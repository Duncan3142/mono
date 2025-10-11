/* eslint-disable @typescript-eslint/unbound-method -- Check mock use */

import { expect, describe, it, vi } from "@effect/vitest"
import { Effect, Fiber, Layer, TestClock, Either } from "effect"
import { CommandExecutor } from "@effect/platform"
import { MockConfigProvider, MockConsole, MockLogger, MockProcess } from "@duncan3142/effect"
import { BranchCommand } from "#duncan3142/git-tools/lib/core/command"
import { BranchExecutor } from "#duncan3142/git-tools/lib/git"
import { RepositoryConfig } from "#duncan3142/git-tools/lib/core/config"
import { RepositoryContext } from "#duncan3142/git-tools/lib/core/context"
import { Repository } from "#duncan3142/git-tools/lib/core/domain"

const logHandler = vi.fn<() => void>()

const console = MockConsole.make()

const processProps = {
	delay: "1 second",
	result: Either.right({
		exitCode: 0,
		stdOutLines: [`alpha\n`, `beta`],
		stdErrLines: [],
	}),
} satisfies MockProcess.Props

const start = vi.fn<MockProcess.Start>()
const branchProcess = MockProcess.make(processProps)
start.mockReturnValueOnce(branchProcess)

const ProgramLayer = BranchCommand.Default.pipe(
	Layer.provide(BranchExecutor.Live),
	Layer.provide(RepositoryConfig.Default),
	Layer.provide(MockLogger.make(logHandler))
)

describe("BranchCommand", () => {
	it.effect("prints", () =>
		Effect.gen(function* () {
			const result = yield* Effect.gen(function* () {
				const printRefs = yield* BranchCommand.BranchCommand
				const fiber = yield* Effect.fork(Effect.exit(printRefs()))
				yield* TestClock.adjust("3 seconds")
				return yield* Fiber.join(fiber)
			})

			expect(result).toStrictEqual(Effect.void)

			expect(console.log).toHaveBeenCalledTimes(2)

			expect(console.log).toHaveBeenNthCalledWith(1, `alpha`)
			expect(console.log).toHaveBeenNthCalledWith(2, `beta`)
		}).pipe(
			Effect.provide(ProgramLayer),
			Effect.provideService(
				RepositoryContext.RepositoryContext,
				Repository.Repository({ directory: "dummy" })
			),
			Effect.provideService(
				CommandExecutor.CommandExecutor,
				CommandExecutor.makeExecutor(start)
			),
			Effect.withConsole(console),
			MockConfigProvider.make([])
		)
	)
})

/* eslint-enable @typescript-eslint/unbound-method -- Check mock use */
