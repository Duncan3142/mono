import { expect, describe, it, vi } from "@effect/vitest"
import {
	exit as effectExit,
	gen as effectGen,
	provide as effectProvide,
	void as effectVoid,
} from "effect/Effect"
import { provide as layerProvide } from "effect/Layer"
import {
	make as loggerMake,
	replace as loggerReplace,
	defaultLogger,
	type Logger,
} from "effect/Logger"
import { pipe } from "effect/Function"
import { NodeContext } from "@effect/platform-node"
import { type Console, withConsole } from "effect/Console"
import { mockDeep } from "vitest-mock-extended"
import ReferenceLayer from "#reference/layer"
import Reference from "#reference/service"
import PrintLayer from "#reference/git/print.layer"

const MainLayer = pipe(
	ReferenceLayer,
	layerProvide(PrintLayer),
	layerProvide(NodeContext.layer)
)

const logHandler = vi.fn<(options: Logger.Options<unknown>) => void>()

const loggerLayer = loggerReplace(defaultLogger, loggerMake(logHandler))

const MockConsole = mockDeep<Console>()

// MockConsole.log.mockImplementation(() => effectVoid)
// MockConsole.unsafe.log.mockImplementation(() => effectVoid)

describe("Reference Layer", () => {
	it.effect("prints references", () =>
		pipe(
			effectGen(function* () {
				const reference = yield* Reference
				const result = yield* effectExit(
					reference.print({
						repoDirectory: process.cwd(),
						level: "Info",
						message: "Testing print references",
					})
				)
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
