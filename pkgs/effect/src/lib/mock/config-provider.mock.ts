import { ConfigProvider } from "effect"

/**
 * Creates a ConfigProvider from an iterable of key-value pairs.
 * @param source - An iterable of key-value pairs.
 * @returns A ConfigProvider instance.
 */
const make = (source: Iterable<readonly [string, string]>): ConfigProvider.ConfigProvider =>
	ConfigProvider.fromMap(new Map(source))

export { make }
