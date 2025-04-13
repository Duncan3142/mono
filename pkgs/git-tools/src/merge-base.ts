import { ExecaError, type ExecaScriptMethod } from "execa"
import type { Logger } from "pino"
import type { Ref } from "#refs"
import fetchRefs from "#fetch"
import { DEFAULT_REMOTE } from "#consts"

interface Ctx {
	$: ExecaScriptMethod
	pino: Logger
}

interface Props {
	baseRef: Ref
	headRef: Ref
	remote?: string
	maxDepth?: number
	deepenBy?: number
}

const checkMergeBase = async (
	$: ExecaScriptMethod,
	baseRef: string,
	headRef: string
): Promise<string | null> => {
	const res = await $({ reject: false })`git merge-base ${baseRef} ${headRef}`
	const MERGE_BASE_FOUND = 0
	if (res.exitCode === MERGE_BASE_FOUND && typeof res.stdout === "string") {
		return res.stdout
	}
	const MERGE_BASE_NOT_FOUND = 1
	if (res instanceof ExecaError && res.exitCode === MERGE_BASE_NOT_FOUND) {
		return null
	}
	throw new Error("Unexpected output from git merge-base")
}

class MergeBaseNotFound extends Error {
	public override name = "MergeBaseNotFound" as const
}

const DEFAULT_MAX_DEPTH = 4096
const DEFAULT_DEEPEN_BY = 128

/**
 * Finds the merge base between two refs.
 * @param ctx - Context object
 * @param ctx.$ - execa instance
 * @param ctx.pino - pino instance
 * @param props - Properties for merge base calculation
 * @param props.baseRef - Base ref
 * @param props.headRef - Head ref
 * @param props.remote - Remote name
 * @param props.deepenBy - Initial deepen value
 * @param props.maxDepth - Maximum fetch depth
 * @returns - A promise that resolves to the merge base commit hash
 * @throws {MergeBaseNotFound} - If the merge base is not found
 */
const mergeBase = async (
	{ $, pino }: Ctx,
	{
		baseRef,
		headRef,
		remote = DEFAULT_REMOTE,
		deepenBy = DEFAULT_DEEPEN_BY,
		maxDepth = DEFAULT_MAX_DEPTH,
	}: Props
): Promise<string> => {
	let result: string | null = null
	let depth = 0
	pino.info("Finding merge base...")

	while (depth < maxDepth) {
		// eslint-disable-next-line no-await-in-loop -- Independant calls
		result = await checkMergeBase($, baseRef.name, headRef.name)
		if (result !== null) {
			pino.info(`Merge base found: "${result}"`)
			return result
		}

		// eslint-disable-next-line @typescript-eslint/no-magic-numbers -- double deepenBy
		deepenBy *= 2
		depth += deepenBy
		pino.debug("Deepening fetch...")
		// eslint-disable-next-line no-await-in-loop -- Independant calls
		await fetchRefs(
			{ $, pino },
			{
				remote,
				depth: deepenBy,
				deepen: true,
				refs: [baseRef, headRef],
			}
		)
	}
	// eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Base 10
	const errMsg = `Fetch depth exceeded ${maxDepth.toString(10)}`
	pino.error(errMsg)
	throw new MergeBaseNotFound(errMsg)
}

export default mergeBase
