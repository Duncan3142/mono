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
		/** @xstate-layout N4IgpgJg5mDOIC5QGMD2BXAdgFzAJwDo0tsBLTKAYnOTzAFswcBtABgF1FQAHVWUsqkxcQAD0QBaAIwAWVgQCcS1gFYAHAGYVANhUyATCpUAaEAE9EUgOwKCU-dqkrWrGRqkbtqgL7fTxHHwiDBxyKggwWgYmbDZOJBBefkFhBPEECX1ZAitWfRkZBVY1FX0Fdw1TCwQFfQJ9Yq01ViLtNVrffxDcQgCyCko6WDBYjhEkgVIhEXSJPXrtDTl3GTUpBUcZKsQHFRy5MqLahU1NTpA+oL6wylhsVDo48b5J6bTLKzU7co01T7dWJ41PptggNLkCJp9NCZKVNM4ZL4-CBMKgIvAEpc8M9klNUqBZg46rl8oViqVylJQTJIUspIs2ostFYDOcsQQ7g8wjjXvixDtPnZtNorLInFYyqLQUsrAQRSobDo9CUVAo2d0rt1uQkJikZohCgQ8g5PoYPLkrCZzIhwVI7FJWPSNOCEcUkd4gA */
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
