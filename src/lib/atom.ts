import { atomWithStorage } from "jotai/utils";
import { z } from "zod";

import { studentStudies } from "./submit-handler";

interface IStudentIdentity {
  currentSemester: string | null;
  autoScroll: boolean;
  nim: string | null;
  name: string | null;
  major: string | null;
  faculty: string | null;
  generation: string | null;
}

interface IStudies {
  studies: z.infer<typeof studentStudies> | null;
}

export type KRSType = IStudentIdentity & IStudies;

export const krsDataAtom = atomWithStorage<KRSType>("krsInfoData", {
  currentSemester: null,
  autoScroll: true,
  nim: null,
  name: null,
  major: null,
  faculty: null,
  generation: null,
  studies: null,
});
