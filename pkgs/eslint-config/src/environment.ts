import { env } from "node:process"
import { type } from "arktype"
import { type LintLevelKey, lintLevels, standard } from "#context/lint-level"

// eslint-disable-next-line functional/prefer-immutable-types -- ArkType Schema
const EnvironmentVariablesSchema = type({
	LINT_LEVEL: type("string.lower")
		.pipe(type.enumerated(...lintLevels))
		.default(standard),
})

interface EnvironmentVariables {
	readonly LINT_LEVEL: LintLevelKey
}

/**
 * Extract config from environment variables
 * @returns Environment config
 */
const environmentVariables = (): EnvironmentVariables => {
	// eslint-disable-next-line functional/prefer-immutable-types -- ArkType result
	const parseResult = EnvironmentVariablesSchema(env)
	// eslint-disable-next-line functional/no-conditional-statements -- Allow for throw
	if (parseResult instanceof type.errors) {
		// eslint-disable-next-line functional/no-throw-statements -- Allow throw for invalid environment variables
		throw new TypeError(parseResult.summary)
	}
	return parseResult
}

export type { EnvironmentVariables }
export default environmentVariables
