import type { Layer } from "effect/Layer"
import {
	make as loggerMake,
	replace as loggerReplace,
	defaultLogger,
	type Logger,
} from "effect/Logger"

/**
 * Creates a mock logger layer that captures log messages.
 * @param handler - A function that receives the log options.
 * @returns A layer that provides a mocked Logger.
 */
const LoggerTest = (handler: (options: Logger.Options<unknown>) => void): Layer<never> =>
	loggerReplace(defaultLogger, loggerMake(handler))

export default LoggerTest
