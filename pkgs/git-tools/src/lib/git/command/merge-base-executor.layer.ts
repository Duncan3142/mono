import { CommandExecutor } from "@effect/platform"
import type { Duration } from "effect"
import { Layer, pipe, Effect, Match } from "effect"
import commandFactory, { type ErrorCode } from "./command.ts"
import MergeBaseCommandExecutor, { type Arguments } from "#command/merge-base-executor.service"
import { MergeBaseNotFoundError } from "#domain/merge-base.error"
import RepositoryConfig from "#config/repository-config.service"

const MERGE_BASE_NOT_FOUND_CODE = 1

const MergeBaseCommandExecutorLive: Layer.Layer<
	MergeBaseCommandExecutor,
	never,
	CommandExecutor.CommandExecutor | RepositoryConfig
> = Layer.effect(
	MergeBaseCommandExecutor,
	Effect.gen(function* () {
		const [executor, { directory }] = yield* Effect.all(
			[CommandExecutor.CommandExecutor, RepositoryConfig],
			{ concurrency: "unbounded" }
		)

		return ({
			baseRef: { name: baseRef },
			headRef: { name: headRef },
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

export default MergeBaseCommandExecutorLive
