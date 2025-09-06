import { NodeSdk } from "@effect/opentelemetry"
import { SimpleSpanProcessor } from "@opentelemetry/sdk-trace-base"
import { PeriodicExportingMetricReader } from "@opentelemetry/sdk-metrics"
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-grpc"
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-grpc"
import { Layer } from "effect"
import { otelConfig, SERVICE_NAME } from "./config.ts"
import { LogLayer } from "./logger.ts"

const NodeSdkLive = NodeSdk.layer(() => {
	return {
		resource: { serviceName: SERVICE_NAME },
		metricReader: new PeriodicExportingMetricReader({
			exporter: new OTLPMetricExporter(otelConfig),
			exportIntervalMillis: 500,
		}),
		spanProcessor: new SimpleSpanProcessor(new OTLPTraceExporter(otelConfig)),
		shutdownTimeout: "2 seconds",
	}
})

const TelemetryLive = Layer.provideMerge(LogLayer, NodeSdkLive)

export { TelemetryLive }
