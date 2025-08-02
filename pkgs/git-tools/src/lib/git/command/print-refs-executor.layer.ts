import { CommandExecutor } from "@effect/platform"
import type { Array, Duration } from "effect"
import { Layer, pipe, Effect, Match, Console } from "effect"
import commandFactory from "./command.ts"
import { BRANCH, TAG } from "#domain/reference"
import PrintRefsCommandExecutor, { type Arguments } from "#command/print-refs-executor.service"
import RepositoryConfig from "#config/repository-config.service"

const PrintRefsCommandExecutorLive: Layer.Layer<
	PrintRefsCommandExecutor,
	never,
	CommandExecutor.CommandExecutor | RepositoryConfig
> = Layer.effect(
	PrintRefsCommandExecutor,
	Effect.gen(function* () {
		const [executor, { directory }] = yield* Effect.all(
			[CommandExecutor.CommandExecutor, RepositoryConfig],
			{ concurrency: "unbounded" }
		)

		return ({ type }: Arguments): Effect.Effect<void> =>
			Effect.gen(function* () {
				const args = pipe(
					Match.value(type),
					Match.when(
						BRANCH,
						(): Array.NonEmptyReadonlyArray<string> => ["branch", "-a", "-v", "-v"]
					),
					Match.when(TAG, (): Array.NonEmptyReadonlyArray<string> => ["tag"]),
					Match.exhaustive
				)
				const [subCommand, ...subArgs] = args
				const timeout: Duration.DurationInput = "2 seconds"
				return yield* pipe(
					commandFactory({
						directory,
						subCommand,
						subArgs,
						timeout,
						errorMatcher: Match.value,
					}),
					Console.log,
					Effect.scoped,
					Effect.provideService(CommandExecutor.CommandExecutor, executor)
				)
			})
	})
)

export default PrintRefsCommandExecutorLive
