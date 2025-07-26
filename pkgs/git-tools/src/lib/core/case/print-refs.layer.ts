import { effect as layerEffect, type Layer, provide as layerProvide } from "effect/Layer"
import { gen as effectGen, provideService as effectProvideService } from "effect/Effect"
import { pipe } from "effect/Function"
import type { CommandExecutor } from "@effect/platform/CommandExecutor"
import PrintRefs, { type Arguments } from "./print-refs.service.ts"
import printRefs from "./print-refs.ts"
import PrintRefsCommand from "#command/print-refs.service"
import PrintRefsCommandLive from "#git/command/print-refs.layer"

const PrintRefsLive: Layer<PrintRefs, never, CommandExecutor> = layerEffect(
	PrintRefs,
	effectGen(function* () {
		const printRefsCommand = yield* PrintRefsCommand

		return (args: Arguments) =>
			pipe(args, printRefs, effectProvideService(PrintRefsCommand, printRefsCommand))
	})
).pipe(layerProvide(PrintRefsCommandLive))

export default PrintRefsLive
