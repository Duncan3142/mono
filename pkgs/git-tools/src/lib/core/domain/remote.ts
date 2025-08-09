import { Data } from "effect"
import { Tag } from "#const"

const REMOTE_TAG = Tag.make("domain", "Remote")

interface Remote {
	readonly _tag: typeof REMOTE_TAG
	readonly name: string
	readonly url: string
}

const Remote = Data.tagged<Remote>(REMOTE_TAG)

export { REMOTE_TAG, Remote }
