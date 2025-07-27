import type { ConfigError } from "effect"
import { Layer, Effect } from "effect"
import Git from "./service.ts"
import PrintRefs from "#case/print-refs.service"
import Fetch from "#case/fetch.service"

const GitLive: Layer.Layer<Git, ConfigError.ConfigError, PrintRefs | Fetch> = Layer.effect(
	Git,
	Effect.gen(function* () {
		const [printRefs, fetch] = yield* Effect.all([PrintRefs, Fetch])

		return {
			printRefs,
			fetch,
		}
	})
)

export default GitLive
