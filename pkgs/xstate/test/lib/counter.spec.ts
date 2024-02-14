import { describe, it, mock } from "node:test"
import { expect } from "expect"
import { counterMachine } from "#lib/counter.js"
import { createActor } from "xstate"
import { setTimeout } from "node:timers/promises"

void describe("counterMachine", () => {
	void it("works", async () => {
		const subscribeFn =
			mock.fn<(state: { value: string; context: { count: number } }) => void>()

		const counterActor = createActor(counterMachine, {
			input: { count: 8 },
		})
		counterActor.subscribe((state) =>
			subscribeFn({ value: state.value, context: state.context })
		)
		counterActor.start()
		counterActor.send({ type: "increment" })
		counterActor.send({ type: "reset" })
		counterActor.send({ type: "decrement" })
		counterActor.send({ type: "decrement" })
		counterActor.send({ type: "store" })
		await setTimeout(0)
		counterActor.stop()

		const subArgs = subscribeFn.mock.calls.map((c) => c.arguments).flat()

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
					count: -2,
				},
				value: "counting",
			},
			{
				context: {
					count: -2,
				},
				value: "storing",
			},
			{
				context: {
					count: -2,
				},
				value: "saved",
			},
		])
	})
})
