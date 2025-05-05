import { entries as ObjectEntries } from "remeda"

const LINT_LEVEL = {
	all: 1,
	standard: 0,
} as const

/**
 * Lint level key
 */
type LintLevelKey = keyof typeof LINT_LEVEL

/**
 * Lint level
 */
type LintLevel = (typeof LINT_LEVEL)[LintLevelKey]

const lintLevelMap: ReadonlyMap<string, LintLevel> = new Map(ObjectEntries(LINT_LEVEL))

export type { LintLevel, LintLevelKey }
export { LINT_LEVEL, lintLevelMap }
