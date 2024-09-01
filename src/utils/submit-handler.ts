import * as cheerio from "cheerio";
import PostalMime from "postal-mime";

import { z } from "zod";

const headerScheme = z.object({
  "snapshot-content-location": z.string().url(),
  subject: z.string(),
});

const studentInfoScheme = z.object({
  nim: z.string(),
  name: z.string(),
  major: z.string(),
  faculty: z.string(),
  generation: z.string(),
});

export const studentStudies = z.array(
  z.object({
    day: z.string(),
    subjects: z.array(
      z.object({
        subject: z.string(),
        credits: z.string(),
        lecturer: z.string(),
        time: z.object({
          round: z.string(),
          startedAt: z.string(),
          endedAt: z.string(),
        }),
        location: z.object({
          building: z.string().nullable(),
          roomNumber: z.string().nullable(),
        }),
      })
    ),
  })
);

const timeToNumber = (t: string) => parseInt(t.replaceAll(":", ""));
const DAYTIME_REF = ["Senin", "Selasa", "Rabu", "Kamis", "Jum'at"];

const trimSplitAndTrim = (content: string) =>
  content
    .trim()
    .split(/\r?\n/)
    .map((c) => c.trim());

interface IGreedArray {
  subject: string;
  credits: string;
  lecturer: string;
  location: {
    building: string | null;
    roomNumber: string | null;
  };
  time: {
    day: string;
    round: string;
    startedAt: string;
    endedAt: string;
  };
}

export const onSubmit =
  (
    successCallback: (successData: {
      studies: z.infer<typeof studentStudies>;
      studentInfo: z.infer<typeof studentInfoScheme>;
    }) => void
  ) =>
  async (formData: { krs: FileList }) => {
    let tempGreedArray: IGreedArray[] = [];

    const fileKRS = formData.krs.item(0)!;
    const raw = await fileKRS.text();

    const content = await PostalMime.parse(raw);

    const objectifyHeader = content.headers.reduce((acc, currentObject) => {
      acc[currentObject.key] = currentObject.value;
      return acc;
    }, {});

    const validateHeader = await headerScheme.safeParseAsync(objectifyHeader);

    if (!validateHeader.success) return alert("Format file tidak sesuai!");

    if (
      validateHeader.data["snapshot-content-location"] !==
        "https://siakad.unj.ac.id/index.php/krs" ||
      validateHeader.data.subject !== "Siakad UNJ"
    )
      return alert(
        "Informasi KRS yang dicantukmkan tidak berasal dari Siakad UNJ!"
      );

    if (!content.html) return;

    const $ = cheerio.load(content.html);

    const studentInfoValidation = await studentInfoScheme.safeParseAsync({
      nim: $(".profile-user-info:nth-of-type(1) .profile-info-value")
        .text()
        .trim(),
      name: $(".profile-user-info:nth-of-type(2) .profile-info-value")
        .text()
        .trim(),
      major: $(".profile-user-info:nth-of-type(3) .profile-info-value")
        .text()
        .trim(),
      faculty: $(".profile-user-info:nth-of-type(4) .profile-info-value")
        .text()
        .trim(),
      generation: $(".profile-user-info:nth-of-type(5) .profile-info-value")
        .text()
        .trim(),
    });

    if (!studentInfoValidation.success)
      return alert("Informasi anda kurang sesuai!");

    const truthTable = $("table#dynamic-table");

    if (truthTable.length === 0)
      return alert(
        "Anda belum memilih data semester! Pilih semester terlebih dahulu dan ulangi proses unduhnya."
      );

    const rawSemesterIndicator = $(
      "#showingData .widget-header .widget-title"
    ).text();

    if (!rawSemesterIndicator.startsWith("Daftar Rencana Studi Semester : "))
      alert(
        "Tidak dapat memastikan informasi semester, mohon untuk mengunduh informasi KRS anda kembali."
      );
    const currentDataSemester = parseInt(
      rawSemesterIndicator
        .replace("Daftar Rencana Studi Semester : ", "")
        .trim()
    );

    if (currentDataSemester !== 121)
      return alert(
        `Saat ini UNJ berada di Semester 121, namun data KRS menunjukan pada Semester ${currentDataSemester}. Mohon unduh data terbaru.`
      );

    const tableBodyTr = [...truthTable.find("tbody tr").clone()];
    tableBodyTr.pop();

    if (tableBodyTr.length < 1)
      return alert("KRS anda masih kosong! Mohon diisi terlebih dahulu.");

    if (tableBodyTr.every((el) => el.name !== "tr"))
      return alert(
        "Ada kesalahan membaca baris perbaris data mata kuliah dari tabel. Mohon hubungi pemilik web ini."
      );

    tableBodyTr.forEach((tr) => {
      const allTds = [
        ...$(tr)
          .children()
          .filter((_, el) => el.name === "td"),
      ];

      const currentRowData = {
        subject: $(allTds[3]).text(),
        credits: $(allTds[4]).text(),
        lecturer: $(allTds[5]).text().trim(),
        location: trimSplitAndTrim($(allTds[6]).text()),
        time: trimSplitAndTrim($(allTds[7]).text()),
      };

      const preciseLocationInfo = currentRowData.location.map((loc) => {
        const [building, roomNumber] = loc.split(" Ruang : ");

        return {
          building: building !== "Ruang :" ? building : null,
          roomNumber: roomNumber ?? null,
        };
      });

      const preciseTimeInfo = currentRowData.time.map((t) => {
        const [day, needToSplit] = t.split(", Waktu : ");
        const [round, timing] = needToSplit.replace(")", "").split(" (");

        const [startedAt, endedAt] = timing.split(" sd ");

        return {
          day,
          round: round.replace("Jam ", ""),
          startedAt,
          endedAt,
        };
      });

      if (preciseLocationInfo.length !== preciseTimeInfo.length) {
        alert("Jumlah data lokasi tidak sama dengan jumlah data waktu!");

        throw new Error("Stop, stop, stop. Space n Time mismatch!");
      }

      for (let i = 0; i < preciseLocationInfo.length; i++) {
        tempGreedArray.push({
          ...currentRowData,
          location: preciseLocationInfo.at(i)!,
          time: preciseTimeInfo.at(i)!,
        });
      }
    });

    const restructureData = DAYTIME_REF.map((daytime) => {
      const currentDaySubjects = tempGreedArray
        .filter((d) => d.time.day === daytime)
        .sort(
          (a, b) =>
            timeToNumber(a.time.startedAt) - timeToNumber(b.time.endedAt)
        )
        .map((s) => ({
          ...s,
          time: {
            round: s.time.round,
            startedAt: s.time.startedAt,
            endedAt: s.time.endedAt,
          },
        }));

      return {
        day: daytime,
        subjects: currentDaySubjects,
      };
    });

    const validateRestructuredData = await studentStudies.safeParseAsync(
      restructureData
    );

    if (!validateRestructuredData.success)
      return alert("Ada data yang tidak valid, mohon hubungi admin web ini.");

    successCallback({
      studies: validateRestructuredData.data,
      studentInfo: studentInfoValidation.data,
    });
  };
