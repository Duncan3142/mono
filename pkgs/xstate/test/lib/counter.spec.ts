import { describe, it, mock } from "node:test"
import { expect } from "expect"
import { counterMachine } from "#lib/counter.js"
import { createActor } from "xstate"

void describe("counterMachine", () => {
	void it("equals", () => {
		const subscribeFn =
			mock.fn<(state: { value: string; context: { count: number } }) => void>()
		const storeFn = mock.fn(() => Promise.resolve(true))

		const counterActor = createActor(counterMachine, {
			input: { count: 8, storeHandler: storeFn },
		})
		counterActor.subscribe((state) =>
			subscribeFn({ value: state.value, context: state.context })
		)
		counterActor.start()
		counterActor.send({ type: "increment" })
		counterActor.send({ type: "reset" })
		counterActor.send({ type: "decrement" })
		counterActor.send({ type: "store" })
		counterActor.send({ type: "increment" })
		counterActor.stop()

		const subArgs = subscribeFn.mock.calls.map((c) => c.arguments).flat()
		const storeArgs = storeFn.mock.calls.map((c) => c.arguments).flat()

		expect(storeArgs).toEqual([-1])

		expect(subArgs).toMatchObject([
			{
				context: {
					count: 8,
				},
				value: "counting",
			},
			{
				context: {
					count: 9,
				},
				value: "counting",
			},
			{
				context: {
					count: 0,
				},
				value: "counting",
			},
			{
				context: {
					count: -1,
				},
				value: "counting",
			},
			{
				context: {
					count: -1,
				},
				value: "storing",
			},
			{
				context: {
					count: 0,
				},
				value: "counting",
			},
		])
	})
})
