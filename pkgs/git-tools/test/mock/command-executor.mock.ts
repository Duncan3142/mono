import type { Duration } from "effect"
import { Layer, Effect, Array, Either, Deferred, Ref, Stream, pipe } from "effect"
import type { Error as PlatformError } from "@effect/platform"
import { CommandExecutor } from "@effect/platform"
import { mockDeep } from "vitest-mock-extended"
import { vi } from "@effect/vitest"

interface MockProcessProps {
	delay: Duration.DurationInput
	result: Either.Either<
		{ exitCode: number; stdOutLines: Array<string>; stdErrLines: Array<string> },
		PlatformError.PlatformError
	>
}

const mockProcessGenerator = ({
	delay,
	result,
}: MockProcessProps): Effect.Effect<CommandExecutor.Process> =>
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

/**
 * CommandExecutor mock properties for testing.
 */
type CommandExecutorMockProps = [branch: MockProcessProps, tag: MockProcessProps]

/**
 * Creates a mock CommandExecutor layer for testing.
 * @param props - The properties for the command executor mock
 * @param props."0" - Properties for the branch command
 * @param props."1" - Properties for the tag command
 * @returns A layer that provides a mocked CommandExecutor
 */
const CommandExecutorTest: (
	props: CommandExecutorMockProps
) => Layer.Layer<CommandExecutor.CommandExecutor> = ([
	branchProps,
	tagProps,
]: CommandExecutorMockProps) =>
	Layer.effect(
		CommandExecutor.CommandExecutor,
		Effect.gen(function* (_) {
			const start = vi.fn()
			const branchProcess = yield* mockProcessGenerator(branchProps)
			start.mockReturnValueOnce(Effect.succeed(branchProcess))
			const tagProcess = yield* mockProcessGenerator(tagProps)
			start.mockReturnValueOnce(Effect.succeed(tagProcess))
			return CommandExecutor.makeExecutor(start)
		})
	)

export default CommandExecutorTest
export type { MockProcessProps, CommandExecutorMockProps }
