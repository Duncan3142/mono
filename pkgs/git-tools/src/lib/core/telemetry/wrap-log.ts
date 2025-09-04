import { Effect } from "effect"

/**
 * Wraps a function call with logging
 * @param message - The log message
 * @param func - The function to wrap
 * @returns A wrapped function that logs the message and calls the original function
 */
const wrap =
	<Args extends ReadonlyArray<unknown>, A, E extends Error, R>(
		message: string,
		func: (...args: Args) => Effect.Effect<A, E, R>
	) =>
	(...args: Args): Effect.Effect<A, E, R> =>
		Effect.gen(function* () {
			yield* Effect.logInfo(message, { args })
			return yield* func(...args).pipe(Effect.tapError(Effect.logError))
		})

export { wrap }
