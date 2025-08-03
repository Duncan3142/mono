/* eslint-disable @typescript-eslint/unbound-method -- Check mock use */
/* eslint-disable @typescript-eslint/no-magic-numbers -- Check mock use */
import { expect, describe, it, vi } from "@effect/vitest"
import { Effect, Fiber, pipe, ConfigProvider, Layer, TestClock, Either } from "effect"
import CommandExecutorTest, { type MockProcessProps } from "#mock/command-executor.mock"
import PrintRefsCommand from "#command/print-refs.service"
import PrintRefsExecutorLive from "#git/executor/print-refs.layer"
import PrintRefs from "#case/print-refs.service"
import RepositoryConfig from "#config/repository-config.service"
import LoggerTest from "#mock/logger.mock"
import consoleFactory from "#mock/console.mock"

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

const ProgramLayer = pipe(
	PrintRefs.Default,
	Layer.provide(PrintRefsCommand.Default),
	Layer.provide(PrintRefsExecutorLive),
	Layer.provide(CommandExecutorTest([branchProps, tagProps])),
	Layer.provide(RepositoryConfig.Default),
	Layer.provide(LoggerTest(logHandler))
)

describe("Reference Layer", () => {
	it.effect("prints references", () =>
		Effect.gen(function* () {
			const result = yield* Effect.gen(function* () {
				const printRefs = yield* PrintRefs
				const fiber = yield* Effect.fork(
					Effect.exit(
						printRefs({
							logLevel: "Info",
							directory: "/dummy/path/to/repo", // Use a dummy path for testing
						})
					)
				)
				yield* TestClock.adjust("3 seconds")
				return yield* Fiber.join(fiber)
			})

			expect(result).toStrictEqual(Effect.void)

			expect(logHandler).toHaveBeenCalledTimes(1)
			expect(logHandler).toHaveBeenNthCalledWith(
				1,
				expect.objectContaining({
					message: ["Testing print references"],
					// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- returns 'any'
					logLevel: expect.objectContaining({ label: "INFO" }),
				})
			)
			expect(mockConsole.log).toHaveBeenCalledTimes(2)
			expect(mockConsole.log).toHaveBeenNthCalledWith(
				1,
				[
					`* effect-test                0468291 [origin/effect-test] abc def`,
					`  main                       62c5d1a [origin/main] Semver @duncan3142/effect-test (#2)`,
					`  remotes/origin/HEAD        -> origin/main`,
					`  remotes/origin/effect-test c6722b4 Semver @duncan3142/effect-test (#1)`,
				].join("\n")
			)
			expect(mockConsole.log).toHaveBeenNthCalledWith(
				2,
				[`@duncan3142/git-tools@0.0.0`, `@duncan3142/git-tools@0.0.1`].join("\n")
			)
		}).pipe(
			Effect.provide(ProgramLayer),
			Effect.withConsole(mockConsole),
			Effect.withConfigProvider(ConfigProvider.fromMap(new Map([])))
		)
	)
})
/* eslint-enable @typescript-eslint/unbound-method -- Check mock use */
/* eslint-enable @typescript-eslint/no-magic-numbers -- Check mock use */
