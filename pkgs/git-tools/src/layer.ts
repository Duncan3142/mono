import { effect as layerEffect, type Layer, provide as layerProvide } from "effect/Layer"
import { gen as effectGen, all as effectAll } from "effect/Effect"

import type { CommandExecutor } from "@effect/platform/CommandExecutor"
import type { ConfigError } from "effect/ConfigError"
import Git from "./service.ts"
import PrintRefs from "#case/print-refs.service"
import Fetch from "#case/fetch.service"
import PrintRefsLive from "#case/print-refs.layer"
import FetchLive from "#case/fetch.layer"
import RepositoryConfigLive from "#config/repository-config.layer"

const GitLive: Layer<Git, ConfigError, CommandExecutor> = layerEffect(
	Git,
	effectGen(function* () {
		const [printRefs, fetch] = yield* effectAll([PrintRefs, Fetch])

		return {
			printRefs,
			fetch,
		}
	})
).pipe(layerProvide(PrintRefsLive), layerProvide(FetchLive), layerProvide(RepositoryConfigLive))

export default GitLive
