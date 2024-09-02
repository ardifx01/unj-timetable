import { useCallback } from "react";
import { z } from "zod";
import { useSetAtom } from "jotai";
import { useForm } from "react-hook-form";
import { LoaderPinwheel } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { onSubmit } from "@/utils/submit-handler";
import { krsDataAtom } from "@/utils/atom";

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
import { Card, CardContent } from "@/components/ui/card";

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
      setKrsData({
        ...data.studentInfo,
        studies: data.studies,
      })
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
          Rencana Studi (KRS) yang belum tersusun berdasarkan hari. Cara lengkap
          akan dijelaskan dibawah form input ini ya 👇👇👇
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
    </>
  );
}
