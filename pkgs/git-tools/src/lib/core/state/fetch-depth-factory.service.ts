import { Console, Ref, Effect, HashMap } from "effect"
import FetchDepth, { type FetchDepthService } from "./fetch-depth.service.ts"
import { SERVICE_PREFIX } from "#const"
import RepositoryConfig from "#config/repository-config.service"

/**
 * Fetch depth factory service
 */
class FetchDepthFactory extends Effect.Service<FetchDepthFactory>()(
	`${SERVICE_PREFIX}/state/fetch-depth-factory`,
	{
		effect: Effect.gen(function* () {
			yield* Console.log("CounterFactoryLive initialized")
			const [
				map,
				{
					fetch: { maxDepth },
				},
			] = yield* Effect.all(
				[Ref.make(HashMap.empty<string, FetchDepthService>()), RepositoryConfig],
				{
					concurrency: "unbounded",
				}
			)
			const acquire = Effect.gen(function* () {
				const depth = yield* FetchDepth.make({ init: 0, maxDepth })
				yield* Console.log("Acquiring FetchDepth:", depth.id)
				yield* Ref.update(map, (m) => HashMap.set(m, depth.id, depth))
				return depth
			})
			const release = (depth: FetchDepthService) =>
				Effect.gen(function* () {
					yield* Console.log("Releasing FetchDepth:", depth.id)
					return yield* Ref.update(map, (m) => HashMap.remove(m, depth.id))
				})
			return Effect.acquireRelease(acquire, release)
		}),
	}
) {}

export default FetchDepthFactory
