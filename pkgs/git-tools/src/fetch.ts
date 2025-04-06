import type { ExecaMethod } from "execa"
import type { Logger } from "pino"
import printRefs from "#refs"
import { DEFAULT_DEPTH, DEFAULT_REMOTE } from "#consts"

interface Ctx {
	$: ExecaMethod
	pino: Logger
}

interface Props {
	remote?: string
	tags?: Array<string>
	branches?: Array<string>
	depth?: number
}

/**
 * Fetches refs the remote repository.
 * @param ctx - Context object
 * @param ctx.$ - execa instance
 * @param ctx.pino - pino instance
 * @param props - Props object
 * @param props.tags - Tags to fetch
 * @param props.branches - Branches to fetch
 * @param props.depth - Depth of the fetch
 * @param props.remote - Remote repository to fetch from
 * @returns - A promise that resolves when the fetch is complete
 */
const fetchRefs = async (
	{ $, pino }: Ctx,
	{ remote = DEFAULT_REMOTE, tags = [], branches = [], depth = DEFAULT_DEPTH }: Props
): Promise<void> => {
	const refSpecs = [
		...tags.map((tag) => `refs/tags/${tag}:refs/tags/${tag}`),
		...branches.map((branch) => `refs/heads/${branch}:refs/remotes/${remote}/${branch}`),
	]
	// eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Empty array check
	if (refSpecs.length === 0) {
		pino.warn("No refs to fetch")
		return
	}

	if (pino.isLevelEnabled("debug")) {
		pino.debug("Refs pre fetch")
		await printRefs({ $ })
	}

	pino.info('Fetching ref specs "%s"', refSpecs.join(", "))

	await $`git fetch ${remote} --depth=${depth} ${refSpecs}`

	if (pino.isLevelEnabled("debug")) {
		pino.debug("Refs post fetch")
		await printRefs({ $ })
	}
	return
}

export default fetchRefs
