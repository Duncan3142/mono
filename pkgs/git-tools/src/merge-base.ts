import type { Logger } from "pino"
import type { ExecaScript } from "#execa"
import type { Ref } from "#refs"
import fetchRefs from "#fetch"
import { DEFAULT_REMOTE } from "#consts"

interface Ctx {
	$: ExecaScript
	pino: Logger
}

interface Props {
	baseRef: Ref
	headRef: Ref
	remote?: string
	maxDepth?: number
	deepenBy?: number
}

class MergeBaseError extends Error {
	public override name = "MergeBaseError" as const
}

const checkMergeBase = async (
	$: ExecaScript,
	baseRef: string,
	headRef: string
): Promise<string | null> => {
	const { exitCode, stdout } = await $`git merge-base ${baseRef} ${headRef}`
	const MERGE_BASE_FOUND = 0
	if (exitCode === MERGE_BASE_FOUND && typeof stdout === "string") {
		return stdout
	}
	const MERGE_BASE_NOT_FOUND = 1
	if (exitCode === MERGE_BASE_NOT_FOUND) {
		return null
	}
	throw new MergeBaseError("Unexpected output from git merge-base")
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
 * @throws {MergeBaseError} - If the merge base is not found
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
	throw new MergeBaseError(errMsg)
}

export default mergeBase
