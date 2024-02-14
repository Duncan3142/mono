import { setup, assign } from "xstate"
import { dummyStore } from "./store.js"

interface CounterMachineTypes {
	context: {
		count: number
	}
	input: { count: number }
	events: { type: "increment" } | { type: "decrement" } | { type: "reset" } | { type: "store" }
	// children?: TChildrenMap;
	// tags?: TTag;
	// output?: TOutput;
}

export const counterMachine = setup({
	types: {} as CounterMachineTypes,
	actions: {
		up: assign({ count: ({ context: { count } }) => count + 1 }),
		down: assign({
			count: ({ context: { count } }) => count - 1,
		}),
		reset: assign({ count: () => 0 }),
	},
	actors: {
		store: dummyStore,
	},
}).createMachine({
	id: "counter",
	context: ({ input }) => {
		const { count } = input
		return {
			count,
		}
	},
	initial: "counting",
	states: {
		storing: {
			id: "storing",
			invoke: {
				id: "store",
				src: "store",
				input: ({ context: { count } }) => {
					return { count }
				},
				onDone: {
					target: "saved",
				},
				onError: {
					target: "errored",
				},
			},
		},
		saved: {
			type: "final",
		},
		errored: {
			type: "final",
		},
		counting: {
			id: "counting",
			on: {
				increment: {
					actions: {
						type: "up",
					},
				},
				decrement: {
					actions: "down",
				},
				reset: {
					actions: "reset",
				},
				store: {
					target: "storing",
				},
			},
		},
	},
})
