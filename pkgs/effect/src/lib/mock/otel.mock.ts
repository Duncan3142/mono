import { SimpleLogRecordProcessor, type LogRecordExporter } from "@opentelemetry/sdk-logs"
import { type Resource, NodeSdk } from "@effect/opentelemetry"
import {
	AggregationTemporality,
	InMemoryMetricExporter,
	PeriodicExportingMetricReader,
} from "@opentelemetry/sdk-metrics"
import {
	SimpleSpanProcessor,
	type ReadableSpan,
	type SpanExporter,
} from "@opentelemetry/sdk-trace-base"
import type { Duration, Layer } from "effect"
import type { ExportResult } from "@opentelemetry/core"

interface Props {
	readonly serviceName: string
	readonly shutdownTimeout?: Duration.DurationInput
	readonly exportIntervalMillis?: number
}

interface Result {
	readonly layer: Layer.Layer<Resource.Resource>
	readonly metrics: InMemoryMetricExporter
	readonly spans: MockSpanExporter
	readonly logs: MockLogRecordExporter
}

class MockSpanExporter implements SpanExporter {
	readonly #spans: Array<ReadableSpan> = []
	public get spans(): Array<ReadableSpan> {
		return this.#spans
	}
	public export(
		// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types -- Otel type
		spans: Array<ReadableSpan>,
		// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types -- Otel type
		resultCallback: (result: ExportResult) => void
	): void {
		this.#spans.push(...spans)
		resultCallback({ code: 0 })
	}
	public shutdown(): Promise<void> {
		return Promise.resolve()
	}
}

class MockLogRecordExporter implements LogRecordExporter {
	readonly #logs: Array<unknown> = []
	public get logs(): Array<unknown> {
		return this.#logs
	}
	public export(
		// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types -- Otel type
		logs: Array<unknown>,
		// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types -- Otel type
		resultCallback: (result: ExportResult) => void
	): void {
		this.#logs.push(...logs)
		resultCallback({ code: 0 })
	}
	public shutdown(): Promise<void> {
		return Promise.resolve()
	}
}

/**
 * Creates a mock OpenTelemetry SDK layer.
 * @param props - Properties for the mock OpenTelemetry SDK layer.
 * @param props.serviceName - The name of the service.
 * @param props.shutdownTimeout - Optional shutdown timeout duration.
 * @param props.exportIntervalMillis - Optional export interval in milliseconds.
 * @returns A Layer that provides a mock OpenTelemetry SDK with in-memory exporters.
 */
const make = ({
	serviceName,
	shutdownTimeout = "1 second",
	exportIntervalMillis = 100,
}: Props): Result => {
	const metrics = new InMemoryMetricExporter(AggregationTemporality.CUMULATIVE)
	const spans = new MockSpanExporter()
	const logs = new MockLogRecordExporter()

	const layer = NodeSdk.layer(() => {
		return {
			resource: { serviceName },
			metricReader: new PeriodicExportingMetricReader({
				exporter: metrics,
				exportIntervalMillis,
			}),
			spanProcessor: new SimpleSpanProcessor(spans),
			logRecordProcessor: new SimpleLogRecordProcessor(logs),
			shutdownTimeout,
		}
	})
	return { layer, metrics, spans, logs }
}

export { make }
