import { Effect } from "effect"
import type { LogAnnotations } from "./log-annotations.ts"

/**
 * Wraps a function call with logging
 * @param func - The function to wrap
 * @returns A wrapped function that logs the message and calls the original function
 */

interface WrapProps {
	readonly message: string
	readonly annotations?: LogAnnotations
}

/**
 * Wraps a function call with logging
 * @param props - The properties for the wrap
 * @param props.message - The message to log when the function is called
 * @param props.annotations - The annotations associated with the function being wrapped
 * @returns A wrapped function that logs the message and calls the original function
 */
const wrap =
	({ message, annotations = {} }: WrapProps) =>
	<Args extends ReadonlyArray<unknown>, A, E extends Error, R>(
		func: (...args: Args) => Effect.Effect<A, E, R>
	) =>
	(...args: Args): Effect.Effect<A, E, R> =>
		Effect.gen(function* () {
			yield* Effect.logDebug({ message })
			return yield* func(...args).pipe(Effect.tapError(Effect.logError))
		}).pipe(Effect.annotateLogs(annotations))

export { wrap }
export type { WrapProps }
