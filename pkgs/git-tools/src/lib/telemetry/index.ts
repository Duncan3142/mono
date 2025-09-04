import { NodeSdk } from "@effect/opentelemetry"
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-base"
import { BatchLogRecordProcessor } from "@opentelemetry/sdk-logs"
import { PeriodicExportingMetricReader } from "@opentelemetry/sdk-metrics"
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-grpc"
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-grpc"
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-grpc"

const TelemetryLive = NodeSdk.layer(
	() =>
		({
			resource: { serviceName: "example" },
			spanProcessor: new BatchSpanProcessor(new OTLPTraceExporter()),
			logRecordProcessor: new BatchLogRecordProcessor(new OTLPLogExporter()),
			metricReader: new PeriodicExportingMetricReader({ exporter: new OTLPMetricExporter() }),
			shutdownTimeout: "2 seconds",
		}) satisfies NodeSdk.Configuration
)

export { TelemetryLive }
