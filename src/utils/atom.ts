import { atomWithStorage } from "jotai/utils";
import { z } from "zod";

import { studentStudies } from "./submit-handler";

interface IStudentIdentity {
  nim: string | null;
  name: string | null;
  major: string | null;
  faculty: string | null;
  generation: string | null;
}

interface IStudies {
  studies: z.infer<typeof studentStudies> | null;
}

export const krsDataAtom = atomWithStorage<IStudentIdentity & IStudies>(
  "krsInfoData",
  {
    nim: null,
    name: null,
    major: null,
    faculty: null,
    generation: null,
    studies: null,
  }
);
