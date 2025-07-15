import { env } from "node:process"
import { type } from "arktype"
import { type LintLevelKey, lintLevels, standard } from "#context/lint-level"

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
	const parseResult = EnvironmentVariablesSchema(env)
	if (parseResult instanceof type.errors) {
		throw new TypeError(parseResult.summary)
	}
	return parseResult
}

export type { EnvironmentVariables }
export default environmentVariables
