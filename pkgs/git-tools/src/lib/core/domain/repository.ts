import { Data } from "effect"
import { Tag } from "#const"

const REPOSITORY_TAG = Tag.make("domain", "Repository")

interface Repository {
	readonly _tag: typeof REPOSITORY_TAG
	readonly directory: string
}

const Repository = Data.tagged<Repository>(REPOSITORY_TAG)

export { REPOSITORY_TAG, Repository }
