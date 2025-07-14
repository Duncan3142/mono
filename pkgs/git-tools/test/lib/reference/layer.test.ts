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
import CommandExecutorTest from "./command-executor.mock.ts"
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
