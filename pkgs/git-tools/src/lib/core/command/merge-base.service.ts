import { Effect } from "effect"
import { tag } from "#const"
import {
	MERGE_BASE_NOT_FOUND_ERROR_TAG,
	MergeBaseNotFoundError,
} from "#domain/merge-base.error"
import type { Reference } from "#domain/reference"
import MergeBaseCommandExecutor from "#command/merge-base-executor.service"
import type { Remote } from "#domain/remote"
import FetchCommand from "#command/fetch.service"
import { FetchDeepenBy, type Depth } from "#domain/fetch"
import type FetchDepth from "#state/fetch-depth.service"
import {
	FETCH_DEPTH_EXCEEDED_ERROR_TAG,
	FETCH_REFS_NOT_FOUND_ERROR_TAG,
} from "#domain/fetch.error"
import type { Repository } from "#domain/repository"

interface Arguments {
	readonly headRef: Reference
	readonly baseRef: Reference
	readonly remote: Remote
	readonly repository: Repository
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
				[MergeBaseCommandExecutor, FetchCommand],
				{
					concurrency: "unbounded",
				}
			)

			return ({
				headRef,
				baseRef,
				remote,
				repository,
				deepenBy,
			}: Arguments): Effect.Effect<string, MergeBaseNotFoundError, FetchDepth> =>
				Effect.retry(
					mergeBaseCommandExecutor({
						headRef,
						baseRef,
						repository,
					}).pipe(
						Effect.tapErrorTag(MERGE_BASE_NOT_FOUND_ERROR_TAG, () =>
							fetchCommand({
								mode: FetchDeepenBy({ deepenBy }),
								remote,
								refs: [headRef, baseRef],
								repository,
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
