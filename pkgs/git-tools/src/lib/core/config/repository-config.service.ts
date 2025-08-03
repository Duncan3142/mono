import { Config, Effect } from "effect"
import { tag } from "#const"
import { Remote } from "#domain/remote"

const DEFAULT_REMOTE_NAME = "origin"

const FETCH = { DEFAULT_DEPTH: 1, DEFAULT_DEEPEN_BY: 512, DEFAULT_MAX_DEPTH: 1024 }

interface FetchConfig {
	readonly maxDepth: number
	readonly defaultDepth: number
	readonly defaultDeepenBy: number
}

/**
 * Repository configuration service
 */
class RepositoryConfig extends Effect.Service<RepositoryConfig>()(
	tag(`config`, `repo-config`),
	{
		effect: Effect.gen(function* () {
			const defaultRemote: Remote = yield* Config.nested(
				Config.string("NAME").pipe(Config.withDefault(DEFAULT_REMOTE_NAME)),
				"DEFAULT_REMOTE"
			).pipe(Config.map((name) => Remote({ name })))
			const gitDirectory = yield* Config.string("GIT_DIRECTORY")

			const fetch: FetchConfig = yield* Config.nested(
				Config.all([
					Config.number("DEFAULT_DEPTH").pipe(Config.withDefault(FETCH.DEFAULT_DEPTH)),
					Config.number("DEFAULT_DEEPEN_BY").pipe(Config.withDefault(FETCH.DEFAULT_DEEPEN_BY)),
					Config.number("DEFAULT_MAX_DEPTH").pipe(Config.withDefault(FETCH.DEFAULT_MAX_DEPTH)),
				]),
				"FETCH"
			).pipe(
				Config.map(([defaultDepth, defaultDeepenBy, maxDepth]) => {
					return { defaultDepth, defaultDeepenBy, maxDepth }
				})
			)

			return {
				directory: gitDirectory,
				defaultRemote,
				fetch,
			}
		}),
	}
) {}

export default RepositoryConfig
