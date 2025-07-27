import type { ConfigError } from "effect"
import { Layer, Config, Effect } from "effect"
import RepositoryConfig from "./repository-config.service.ts"

const DEFAULT_REMOTE_NAME = "origin"

const FETCH = { DEFAULT_DEPTH: 1, DEFAULT_DEEPEN_BY: 512, DEFAULT_MAX_DEPTH: 1024 }

const RepositoryConfigLive: Layer.Layer<RepositoryConfig, ConfigError.ConfigError> =
	Layer.effect(
		RepositoryConfig,
		Effect.gen(function* () {
			const defaultRemote = yield* Config.nested(
				Config.string("NAME").pipe(Config.withDefault(DEFAULT_REMOTE_NAME)),
				"DEFAULT_REMOTE"
			).pipe(
				Config.map((name) => {
					return { name }
				})
			)
			const gitDirectory = yield* Config.string("GIT_DIRECTORY")

			const fetch = yield* Config.nested(
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
		})
	)

export default RepositoryConfigLive
