import { expect, describe, it } from "@effect/vitest"
import {
	exit as effectExit,
	gen as effectGen,
	provide as effectProvide,
	void as effectVoid,
} from "effect/Effect"
import { provide as layerProvide } from "effect/Layer"
import { pipe } from "effect/Function"
import { NodeContext } from "@effect/platform-node"
// import { pretty as loggerPretty } from "effect/Logger"
import ReferenceLayer from "#reference/layer"
import Reference from "#reference/service"
import PrintLayer from "#reference/git/print.layer"

const MainLayer = pipe(
	ReferenceLayer,
	layerProvide(PrintLayer),
	layerProvide(NodeContext.layer)
)

describe("Reference Layer", () => {
	it.live("prints references", () =>
		pipe(
			effectGen(function* () {
				const reference = yield* Reference
				const result = yield* effectExit(
					reference.print({
						repoDirectory: process.cwd(),
						level: "All",
						message: "Testing print references",
					})
				)

				expect(result).toStrictEqual(effectVoid)
			}),
			effectProvide(MainLayer)
			// effectProvide(loggerPretty)
		)
	)
})
