import { type Console, Effect  } from "effect"
import { mockDeep, type DeepMockProxy } from "vitest-mock-extended"

/**
 * Creates a mocked Console instance.
 * @returns A mocked Console instance.
 */
const make = (): DeepMockProxy<Console.Console> => {
	const mock = mockDeep<Console.Console>()
	mock.log.mockImplementation(() => Effect.void)
	mock.info.mockImplementation(() => Effect.void)
	mock.error.mockImplementation(() => Effect.void)
	mock.debug.mockImplementation(() => Effect.void)
	mock.trace.mockImplementation(() => Effect.void)
	mock.warn.mockImplementation(() => Effect.void)
	return mock
}

export { make }
