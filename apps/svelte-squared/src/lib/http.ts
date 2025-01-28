const STATUS_302 = 302
const STATUS_400 = 400
const STATUS_401 = 401
const STATUS_500 = 500

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

export { STATUS_302, STATUS_400, STATUS_401, STATUS_500, HTTPError }
