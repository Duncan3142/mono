import environmentVariables from "./environment.ts"
import { type Guards, LINT_LEVEL as LINT_LEVEL_ENUM, when } from "#context/lint-level"

interface Context {
	readonly when: Guards
}

/**
 * Create context
 * @returns Context
 */
const context = (): Context => {
	const { LINT_LEVEL } = environmentVariables()

	return {
		when: when(LINT_LEVEL_ENUM[LINT_LEVEL]),
	}
}

export default context
