type Found = boolean

/**
 * Fetch Error
 */
class FetchError extends Error {
	public override name = "FetchError" as const
}

/**
 * Fetch Not Found Error
 */
class FetchNotFoundError extends Error {
	public override name = "FetchNotFoundError" as const
}

export type { Found }
export { FetchError, FetchNotFoundError }
