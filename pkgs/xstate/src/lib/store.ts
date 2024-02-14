import { fromPromise } from "xstate"

export const store = fromPromise<string, number>(({ input }) => {
	const success = input % 2 === 0
	return success ? Promise.resolve("even") : Promise.reject(new Error("odd"))
})
