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

import { mockDeep } from "vitest-mock-extended"
import { CommandExecutor, ExitCode, type Process } from "@effect/platform/CommandExecutor"
import { effect as layerEffect, type Layer } from "effect/Layer"

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
				new TextEncoder().encode(
					`* effect-test                0468291 [origin/effect-test] abc def`
				),
				new TextEncoder().encode(
					`  main                       62c5d1a [origin/main] Semver @duncan3142/effect-test (#2)`
				),
				new TextEncoder().encode(`  remotes/origin/HEAD        -> origin/main`),
				new TextEncoder().encode(
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

export default CommandExecutorTest
