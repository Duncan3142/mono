import { type Duration, Effect, Layer } from "effect"
import { BatchLogRecordProcessor } from "@opentelemetry/sdk-logs"
import { NodeSdk, Logger as OtelLogger } from "@effect/opentelemetry"
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-grpc"
import { PeriodicExportingMetricReader } from "@opentelemetry/sdk-metrics"
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-grpc"
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-base"
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-grpc"
import { BaseLogLayer } from "./logger.layer.ts"
import { CoreConfig } from "#duncan3142/effect/lib/config"

const OTEL_URL = "http://otel-lgtm:4317"
const OTEL_DELAY = 500
const OTEL_SHUTDOWN_TIMEOUT: Duration.DurationInput = "2 seconds"

const Live = Layer.unwrapEffect(
	Effect.gen(function* () {
		const {
			service: { name: serviceName, version: serviceVersion },
			otel: {
				url = OTEL_URL,
				exportDelay = OTEL_DELAY,
				shutdownTimeout = OTEL_SHUTDOWN_TIMEOUT,
			},
		} = yield* CoreConfig.CoreConfig

		const versionKV = typeof serviceVersion === "undefined" ? {} : { serviceVersion }

		const config = { url }

		const LogLayer = Layer.provide(
			BaseLogLayer,
			OtelLogger.layerLoggerProvider(
				new BatchLogRecordProcessor(new OTLPLogExporter(config), {
					scheduledDelayMillis: exportDelay,
				}),
				{
					shutdownTimeout,
				}
			)
		)
		const NodeSdkLive = NodeSdk.layer(() => {
			return {
				resource: { serviceName, ...versionKV },
				metricReader: new PeriodicExportingMetricReader({
					exporter: new OTLPMetricExporter(config),
					exportIntervalMillis: exportDelay,
				}),
				spanProcessor: new BatchSpanProcessor(new OTLPTraceExporter(config), {
					scheduledDelayMillis: exportDelay,
				}),
				shutdownTimeout,
			}
		})

		return Layer.provideMerge(LogLayer, NodeSdkLive)
	})
)

export { Live }
