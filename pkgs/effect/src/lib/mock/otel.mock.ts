import { InMemoryLogRecordExporter, SimpleLogRecordProcessor } from "@opentelemetry/sdk-logs"
import { type Resource, NodeSdk } from "@effect/opentelemetry"
import {
	AggregationTemporality,
	InMemoryMetricExporter,
	PeriodicExportingMetricReader,
} from "@opentelemetry/sdk-metrics"
import { InMemorySpanExporter, SimpleSpanProcessor } from "@opentelemetry/sdk-trace-base"
import type { Duration, Layer } from "effect"

interface Props {
	readonly serviceName: string
	readonly shutdownTimeout?: Duration.DurationInput
	readonly exportIntervalMillis?: number
}

interface Result {
	readonly layer: Layer.Layer<Resource.Resource>
	readonly metrics: InMemoryMetricExporter
	readonly spans: InMemorySpanExporter
	readonly logs: InMemoryLogRecordExporter
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
	exportIntervalMillis = 1000,
}: Props): Result => {
	const metrics = new InMemoryMetricExporter(AggregationTemporality.CUMULATIVE)
	const spans = new InMemorySpanExporter()
	const logs = new InMemoryLogRecordExporter()
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
