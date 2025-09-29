import { describe, it, expect } from "@effect/vitest"
import { Duration, Effect, Exit, Logger, LogLevel, pipe } from "effect"
import { MockConsole, MockConfigProvider } from "#duncan3142/effect/lib/mock"
import { Otel } from "#duncan3142/effect/lib/otel"
import { CoreConfig } from "#duncan3142/effect/lib/config"
import { DurationTimer, LogEffect } from "#duncan3142/effect/lib/telemetry"

const mockConsole = MockConsole.make()

describe("Telemetry", () => {
	it.live("should emit telemetry", () =>
		Effect.gen(function* () {
			const duration = DurationTimer.make({
				name: "test_timer",
				boundaries: [0, 5, 10, 15, 20, 25, 30],
				description: "A test timer",
				tags: { timer_core_key: "timer_core_value" },
			})

			const program = () =>
				pipe(
					Effect.sleep(Duration.millis(15)),
					duration({ tags: { timer_use_key: "timer_use_value" } })
				)

			const wrapped = pipe(
				program,
				LogEffect.wrap({ message: "Test log", annotations: { log_key: "log_value" } }),
				(prog) => prog(),
				Effect.andThen(Effect.sleep("1 seconds")),
				Effect.withSpan("test_span", {
					root: true,
					kind: "internal",
					attributes: { span_key: "span_value" },
				})
			)

			const result = yield* pipe(
				wrapped,
				Logger.withMinimumLogLevel(LogLevel.Debug),
				Effect.withConsole(mockConsole),
				Effect.provide(Otel.Live),
				Effect.provide(CoreConfig.Default),
				MockConfigProvider.make([["GIT_TOOLS.SERVICE.NAME", "telemetry-test"]]),
				Effect.exit
			)

			expect(result).toEqual(Exit.void)
		})
	)
})
