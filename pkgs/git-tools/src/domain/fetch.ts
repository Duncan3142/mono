/**
 * Fetch refs found
 */
type WasFound = boolean
const Found = true
const NotFound = false

/**
 * Fetch Not Found Error
 */
class FetchNotFoundError extends Error {
	public override readonly name = "FetchNotFoundError" as const
}

export type { WasFound }
export { FetchNotFoundError, Found, NotFound }
