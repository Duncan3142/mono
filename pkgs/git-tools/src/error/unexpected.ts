/**
 * Unexpected error
 */
class UnexpectedError extends Error {
	public override readonly name = "UnexpectedError" as const
}

export default UnexpectedError
