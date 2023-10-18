import { describe, it, mock } from "node:test"
import { equal } from "node:assert/strict"
import { counterMachine } from "#lib/machine.js"
import { interpret } from "xstate"

void describe("counterMachine", () => {
	void it("equals", () => {
		const fn = mock.fn()
		const counterActor = interpret(counterMachine)
		counterActor.subscribe((state) => fn(state.context.count))
		counterActor.start()

		counterActor.send({ type: "increment" }) // logs 1
		counterActor.send({ type: "increment" }) // logs 2
		counterActor.send({ type: "decrement" }) // logs 1
	})
})
