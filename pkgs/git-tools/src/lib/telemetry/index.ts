import { NodeSdk } from "@effect/opentelemetry"
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-base"
import { BatchLogRecordProcessor } from "@opentelemetry/sdk-logs"
import { PeriodicExportingMetricReader } from "@opentelemetry/sdk-metrics"
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-grpc"
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-grpc"
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-grpc"

const OTEL_URL = "http://otel-collector:4317"
const SERVICE_NAME = "git-tools"
const otelConfig = { url: OTEL_URL }

const TelemetryLive = NodeSdk.layer(
	() =>
		({
			resource: { serviceName: SERVICE_NAME },
			spanProcessor: new BatchSpanProcessor(new OTLPTraceExporter(otelConfig)),
			logRecordProcessor: new BatchLogRecordProcessor(new OTLPLogExporter(otelConfig)),
			metricReader: new PeriodicExportingMetricReader({
				exporter: new OTLPMetricExporter(otelConfig),
			}),
			shutdownTimeout: "2 seconds",
		}) satisfies NodeSdk.Configuration
)

export { TelemetryLive }
