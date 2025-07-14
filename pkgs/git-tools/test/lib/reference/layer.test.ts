import { expect, describe, it, vi } from "@effect/vitest"
import {
	exit as effectExit,
	gen as effectGen,
	provide as effectProvide,
	void as effectVoid,
	succeed as effectSucceed,
	delay as effectDelay,
	fork as effectFork,
	type Effect,
	all as effectAll,
} from "effect/Effect"
import { join as effectJoin } from "effect/Fiber"
import {
	make as loggerMake,
	replace as loggerReplace,
	defaultLogger,
	type Logger,
} from "effect/Logger"
import {
	make as deferredMake,
	succeed as deferredSucceed,
	await as deferredAwait,
} from "effect/Deferred"
import { make as refMake, get as refGet, set as refSet } from "effect/Ref"
import { fromIterable as streamFromIterable } from "effect/Stream"
import { pipe } from "effect/Function"
import { type Console, withConsole } from "effect/Console"
import { mockDeep } from "vitest-mock-extended"
import { CommandExecutor, ExitCode, type Process } from "@effect/platform/CommandExecutor"
import { provide as layerProvide, effect as layerEffect, type Layer } from "effect/Layer"
import { adjust as testClockAdjust } from "effect/TestClock"
import ReferenceLayer from "#reference/layer"
import Reference from "#reference/service"
import PrintLayer from "#reference/git/print.layer"

const logHandler = vi.fn<(options: Logger.Options<unknown>) => void>()

const loggerLayer = loggerReplace(defaultLogger, loggerMake(logHandler))

const MockConsole = mockDeep<Console>()

MockConsole.log.mockImplementation((args) => {
	console.log(args)
	return effectVoid
})
MockConsole.error.mockImplementation(() => effectVoid)

const mockProcessGenerator = (): Effect<Process> =>
	effectGen(function* () {
		const isRunningRef = yield* refMake(true)
		const exitCodeDeferred = yield* deferredMake<ExitCode>()

		const settleProcess = pipe(
			effectAll(
				[
					refSet(isRunningRef, false),
					// eslint-disable-next-line @typescript-eslint/no-magic-numbers -- success exit code
					deferredSucceed(exitCodeDeferred, ExitCode(0)),
				],
				{ discard: true, concurrency: 2 }
			),
			effectDelay("1 second")
		)

		yield* effectFork(settleProcess)

		// The `isRunning` effect is now just a simple, efficient read from the SHARED ref.
		const isRunningEffect = refGet(isRunningRef)
		const exitCodeEffect = deferredAwait(exitCodeDeferred)

		return mockDeep<Process>({
			isRunning: isRunningEffect,
			exitCode: exitCodeEffect, // exitCode can now be immediate
			stdout: streamFromIterable([
				Uint8Array.from(`* effect-test                0468291 [origin/effect-test] abc def\n`),
				Uint8Array.from(
					`  main                       62c5d1a [origin/main] Semver @duncan3142/effect-test (#2)\n`
				),
				Uint8Array.from(`  remotes/origin/HEAD        -> origin/main\n`),
				Uint8Array.from(
					`  remotes/origin/effect-test c6722b4 Semver @duncan3142/effect-test (#1)`
				),
			]),
			stderr: streamFromIterable([]),
		})
	})

const CommandExecutorTest: Layer<CommandExecutor> = layerEffect(
	CommandExecutor,
	effectGen(function* (_) {
		// Acquire the correctly constructed mock from our factory.
		const mockProcess = yield* mockProcessGenerator()
		const commandExecutorMock = mockDeep<CommandExecutor>()
		commandExecutorMock.start.mockReturnValue(effectSucceed(mockProcess))
		return commandExecutorMock
	})
)

const MainLayer = pipe(
	ReferenceLayer,
	layerProvide(PrintLayer),
	layerProvide(CommandExecutorTest)
)

describe("Reference Layer", () => {
	it.scoped("prints references", () =>
		pipe(
			effectGen(function* () {
				const reference = yield* Reference
				const fiber = yield* effectFork(
					effectExit(
						reference.print({
							repoDirectory: process.cwd(),
							level: "Info",
							message: "Testing print references",
						})
					)
				)
				yield* testClockAdjust("3 seconds")
				const result = yield* effectJoin(fiber)
				expect(result).toStrictEqual(effectVoid)
				expect(logHandler).toHaveBeenCalledWith(
					expect.objectContaining({
						message: ["Testing print references"],
						// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- returns 'any'
						logLevel: expect.objectContaining({ label: "INFO" }),
					})
				)
			}),
			effectProvide(MainLayer),
			effectProvide(loggerLayer),
			withConsole(MockConsole)
		)
	)
})
