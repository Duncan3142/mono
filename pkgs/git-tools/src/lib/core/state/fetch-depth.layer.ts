import { Layer, Ref, Effect, pipe } from "effect"
import FetchDepth from "./fetch-depth.service.ts"
import RepositoryConfig from "#config/repository-config.service"
import { FetchDepthExceededError } from "#domain/fetch.error"

const FetchDepthLive: Layer.Layer<FetchDepth, never, RepositoryConfig> = Layer.effect(
	FetchDepth,
	Effect.gen(function* () {
		const {
			fetch: { maxDepth },
		} = yield* RepositoryConfig
		const ZERO = 0
		const ref = yield* Ref.make(ZERO)

		return {
			inc: (by: number) =>
				pipe(
					Ref.get(ref),
					Effect.flatMap((currentDepth) => {
						const requestedDepth = currentDepth + by
						return requestedDepth > maxDepth
							? Effect.fail(
									new FetchDepthExceededError({
										requestedDepth: currentDepth + by,
										maxDepth,
									})
								)
							: Ref.update(ref, (n) => n + by)
					})
				),
			get: Ref.get(ref),
			set: (requestedDepth: number) =>
				requestedDepth > maxDepth
					? Ref.update(ref, () => requestedDepth)
					: Effect.fail(
							new FetchDepthExceededError({
								requestedDepth,
								maxDepth,
							})
						),
		}
	})
)
export default FetchDepthLive
