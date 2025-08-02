import { CommandExecutor } from "@effect/platform"
import type { Array, Duration } from "effect"
import { Layer, pipe, Effect, Match } from "effect"
import commandFactory from "./command.ts"
import { BRANCH, TAG } from "#domain/reference"
import { GitCommandFailedError } from "#domain/git-command.error"
import PrintRefsCommandExecutor, { type Arguments } from "#command/print-refs-executor.service"
import RepositoryConfig from "#config/repository-config.service"

const PrintRefsCommandExecutorLive: Layer.Layer<
	PrintRefsCommandExecutor,
	never,
	CommandExecutor.CommandExecutor | RepositoryConfig
> = Layer.effect(
	PrintRefsCommandExecutor,
	Effect.gen(function* () {
		const executor = yield* CommandExecutor.CommandExecutor
		const { directory: repoDirectory } = yield* RepositoryConfig

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
						directory: repoDirectory,
						subCommand,
						subArgs,
						timeout,
					}),
					Effect.catchAll((errorCode) =>
						Effect.die(
							new GitCommandFailedError({
								exitCode: errorCode,
								command: subCommand,
								args: subArgs,
							})
						)
					),
					Effect.scoped,
					Effect.provideService(CommandExecutor.CommandExecutor, executor)
				)
			})
	})
)

export default PrintRefsCommandExecutorLive
