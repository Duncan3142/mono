import { createMachine, assign } from "xstate"
import { Just, Nothing, type Maybe } from "purify-ts/Maybe"

interface CounterMachineTypes {
	context: {
		count: Maybe<number>
	}
	actions:
		| { type: "up" }
		| { type: "down" }
		| { type: "reset" }
		| { type: "init"; params: { count: number } }
	events:
		| { type: "unlock" }
		| { type: "increment" }
		| { type: "decrement" }
		| { type: "lock" }
		| { type: "reset" }
		| { type: "init"; count: number }
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
		initial: "reset",
		states: {
			locked: {
				on: {
					unlock: "unlocked",
				},
			},
			reset: {
				entry: "reset",
				on: {
					init: {
						actions: {
							type: "init",
							params: ({ event: { count } }) => {
								return {
									count,
								}
							},
						},
						target: "unlocked",
					},
				},
			},
			unlocked: {
				on: {
					increment: {
						actions: "up",
					},
					decrement: {
						actions: "down",
					},
					reset: "reset",
					lock: "locked",
				},
			},
		},
	},
	{
		actions: {
			up: assign({ count: ({ context: { count } }) => count.map((c) => c + 1) }),
			down: assign({
				count: ({ context: { count } }) => count.map((c) => c - 1),
			}),
			reset: assign({ count: () => Nothing }),
			init: assign({
				count: ({
					action: {
						params: { count },
					},
				}) => Just(count),
			}),
		},
	}
)
