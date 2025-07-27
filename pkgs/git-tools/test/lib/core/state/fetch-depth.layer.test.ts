import { describe, it, expect } from "@effect/vitest"
import { ConfigProvider, Effect, Layer, pipe } from "effect"
import FetchDepth from "#state/fetch-depth.service"
import FetchDepthLive from "#state/fetch-depth.layer"
import RepositoryConfigLive from "#config/repository-config.layer"

const ProgramTest = pipe(FetchDepthLive, Layer.provide(RepositoryConfigLive))

describe("FetchDepth", () => {
	it.effect("should increment", () =>
		Effect.gen(function* () {
			const fetchDepth = yield* FetchDepth
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
			Effect.withConfigProvider(
				ConfigProvider.fromMap(
					new Map([
						["DEFAULT_REMOTE_NAME", "origin"],
						["GIT_DIRECTORY", process.cwd()],
					])
				)
			)
		)
	)
	it.effect("should increment across scopes independently", () =>
		Effect.gen(function* () {
			const program = (incBy: number) =>
				Effect.gen(function* () {
					const fetchDepth = yield* FetchDepth

					yield* fetchDepth.inc(incBy)
					return yield* fetchDepth.get
				})
			const EIGHT = 8
			const NINE = 9
			const eight = yield* program(EIGHT).pipe(Effect.provide(FetchDepthLive))
			const nine = yield* program(NINE).pipe(Effect.provide(FetchDepthLive))
			expect(eight).toBe(EIGHT)
			expect(nine).toBe(NINE)
		}).pipe(
			Effect.provide(RepositoryConfigLive),
			Effect.withConfigProvider(
				ConfigProvider.fromMap(
					new Map([
						["DEFAULT_REMOTE_NAME", "origin"],
						["GIT_DIRECTORY", process.cwd()],
					])
				)
			)
		)
	)
	it.effect("should increment within a scope dependently", () =>
		Effect.gen(function* () {
			const program = (incBy: number) =>
				Effect.gen(function* () {
					const fetchDepth = yield* FetchDepth

					yield* fetchDepth.inc(incBy)
					return yield* fetchDepth.get
				})
			const EIGHT = 8
			const NINE = 9
			const SEVENTEEN = 17
			const eight = yield* program(EIGHT)
			const seventeen = yield* program(NINE)
			expect(eight).toBe(EIGHT)
			expect(seventeen).toBe(SEVENTEEN)
		}).pipe(
			Effect.provide(ProgramTest),
			Effect.withConfigProvider(
				ConfigProvider.fromMap(
					new Map([
						["DEFAULT_REMOTE_NAME", "origin"],
						["GIT_DIRECTORY", process.cwd()],
					])
				)
			)
		)
	)
})
