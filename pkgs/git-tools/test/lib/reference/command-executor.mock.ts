import {
	gen as effectGen,
	succeed as effectSucceed,
	delay as effectDelay,
	fork as effectFork,
	type Effect,
	all as effectAll,
} from "effect/Effect"
import {
	make as deferredMake,
	succeed as deferredSucceed,
	await as deferredAwait,
} from "effect/Deferred"
import { make as refMake, get as refGet, set as refSet } from "effect/Ref"
import { fromIterable as streamFromIterable } from "effect/Stream"
import { pipe } from "effect/Function"
import { CommandExecutor, ExitCode, type Process } from "@effect/platform/CommandExecutor"
import { effect as layerEffect, type Layer } from "effect/Layer"
import { mockDeep } from "vitest-mock-extended"
import type { DurationInput } from "effect/Duration"

interface MockProcessProps {
	exitCode: number
	delay: DurationInput
	stdOutLines: Array<string>
	stdErrLines: Array<string>
}

const mockProcessGenerator = ({
	exitCode,
	delay,
	stdOutLines,
	stdErrLines,
}: MockProcessProps): Effect<Process> =>
	effectGen(function* () {
		const isRunningRef = yield* refMake(true)
		const exitCodeDeferred = yield* deferredMake<ExitCode>()

		const settleProcess = pipe(
			effectAll(
				[refSet(isRunningRef, false), deferredSucceed(exitCodeDeferred, ExitCode(exitCode))],
				{ discard: true, concurrency: 2 }
			),
			effectDelay(delay)
		)

		yield* effectFork(settleProcess)

		// The `isRunning` effect is now just a simple, efficient read from the SHARED ref.
		const isRunningEffect = refGet(isRunningRef)
		const exitCodeEffect = deferredAwait(exitCodeDeferred)

		const encoder = new TextEncoder()

		const stdOutBytes = stdOutLines.map((line) => encoder.encode(line))
		const stdErrBytes = stdErrLines.map((line) => encoder.encode(line))

		return mockDeep<Process>({
			isRunning: isRunningEffect,
			exitCode: exitCodeEffect, // exitCode can now be immediate
			stdout: streamFromIterable(stdOutBytes),
			stderr: streamFromIterable(stdErrBytes),
		})
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
			const branchProcess = yield* mockProcessGenerator(branchProps)
			const tagProcess = yield* mockProcessGenerator(tagProps)
			const commandExecutorMock = mockDeep<CommandExecutor>()
			commandExecutorMock.start.mockReturnValueOnce(effectSucceed(branchProcess))
			commandExecutorMock.start.mockReturnValueOnce(effectSucceed(tagProcess))
			return commandExecutorMock
		})
	)

export default CommandExecutorTest
export type { MockProcessProps, CommandExecutorMockProps }
