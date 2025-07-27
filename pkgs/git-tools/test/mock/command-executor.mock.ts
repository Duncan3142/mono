import {
	gen as effectGen,
	succeed as effectSucceed,
	fail as effectFail,
	delay as effectDelay,
	fork as effectFork,
	type Effect,
	all as effectAll,
} from "effect/Effect"
import { match as eitherMatch } from "effect/Either"
import {
	make as deferredMake,
	succeed as deferredSucceed,
	await as deferredAwait,
} from "effect/Deferred"
import { map as arrayMap } from "effect/Array"
import { make as refMake, get as refGet, set as refSet } from "effect/Ref"
import { fromIterable as streamFromIterable, fail as streamFail } from "effect/Stream"
import { pipe } from "effect/Function"
import {
	CommandExecutor,
	ExitCode,
	type Process,
	makeExecutor,
} from "@effect/platform/CommandExecutor"
import { effect as layerEffect, type Layer } from "effect/Layer"
import { mockDeep } from "vitest-mock-extended"
import { vi } from "@effect/vitest"
import type { DurationInput } from "effect/Duration"
import type { PlatformError } from "@effect/platform/Error"
import type { Either } from "effect/Either"

interface MockProcessProps {
	delay: DurationInput
	result: Either<
		{ exitCode: number; stdOutLines: Array<string>; stdErrLines: Array<string> },
		PlatformError
	>
}

const mockProcessGenerator = ({ delay, result }: MockProcessProps): Effect<Process> =>
	eitherMatch(result, {
		onLeft: (err) =>
			effectSucceed(
				mockDeep<Process>({
					isRunning: effectSucceed(false),
					exitCode: effectFail(err),
					stdout: streamFail(err),
					stderr: streamFail(err),
				})
			),
		onRight: ({ exitCode: exitCodeNumber, stdOutLines, stdErrLines }) =>
			effectGen(function* () {
				const isRunningRef = yield* refMake(true)
				const exitCodeDeferred = yield* deferredMake<ExitCode, PlatformError>()

				const settleProcess = pipe(
					effectAll(
						[
							refSet(isRunningRef, false),
							deferredSucceed(exitCodeDeferred, ExitCode(exitCodeNumber)),
						],
						{ discard: true, concurrency: "unbounded" }
					),
					effectDelay(delay)
				)

				yield* effectFork(settleProcess)

				const isRunning = refGet(isRunningRef)
				const exitCode = deferredAwait(exitCodeDeferred)

				const encoder = new TextEncoder()
				const lineToByteStream = (lines: Array<string>) =>
					pipe(
						arrayMap(lines, (line) => encoder.encode(line)),
						streamFromIterable
					)
				const stdout = lineToByteStream(stdOutLines)
				const stderr = lineToByteStream(stdErrLines)

				return mockDeep<Process>({
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
const CommandExecutorTest: (props: CommandExecutorMockProps) => Layer<CommandExecutor> = ([
	branchProps,
	tagProps,
]: CommandExecutorMockProps) =>
	layerEffect(
		CommandExecutor,
		effectGen(function* (_) {
			const start = vi.fn()
			const branchProcess = yield* mockProcessGenerator(branchProps)
			start.mockReturnValueOnce(effectSucceed(branchProcess))
			const tagProcess = yield* mockProcessGenerator(tagProps)
			start.mockReturnValueOnce(effectSucceed(tagProcess))
			return makeExecutor(start)
		})
	)

export default CommandExecutorTest
export type { MockProcessProps, CommandExecutorMockProps }
