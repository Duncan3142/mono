import { effect as layerEffect, type Layer } from "effect/Layer"
import {
	gen as effectGen,
	provideService as effectProvideService,
	all as effectAll,
} from "effect/Effect"
import { pipe } from "effect/Function"
import Fetch, { type Arguments } from "./fetch.service.ts"
import fetch from "./fetch.ts"
import PrintRefs from "./print-refs.service.ts"
import FetchCommand from "#command/fetch.service"

const FetchLive: Layer<Fetch, never, FetchCommand | PrintRefs> = layerEffect(
	Fetch,
	effectGen(function* () {
		const [fetchCommand, printRefs] = yield* effectAll([FetchCommand, PrintRefs], {
			concurrency: "unbounded",
		})

		return (args: Arguments) =>
			pipe(
				args,
				fetch,
				effectProvideService(FetchCommand, fetchCommand),
				effectProvideService(PrintRefs, printRefs)
			)
	})
)

export default FetchLive
