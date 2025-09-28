import { describe, it, expect } from "@effect/vitest"
import { Duration, Effect, Fiber, Logger, LogLevel, pipe, TestClock } from "effect"
import { MockConsole, MockOtel } from "#duncan3142/effect/lib/mock"
import { DurationTimer, LogEffect } from "#duncan3142/effect/lib/telemetry"

const mockConsole = MockConsole.make()

describe("Telemetry", () => {
	it.live("should emit telemetry", () =>
		Effect.gen(function* () {
			const otel = MockOtel.make({ serviceName: "test_service" })

			const duration = DurationTimer.make({
				name: "test_timer",
				boundaries: [0, 100, 200, 300, 400],
				description: "A test timer",
				tags: { base: "base_tag" },
			})

			const program = () =>
				pipe(
					Effect.sleep(Duration.millis(150)),
					duration({ tags: { operation: "test_operation" } }),
					Effect.withSpan("test_span", { root: true })
				)

			const wrapped = pipe(
				program,
				LogEffect.wrap({ message: "Test log", annotations: { key: "value" } })
			)

			const fiber = yield* Effect.fork(
				pipe(
					wrapped(),
					Logger.withMinimumLogLevel(LogLevel.Debug),
					Effect.withConsole(mockConsole),
					Effect.provide(otel.layer)
				)
			)
			// yield* TestClock.adjust("1 seconds")
			yield* Fiber.join(fiber)

			const { metrics, spans, logs } = otel
			yield* Effect.promise(() => Promise.all([metrics.forceFlush(), spans.forceFlush()]))

			expect(metrics.getMetrics()).toHaveLength(1)
			expect(spans.getFinishedSpans()).toHaveLength(1)
			expect(logs.getFinishedLogRecords()).toHaveLength(1)
		})
	)
})
