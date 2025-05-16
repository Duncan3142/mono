import { keys } from "remeda"

const all = "all"
const standard = "standard"

const LINT_LEVEL_ALL = 1
const LINT_LEVEL_STANDARD = 0

interface LINT_LEVEL {
	[all]: typeof LINT_LEVEL_ALL
	[standard]: typeof LINT_LEVEL_STANDARD
}

const LINT_LEVEL: LINT_LEVEL = {
	[all]: LINT_LEVEL_ALL,
	[standard]: LINT_LEVEL_STANDARD,
} as const

/**
 * Lint level key
 */
type LintLevelKey = keyof typeof LINT_LEVEL

/**
 * Lint level
 */
type LintLevel = (typeof LINT_LEVEL)[LintLevelKey]

const lintLevels: ReadonlyArray<LintLevelKey> = keys(LINT_LEVEL)

const ERR = "error"
const OFF = "off"

type RuleState = typeof ERR | typeof OFF

interface Guards {
	readonly all: RuleState
	readonly standard: RuleState
}

/**
 * Lint level guards
 * @param level - Lint level
 * @returns Guards
 */
const when = (level: LintLevel): Guards => {
	return {
		get all() {
			return level >= LINT_LEVEL[all] ? ERR : OFF
		},
		get standard() {
			return level >= LINT_LEVEL[standard] ? ERR : OFF
		},
	}
}

export type { LintLevel, LintLevelKey, Guards }
export { LINT_LEVEL, lintLevels, standard, when }
