import { env } from "node:process"
import { type } from "arktype"
import { type LintLevelKey, lintLevels, standard } from "./lint-level.ts"

const EnvVarsSchema = type({
	LINT_LEVEL: type("string.lower")
		.pipe(type.enumerated(...lintLevels))
		.default(standard),
})

interface EnvVars {
	readonly LINT_LEVEL: LintLevelKey
}

/**
 * Extract config from environment variables
 * @returns Environment config
 */
const parse = (): EnvVars => {
	const parseResult = EnvVarsSchema(env)
	if (parseResult instanceof type.errors) {
		throw new TypeError(parseResult.summary)
	}
	return parseResult
}

export type { EnvVars }
export { parse }
