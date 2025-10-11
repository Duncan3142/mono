import { Effect, LogLevel } from "effect"
import type { LogAnnotations } from "./log-annotations.ts"
import type { SpanAttributes } from "./span-attributes.ts"

/**
 * Wraps a function call with logging
 * @param func - The function to wrap
 * @returns A wrapped function that logs the message and calls the original function
 */

interface LogSpanProps {
	readonly log: {
		readonly message: string
		readonly level?: LogLevel.Literal
		readonly annotations?: LogAnnotations
	}
	readonly span: {
		readonly name: string
		readonly attributes?: SpanAttributes
		readonly root?: boolean
	}
}

/**
 * Wraps a function call with logging
 * @param props - The properties for the log span
 * @param props.log - The log properties
 * @param props.log.message - The message to log when the function is called
 * @param props.log.level - The log level for the message (default: "Debug")
 * @param props.log.annotations - The annotations associated with the function being wrapped
 * @param props.span - The span properties
 * @param props.span.name - The span name
 * @param props.span.attributes - The attributes associated with the span
 * @param props.span.root - Whether the span is a root span (default: false)
 * @returns A wrapped function that logs the message and calls the original function
 */
const wrap =
	({
		log: { message, annotations = {}, level = "Debug" },
		span: { name: spanName, root = false, attributes = {} },
	}: LogSpanProps) =>
	<Args extends ReadonlyArray<unknown>, A, E extends Error, R>(
		func: (...args: Args) => Effect.Effect<A, E, R>
	) =>
	(...args: Args): Effect.Effect<A, E, R> =>
		Effect.gen(function* () {
			yield* Effect.logWithLevel(LogLevel.fromLiteral(level), { message })
			return yield* func(...args).pipe(Effect.tapError(Effect.logError))
		}).pipe(Effect.annotateLogs(annotations), Effect.withSpan(spanName, { attributes, root }))

export { wrap }
export type { LogSpanProps }
