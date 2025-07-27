/* eslint-disable @typescript-eslint/no-magic-numbers -- Example */
import { Effect, Ref, Context, Layer, Console, pipe } from "effect"

class Counter extends Context.Tag("Counter")<Counter, Ref.Ref<number>>() {}

class PrintCount extends Context.Tag("PrintCount")<PrintCount, () => Effect.Effect<void>>() {}

class IncrementCount extends Context.Tag("IncrementCount")<
	IncrementCount,
	() => Effect.Effect<void>
>() {}

const CounterLive = Layer.effect(Counter, Ref.make(0))

const PrintCountLive = Layer.effect(
	PrintCount,
	Effect.gen(function* () {
		const counter = yield* Counter
		return () =>
			Effect.gen(function* () {
				const count = yield* Ref.get(counter)
				yield* Console.log(`Current count: ${count.toString()}`)
			})
	})
)

const IncrementCountLive = Layer.effect(
	IncrementCount,
	Effect.gen(function* () {
		const print = yield* PrintCount
		const counter = yield* Counter
		return () =>
			Effect.gen(function* () {
				yield* Ref.update(counter, (n) => n + 1)
				yield* print()
			})
	})
)

const ProgramLive = pipe(
	IncrementCountLive,
	Layer.provide(PrintCountLive),
	Layer.provide(CounterLive) // How can a new ref layer be generated for each scope?
)

const program = Effect.gen(function* () {
	const increment = yield* IncrementCount
	yield* increment()
})

Effect.runFork(
	Effect.all([Effect.scoped(program), Effect.scoped(program)]).pipe(Effect.provide(ProgramLive))
)
/*
Prints the following:
Current count: 1
Current count: 2

Is it possible to have a new Ref instance for each scope?
This would allow independent counters in each scope.

The desired output would be:
Current count: 1
Current count: 1
*/

/* eslint-enable @typescript-eslint/no-magic-numbers -- Example */
