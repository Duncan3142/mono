/* eslint-disable @typescript-eslint/unbound-method -- Check mock use */
/* eslint-disable @typescript-eslint/no-magic-numbers -- Check mock use */
import { expect, describe, it, vi } from "@effect/vitest"
import { Effect, Fiber, ConfigProvider, Layer, TestClock, Either } from "effect"
import { CommandExecutor } from "@effect/platform"
import { BranchCommand } from "#command"
import { BranchExecutor } from "#git"
import { RepositoryConfig } from "#config"
import { MockConsole, MockLogger, MockProcess } from "#mock"
import { RepositoryContext } from "#context"
import { Repository } from "#domain"

const logHandler = vi.fn<() => void>()

const console = MockConsole.make()

const processProps = {
	delay: "1 second",
	result: Either.right({
		exitCode: 0,
		stdOutLines: [
			`* effect-test                0468291 [origin/effect-test] abc def\n`,
			`  main                       62c5d1a [origin/main] Semver @duncan3142/effect-test (#2)\n`,
			`  remotes/origin/HEAD        -> origin/main\n`,
			`  remotes/origin/effect-test c6722b4 Semver @duncan3142/effect-test (#1)`,
		],
		stdErrLines: [],
	}),
} satisfies MockProcess.Props

const start = vi.fn<MockProcess.Start>()
const branchProcess = MockProcess.make(processProps)
start.mockReturnValueOnce(branchProcess)

const ProgramLayer = BranchCommand.Default.pipe(
	Layer.provide(BranchExecutor.Live),
	Layer.provide(RepositoryConfig.Default),
	Layer.provide(MockLogger.Test(logHandler))
)

describe("BranchCommand", () => {
	it.effect("prints", () =>
		Effect.gen(function* () {
			const result = yield* Effect.gen(function* () {
				const printRefs = yield* BranchCommand.Service
				const fiber = yield* Effect.fork(Effect.exit(printRefs()))
				yield* TestClock.adjust("3 seconds")
				return yield* Fiber.join(fiber)
			})

			expect(result).toStrictEqual(Effect.void)

			expect(console.log).toHaveBeenCalledTimes(1)

			expect(console.log).toHaveBeenNthCalledWith(
				1,
				[
					`* effect-test                0468291 [origin/effect-test] abc def`,
					`  main                       62c5d1a [origin/main] Semver @duncan3142/effect-test (#2)`,
					`  remotes/origin/HEAD        -> origin/main`,
					`  remotes/origin/effect-test c6722b4 Semver @duncan3142/effect-test (#1)`,
				].join("\n")
			)
		}).pipe(
			Effect.provide(ProgramLayer),
			Effect.provideService(
				RepositoryContext.Tag,
				Repository.Repository({ directory: process.cwd() })
			),
			Effect.provideService(
				CommandExecutor.CommandExecutor,
				CommandExecutor.makeExecutor(start)
			),
			Effect.withConsole(console),
			Effect.withConfigProvider(ConfigProvider.fromMap(new Map([])))
		)
	)
})
/* eslint-enable @typescript-eslint/unbound-method -- Check mock use */
/* eslint-enable @typescript-eslint/no-magic-numbers -- Check mock use */
