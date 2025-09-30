import { describe, it, expect } from "@effect/vitest"
import { ConfigError, Duration, Effect, Exit, pipe } from "effect"
import { CoreConfig } from "#duncan3142/effect/lib/config"
import { MockConsole, MockConfigProvider } from "#duncan3142/effect/lib/mock"

const mockConsole = MockConsole.make()

describe("CoreConfig", () => {
	it.effect("should provide default config", () =>
		Effect.gen(function* () {
			const config = yield* pipe(
				CoreConfig.CoreConfig,
				Effect.provide(CoreConfig.Default),
				Effect.withConsole(mockConsole),
				MockConfigProvider.make([["EFFECT.SERVICE.NAME", "test_service"]])
			)

			expect(config).toMatchObject({ otel: {}, service: { name: "test_service" } })
		})
	)
	it.effect("should provide specified config", () =>
		Effect.gen(function* () {
			const config = yield* pipe(
				CoreConfig.CoreConfig,
				Effect.provide(CoreConfig.Default),
				Effect.withConsole(mockConsole),
				MockConfigProvider.make([
					["EFFECT.SERVICE.NAME", "test_service"],
					["EFFECT.SERVICE.VERSION", "1.0.0"],
					["EFFECT.OTEL.URL", "http://example.com"],
					["EFFECT.OTEL.DELAY", "5000"],
					["EFFECT.OTEL.SHUTDOWN_TIMEOUT", "1 second"],
					["EFFECT.OTEL.HEADERS.ALPHA", "beta"],
					["EFFECT.OTEL.HEADERS.GAMMA", "delta"],
				])
			)

			expect(config).toMatchObject({
				otel: {
					url: new URL("http://example.com"),
					exportDelay: 5000,
					shutdownTimeout: Duration.seconds(1),
					headers: {
						ALPHA: "beta",
						GAMMA: "delta",
					},
				},
				service: { name: "test_service", version: "1.0.0" },
			})
		})
	)
	it.effect("should fail invalid config", () =>
		Effect.gen(function* () {
			const result = yield* Effect.exit(
				pipe(
					CoreConfig.CoreConfig,
					Effect.provide(CoreConfig.Default),
					Effect.withConsole(mockConsole),
					MockConfigProvider.make([
						["EFFECT.OTEL.URL", "bad"],
						["EFFECT.OTEL.DELAY", "wrong"],
						["EFFECT.OTEL.SHUTDOWN_TIMEOUT", "invalid"],
					])
				)
			)

			expect(result).toStrictEqual(
				Exit.fail(
					ConfigError.And(
						ConfigError.MissingData(
							["EFFECT", "SERVICE", "NAME"],
							"Expected EFFECT.SERVICE.NAME to exist in the provided map"
						),
						ConfigError.And(
							ConfigError.And(
								ConfigError.InvalidData(
									["EFFECT", "OTEL", "URL"],
									"Expected an URL value but received bad"
								),
								ConfigError.InvalidData(
									["EFFECT", "OTEL", "DELAY"],
									"Expected a number value but received wrong"
								)
							),
							ConfigError.InvalidData(
								["EFFECT", "OTEL", "SHUTDOWN_TIMEOUT"],
								"Expected a duration but received invalid"
							)
						)
					)
				)
			)
		})
	)
})
