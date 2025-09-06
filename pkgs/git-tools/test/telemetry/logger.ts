import {
	Context,
	Effect,
	FiberId,
	FiberRef,
	FiberRefs,
	Inspectable,
	Layer,
	Logger,
	Array,
	Tracer,
} from "effect"
import { Logger as OtelLogger } from "@effect/opentelemetry"
import { SimpleLogRecordProcessor, type SdkLogRecord } from "@opentelemetry/sdk-logs"
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-grpc"
import { otelConfig } from "./config.ts"
import { Number as NumberConst } from "#duncan3142/git-tools/core/const"

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

		if (maybeSpan._tag === "Some") {
			attributes["spanId"] = maybeSpan.value.spanId
			attributes["traceId"] = maybeSpan.value.traceId
		}

		for (const [key, value] of annotations) {
			attributes[key] = unknownToAnyValue(value)
		}
		for (const span of spans) {
			const spanDuration = now - span.startTime
			attributes[`logSpan.${span.label}`] =
				`${spanDuration.toString(NumberConst.BASE_10_RADIX)}ms`
		}

		otelLogger.emit({
			body: unknownToAnyValue(message),
			severityText: logLevel.label,
			severityNumber: logLevel.ordinal,
			timestamp: date,
			observedTimestamp: clock.unsafeCurrentTimeMillis(),
			attributes,
		})
	})
}).pipe(Logger.addEffect)

const LogLayer = Layer.provide(
	BaseLogLayer,
	OtelLogger.layerLoggerProvider(
		new SimpleLogRecordProcessor(new OTLPLogExporter(otelConfig)),
		{ shutdownTimeout: "2 seconds" }
	)
)

export { LogLayer }
