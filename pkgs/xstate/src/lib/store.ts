import { createMachine } from "xstate"

interface StoreMachineTypes {
	context: {
		count: number
	}
	actions: { type: "store" }
}

export interface StoreMachineProps {
	input: StoreMachineTypes["context"]
}

export const counterMachine = createMachine({
	types: {} as StoreMachineTypes,
	id: "store",
	context: ({ input }: StoreMachineProps) => {
		return {
			count: input.count,
		}
	},
	initial: "storing",
	states: {
		storing: {
			entry: "store",
		},
	},
})
