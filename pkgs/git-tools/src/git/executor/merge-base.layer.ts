import { CommandExecutor } from "@effect/platform"
import { Layer, pipe, Effect, Match, Chunk, Stream } from "effect"
import type { CommandError } from "@duncan3142/effect"
import * as Base from "./base.ts"
import { MergeBaseExecutor } from "#duncan3142/git-tools/core/executor"
import { type Reference, MergeBaseError } from "#duncan3142/git-tools/core/domain"

const MERGE_BASE_NOT_FOUND_CODE = 1

const Live: Layer.Layer<
	MergeBaseExecutor.MergeBaseExecutor,
	never,
	CommandExecutor.CommandExecutor
> = Layer.effect(
	MergeBaseExecutor.MergeBaseExecutor,
	Effect.gen(function* () {
		const executor = yield* CommandExecutor.CommandExecutor

		return ({
			baseRef: { name: baseRef },
			headRef: { name: headRef },
			directory,
			timeout,
		}: MergeBaseExecutor.Arguments): Effect.Effect<
			Reference.SHA,
			| MergeBaseError.MergeBaseNotFound
			| CommandError.CommandFailed
			| CommandError.CommandTimeout
		> =>
			Base.make({
				directory,
				command: "merge-base",
				args: [baseRef, headRef],
				timeout,
				errorMatcher: ({ exitCode }) =>
					pipe(
						Match.value(exitCode),
						Match.when(MERGE_BASE_NOT_FOUND_CODE, () =>
							Effect.fail(
								new MergeBaseError.MergeBaseNotFound({
									baseRef,
									headRef,
								})
							)
						)
					),
			}).pipe(
				Effect.andThen(Stream.runCollect),
				Effect.map(Chunk.join("")),
				Effect.scoped,
				Effect.provideService(CommandExecutor.CommandExecutor, executor)
			)
	})
)

export { Live }
