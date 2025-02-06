/**
 * HTTP Error
 */
class HTTPError extends Error {
	public readonly code: number
	/**
	 * HTTP Error constructor
	 * @param code - HTTP status code
	 * @param message - Error message
	 * @param cause - Cause of the error
	 */
	public constructor(code: number, message: string, cause?: unknown) {
		super(message)
		this.code = code
		this.cause = cause
	}
}

export default HTTPError
