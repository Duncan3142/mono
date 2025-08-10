import * as EnvVars from "./environment.ts"
import { type Guards, LINT_LEVEL as LINT_LEVEL_ENUM, when } from "./lint-level.ts"

interface Context {
	readonly when: Guards
}

/**
 * Create context
 * @returns Context
 */
const make = (): Context => {
	const { LINT_LEVEL } = EnvVars.parse()

	return {
		when: when(LINT_LEVEL_ENUM[LINT_LEVEL]),
	}
}

export { make }
