import { effect as layerEffect, type Layer } from "effect/Layer"
import { gen as effectGen, provideService as effectProvideService } from "effect/Effect"
import { pipe } from "effect/Function"
import printCase, { type Arguments as PrintArguments } from "./core/print.case.ts"
import Reference from "./service.ts"
import PrintCommand from "./core/print-command.service.ts"

const referenceLive: Layer<Reference, never, PrintCommand> = layerEffect(
	Reference,
	effectGen(function* () {
		const print = yield* PrintCommand

		return {
			print: (args: PrintArguments) =>
				pipe(printCase(args), effectProvideService(PrintCommand, print)),
		}
	})
)

export default referenceLive
