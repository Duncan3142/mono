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
	readonly remote?: Remote
}

/**
 * Reference service
 */
class MergeBase extends Effect.Service<MergeBase>()(tag(`case`, `merge-base`), {
	effect: Effect.gen(function* () {
		const [mergeBaseCommand, { defaultRemote }, fetchDepthFactory] = yield* Effect.all(
			[MergeBaseCommand, RepositoryConfig, FetchDepthFactory],
			{
				concurrency: "unbounded",
			}
		)

		return ({
			headRef,
			baseRef,
			remote = defaultRemote,
		}: Arguments): Effect.Effect<string, MergeBaseNotFoundError> =>
			mergeBaseCommand({
				headRef,
				baseRef,
				remote,
			}).pipe(Effect.provideServiceEffect(FetchDepth, fetchDepthFactory), Effect.scoped)
	}),
}) {}

export default MergeBase
export type { Arguments }
