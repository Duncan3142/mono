import { Config, Effect } from "effect"
import { TagFactory } from "#const"
import { Remote, Fetch } from "#domain"

const DEFAULT_REMOTE_NAME = "origin"
const DEFAULT_BRANCH = "main"
const FETCH = { DEFAULT_DEPTH: 1, DEFAULT_DEEPEN_BY: 512, DEFAULT_MAX_DEPTH: 1024 }

interface FetchConfig {
	readonly maxDepth: Fetch.Depth
	readonly defaultDepth: Fetch.Depth
	readonly defaultDeepenBy: Fetch.Depth
}

/**
 * Repository configuration service
 */
class Service extends Effect.Service<Service>()(TagFactory.make(`config`, `repo-config`), {
	effect: Effect.gen(function* () {
		const [defaultRemote, fetch, defaultBranch] = yield* Config.nested(
			Config.all([
				Config.nested(
					Config.all([
						Config.string("NAME").pipe(Config.withDefault(DEFAULT_REMOTE_NAME)),
						Config.string("URL"),
					]),
					"DEFAULT_REMOTE"
				).pipe(Config.map(([name, url]) => Remote.Remote({ name, url }))),
				Config.nested(
					Config.all([
						Config.number("DEFAULT_DEPTH").pipe(Config.withDefault(FETCH.DEFAULT_DEPTH)),
						Config.number("DEFAULT_DEEPEN_BY").pipe(
							Config.withDefault(FETCH.DEFAULT_DEEPEN_BY)
						),
						Config.number("DEFAULT_MAX_DEPTH").pipe(
							Config.withDefault(FETCH.DEFAULT_MAX_DEPTH)
						),
					]),
					"FETCH"
				).pipe(
					Config.map(([defaultDepth, defaultDeepenBy, maxDepth]): FetchConfig => {
						return { defaultDepth, defaultDeepenBy, maxDepth }
					})
				),
				Config.string("DEFAULT_BRANCH").pipe(Config.withDefault(DEFAULT_BRANCH)),
			]),
			"GIT_TOOLS"
		)

		return {
			defaultRemote,
			defaultBranch,
			fetch,
		}
	}),
}) {}

const Default = Service.Default

export { Service, Default }
