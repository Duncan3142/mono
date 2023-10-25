import { describe, it, mock } from "node:test"
import { deepEqual } from "node:assert/strict"
import { counterMachine } from "#lib/counter.js"
import { createActor } from "xstate"

void describe("counterMachine", () => {
	void it("equals", () => {
		const fn = mock.fn<(count: number | null) => number>()

		const counterActor = createActor(counterMachine, {
			input: { count: 8 },
		})
		counterActor.subscribe((state) => fn(state.context.count))
		counterActor.start()
		counterActor.send({ type: "increment" })
		counterActor.send({ type: "increment" })
		counterActor.send({ type: "reset" })
		counterActor.send({ type: "decrement" })
		counterActor.send({ type: "decrement" })
		counterActor.send({ type: "decrement" })
		counterActor.stop()

		const args = fn.mock.calls.map((c) => c.arguments)

		deepEqual(args, [[8], [9], [10], [0], [-1], [-2], [-3], [-3]])
	})
})
