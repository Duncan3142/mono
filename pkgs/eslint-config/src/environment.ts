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
	const res = EnvironmentVariablesSchema(env)
	if (res instanceof type.errors) {
		throw new TypeError(res.summary)
	}
	return res
}

export type { EnvironmentVariables }
export default environmentVariables
