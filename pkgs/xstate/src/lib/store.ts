import { fromPromise } from "xstate"

export type DoStoreHandler<I> = (input: I) => Promise<boolean>

export type DoStoreActorInput = {
	value: number
	handler: DoStoreHandler<number>
}

export const doStoreActor = fromPromise<boolean, DoStoreActorInput>(({ input }) =>
	input.handler(input.value)
)
