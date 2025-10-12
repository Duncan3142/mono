/* eslint-disable @typescript-eslint/no-empty-function -- Mock */
import { Console, Effect } from "effect"
import { type Mocked, vi } from "vitest"

/**
 * Creates a mocked Console instance.
 * @returns A mocked Console instance.
 */
const make = (): Mocked<Console.Console> => {
	return {
		[Console.TypeId]: Console.TypeId,
		log: vi.fn(() => Effect.void),
		info: vi.fn(() => Effect.void),
		error: vi.fn(() => Effect.void),
		debug: vi.fn(() => Effect.void),
		trace: vi.fn(() => Effect.void),
		warn: vi.fn(() => Effect.void),
		assert: vi.fn((_condition: boolean) => Effect.void),
		count: vi.fn(() => Effect.void),
		countReset: vi.fn(() => Effect.void),
		group: vi.fn(() => Effect.void),
		dir: vi.fn((_item: unknown) => Effect.void),
		table: vi.fn((_data: unknown) => Effect.void),
		time: vi.fn(() => Effect.void),
		timeEnd: vi.fn(() => Effect.void),
		timeLog: vi.fn(() => Effect.void),
		dirxml: vi.fn(() => Effect.void),
		get groupEnd() {
			return Effect.void
		},
		get clear() {
			return Effect.void
		},
		get unsafe() {
			return {
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
			}
		},
	}
}

export { make }
/* eslint-enable @typescript-eslint/no-empty-function -- Mock */
