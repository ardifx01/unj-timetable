import { useCallback, useState } from "react";
import { z } from "zod"
import { useSetAtom } from "jotai";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { onSubmit } from "@utils/submit-handler";
import { krsDataAtom } from "@utils/atom";

const OneMeg = 3_000_000;

const formSchema = z.object({
    krs: z
        .any()
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        .refine((files) => files?.length === 1, "Diperlukan file informasi KRS!")
        .refine(
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            (files) => files?.[0]?.size <= OneMeg,
            `Ukuran file informasi KRS adalah 3MB!`,
        )
});

interface FormSchema {
    krs: FileList;
}

export function NoData() {
    const [data, setD] = useState("")
    const setKrsData = useSetAtom(krsDataAtom);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<FormSchema>({
        resolver: zodResolver(formSchema)
    });

    const submitCallback = useCallback(onSubmit(data => {
        setD(JSON.stringify(data, null, 2))
    }), []);

    return (
        <div className="px-8 py-5 flex flex-row justify-center items-center md:flex-col md:items-start">
            <form
                className="w-full flex flex-col gap-1 md:flex-row"
                onSubmit={handleSubmit(submitCallback)}
            >
                <div className="w-full flex flex-row md:justify-center gap-2">
                    <input
                        {...register("krs", { required: true })}
                        name="krs"
                        type="file"
                        accept="text/plain,multipart/related,application/x-mimearchive"
                        className="relative m-0 block w-full min-w-0 flex-auto cursor-pointer rounded border border-solid border-secondary-500 bg-transparent bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-surface transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:me-3 file:cursor-pointer file:overflow-hidden file:rounded-none file:border-0 file:border-e file:border-solid file:border-inherit file:bg-transparent file:px-3  file:py-[0.32rem] file:text-surface focus:border-primary focus:text-gray-700 focus:shadow-inset focus:outline-none dark:border-white/70 dark:text-white  file:dark:text-white"
                    />

                    <button className="hidden md:block md:w-1/3 relative overflow-hidden rounded-md bg-green-700 px-3 py-[0.32rem] text-white transition-all duration-300 [transition-timing-function:cubic-bezier(0.175,0.885,0.32,1.275)] active:-translate-y-1 active:scale-x-90 active:scale-y-110" type="submit">Tambah KRS</button>
                </div>
                {errors.krs?.message && <div>
                    <span className="text-sm text-red-700 md:hidden">{errors.krs?.message}</span>
                </div>}

                <button className="md:w-1/4 relative md:hidden overflow-hidden rounded-md bg-green-700 px-3 py-[0.32rem] text-white transition-all duration-300 [transition-timing-function:cubic-bezier(0.175,0.885,0.32,1.275)] active:-translate-y-1 active:scale-x-90 active:scale-y-110" type="submit">Tambah KRS</button>
            </form>

            {errors.krs?.message && <div>
                <span className="text-sm text-red-700 hidden md:block">{errors.krs?.message}</span>
            </div>}

            <pre>{data}</pre>

        </div>
    )
}