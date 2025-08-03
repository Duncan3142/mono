import { Effect } from "effect"
import { tag } from "#const"
import {
	MERGE_BASE_NOT_FOUND_ERROR_TAG,
	MergeBaseNotFoundError,
} from "#domain/merge-base.error"
import type { Reference } from "#domain/reference"
import MergeBaseExecutor from "#executor/merge-base.service"
import type { Remote } from "#domain/remote"
import FetchCommand from "#command/fetch.service"
import { FetchDeepenBy, type Depth } from "#domain/fetch"
import type FetchDepth from "#state/fetch-depth.service"
import {
	FETCH_DEPTH_EXCEEDED_ERROR_TAG,
	FETCH_REFS_NOT_FOUND_ERROR_TAG,
} from "#domain/fetch.error"

interface Arguments {
	readonly headRef: Reference
	readonly baseRef: Reference
	readonly remote: Remote
	readonly directory: string
	readonly deepenBy: Depth
}

/**
 * Reference service
 */
class MergeBaseCommand extends Effect.Service<MergeBaseCommand>()(
	tag(`command`, `merge-base`),
	{
		effect: Effect.gen(function* () {
			const [mergeBaseCommandExecutor, fetchCommand] = yield* Effect.all(
				[MergeBaseExecutor, FetchCommand],
				{
					concurrency: "unbounded",
				}
			)

			return ({
				headRef,
				baseRef,
				remote,
				directory,
				deepenBy,
			}: Arguments): Effect.Effect<string, MergeBaseNotFoundError, FetchDepth> =>
				Effect.retry(
					mergeBaseCommandExecutor({
						headRef,
						baseRef,
						directory,
					}).pipe(
						Effect.tapErrorTag(MERGE_BASE_NOT_FOUND_ERROR_TAG, () =>
							fetchCommand({
								mode: FetchDeepenBy({ deepenBy }),
								remote,
								refs: [headRef, baseRef],
								directory,
							}).pipe(Effect.catchTag(FETCH_REFS_NOT_FOUND_ERROR_TAG, (err) => Effect.die(err)))
						)
					),
					{
						until: (err) => err._tag === FETCH_DEPTH_EXCEEDED_ERROR_TAG,
					}
				).pipe(
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
		}),
	}
) {}

export default MergeBaseCommand
export type { Arguments }
