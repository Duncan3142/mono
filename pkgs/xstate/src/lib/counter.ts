import { createMachine, assign } from "xstate"

interface CounterMachineTypes {
	context: {
		count: number
	}
	actions: { type: "up" } | { type: "down" } | { type: "reset" }

	events: { type: "increment" } | { type: "decrement" } | { type: "reset" } | { type: "store" }

	// actors: { type: "store" }
}

export interface CounterMachineProps {
	input: CounterMachineTypes["context"]
}

export const counterMachine = createMachine(
	{
		types: {} as CounterMachineTypes,
		id: "counter",
		context: ({ input }: CounterMachineProps) => {
			return {
				count: input.count,
			}
		},
		initial: "counting",
		states: {
			storing: {
				invoke: {
					src: "store",
					input: ({ context }) => {
						return { count: context.count }
					},
				},
			},
			counting: {
				on: {
					increment: {
						actions: "up",
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
	},
	{
		actions: {
			up: assign({ count: ({ context: { count } }) => count + 1 }),
			down: assign({
				count: ({ context: { count } }) => count - 1,
			}),
			reset: assign({ count: () => 0 }),
		},
	}
)
