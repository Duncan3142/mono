import { CommandExecutor, Command } from "@effect/platform"
import type { Array, Duration } from "effect"
import { Layer, pipe, Effect, Console, Stream, Match } from "effect"
import { BRANCH, TAG } from "#domain/reference"
import { GitCommandFailedError, GitCommandTimeoutError } from "#domain/git-command.error"
import PrintCommand, { type Arguments } from "#command/print-refs.service"
import RepositoryConfig from "#config/repository-config.service"

const SUCCESS_CODE = 0

const PrintRefsCommandLive: Layer.Layer<
	PrintCommand,
	never,
	CommandExecutor.CommandExecutor | RepositoryConfig
> = Layer.effect(
	PrintCommand,
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
				const [subcommand, ...subArgs] = args
				const timeout: Duration.DurationInput = "2 seconds"
				return yield* pipe(
					Command.make("git", "--no-pager", ...args),
					Command.workingDirectory(repoDirectory),
					Command.stdout("pipe"),
					Command.stderr("pipe"),
					Command.start,
					Effect.orDie,
					Effect.flatMap(({ exitCode, stdout, stderr }) => {
						const result = pipe(
							exitCode,
							Effect.timeoutFail({
								duration: timeout,
								onTimeout: () =>
									new GitCommandTimeoutError({ timeout, command: subcommand, args: subArgs }),
							}),
							Effect.orDie,
							Effect.flatMap((code) =>
								pipe(
									Match.value(code),
									Match.when(SUCCESS_CODE, () => Effect.void),
									Match.orElse((errorCode) =>
										Effect.die(
											new GitCommandFailedError({
												exitCode: errorCode,
												command: subcommand,
												args: subArgs,
											})
										)
									)
								)
							)
						)
						return Effect.all(
							[
								result,
								pipe(stdout, Stream.decodeText(), Stream.runForEach(Console.log), Effect.orDie),
								pipe(
									stderr,
									Stream.decodeText(),
									Stream.runForEach(Console.error),
									Effect.orDie
								),
							],
							{ concurrency: "unbounded", discard: true }
						)
					}),
					Effect.scoped,
					Effect.provideService(CommandExecutor.CommandExecutor, executor)
				)
			})
	})
)

export default PrintRefsCommandLive
