import { type Guards, LINT_LEVEL as LINT_LEVEL_ENUM, when } from "./config/lintLevel.ts"
import environmentVariables from "./environment.ts"

interface Config {
	when: Guards
}

const config = (): Config => {
	const { LINT_LEVEL } = environmentVariables()

	return {
		when: when(LINT_LEVEL_ENUM[LINT_LEVEL]),
	}
}

export default config
