import type { KRSType } from "@/utils/atom";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { krsDataAtom } from "@/utils/atom";
import { useAtom, useSetAtom } from "jotai";
import { RESET } from "jotai/utils";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { DateTime } from "luxon";
import { useEffect, useMemo } from "react";
import type { Construction } from "lucide-react";

type TProps = { data: NonNullable<KRSType> };

const getCurrentDate = (dayIndex: number, isNextWeek: boolean) => {
  const time = DateTime.now()
    .plus({ weeks: isNextWeek ? 1 : 0 })
    .startOf("week")
    .plus({
      days: dayIndex,
    })
    .setLocale("id-ID");

  return time.toLocaleString(DateTime.DATE_FULL);
};

function AutoScroll() {
  const [allData, setData] = useAtom(krsDataAtom);

  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="auto-scroll"
        checked={allData.autoScroll}
        onCheckedChange={(autoScroll) =>
          setData((prev) => ({ ...prev, autoScroll }))
        }
      />
      <Label htmlFor="auto-scroll">Scroll Otomatis</Label>
    </div>
  );
}

export function Viewer({ data }: TProps) {
  const setKRSData = useSetAtom(krsDataAtom);

  const isNextWeek = useMemo(() => {
    const lastDay = data.studies!.at(data.studies!.length - 1);

    const [hour, minute] = lastDay!.endsAt.split(":");

    return (
      DateTime.now()
        .startOf("week")
        .plus({ days: lastDay?.dayIndex })
        .set({
          hour: parseInt(hour),
          minute: parseInt(minute),
        }) <= DateTime.now().setZone()
    );
  }, []);

  useEffect(() => {
    const autoScrollExecution = () => {
      try {
        const now = DateTime.now();

        if (isNextWeek) {
          const firstDataOfArray = data.studies!.at(0);

          const targetCard = document.querySelector(
            `#day-${firstDataOfArray?.dayIndex}`
          );

          targetCard?.scrollIntoView({
            behavior: "smooth",
          });

          return;
        }

        const currentDayIndex = data.studies?.find(
          (schedule) => schedule.dayIndex === now.weekday - 1
        )!;

        if (!currentDayIndex) {
          const previousIndex = data.studies!.reduce((acc, day) => {
            if (day.dayIndex <= now.weekday - 1 && day.dayIndex > acc)
              return day.dayIndex;

            return acc;
          }, 0);

          if (previousIndex === 0) {
            const firstDataOfArray = data.studies!.at(0);

            const targetCard = document.querySelector(
              `#day-${firstDataOfArray?.dayIndex}`
            );

            targetCard?.scrollIntoView({
              behavior: "smooth",
            });

            return;
          }

          const nextDataIndex = data.studies!.find(
            (day) => day.dayIndex > previousIndex
          );

          if (!nextDataIndex) {
            const lastDataOfArray = data.studies!.at(data.studies!.length - 1);

            const targetCard = document.querySelector(
              `#day-${lastDataOfArray?.dayIndex}`
            );

            targetCard?.scrollIntoView({
              behavior: "smooth",
            });

            return;
          }

          const targetCard = document.querySelector(
            `#day-${nextDataIndex?.dayIndex}`
          );

          targetCard?.scrollIntoView({
            behavior: "smooth",
          });

          return;
        }

        const { endsAt, dayIndex } = currentDayIndex;
        const [hour, minutes] = endsAt.split(":");

        const isTheEndOfTheDay =
          DateTime.now().set({
            hour: parseInt(hour),
            minute: parseInt(minutes),
          }) <= now;

        if (isTheEndOfTheDay) {
          const currentDayIndex = data.studies!.findIndex(
            (schedule) => schedule.dayIndex === dayIndex
          );
          const nextDayData = data.studies!.at(currentDayIndex + 1);

          const targetCard = document.querySelector(
            `#day-${nextDayData!.dayIndex}`
          );

          targetCard?.scrollIntoView({
            behavior: "smooth",
          });

          return;
        }

        const targetCard = document.querySelector(`#day-${now.weekday - 1}`);

        targetCard?.scrollIntoView({
          behavior: "smooth",
        });
      } catch (e) {
        console.error(e);

        toast.error("Gagal mengaktifkan auto scroll", {
          description:
            "Hal ini terjadi karena kesalahan program, anda masih bisa tetap memakai tetapi fitur ini dimatikan. Mohon untuk memberitakan kesalahan ke pembuat web ini.",
        });
      }
    };

    if (data.autoScroll) autoScrollExecution();
  }, [isNextWeek]);

  return (
    <>
      <h1 className="text-center scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        UNJ Timetable
      </h1>

      <section className="space-y-1.5 w-full md:w-8/9">
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
          Identitas Diri
        </h4>

        <div className="border rounded-lg">
          <div className="relative w-full overflow-auto">
            <table className="w-full table-auto">
              <tbody>
                <tr className="bg-neutral-50 dark:bg-neutral-900 rounded-tr-lg">
                  <td className="bg-lime-400 dark:bg-lime-700 rounded-tl-lg px-4 py-3 font-medium w-1/4">
                    Nama
                  </td>
                  <td className="px-4 py-3 border-b rounded-tr-lg">
                    {data.name}
                  </td>
                </tr>
                <tr className="bg-neutral-50 dark:bg-neutral-900">
                  <td className="bg-lime-400 dark:bg-lime-700 px-4 py-3 font-medium w-1/4">
                    Prodi
                  </td>
                  <td className="px-4 py-3 border-b">{data.major}</td>
                </tr>
                <tr className="bg-neutral-50 dark:bg-neutral-900">
                  <td className="bg-lime-400 dark:bg-lime-700 px-4 py-3 font-medium w-1/4">
                    Fakultas
                  </td>
                  <td className="px-4 py-3 border-b">{data.faculty}</td>
                </tr>
                <tr className="bg-neutral-50 dark:bg-neutral-900">
                  <td className="bg-lime-400 dark:bg-lime-700 px-4 py-3 font-medium w-1/4">
                    NIM
                  </td>
                  <td className="px-4 py-3 border-b">{data.nim}</td>
                </tr>
                <tr className="bg-neutral-50 dark:bg-neutral-900 rounded-br-lg">
                  <td className="bg-lime-400 dark:bg-lime-700 rounded-bl-lg px-4 py-3 font-medium w-1/4">
                    Angkatan
                  </td>
                  <td className="px-4 py-3 rounded-br-lg">{data.generation}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex gap-3 pt-1">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Hapus Data KRS</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Apakah anda yakin?</AlertDialogTitle>
                <AlertDialogDescription>
                  Hal ini akan menghapus data KRS anda dari web ini. Anda masih
                  bisa menambahkannya kembali setelah penghapusan data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction onClick={() => setKRSData(RESET)}>
                  Lanjutkan
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AutoScroll />
        </div>
      </section>

      <section className="space-y-1.5 w-full">
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
          Jadwal Perkuliahan
        </h4>

        <main className="grid grid-cols-1 md:grid-cols-2 gap-3 justify-center pb-24">
          {data.studies?.map((study) => (
            <Card
              key={study.dayIndex}
              id={`day-${study.dayIndex}`}
              className="w-full dark:border-sm dark:bg-neutral-900 dark:border-neutral-900"
            >
              <CardHeader>
                <CardTitle className="text-xl md:text-2xl">
                  {study.day},{" "}
                  <span className="font-normal">
                    {getCurrentDate(study.dayIndex, isNextWeek)}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="px-2 overflow-x-auto">
                <table className="table-auto w-full">
                  <thead className="bg-blue-600 dark:bg-blue-800 text-gray-100 text-lg">
                    <tr className="h-10">
                      <th className="text-start pl-3">JAM</th>
                      <th className="text-center">Matkul</th>
                      <th className="text-center">Dosen</th>
                      <th className="text-center">Lokasi</th>
                      <th className="text-end pr-3">Waktu</th>
                    </tr>
                  </thead>
                  <tbody className="gap-5">
                    {study.subjects.map((s) => (
                      <tr
                        key={s.time.round}
                        className="light:even:bg-zinc-800 odd:bg-slate-100 dark:even-zinc-900 dark:odd:bg-slate-900 *:py-3"
                      >
                        <td className="text-center font-mono w-[5%]">
                          {s.time.round}
                        </td>

                        <td className="w-[25%] md:w-fit text-center">
                          {s.subject}
                        </td>

                        <td className="w-[25%] md:w-fit text-center">
                          {s.lecturer}
                        </td>

                        <td className="text-center">
                          {s.location.building !== null &&
                          s.location.roomNumber !== null ? (
                            <div className="flex flex-col py-2">
                              <b>{s.location.building}</b>
                              <span className="font-mono">
                                {s.location.roomNumber}
                              </span>
                            </div>
                          ) : (
                            "DARING"
                          )}
                        </td>

                        <td className="pr-2 w-[5%]">
                          <div className="flex flex-col items-end">
                            <span className="border-b border-neutral-800 dark:border-neutral-400">
                              {s.time.startedAt.replace(":00", "")}
                            </span>

                            <span>{s.time.endedAt.replace(":00", "")}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          ))}
        </main>
      </section>
    </>
  );
}
