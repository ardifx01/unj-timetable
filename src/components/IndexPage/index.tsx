import { useAtomValue } from "jotai";
import { NoData } from "./NoData";
import { krsDataAtom } from "@utils/atom";

export function IndexPage() {
	const krsData = useAtomValue(krsDataAtom);

	if (krsData.nim &&
		krsData.name &&
		krsData.major &&
		krsData.faculty &&
		krsData.generation) return (
			<>Ada datanya cuy</>
		)

	return <NoData />
}