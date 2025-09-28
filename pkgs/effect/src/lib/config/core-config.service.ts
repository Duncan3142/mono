import { type Duration, Config, Effect, Option } from "effect"
import type { EmptyObject } from "#duncan3142/effect/lib/type"

interface CoreConfigData {
	readonly service: { name: string; version?: string }
	readonly otel: {
		readonly url?: URL
		readonly exportDelay?: number
		readonly shutdownTimeout?: Duration.DurationInput
	}
}

const someKV = <Key extends string, Value>(
	key: Key,
	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types -- Effect TS type
	value: Option.Option<Value>
): Record<Key, Value> | EmptyObject =>
	Option.match(value, {
		onSome: (v) => {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- TypeScript generic type inference
			const result = { [key]: v } as Record<Key, Value>
			return result
		},
		onNone: () => {
			return {}
		},
	})

/**
 * Core configuration service
 */
class CoreConfig extends Effect.Service<CoreConfig>()("@duncan3142/effect/config/core-config", {
	effect: Effect.gen(function* () {
		const [service, otel] = yield* Config.nested(
			Config.all([
				Config.nested(
					Config.all([Config.string("NAME"), Config.string("VERSION").pipe(Config.option)]),
					"SERVICE"
				).pipe(
					Config.map(([name, version]) => {
						const versionKV = someKV("version", version)
						return { name, ...versionKV }
					})
				),
				Config.nested(
					Config.all([
						Config.url("URL").pipe(Config.option),
						Config.number("DELAY").pipe(Config.option),
						Config.duration("SHUTDOWN_TIMEOUT").pipe(Config.option),
					]),
					"OTEL"
				).pipe(
					Config.map(([url, delay, shutdownTimeout]) => {
						const urlKV = someKV("url", url)
						const delayKV = someKV("exportDelay", delay)
						const shutdownKV = someKV("shutdownTimeout", shutdownTimeout)
						return { ...urlKV, ...delayKV, ...shutdownKV }
					})
				),
			]),
			"GIT_TOOLS"
		)

		const result: CoreConfigData = {
			service,
			otel,
		}

		return result
	}),
}) {}

const { Default } = CoreConfig

export { CoreConfig, Default }
