import { NodeSdk } from "@effect/opentelemetry"
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-base"
import { BatchLogRecordProcessor } from "@opentelemetry/sdk-logs"
import { PeriodicExportingMetricReader } from "@opentelemetry/sdk-metrics"
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-grpc"
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-grpc"
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-grpc"
import { logs, SeverityNumber } from "@opentelemetry/api-logs"
import { Layer, Logger, LogLevel } from "effect"

const OTEL_URL = "http://otel-collector:4317"
const SERVICE_NAME = "git-tools"
const otelConfig = { url: OTEL_URL }

const OtelSdkLive = NodeSdk.layer(
	() =>
		({
			resource: { serviceName: SERVICE_NAME },
			spanProcessor: new BatchSpanProcessor(new OTLPTraceExporter(otelConfig)),
			logRecordProcessor: new BatchLogRecordProcessor(new OTLPLogExporter(otelConfig)),
			metricReader: new PeriodicExportingMetricReader({
				exporter: new OTLPMetricExporter(otelConfig),
				exportIntervalMillis: 1000,
			}),
			shutdownTimeout: "2 seconds",
		}) satisfies NodeSdk.Configuration
)

const logLevelToOtelSeverity = (level: LogLevel.LogLevel) => {
	switch (level) {
		case LogLevel.Trace:
			return SeverityNumber.TRACE
		case LogLevel.Debug:
			return SeverityNumber.DEBUG
		case LogLevel.Info:
			return SeverityNumber.INFO
		case LogLevel.Warning:
			return SeverityNumber.WARN
		case LogLevel.Error:
			return SeverityNumber.ERROR
		case LogLevel.Fatal:
			return SeverityNumber.FATAL
		default:
			return SeverityNumber.UNSPECIFIED
	}
}

const OtelLogger = Logger.make(({ fiberId, logLevel, message, cause, date }) => {
	// Get the OTel logger from the globally configured provider
	const logger = logs.getLoggerProvider().getLogger(SERVICE_NAME)

	logger.emit({
		severityNumber: logLevelToOtelSeverity(logLevel),
		timestamp: date,
		body: String(message),
		attributes: {
			"log.fiberId": fiberId.toString(),
			"log.cause": cause.toString(),
		},
	})
})

const CombinedLogger = Logger.zip(Logger.defaultLogger, OtelLogger)
const LoggerLive = Logger.replace(Logger.defaultLogger, CombinedLogger)

const TelemetryLive = Layer.merge(OtelSdkLive, LoggerLive)

export { TelemetryLive }
