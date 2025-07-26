import { effect as layerEffect, type Layer } from "effect/Layer"
import { gen as effectGen, all as effectAll } from "effect/Effect"

import Git from "./service.ts"
import PrintRefs from "#case/print-refs.service"
import Fetch from "#case/fetch.service"

const GitLive: Layer<Git, never, Fetch | PrintRefs> = layerEffect(
	Git,
	effectGen(function* () {
		const [printRefs, fetch] = yield* effectAll([PrintRefs, Fetch])

		return {
			printRefs,
			fetch,
		}
	})
)

export default GitLive
