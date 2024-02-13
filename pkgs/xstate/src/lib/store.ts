import { fromPromise } from "xstate"

export type DoStoreHandler<I> = (input: I) => Promise<boolean>

export type DoStoreActorInput = {
	value: number
	handler: DoStoreHandler<number>
}

export const doStoreActor = fromPromise<boolean, DoStoreActorInput>(async ({ input }) => {
	console.log("storing", input.value)
	await input.handler(input.value)
	return true
})
