import type { ExecaMethod } from "execa"

interface Ctx {
	$: ExecaMethod
}

/**
 * Prints the refs of the current git repository.
 * @param ctx - Context object
 * @param ctx.$ - execa instance
 * @returns - A promise that resolves when the refs are printed
 */
const printRefs = async ({ $ }: Ctx): Promise<void> => {
	await $`git --no-pager branch -a -v -v`
	await $`git --no-pager tag`
}

export default printRefs
