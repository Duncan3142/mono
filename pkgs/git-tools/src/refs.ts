import type { ExecaMethod } from "execa"

const BRANCH = "branch"
const TAG = "tag"

/**
 * Ref branch type
 */
type BRANCH_TYPE = typeof BRANCH

/**
 * Ref tag type
 */
type TAG_TYPE = typeof TAG

/**
 * Ref type
 */
type REF_TYPE = BRANCH_TYPE | TAG_TYPE

interface Ref {
	name: string
	type?: REF_TYPE
}

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
export type { BRANCH_TYPE, TAG_TYPE, REF_TYPE, Ref, Ctx }
export { BRANCH, TAG }
