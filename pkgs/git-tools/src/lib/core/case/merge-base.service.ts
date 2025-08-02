import { Effect, Console } from "effect"
import { SERVICE_PREFIX } from "#const"
import {
	MERGE_BASE_NOT_FOUND_ERROR_TAG,
	MergeBaseNotFoundError,
} from "#domain/merge-base.error"
import type { Reference } from "#domain/reference"
import MergeBaseCommandExecutor from "#command/merge-base-executor.service"
import type { Remote } from "#domain/remote"
import RepositoryConfig from "#config/repository-config.service"
import FetchCommand from "#command/fetch.service"
import { FETCH_MODE_DEEPEN_BY } from "#domain/fetch-reference"
import type FetchDepth from "#state/fetch-depth.service"
import {
	FETCH_DEPTH_EXCEEDED_ERROR_TAG,
	FETCH_REFS_NOT_FOUND_ERROR_TAG,
} from "#domain/fetch.error"

interface Arguments {
	readonly headRef: Reference
	readonly baseRef: Reference
	readonly remote?: Remote
}

/**
 * Reference service
 */
class MergeBase extends Effect.Service<MergeBase>()(`${SERVICE_PREFIX}/case/merge-base`, {
	effect: Effect.gen(function* () {
		const [
			mergeBaseCommandExecutor,
			{
				defaultRemote,
				fetch: { defaultDeepenBy },
			},
			fetchCommand,
		] = yield* Effect.all([MergeBaseCommandExecutor, RepositoryConfig, FetchCommand])

		return ({
			headRef,
			baseRef,
			remote = defaultRemote,
		}: Arguments): Effect.Effect<string, MergeBaseNotFoundError, FetchDepth> =>
			Effect.retry(
				mergeBaseCommandExecutor({
					headRef,
					baseRef,
				}).pipe(
					Effect.tapErrorTag(MERGE_BASE_NOT_FOUND_ERROR_TAG, () =>
						fetchCommand({
							mode: { mode: FETCH_MODE_DEEPEN_BY, value: defaultDeepenBy },
							remote,
							refs: [headRef, baseRef],
						}).pipe(Effect.catchTag(FETCH_REFS_NOT_FOUND_ERROR_TAG, (err) => Effect.die(err)))
					)
				),
				{
					until: (err) => err._tag === FETCH_DEPTH_EXCEEDED_ERROR_TAG,
				}
			).pipe(
				Effect.tapError((err) => Console.error(err)),
				Effect.timeout("16 seconds"),
				Effect.orElseFail(
					() => new MergeBaseNotFoundError({ headRef: headRef.name, baseRef: baseRef.name })
				)
			)
	}),
}) {}

export default MergeBase
export type { Arguments }
