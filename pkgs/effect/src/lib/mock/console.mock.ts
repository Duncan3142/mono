/* eslint-disable @typescript-eslint/no-empty-function -- Mock */
import { type Console, Effect } from "effect"
import { mockDeep, type DeepMockProxy } from "vitest-mock-extended"

/**
 * Creates a mocked Console instance.
 * @returns A mocked Console instance.
 */
const make = (): DeepMockProxy<Console.Console> => {
	const mock = mockDeep<Console.Console>({
		log: () => Effect.void,
		info: () => Effect.void,
		error: () => Effect.void,
		debug: () => Effect.void,
		trace: () => Effect.void,
		warn: () => Effect.void,
		assert: () => Effect.void,
		count: () => Effect.void,
		countReset: () => Effect.void,
		group: () => Effect.void,
		dir: () => Effect.void,
		table: () => Effect.void,
		time: () => Effect.void,
		timeEnd: () => Effect.void,
		timeLog: () => Effect.void,
		dirxml: () => Effect.void,
		groupEnd: Effect.void,
		clear: Effect.void,
		unsafe: {
			assert: () => {},
			count: () => {},
			countReset: () => {},
			debug: () => {},
			dir: () => {},
			dirxml: () => {},
			error: () => {},
			group: () => {},
			groupEnd: () => {},
			info: () => {},
			log: () => {},
			table: () => {},
			time: () => {},
			timeEnd: () => {},
			timeLog: () => {},
			trace: () => {},
			warn: () => {},
			clear: () => {},
			groupCollapsed: () => {},
		},
	})
	return mock
}

export { make }
/* eslint-enable @typescript-eslint/no-empty-function -- Mock */
