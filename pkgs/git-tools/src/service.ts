import { Effect } from "effect"
import PrintRefs from "#case/print-refs.service"
import Fetch from "#case/fetch.service"
import { SERVICE_PREFIX } from "#const"

/**
 * Git service
 */
class Git extends Effect.Service<Git>()(`${SERVICE_PREFIX}/git`, {
	effect: Effect.gen(function* () {
		const [printRefs, fetch] = yield* Effect.all([PrintRefs, Fetch])

		return {
			printRefs,
			fetch,
		}
	}),
}) {}

export default Git
