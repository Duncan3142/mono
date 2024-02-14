import { describe, it, mock } from "node:test"
import { expect } from "expect"
import { counterMachine } from "#lib/counter.js"
import { createActor } from "xstate"
import { setTimeout } from "node:timers/promises"
import { storeFactory } from "#lib/store.js"

void describe("counterMachine", () => {
	void it("works", async () => {
		const subscribeFn =
			mock.fn<(state: { value: string; context: { count: number } }) => void>()

		const save = mock.fn<(count: number) => Promise<string>>((count) => {
			const success = count % 2 === 0
			return success ? Promise.resolve("even") : Promise.reject(new Error("odd"))
		})

		const counterActor = createActor(
			counterMachine.provide({
				actors: {
					store: storeFactory({ repo: { save } }),
				},
			}),
			{
				input: { count: 8 },
			}
		)
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
	void it("restores", () => {
		const initial = createActor(counterMachine, {
			input: { count: 8 },
		})
		initial.start()
		initial.send({ type: "increment" })
		const state = initial.getPersistedSnapshot()
		initial.stop()
		const restored = createActor(counterMachine, {
			input: { count: 0 },
			snapshot: state,
		})
		const {
			context: { count },
		} = restored.getSnapshot()
		restored.stop()
		expect(count).toBe(9)
	})
})
