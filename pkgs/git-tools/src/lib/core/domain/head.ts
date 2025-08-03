import { Data } from "effect"
import { tag } from "#const"

const HEAD_TAG = tag("domain", "Head")

interface Head {
	readonly _tag: typeof HEAD_TAG
	readonly name: "HEAD"
}

const Head = Data.tagged<Head>(HEAD_TAG)

export type { Head }
export default Head
