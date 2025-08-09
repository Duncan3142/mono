import { Ref, Effect, HashMap } from "effect"
import * as FetchDepth from "./fetch-depth.service.ts"
import * as Const from "#const"
import * as RepositoryConfig from "#config/repository-config.service"

/**
 * Fetch depth factory service
 */
class Service extends Effect.Service<Service>()(Const.tag(`state`, `fetch-depth-factory`), {
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
			const depth = yield* FetchDepth.Tag.make({ init: 0, maxDepth })
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
}) {}

export { Service }
