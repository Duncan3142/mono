import { effect as layerEffect, type Layer } from "effect/Layer"
import { gen as effectGen, provideService as effectProvideService } from "effect/Effect"
import { pipe } from "effect/Function"
import printCase, { type Arguments as PrintArguments } from "./core/print.case.ts"
import Reference from "./service.ts"
import Print from "./core/print.service.ts"

const ReferenceLive: Layer<Reference, never, Print> = layerEffect(
	Reference,
	effectGen(function* () {
		const print = yield* Print

		return {
			print: (args: PrintArguments) =>
				pipe(printCase(args), effectProvideService(Print, print)),
		}
	})
)

export default ReferenceLive
