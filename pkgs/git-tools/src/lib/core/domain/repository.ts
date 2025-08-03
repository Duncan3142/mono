import { Data } from "effect"
import { tag } from "#const"

const REPOSITORY_TAG = tag("domain", "Repository")

interface Repository {
	readonly _tag: typeof REPOSITORY_TAG
	readonly directory: string
}

const Repository = Data.tagged<Repository>(REPOSITORY_TAG)

export { REPOSITORY_TAG, Repository }
