class NeverError extends Error {
	public override name = "NEVER_ERROR"
}

/**
 * Never error
 * @param message - Error message
 */
const never = (message = "Unexpected default case"): never => {
	throw new NeverError(message)
}

export default never
