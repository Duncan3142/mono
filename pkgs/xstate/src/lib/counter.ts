import { setup, assign } from "xstate"
import { doStoreActor, type DoStoreHandler } from "./store.js"

interface CounterMachineTypes {
	context: {
		count: number
		storeHandler: DoStoreHandler<number>
	}
	input: { count: number; storeHandler: DoStoreHandler<number> }
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
	actors: { store: doStoreActor },
	guards: {},
}).createMachine({
	id: "counter",
	context: ({ input }) => {
		return {
			count: input.count,
			storeHandler: input.storeHandler,
		}
	},
	initial: "counting",
	states: {
		storing: {
			invoke: {
				src: "store",
				input: ({ context }) => {
					return { handler: context.storeHandler, value: context.count }
				},
				onDone: {
					target: "counting",
				},
				onError: {
					target: "counting",
				},
			},
		},
		counting: {
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
