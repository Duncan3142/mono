/**
 * Error that should never be thrown due to Typescript type system
 * This error is used to indicate unreachable code paths.
 */
class NeverError extends Error {
	public override name = "NeverError" as const
}

/**
 * Function that should never be called
 * @throws NeverError
 *
 * This function is used to protect unreachable code paths.
 * It throws a NeverError to signal that the code should never be executed.
 */
const never = (): never => {
	throw new NeverError("Executed unexpected code")
}

export default never
