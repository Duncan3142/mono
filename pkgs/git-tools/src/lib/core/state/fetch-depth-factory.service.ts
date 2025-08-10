import { Ref, Effect, HashMap } from "effect"
import { FetchDepth } from "#state"
import { TagFactory } from "#const"
import { RepositoryConfig } from "#config"

/**
 * Fetch depth factory service
 */
class Service extends Effect.Service<Service>()(
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
				[Ref.make(HashMap.empty<string, FetchDepth.Service>()), RepositoryConfig.Service],
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
			const release = (service: FetchDepth.Service) =>
				Effect.gen(function* () {
					yield* Effect.logDebug("Releasing FetchDepth:", service.id)
					return yield* Ref.update(map, (m) => HashMap.remove(m, service.id))
				})
			return Effect.acquireRelease(acquire, release)
		}),
	}
) {}

const Default = Service.Default

export { Service, Default }
