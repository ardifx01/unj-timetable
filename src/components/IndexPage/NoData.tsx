import { useCallback } from "react";
import { z } from "zod";
import { useSetAtom } from "jotai";
import { useForm } from "react-hook-form";
import { LoaderPinwheel } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { CURRENT_SEMESTER, onSubmit } from "@/lib/submit-handler";
import { krsDataAtom } from "@/lib/atom";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardTitle,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";

const OneMeg = 3_000_000;

const formSchema = z.object({
  krs: z
    .any()
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    .refine((files) => files?.length === 1, "Diperlukan file informasi KRS!")
    .refine(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      (files) => files?.[0]?.size <= OneMeg,
      `Ukuran file informasi KRS adalah 3MB!`
    ),
});

interface FormSchema {
  krs: FileList;
}

export function NoData() {
  const setKrsData = useSetAtom(krsDataAtom);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  });

  const submitCallback = useCallback(
    onSubmit((data) =>
      setKrsData((prev) => ({
        ...prev,
        ...data.studentInfo,
        studies: data.studies,
        currentSemester: String(CURRENT_SEMESTER),
      }))
    ),
    []
  );

  return (
    <>
      <div className="flex flex-col items-center">
        <h1 className="text-center scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          UNJ Timetable
        </h1>
        <p className="leading-7 [&:not(:first-child)]:mt-6 w-[95%] md:w-3/4 text-justify">
          Selamat datang 👋 pada web UNJ Timetable. Tujuan web ini yaitu
          memudahkan mahasiswa/i Universitas Negeri Jakarta dalam melihat Kartu
          Rencana Studi (KRS) yang belum tersusun berdasarkan hari. Namun perlu
          di catat bahwa <u>selalu ikuti PJ</u> setiap matkul yaa.
        </p>
      </div>

      <Card className="w-full md:w-3/4 dark:bg-neutral-900">
        <CardContent className="p-6 flex flex-col gap-5 items-center">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(submitCallback)}
              className="w-full"
            >
              <FormField
                control={form.control}
                name="krs"
                render={() => (
                  <FormItem>
                    <FormLabel>File Laman KRS</FormLabel>
                    <FormControl>
                      <div className="flex flex-row gap-2">
                        <Input
                          className="file:dark:text-white"
                          type="file"
                          {...form.register("krs")}
                          disabled={form.formState.isSubmitting}
                        />
                        <Button
                          type="submit"
                          disabled={form.formState.isSubmitting}
                        >
                          {form.formState.isSubmitting ? (
                            <LoaderPinwheel className="w-4 h-4 animate-spin mr-2" />
                          ) : null}{" "}
                          Tambah File
                        </Button>
                      </div>
                    </FormControl>
                    <FormDescription>
                      Pilih file KRS yang sudah di unduh dari Siakad UNJ.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="w-full md:w-3/4 rounded-xl bg-green-300 dark:bg-green-800">
        <CardHeader>
          <CardTitle className="text-green-950 dark:text-green-200">
            Tenang 🚦🚦🚦
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-justify">
            Web ini memproses datamu hanya pada perangkat saat ini aja yaa, ga
            ada data yang di kirim keluar kok 🥳🥳🥳.
          </p>
        </CardContent>

        <CardFooter>
          <small>
            Here's the{" "}
            <a
              className="underline"
              href="https://github.com/reacto11mecha/unj-timetable"
              target="_blank"
              rel="noopener noreferrer"
            >
              github repo
            </a>{" "}
            if you are curious.
          </small>
        </CardFooter>
      </Card>

      <div className="w-full md:w-3/4 space-y-2">
        <h3 className="text-start scroll-m-20 text-2xl font-semibold tracking-tight">
          Tutorial Cara Penggunaan
        </h3>

        <div className="pl-2.5 pr-1 md:pl-4 md:pr-0 space-y-4">
          <p className="text-justify">
            1. Buka Google Chrome, hal ini diperlukan karena akan mengunduh data
            halaman KRS,{" "}
            <a
              className="font-semibold text-sky-900 dark:text-sky-500"
              href="https://siakad.unj.ac.id/login"
              target="_blank"
              rel="noopener noreferrer"
            >
              pelajari lebih lanjut
            </a>
            .
          </p>

          <p className="text-justify">
            2. Kunjungi web{" "}
            <a
              className="font-semibold text-sky-900 dark:text-sky-500"
              href="https://siakad.unj.ac.id/login"
              target="_blank"
              rel="noopener noreferrer"
            >
              Siakad UNJ
            </a>
            , login dengan identitas diri yang sudah diberikan.
          </p>

          <div className="flex flex-col items-center gap-2">
            <p className="self-start text-justify">
              3. Pilih menu <u>Akademik</u> lalu klik <u>Kartu Rencana Studi</u>{" "}
              untuk mendapatkan Daftar Rencana Studi Semester, atau menuju link{" "}
              <a
                className="font-semibold text-sky-900 dark:text-sky-500"
                href="https://siakad.unj.ac.id/index.php/krs"
                target="_blank"
                rel="noopener noreferrer"
              >
                ini
              </a>{" "}
              supaya langsung menuju halaman yang dimaksud.
            </p>

            <img
              src="/assets/001-pilih-menu-krs.png"
              className="w-60 md:w-80"
            />
          </div>

          <div className="flex flex-col items-center gap-4">
            <p className="self-start text-justify">
              4. Jika sudah berada di halaman memilih semester <i>121</i>{" "}
              kemudian klik tombol "Proses".
            </p>

            <img
              src="/assets/002-ambil-data-semester.png"
              className="w-60 md:w-80"
            />

            <p className="text-justify">
              Jika sudah klik, akan muncul tabel yang berjudul "Daftar Rencana
              Studi Semester : 121" yang isinya sesuai dengan pilihan anda saat
              melakukan pengisian KRS sebelum waktu perkuliahan dimulai.
            </p>
          </div>

          <div className="flex flex-col items-center gap-4">
            <p className="self-start text-justify">
              5. Klik logo titik tiga berjejer ke bawah, posisinya ada di kanan
              atas. Akan muncul logo unduh yang diperjelas dengan lingkaran,
              foto terlampir.
            </p>

            <div className="flex flex-col md:flex-row gap-3 justify-center">
              <img
                src="/assets/003-pilih-titik-tiga.jpg"
                className="w-60 md:w-80"
              />

              <img
                src="/assets/004-klik-download.jpg"
                className="w-60 md:w-80"
              />
            </div>

            <p>
              Akan muncul notifikasi bahwa unduhan sudah selesai, kurang lebih
              begini tampilannya.
            </p>

            <img
              src="/assets/005-selesai-download.jpg"
              className="w-60 md:w-80"
            />
          </div>

          <div className="flex flex-col items-center gap-4">
            <p className="self-start text-justify">
              6. Kembali ke web ini, klik input File Laman KRS dan kemudian
              pilih file yang tadi sudah di unduh. File tersebut biasanya secara
              otomatis memiliki nama "Siakad UNJ" pada folder Unduhan (atau
              Download).
            </p>

            <div className="flex flex-col md:flex-row gap-3 justify-center">
              <img
                src="/assets/006-pilih-file-mhtml.jpg"
                className="w-60 md:w-80"
              />

              <img
                src="/assets/007-setelah-memilih.jpg"
                className="w-60 md:w-80 h-full"
              />
            </div>

            <p>Klik tombol Tambah File untuk melanjutkan.</p>

            <img
              src="/assets/008-tunggu-loading.jpg"
              className="w-60 md:w-80"
            />
          </div>

          <p className="text-justify">
            7. Nikmati kemudahannya 🎉🎉🎉 Lakukan pengecekan ulang dan selalu
            ikuti arahan dari PJ mata kuliah masing-masing yaa!
          </p>
        </div>
      </div>

      <div className="w-full md:w-3/4 space-y-2 pt-5">
        <h3 className="text-start scroll-m-20 text-2xl font-semibold tracking-tight">
          Fitur-Fitur Yang Tersedia
        </h3>

        <div className="pl-2.5 pr-1 md:pl-4 md:pr-0 space-y-4">
          <p className="text-justify">
            1. Mengubah data KRS dari web siakad menjadi jadwal perkuliahan yang
            otomatis tersusun berdasarkan hari dan mudah di mengerti.
          </p>

          <p className="text-justify">
            2. Memilih file data hanya sekali, jika sudah pernah menentukan file
            maka akan terus ditampilkan kecuali data dihapus.
          </p>

          <p className="text-justify">
            3. Web ini dapat di instal sebagai aplikasi dengan cara menekan{" "}
            <u>titik tiga pojok kanan atas</u>, pilih <i>Add to Home Screen</i>,
            lalu klik <i>Install</i>. Akan ada kalanya muncul prompt otomatis
            dari Chrome supaya bisa instal, tapi hasilnya tetap sama.
          </p>

          <p className="text-justify">
            4. Karena dapat di instal, web ini bisa bekerja secara{" "}
            <i>offline</i> tanpa perlu terhubung ke internet.
          </p>

          <div className="space-y-3 *:text-justify">
            <p>
              5. Fitur auto scroll pada saat web ini akan secara otomatis scroll
              ke bagian sesuai hari.
            </p>

            <p>
              Jika anda membuka web ini pada pagi hari di hari senin maka akan
              otomatis scroll pada bagian hari senin. Masih di hari yang sama
              namun setelah jam selesai perkuliahan maka akan otomatis scroll ke
              hari selasa dan begitu seterusnya.
            </p>

            <p>
              Namun ketika hari Jum'at dan jam sudah menunjukan jadwal
              perkuliahan telah usai maka akan otomatis scroll ke hari senin.
              Siklus ini berulang terus menerus.
            </p>
          </div>
        </div>
      </div>

      <p className="mt-5 pb-20 text-center w-[80%] md:w-full">
        Terima kasih sudah menggunakan, semangat selalu yaa 🤗💓
      </p>
    </>
  );
}
