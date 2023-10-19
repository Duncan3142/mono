import { describe, it, mock } from "node:test"
import { equal, deepEqual } from "node:assert/strict"
import { counterMachine } from "#lib/machine.js"
import { createActor } from "xstate"
import { Just } from "purify-ts/Maybe"

void describe("counterMachine", () => {
	void it("equals", () => {
		const fn = mock.fn<(count: number | null) => number>()

		const counterActor = createActor(counterMachine, {
			input: { count: Just(8) },
		})
		counterActor.subscribe((state) => fn(state.context.count.extractNullable()))
		counterActor.start()
		counterActor.send({ type: "increment" })
		counterActor.send({ type: "unlock" })
		counterActor.send({ type: "increment" })
		counterActor.send({ type: "reset" })
		counterActor.send({ type: "lock" })
		counterActor.send({ type: "decrement" })
		counterActor.send({ type: "unlock" })
		counterActor.send({ type: "decrement" })
		counterActor.send({ type: "init", count: 5 })
		counterActor.send({ type: "decrement" })
		counterActor.stop()

		equal(fn.mock.callCount(), 12)
		const args = fn.mock.calls.map((c) => c.arguments)
		deepEqual(args, [
			[null],
			[null],
			[null],
			[null],
			[null],
			[null],
			[null],
			[null],
			[null],
			[5],
			[4],
			[4],
		])
	})
})
