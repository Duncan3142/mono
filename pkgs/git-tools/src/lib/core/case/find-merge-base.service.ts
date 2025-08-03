import { Effect } from "effect"
import { tag } from "#const"
import type { MergeBaseNotFoundError } from "#domain/merge-base.error"
import type { Reference } from "#domain/reference"
import MergeBaseCommand from "#command/merge-base.service"
import type { Remote } from "#domain/remote"
import RepositoryConfig from "#config/repository-config.service"
import FetchDepth from "#state/fetch-depth.service"
import FetchDepthFactory from "#state/fetch-depth-factory.service"

interface Arguments {
	readonly headRef: Reference
	readonly baseRef: Reference
	readonly directory: string
	readonly remote?: Remote
	readonly deepenBy?: number
}

/**
 * Reference service
 */
class FindMergeBase extends Effect.Service<FindMergeBase>()(tag(`case`, `find-merge-base`), {
	effect: Effect.gen(function* () {
		const [
			mergeBaseCommand,
			{
				defaultRemote,
				fetch: { defaultDeepenBy },
			},
			fetchDepthFactory,
		] = yield* Effect.all([MergeBaseCommand, RepositoryConfig, FetchDepthFactory], {
			concurrency: "unbounded",
		})

		return ({
			headRef,
			baseRef,
			remote = defaultRemote,
			deepenBy = defaultDeepenBy,
			directory,
		}: Arguments): Effect.Effect<string, MergeBaseNotFoundError> =>
			mergeBaseCommand({
				headRef,
				baseRef,
				remote,
				directory,
				deepenBy,
			}).pipe(Effect.provideServiceEffect(FetchDepth, fetchDepthFactory), Effect.scoped)
	}),
}) {}

export default FindMergeBase
export type { Arguments }
