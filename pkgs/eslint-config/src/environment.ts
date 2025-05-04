import { env } from "node:process"
import { LINT_LEVEL, lintLevelMap, type LintLevel } from "#lib/core"

interface EnvironmentVariables {
	readonly level: LintLevel
}

const environmentLintLevel = env["LINT_LEVEL"]?.toLowerCase()

const pickLintLevel = (level: string): LintLevel => {
	const result = lintLevelMap.get(level)
	// eslint-disable-next-line functional/no-conditional-statements -- Throw on invalid env vars
	if (typeof result === "undefined") {
		// eslint-disable-next-line functional/no-throw-statements -- Throw on invalid env vars
		throw new TypeError(
			`Invalid LINT_LEVEL environment variable. Expected one of ${[...lintLevelMap.keys()].join(
				", "
			)}, but received "${level}".`
		)
	}
	return result
}

const level =
	typeof environmentLintLevel === "undefined"
		? LINT_LEVEL.standard
		: pickLintLevel(environmentLintLevel)

/**
 * Extract config from environment variables
 * @returns Environment config
 */
const environmentVariables = (): EnvironmentVariables => {
	return {
		level,
	}
}

export default environmentVariables
