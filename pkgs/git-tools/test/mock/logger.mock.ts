import { Logger, type Layer } from "effect"

/**
 * Creates a mock logger layer that captures log messages.
 * @param handler - A function that receives the log options.
 * @returns A layer that provides a mocked Logger.
 */
const LoggerTest = (
	handler: (options: Logger.Logger.Options<unknown>) => void
): Layer.Layer<never> => Logger.replace(Logger.defaultLogger, Logger.make(handler))

export default LoggerTest
