/* eslint-disable @typescript-eslint/no-magic-numbers -- Example */
import type { Scope } from "effect"
import { Effect, Ref, Context, Layer, Console, pipe, HashMap } from "effect"

type Count = number

class Counter extends Context.Tag("Counter")<
	Counter,
	{
		id: string
		inc: (by: number) => Effect.Effect<void>
		get: Effect.Effect<Count>
		set: (value: Count) => Effect.Effect<void>
	}
>() {
	public static make = Effect.gen(function* () {
		const id = crypto.randomUUID()
		const ref = yield* Ref.make(0)
		return Counter.of({
			id,
			inc: (by: number) => Ref.update(ref, (n) => n + by),
			get: Ref.get(ref),
			set: (value: Count) => Ref.set(ref, value),
		})
	})
}

type CounterService = Context.Tag.Service<Counter>

class CounterStore extends Context.Tag("CounterStore")<
	CounterStore,
	Effect.Effect<CounterService, never, Scope.Scope>
>() {}

class PrintCount extends Context.Tag("PrintCount")<
	PrintCount,
	Effect.Effect<void, never, Counter>
>() {}

class IncrementCount extends Context.Tag("IncrementCount")<
	IncrementCount,
	Effect.Effect<void, never, Counter>
>() {}

const CounterStoreLive = Layer.effect(
	CounterStore,
	Effect.gen(function* () {
		yield* Console.log("CounterStoreLive initialized")
		const map = yield* Ref.make(HashMap.empty<string, CounterService>())
		const acquire = Effect.gen(function* () {
			const counter = yield* Counter.make
			yield* Console.log("Created Counter:", counter.id)
			yield* Ref.update(map, (m) => HashMap.set(m, counter.id, counter))
			return counter
		})
		const release = (counter: CounterService) =>
			Effect.gen(function* () {
				yield* Console.log("Releasing Counter:", counter.id)
				return yield* Ref.update(map, (m) => HashMap.remove(m, counter.id))
			})
		return Effect.acquireRelease(acquire, release)
	})
)

const PrintCountLive = Layer.effect(
	PrintCount,
	Effect.gen(function* () {
		yield* Console.log("PrintCountLive initialized")
		return Effect.gen(function* () {
			const counter = yield* Counter
			const count = yield* counter.get
			yield* Console.log(`Current count: ${count.toString()}`)
		})
	})
)

const IncrementCountLive = Layer.effect(
	IncrementCount,
	Effect.gen(function* () {
		yield* Console.log("IncrementCountLive initialized")
		const print = yield* PrintCount
		return Effect.gen(function* () {
			const counter = yield* Counter
			yield* counter.inc(14)
			yield* print
		})
	})
)

const ProgramLive = pipe(
	IncrementCountLive,
	Layer.provide(PrintCountLive),
	Layer.merge(CounterStoreLive)
)

const program = Effect.gen(function* () {
	const counterStore = yield* CounterStore
	const counter = yield* counterStore
	const increment = yield* IncrementCount
	yield* increment.pipe(Effect.provideService(Counter, counter))
}).pipe(Effect.scoped)

const programs = Effect.all([program, program]).pipe(
	Effect.provide(ProgramLive),
	Effect.exit,
	Effect.map((exit) => {
		console.log("All programs completed with exit:", exit)
	})
)

Effect.runFork(programs)

/* eslint-enable @typescript-eslint/no-magic-numbers -- Example */
