import { Data } from "effect"
import { tag } from "#const"

const REMOTE_TAG = tag("domain", "Remote")

interface Remote {
	readonly _tag: typeof REMOTE_TAG
	readonly name: string
}

const Remote = Data.tagged<Remote>(REMOTE_TAG)

export { REMOTE_TAG, Remote }
