import { type Layer, effect as layerEffect } from "effect/Layer"
import { string as configString, withDefault as configWithDefault } from "effect/Config"
import { gen as effectGen } from "effect/Effect"
import type { ConfigError } from "effect/ConfigError"
import RepositoryConfig from "./repository-config.service.ts"

const DEFAULT_REMOTE_NAME = "origin"

const RepositoryConfigLive: Layer<RepositoryConfig, ConfigError> = layerEffect(
	RepositoryConfig,
	effectGen(function* () {
		const defaultRemoteName = yield* configString("DEFAULT_REMOTE_NAME").pipe(
			configWithDefault(DEFAULT_REMOTE_NAME)
		)
		const gitDirectory = yield* configString("GIT_DIRECTORY")

		return {
			directory: gitDirectory,
			defaultRemote: { name: defaultRemoteName },
		}
	})
)

export default RepositoryConfigLive
