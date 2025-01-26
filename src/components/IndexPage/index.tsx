import { useAtomValue } from "jotai";
import { NoData } from "./NoData";
import { krsDataAtom } from "@/lib/atom";
import { Viewer } from "./Viewer";

export function IndexPage() {
  const krsData = useAtomValue(krsDataAtom);

  if (
    krsData.nim &&
    krsData.name &&
    krsData.major &&
    krsData.faculty &&
    krsData.generation &&
    krsData.studies
  )
    return <Viewer data={krsData} />;

  return <NoData />;
}
