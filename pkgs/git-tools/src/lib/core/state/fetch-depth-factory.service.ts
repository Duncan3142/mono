import { Ref, Effect, HashMap } from "effect"
import * as FetchDepth from "./fetch-depth.tag.ts"
import { TagFactory } from "#duncan3142/git-tools/const"
import { RepositoryConfig } from "#duncan3142/git-tools/config"

/**
 * Fetch depth factory service
 */
class FetchDepthFactory extends Effect.Service<FetchDepthFactory>()(
	TagFactory.make(`state`, `fetch-depth-factory`),
	{
		effect: Effect.gen(function* () {
			yield* Effect.logTrace("CounterFactoryLive initialized")
			const [
				map,
				{
					fetch: { maxDepth },
				},
			] = yield* Effect.all(
				[
					Ref.make(HashMap.empty<string, FetchDepth.FetchDepthService>()),
					RepositoryConfig.RepositoryConfig,
				],
				{
					concurrency: "unbounded",
				}
			)
			const acquire = Effect.gen(function* () {
				const depth = yield* FetchDepth.make({ init: 0, maxDepth })
				yield* Effect.logDebug("Acquiring FetchDepth:", depth.id)
				yield* Ref.update(map, (m) => HashMap.set(m, depth.id, depth))
				return depth
			})
			const release = (service: FetchDepth.FetchDepthService) =>
				Effect.gen(function* () {
					yield* Effect.logDebug("Releasing FetchDepth:", service.id)
					return yield* Ref.update(map, (m) => HashMap.remove(m, service.id))
				})
			return Effect.acquireRelease(acquire, release)
		}),
	}
) {}

const { Default } = FetchDepthFactory

export { FetchDepthFactory, Default }
