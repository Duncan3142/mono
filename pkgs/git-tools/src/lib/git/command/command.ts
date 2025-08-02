import type { CommandExecutor } from "@effect/platform"
import { Command } from "@effect/platform"
import type { Duration, Scope } from "effect"
import { Effect, Stream, pipe, Console, Chunk } from "effect"
import { GitCommandTimeoutError } from "#domain/git-command.error"

interface Arguments {
	readonly subCommand: string
	readonly subArgs: ReadonlyArray<string>
	readonly directory: string
	readonly timeout: Duration.DurationInput
}

const SUCCESS_CODE = 0

type ErrorCode = number

/**
 * Factory function to create a command executor for git commands.
 * @param args - The arguments for the command executor.
 * @param args.subCommand - The sub-command to run (e.g., "fetch").
 * @param args.subArgs - The arguments to pass to the git subcommand.
 * @param args.directory - The working directory for the git command.
 * @param args.timeout - The timeout for the command execution.
 * @returns A function that executes the git command and returns an effect.
 */
const commandFactory = ({
	directory,
	subCommand,
	subArgs,
	timeout,
}: Arguments): Effect.Effect<
	string,
	ErrorCode,
	CommandExecutor.CommandExecutor | Scope.Scope
> =>
	pipe(
		Command.make("git", "--no-pager", subCommand, ...subArgs),
		Command.workingDirectory(directory),
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
						new GitCommandTimeoutError({
							timeout,
							command: subCommand,
							args: subArgs,
						}),
				}),
				Effect.orDie,
				Effect.flatMap((code) => (code === SUCCESS_CODE ? Effect.void : Effect.fail(code)))
			)
			return Effect.all(
				[
					pipe(
						stdout,
						Stream.orDie,
						Stream.decodeText(),
						Stream.runCollect,
						Effect.andThen(Chunk.join(""))
					),
					pipe(stderr, Stream.orDie, Stream.decodeText(), Stream.runForEach(Console.error)),
					result,
				],
				{ concurrency: "unbounded" }
			).pipe(Effect.map(([stdOut]) => stdOut))
		})
	)

export default commandFactory
