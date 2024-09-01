import { z } from "zod"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { onSubmit } from "@utils/submit-handler";

const OneMeg = 1_000_000;

const formSchema = z.object({
    krs: z
        .any()
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        .refine((files) => files?.length === 1, "Diperlukan file informasi KRS!")
        .refine(
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            (files) => files?.[0]?.size <= OneMeg,
            `Ukuran file informasi KRS adalah 1MB!`,
        )
});

interface FormSchema {
    krs: FileList;
}

export function NoData() {
    const {
        register,
        handleSubmit,
        // reset,
        formState: { errors }
    } = useForm<FormSchema>({
        resolver: zodResolver(formSchema)
    });

    return (
        <>
            <form
                onSubmit={handleSubmit(onSubmit)}
            >
                <div>
                    <input
                        {...register("krs", { required: true })}
                        name="krs"
                        type="file"
                        accept="text/plain,multipart/related,application/x-mimearchive"
                        className="file:absolute file:right-0 file:bg-blue-500 file:text-white file:border-0 file:py-1 file:px-3 file:rounded-full file:shadow-xl text-gray-600"
                    />
                </div>
                {errors.krs?.message && <span>{errors.krs?.message}</span>}

                <button type="submit">Submit</button>
            </form>
        </>
    )
}