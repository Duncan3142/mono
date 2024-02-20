import { fromPromise } from "xstate"

export interface CountRepo {
	save: (count: number) => Promise<string>
}

export interface StoreInput {
	count: number
}

export interface StoreCtx {
	repo: CountRepo
}

export const storeFactory = (ctx: StoreCtx) =>
	fromPromise<string, StoreInput>(({ input }) => {
		const { repo } = ctx
		const { count } = input
		return repo.save(count)
	})

export const dummyStore = storeFactory({ repo: { save: () => Promise.reject("Dummy") } })
