import {
	Context,
	Effect,
	FiberId,
	FiberRef,
	FiberRefs,
	Inspectable,
	Logger,
	Array,
	Tracer,
	Option,
} from "effect"
import { Logger as OtelLogger } from "@effect/opentelemetry"
import type { SdkLogRecord } from "@opentelemetry/sdk-logs"

import { Radix } from "#duncan3142/effect/lib/const"

const unknownToAnyValue = (value: unknown): SdkLogRecord["body"] => {
	if (
		typeof value === "string" ||
		typeof value === "number" ||
		typeof value === "boolean" ||
		typeof value === "undefined" ||
		value === null
	) {
		return value
	} else if (typeof value === "bigint") {
		return Number(value)
	} else if (value instanceof Date) {
		return value.toISOString()
	} else if (value instanceof Uint8Array) {
		return value
	} else if (Array.isArray(value)) {
		return value.map(unknownToAnyValue)
	} else if (typeof value === "object") {
		return Object.fromEntries(
			Object.entries(value).map(([key, val]) => [key, unknownToAnyValue(val)])
		)
	}
	return Inspectable.toStringUnknown(value)
}

const BaseLogLayer = Effect.gen(function* () {
	const provider = yield* OtelLogger.OtelLoggerProvider
	const clock = yield* Effect.clock
	const otelLogger = provider.getLogger("@duncan3142/git-tools")

	return Logger.make(({ annotations, context, date, fiberId, logLevel, message, spans }) => {
		const now = date.getTime()

		const attributes: SdkLogRecord["attributes"] = {
			fiberId: FiberId.threadName(fiberId),
		}

		const maybeSpan = Context.getOption(
			FiberRefs.getOrDefault(context, FiberRef.currentContext),
			Tracer.ParentSpan
		)

		if (Option.isSome(maybeSpan)) {
			attributes["spanId"] = maybeSpan.value.spanId
			attributes["traceId"] = maybeSpan.value.traceId
		}

		for (const [key, value] of annotations) {
			attributes[key] = unknownToAnyValue(value)
		}
		for (const span of spans) {
			const spanDuration = now - span.startTime
			attributes[`logSpan.${span.label}`] = `${spanDuration.toString(Radix.BASE_10)}ms`
		}

		const [messageHead, ...messageTail] = Array.ensure(unknownToAnyValue(message))

		otelLogger.emit({
			body: messageTail.length > 0 ? [messageHead, ...messageTail] : messageHead,
			severityText: logLevel.label,
			severityNumber: logLevel.ordinal,
			timestamp: date,
			observedTimestamp: clock.unsafeCurrentTimeMillis(),
			attributes,
		})
	})
}).pipe(Logger.addEffect)

export { BaseLogLayer }
