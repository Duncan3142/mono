import { Effect } from "effect"
import { tag } from "#const"
import {
	MERGE_BASE_NOT_FOUND_ERROR_TAG,
	MergeBaseNotFoundError,
} from "#domain/merge-base.error"
import type { Reference } from "#domain/reference"
import MergeBaseCommandExecutor from "#command/merge-base-executor.service"
import type { Remote } from "#domain/remote"
import RepositoryConfig from "#config/repository-config.service"
import FetchCommand from "#command/fetch.service"
import { FetchDeepenBy } from "#domain/fetch"
import FetchDepth from "#state/fetch-depth.service"
import {
	FETCH_DEPTH_EXCEEDED_ERROR_TAG,
	FETCH_REFS_NOT_FOUND_ERROR_TAG,
} from "#domain/fetch.error"
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
		const [
			mergeBaseCommandExecutor,
			{
				defaultRemote,
				fetch: { defaultDeepenBy },
			},
			fetchCommand,
			fetchDepthFactory,
		] = yield* Effect.all(
			[MergeBaseCommandExecutor, RepositoryConfig, FetchCommand, FetchDepthFactory],
			{
				concurrency: "unbounded",
			}
		)

		return ({
			headRef,
			baseRef,
			remote = defaultRemote,
		}: Arguments): Effect.Effect<string, MergeBaseNotFoundError> =>
			Effect.retry(
				mergeBaseCommandExecutor({
					headRef,
					baseRef,
				}).pipe(
					Effect.tapErrorTag(MERGE_BASE_NOT_FOUND_ERROR_TAG, () =>
						fetchCommand({
							mode: FetchDeepenBy({ deepenBy: defaultDeepenBy }),
							remote,
							refs: [headRef, baseRef],
						}).pipe(Effect.catchTag(FETCH_REFS_NOT_FOUND_ERROR_TAG, (err) => Effect.die(err)))
					)
				),
				{
					until: (err) => err._tag === FETCH_DEPTH_EXCEEDED_ERROR_TAG,
				}
			)
				.pipe(
					Effect.tapError((err) => Effect.logError(err)),
					Effect.timeout("16 seconds"),
					Effect.catchAll(
						(err) =>
							new MergeBaseNotFoundError({
								headRef: headRef.name,
								baseRef: baseRef.name,
								cause: err,
							})
					)
				)
				.pipe(Effect.provideServiceEffect(FetchDepth, fetchDepthFactory), Effect.scoped)
	}),
}) {}

export default MergeBase
export type { Arguments }
