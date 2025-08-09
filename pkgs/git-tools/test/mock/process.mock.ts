import type { Duration, Scope } from "effect"
import { Effect, Array, Either, Deferred, Ref, Stream, pipe } from "effect"
import type { Command, Error as PlatformError } from "@effect/platform"
import { CommandExecutor } from "@effect/platform"
import { mockDeep } from "vitest-mock-extended"

interface MockProcessProps {
	delay: Duration.DurationInput
	result: Either.Either<
		{ exitCode: number; stdOutLines: Array<string>; stdErrLines: Array<string> },
		PlatformError.PlatformError
	>
}

/**
 * Generates a mock process that simulates the behavior of a command executor process.
 * @param props - The properties to configure the mock process.
 * @param props.delay - The delay before the process settles.
 * @param props.result - The result of the process execution.
 * @returns An Effect that produces a mock CommandExecutor.Process.
 */
const make = ({ delay, result }: MockProcessProps): Effect.Effect<CommandExecutor.Process> =>
	Either.match(result, {
		onLeft: (err) =>
			Effect.succeed(
				mockDeep<CommandExecutor.Process>({
					isRunning: Effect.succeed(false),
					exitCode: Effect.fail(err),
					stdout: Stream.fail(err),
					stderr: Stream.fail(err),
				})
			),
		onRight: ({ exitCode: exitCodeNumber, stdOutLines, stdErrLines }) =>
			Effect.gen(function* () {
				const isRunningRef = yield* Ref.make(true)
				const exitCodeDeferred = yield* Deferred.make<
					CommandExecutor.ExitCode,
					PlatformError.PlatformError
				>()

				const settleProcess = pipe(
					Effect.all(
						[
							Ref.set(isRunningRef, false),
							Deferred.succeed(exitCodeDeferred, CommandExecutor.ExitCode(exitCodeNumber)),
						],
						{ discard: true, concurrency: "unbounded" }
					),
					Effect.delay(delay)
				)

				yield* Effect.fork(settleProcess)

				const isRunning = Ref.get(isRunningRef)
				const exitCode = Deferred.await(exitCodeDeferred)

				const encoder = new TextEncoder()
				const lineToByteStream = (lines: Array<string>) =>
					pipe(
						Array.map(lines, (line) => encoder.encode(line)),
						Stream.fromIterable
					)
				const stdout = lineToByteStream(stdOutLines)
				const stderr = lineToByteStream(stdErrLines)

				return mockDeep<CommandExecutor.Process>({
					isRunning,
					exitCode,
					stdout,
					stderr,
				})
			}),
	})

type Start = (
	command: Command.Command
) => Effect.Effect<CommandExecutor.Process, PlatformError.PlatformError, Scope.Scope>

export { make }
export type { MockProcessProps, Start }
