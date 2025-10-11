import { Data } from "effect"
import { TagFactory } from "#duncan3142/git-tools/internal"

const REPOSITORY_TAG = TagFactory.make("domain", "Repository")

interface Repository {
	readonly _tag: typeof REPOSITORY_TAG
	readonly directory: string
}

const Repository = Data.tagged<Repository>(REPOSITORY_TAG)

export { REPOSITORY_TAG, Repository }
