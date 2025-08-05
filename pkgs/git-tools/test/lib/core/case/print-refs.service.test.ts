/* eslint-disable @typescript-eslint/unbound-method -- Check mock use */
/* eslint-disable @typescript-eslint/no-magic-numbers -- Check mock use */
import { expect, describe, it, vi } from "@effect/vitest"
import { Effect, Fiber, ConfigProvider, Layer, TestClock, Either } from "effect"
import CommandExecutorTest, { type MockProcessProps } from "#mock/command-executor.mock"
import PrintRefsCommand from "#command/print-refs.service"
import PrintRefsExecutorLive from "#git/executor/print-refs.layer"
import RepositoryConfig from "#config/repository-config.service"
import LoggerTest from "#mock/logger.mock"
import consoleFactory from "#mock/console.mock"
import Repository from "#context/repository.service"
import { Repository as RepositoryData } from "#domain/repository"

const logHandler = vi.fn<() => void>()

const mockConsole = consoleFactory()

const branchProps = {
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
} satisfies MockProcessProps

const tagProps = {
	delay: "1 second",
	result: Either.right({
		exitCode: 0,
		stdOutLines: [`@duncan3142/git-tools@0.0.0\n`, `@duncan3142/git-tools@0.0.1`],
		stdErrLines: [],
	}),
} satisfies MockProcessProps

const ProgramLayer = PrintRefsCommand.Default.pipe(
	Layer.provide(PrintRefsExecutorLive),
	Layer.provide(CommandExecutorTest([branchProps, tagProps])),
	Layer.provide(RepositoryConfig.Default),
	Layer.provide(LoggerTest(logHandler))
)

describe("Reference Layer", () => {
	it.effect("prints references", () =>
		Effect.gen(function* () {
			const result = yield* Effect.gen(function* () {
				const printRefs = yield* PrintRefsCommand
				const fiber = yield* Effect.fork(Effect.exit(printRefs()))
				yield* TestClock.adjust("3 seconds")
				return yield* Fiber.join(fiber)
			})

			expect(result).toStrictEqual(Effect.void)

			expect(mockConsole.log).toHaveBeenCalledTimes(1)
			expect(mockConsole.log).toHaveBeenNthCalledWith(1, "Branches:")
			expect(mockConsole.log).toHaveBeenNthCalledWith(
				2,
				[
					`* effect-test                0468291 [origin/effect-test] abc def`,
					`  main                       62c5d1a [origin/main] Semver @duncan3142/effect-test (#2)`,
					`  remotes/origin/HEAD        -> origin/main`,
					`  remotes/origin/effect-test c6722b4 Semver @duncan3142/effect-test (#1)`,
				].join("\n")
			)

			expect(mockConsole.log).toHaveBeenNthCalledWith(3, "Tags:")
			expect(mockConsole.log).toHaveBeenNthCalledWith(
				4,
				[`@duncan3142/git-tools@0.0.0`, `@duncan3142/git-tools@0.0.1`].join("\n")
			)
		}).pipe(
			Effect.provide(ProgramLayer),
			Effect.provideService(Repository, RepositoryData({ directory: process.cwd() })),
			Effect.withConsole(mockConsole),
			Effect.withConfigProvider(ConfigProvider.fromMap(new Map([])))
		)
	)
})
/* eslint-enable @typescript-eslint/unbound-method -- Check mock use */
/* eslint-enable @typescript-eslint/no-magic-numbers -- Check mock use */
