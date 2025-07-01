import { effect as layerEffect, type Layer } from "effect/Layer"
import { gen as effectGen, provideService as effectProvideService } from "effect/Effect"
import print, { type Arguments as PrintArguments } from "./core/print.case.ts"
import Reference from "./service.ts"
import PrintCommand from "./core/print.command.ts"

const ReferenceLive: Layer<Reference, never, PrintCommand> = layerEffect(
	Reference,
	effectGen(function* () {
		const command = yield* PrintCommand

		return {
			print: (args: PrintArguments) => effectProvideService(print(args), PrintCommand, command),
		}
	})
)

export default ReferenceLive
