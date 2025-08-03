import { CommandExecutor } from "@effect/platform"
import type { Duration } from "effect"
import { Layer, pipe, Effect, Match } from "effect"
import commandFactory, { type ErrorCode } from "./base.ts"
import MergeBaseExecutor, { type Arguments } from "#executor/merge-base.service"
import { MergeBaseNotFoundError } from "#domain/merge-base.error"

const MERGE_BASE_NOT_FOUND_CODE = 1

const MergeBaseExecutorLive: Layer.Layer<
	MergeBaseExecutor,
	never,
	CommandExecutor.CommandExecutor
> = Layer.effect(
	MergeBaseExecutor,
	Effect.gen(function* () {
		const executor = yield* CommandExecutor.CommandExecutor

		return ({
			baseRef: { name: baseRef },
			headRef: { name: headRef },
			directory,
		}: Arguments): Effect.Effect<string, MergeBaseNotFoundError> =>
			Effect.gen(function* () {
				const timeout: Duration.DurationInput = "2 seconds"
				return yield* pipe(
					commandFactory({
						directory,
						subCommand: "merge-base",
						subArgs: [baseRef, headRef],
						timeout,
						errorMatcher: (errorCode: ErrorCode) =>
							pipe(
								Match.value(errorCode),
								Match.when(MERGE_BASE_NOT_FOUND_CODE, () =>
									Effect.fail(
										new MergeBaseNotFoundError({
											baseRef,
											headRef,
										})
									)
								)
							),
					}),
					Effect.scoped,
					Effect.provideService(CommandExecutor.CommandExecutor, executor)
				)
			})
	})
)

export default MergeBaseExecutorLive
