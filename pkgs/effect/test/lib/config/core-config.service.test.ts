import { describe, it, expect } from "@effect/vitest"
import { ConfigError, Duration, Effect, Exit, pipe } from "effect"
import { CoreConfig } from "#duncan3142/effect/lib/config"
import { MockConsole, MockConfigProvider } from "#duncan3142/effect/lib/mock"

const mockConsole = MockConsole.make()

describe("CoreConfig", () => {
	it.effect("should provide default config", () =>
		Effect.gen(function* () {
			const config = yield* CoreConfig.CoreConfig

			expect(config).toMatchObject({ otel: {}, service: { name: "test_service" } })
		}).pipe(
			Effect.provide(CoreConfig.Default),
			Effect.withConsole(mockConsole),
			Effect.withConfigProvider(
				MockConfigProvider.make([["GIT_TOOLS.SERVICE.NAME", "test_service"]])
			)
		)
	)
	it.effect("should provide specified config", () =>
		Effect.gen(function* () {
			const config = yield* CoreConfig.CoreConfig

			expect(config).toMatchObject({
				otel: {
					url: new URL("http://example.com"),
					exportDelay: 5000,
					shutdownTimeout: Duration.seconds(1),
				},
				service: { name: "test_service", version: "1.0.0" },
			})
		}).pipe(
			Effect.provide(CoreConfig.Default),
			Effect.withConsole(mockConsole),
			Effect.withConfigProvider(
				MockConfigProvider.make([
					["GIT_TOOLS.SERVICE.NAME", "test_service"],
					["GIT_TOOLS.SERVICE.VERSION", "1.0.0"],
					["GIT_TOOLS.OTEL.URL", "http://example.com"],
					["GIT_TOOLS.OTEL.DELAY", "5000"],
					["GIT_TOOLS.OTEL.SHUTDOWN_TIMEOUT", "1 second"],
				])
			)
		)
	)
	it.effect("should fail invalid config", () =>
		Effect.gen(function* () {
			const result = yield* Effect.exit(
				pipe(
					CoreConfig.CoreConfig,
					Effect.provide(CoreConfig.Default),
					Effect.withConsole(mockConsole),
					Effect.withConfigProvider(
						MockConfigProvider.make([
							["GIT_TOOLS.OTEL.URL", "bad"],
							["GIT_TOOLS.OTEL.DELAY", "wrong"],
							["GIT_TOOLS.OTEL.SHUTDOWN_TIMEOUT", "invalid"],
						])
					)
				)
			)

			expect(result).toEqual(
				Exit.fail(
					ConfigError.And(
						ConfigError.MissingData(
							["GIT_TOOLS", "SERVICE", "NAME"],
							"Expected GIT_TOOLS.SERVICE.NAME to exist in the provided map"
						),
						ConfigError.And(
							ConfigError.And(
								ConfigError.InvalidData(
									["GIT_TOOLS", "OTEL", "URL"],
									"Expected an URL value but received bad"
								),
								ConfigError.InvalidData(
									["GIT_TOOLS", "OTEL", "DELAY"],
									"Expected a number value but received wrong"
								)
							),
							ConfigError.InvalidData(
								["GIT_TOOLS", "OTEL", "SHUTDOWN_TIMEOUT"],
								"Expected a duration but received invalid"
							)
						)
					)
				)
			)
		})
	)
})
