/* c8 ignore start */
export const neverGuard = (...values: Array<never>): never => {
	throw new Error(`Unexpected values: ${String(values)}`)
}
/* c8 ignore stop */
