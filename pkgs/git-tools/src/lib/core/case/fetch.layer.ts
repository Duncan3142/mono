import { effect as layerEffect, type Layer, provide as layerProvide } from "effect/Layer"
import {
	gen as effectGen,
	provideService as effectProvideService,
	all as effectAll,
} from "effect/Effect"
import { pipe } from "effect/Function"
import type { CommandExecutor } from "@effect/platform/CommandExecutor"
import Fetch, { type Arguments } from "./fetch.service.ts"
import fetch from "./fetch.ts"
import PrintRefs from "./print-refs.service.ts"
import PrintRefsLive from "./print-refs.layer.ts"
import FetchCommand from "#command/fetch.service"
import FetchCommandLive from "#git/command/fetch.layer"
import type RepositoryConfig from "#config/repository-config.service"

const FetchLive: Layer<Fetch, never, CommandExecutor | RepositoryConfig> = layerEffect(
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
).pipe(layerProvide(FetchCommandLive), layerProvide(PrintRefsLive))

export default FetchLive
