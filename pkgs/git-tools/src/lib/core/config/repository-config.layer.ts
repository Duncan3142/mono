import { type Layer, effect as layerEffect } from "effect/Layer"
import {
	string as configString,
	number as configNumber,
	withDefault as configWithDefault,
	all as configAll,
	nested as configNested,
	map as configMap,
} from "effect/Config"
import { gen as effectGen } from "effect/Effect"
import type { ConfigError } from "effect/ConfigError"
import RepositoryConfig from "./repository-config.service.ts"

const DEFAULT_REMOTE_NAME = "origin"

const FETCH = { DEFAULT_DEPTH: 1, DEFAULT_DEEPEN_BY: 512, DEFAULT_MAX_DEPTH: 1024 }

const RepositoryConfigLive: Layer<RepositoryConfig, ConfigError> = layerEffect(
	RepositoryConfig,
	effectGen(function* () {
		const defaultRemote = yield* configNested(
			configString("NAME").pipe(configWithDefault(DEFAULT_REMOTE_NAME)),
			"DEFAULT_REMOTE"
		).pipe(
			configMap((name) => {
				return { name }
			})
		)
		const gitDirectory = yield* configString("GIT_DIRECTORY")

		const fetch = yield* configNested(
			configAll([
				configNumber("DEFAULT_DEPTH").pipe(configWithDefault(FETCH.DEFAULT_DEPTH)),
				configNumber("DEFAULT_DEEPEN_BY").pipe(configWithDefault(FETCH.DEFAULT_DEEPEN_BY)),
				configNumber("DEFAULT_MAX_DEPTH").pipe(configWithDefault(FETCH.DEFAULT_MAX_DEPTH)),
			]),
			"FETCH"
		).pipe(
			configMap(([defaultDepth, defaultDeepenBy, maxDepth]) => {
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
