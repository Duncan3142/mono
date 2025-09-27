/**
 * An error indicating that an impossible code path has been reached.
 */
class ExhaustiveError extends Error {
	readonly #value: unknown
	/**
	 * Creates a new ExhaustiveError.
	 * @param value - The unexpected value.
	 */
	private constructor(value: unknown) {
		super(`Encountered unexpected value: ${String(value)}`)
		this.#value = value
	}

	/**
	 * Gets the unexpected value.
	 * @returns The unexpected value.
	 */
	public get value(): unknown {
		return this.#value
	}

	/**
	 * Throws a ExhaustiveError for the given impossible value.
	 * @param value - The impossible value.
	 */
	public static never(value: never): never {
		throw new ExhaustiveError(value)
	}

	/**
	 * Throws a ExhaustiveError for the given value.
	 * @param value - The value.
	 */
	public static throw(value: unknown): never {
		throw new ExhaustiveError(value)
	}
}

export { ExhaustiveError }
