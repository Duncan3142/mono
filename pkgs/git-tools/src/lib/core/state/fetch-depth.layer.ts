import { effect as layerEffect, type Layer } from "effect/Layer"
import { make as refMake, update as refUpdate, get as refGet } from "effect/Ref"
import { pipe } from "effect/Function"
import { gen as effectGen, fail as effectFail, flatMap as effectFlatMap } from "effect/Effect"
import FetchDepth from "./fetch-depth.service.ts"
import RepositoryConfig from "#config/repository-config.service"
import { FetchDepthExceededError } from "#domain/fetch.error"

const FetchDepthLive: Layer<FetchDepth, never, RepositoryConfig> = layerEffect(
	FetchDepth,
	effectGen(function* () {
		const {
			fetch: { maxDepth },
		} = yield* RepositoryConfig
		const ZERO = 0
		const ref = yield* refMake(ZERO)

		return {
			inc: (by: number) =>
				pipe(
					refGet(ref),
					effectFlatMap((currentDepth) => {
						const requestedDepth = currentDepth + by
						return requestedDepth > maxDepth
							? effectFail(
									new FetchDepthExceededError({
										requestedDepth: currentDepth + by,
										maxDepth,
									})
								)
							: refUpdate(ref, (n) => n + by)
					})
				),
			get: refGet(ref),
			set: (requestedDepth: number) =>
				requestedDepth > maxDepth
					? refUpdate(ref, () => requestedDepth)
					: effectFail(
							new FetchDepthExceededError({
								requestedDepth,
								maxDepth,
							})
						),
		}
	})
)
export default FetchDepthLive
