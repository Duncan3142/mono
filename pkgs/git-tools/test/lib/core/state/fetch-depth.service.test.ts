import { describe, it, expect } from "@effect/vitest"
import { ConfigProvider, Effect, Layer, pipe } from "effect"
import FetchDepth from "#state/fetch-depth.service"
import FetchDepthFactory from "#state/fetch-depth-factory.service"
import RepositoryConfig from "#config/repository-config.service"
import consoleFactory from "#mock/console.mock"

const ProgramTest = pipe(FetchDepthFactory.Default, Layer.provide(RepositoryConfig.Default))

const mockConsole = consoleFactory()

describe("FetchDepth", () => {
	it.scoped("should increment", () =>
		Effect.gen(function* () {
			const fetchDepthFactory = yield* FetchDepthFactory
			const fetchDepth = yield* fetchDepthFactory
			const depth = yield* fetchDepth.get
			const ZERO = 0
			const ONE = 1
			const TWO = 2
			expect(depth).toBe(ZERO)
			yield* fetchDepth.inc(ONE)
			const incrementedDepth = yield* fetchDepth.get
			expect(incrementedDepth).toBe(ONE)
			yield* fetchDepth.inc(ONE)
			const incrementedDepthAgain = yield* fetchDepth.get
			expect(incrementedDepthAgain).toBe(TWO)
		}).pipe(
			Effect.provide(ProgramTest),
			Effect.withConsole(mockConsole),
			Effect.withConfigProvider(ConfigProvider.fromMap(new Map([])))
		)
	)
	it.effect("should increment across scopes independently", () =>
		Effect.gen(function* () {
			const fetchDepthFactory = yield* FetchDepthFactory
			const program = (incBy: number) =>
				Effect.gen(function* () {
					const fetchDepth = yield* FetchDepth

					yield* fetchDepth.inc(incBy)
					return yield* fetchDepth.get
				})
			const EIGHT = 8
			const NINE = 9
			const eight = yield* program(EIGHT).pipe(
				Effect.provideServiceEffect(FetchDepth, fetchDepthFactory),
				Effect.scoped
			)
			const nine = yield* program(NINE).pipe(
				Effect.provideServiceEffect(FetchDepth, fetchDepthFactory),
				Effect.scoped
			)
			expect(eight).toBe(EIGHT)
			expect(nine).toBe(NINE)
		}).pipe(
			Effect.provide(ProgramTest),
			Effect.withConsole(mockConsole),
			Effect.withConfigProvider(ConfigProvider.fromMap(new Map([])))
		)
	)
	it.scoped("should increment within a scope dependently", () =>
		Effect.gen(function* () {
			const fetchDepthFactory = yield* FetchDepthFactory
			const fetchDepth = yield* fetchDepthFactory
			const program = (incBy: number) =>
				Effect.gen(function* () {
					const innerFetchDepth = yield* FetchDepth
					yield* innerFetchDepth.inc(incBy)
					return yield* innerFetchDepth.get
				})
			const EIGHT = 8
			const NINE = 9
			const SEVENTEEN = 17
			const eight = yield* program(EIGHT).pipe(Effect.provideService(FetchDepth, fetchDepth))
			const seventeen = yield* program(NINE).pipe(Effect.provideService(FetchDepth, fetchDepth))
			expect(eight).toBe(EIGHT)
			expect(seventeen).toBe(SEVENTEEN)
		}).pipe(
			Effect.provide(ProgramTest),
			Effect.withConsole(mockConsole),
			Effect.withConfigProvider(ConfigProvider.fromMap(new Map([])))
		)
	)
})
