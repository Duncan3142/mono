/* eslint-disable @typescript-eslint/unbound-method -- Check mock use */
/* eslint-disable @typescript-eslint/no-magic-numbers -- Check mock use */
import { expect, describe, it, vi } from "@effect/vitest"
import {
	exit as effectExit,
	gen as effectGen,
	provide as effectProvide,
	void as effectVoid,
	fork as effectFork,
} from "effect/Effect"
import { join as effectJoin } from "effect/Fiber"
import {
	make as loggerMake,
	replace as loggerReplace,
	defaultLogger,
	type Logger,
} from "effect/Logger"
import { pipe } from "effect/Function"
import { type Console, withConsole } from "effect/Console"
import { mockDeep } from "vitest-mock-extended"
import { provide as layerProvide } from "effect/Layer"
import { adjust as testClockAdjust } from "effect/TestClock"
import CommandExecutorTest, { type MockProcessProps } from "#mock/command-executor.mock"
import PrintRefsLive from "#case/print-refs.layer"
import PrintRefs from "#case/print-refs.service"
import PrintRefsCommandLive from "#git/command/print-refs.layer"

const logHandler = vi.fn<(options: Logger.Options<unknown>) => void>()

const LoggerLayer = loggerReplace(defaultLogger, loggerMake(logHandler))

const mockConsole = mockDeep<Console>()

mockConsole.log.mockImplementation(() => effectVoid)
mockConsole.error.mockImplementation(() => effectVoid)

const branchProps = {
	delay: "1 second",
	exitCode: 0,
	stdOutLines: [
		`* effect-test                0468291 [origin/effect-test] abc def`,
		`  main                       62c5d1a [origin/main] Semver @duncan3142/effect-test (#2)`,
		`  remotes/origin/HEAD        -> origin/main`,
		`  remotes/origin/effect-test c6722b4 Semver @duncan3142/effect-test (#1)`,
	],
	stdErrLines: [],
} satisfies MockProcessProps

const tagProps = {
	delay: "1 second",
	exitCode: 0,
	stdOutLines: [`@duncan3142/git-tools@0.0.0`, `@duncan3142/git-tools@0.0.1`],
	stdErrLines: [],
} satisfies MockProcessProps

const MainLayer = pipe(
	PrintRefsLive,
	layerProvide(PrintRefsCommandLive),
	layerProvide(CommandExecutorTest([branchProps, tagProps]))
)

describe("Reference Layer", () => {
	it.effect("prints references", () =>
		effectGen(function* () {
			const result = yield* pipe(
				effectGen(function* () {
					const printRefs = yield* PrintRefs
					const fiber = yield* effectFork(
						effectExit(
							printRefs({
								repoDirectory: process.cwd(),
								level: "Info",
								message: "Testing print references",
							})
						)
					)
					yield* testClockAdjust("3 seconds")
					return yield* effectJoin(fiber)
				}),
				effectProvide(MainLayer),
				effectProvide(LoggerLayer),
				withConsole(mockConsole)
			)

			expect(result).toStrictEqual(effectVoid)

			expect(logHandler).toHaveBeenCalledTimes(1)
			expect(logHandler).toHaveBeenNthCalledWith(
				1,
				expect.objectContaining({
					message: ["Testing print references"],
					// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- returns 'any'
					logLevel: expect.objectContaining({ label: "INFO" }),
				})
			)
			expect(mockConsole.log).toHaveBeenCalledTimes(6)
			expect(mockConsole.log).toHaveBeenNthCalledWith(
				1,
				"* effect-test                0468291 [origin/effect-test] abc def"
			)
			expect(mockConsole.log).toHaveBeenNthCalledWith(
				2,
				`  main                       62c5d1a [origin/main] Semver @duncan3142/effect-test (#2)`
			)
			expect(mockConsole.log).toHaveBeenNthCalledWith(
				3,
				`  remotes/origin/HEAD        -> origin/main`
			)
			expect(mockConsole.log).toHaveBeenNthCalledWith(
				4,
				`  remotes/origin/effect-test c6722b4 Semver @duncan3142/effect-test (#1)`
			)
			expect(mockConsole.log).toHaveBeenNthCalledWith(5, `@duncan3142/git-tools@0.0.0`)
			expect(mockConsole.log).toHaveBeenNthCalledWith(6, `@duncan3142/git-tools@0.0.1`)
		})
	)
})
/* eslint-enable @typescript-eslint/unbound-method -- Check mock use */
/* eslint-enable @typescript-eslint/no-magic-numbers -- Check mock use */
