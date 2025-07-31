import { Effect } from "effect"
import PrintRefs from "#case/print-refs.service"
import Fetch, { type Arguments as FetchArguments } from "#case/fetch.service"
import { SERVICE_PREFIX } from "#const"
import FetchDepthFactory from "#state/fetch-depth-factory.service"
import FetchDepth from "#state/fetch-depth.service"

/**
 * Git service
 */
class Git extends Effect.Service<Git>()(`${SERVICE_PREFIX}/git`, {
	effect: Effect.gen(function* () {
		const [printRefs, fetch, fetchDepthFactory] = yield* Effect.all([
			PrintRefs,
			Fetch,
			FetchDepthFactory,
		])

		return {
			printRefs,
			fetch: (args: FetchArguments) =>
				fetch(args).pipe(
					Effect.provideServiceEffect(FetchDepth, fetchDepthFactory),
					Effect.scoped
				),
		}
	}),
}) {}

export default Git
