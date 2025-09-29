import { ConfigProvider, Effect } from "effect"

/**
 * Creates a ConfigProvider from an iterable of key-value pairs.
 * @param source - An iterable of key-value pairs.
 * @returns A ConfigProvider instance.
 */
const make = (
	source: Iterable<readonly [string, string]>
): (<A, E, R>(self: Effect.Effect<A, E, R>) => Effect.Effect<A, E, R>) =>
	Effect.withConfigProvider(ConfigProvider.fromMap(new Map(source)))

export { make }
