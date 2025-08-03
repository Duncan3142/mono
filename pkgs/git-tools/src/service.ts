import { Effect } from "effect"
import PrintRefs from "#case/print-refs.service"
import Fetch from "#case/fetch.service"
import MergeBase from "#case/merge-base.service"
import { tag } from "#const"

/**
 * Git service
 */
class Git extends Effect.Service<Git>()(tag(`git`), {
	effect: Effect.gen(function* () {
		const [printRefs, fetch, mergeBase] = yield* Effect.all([PrintRefs, Fetch, MergeBase], {
			concurrency: "unbounded",
		})

		return {
			printRefs,
			fetch,
			mergeBase,
		}
	}),
}) {}

export default Git
