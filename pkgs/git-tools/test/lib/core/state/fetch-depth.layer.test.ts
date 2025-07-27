import { describe, it, expect } from "@effect/vitest"
import { gen as effectGen, provide as effectProvide, withConfigProvider } from "effect/Effect"
import { pipe } from "effect/Function"
import { provide as layerProvide } from "effect/Layer"
import { fromMap as configProviderFromMap } from "effect/ConfigProvider"
import FetchDepth from "#state/fetch-depth.service"
import FetchDepthLive from "#state/fetch-depth.layer"
import RepositoryConfigLive from "#config/repository-config.layer"

const ProgramTest = pipe(FetchDepthLive, layerProvide(RepositoryConfigLive))

describe("FetchDepth", () => {
	it.effect("should increment", () =>
		effectGen(function* () {
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
			effectProvide(ProgramTest),
			withConfigProvider(
				configProviderFromMap(
					new Map([
						["DEFAULT_REMOTE_NAME", "origin"],
						["GIT_DIRECTORY", process.cwd()],
					])
				)
			)
		)
	)
	it.effect("should increment across scopes independently", () =>
		effectGen(function* () {
			const program = (incBy: number) =>
				effectGen(function* () {
					const fetchDepth = yield* FetchDepth

					yield* fetchDepth.inc(incBy)
					return yield* fetchDepth.get
				})
			const EIGHT = 8
			const NINE = 9
			const eight = yield* program(EIGHT).pipe(effectProvide(FetchDepthLive))
			const nine = yield* program(NINE).pipe(effectProvide(FetchDepthLive))
			expect(eight).toBe(EIGHT)
			expect(nine).toBe(NINE)
		}).pipe(
			effectProvide(RepositoryConfigLive),
			withConfigProvider(
				configProviderFromMap(
					new Map([
						["DEFAULT_REMOTE_NAME", "origin"],
						["GIT_DIRECTORY", process.cwd()],
					])
				)
			)
		)
	)
	it.effect("should increment within a scope dependently", () =>
		effectGen(function* () {
			const program = (incBy: number) =>
				effectGen(function* () {
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
			effectProvide(ProgramTest),
			withConfigProvider(
				configProviderFromMap(
					new Map([
						["DEFAULT_REMOTE_NAME", "origin"],
						["GIT_DIRECTORY", process.cwd()],
					])
				)
			)
		)
	)
})
