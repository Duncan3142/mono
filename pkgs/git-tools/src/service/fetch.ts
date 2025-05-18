import { ExecaError } from "execa"
import type { Logger } from "pino"
import type { ExecaScript } from "#execa"
import printRefs, { BRANCH, TAG, type Ref, type REF_TYPE } from "#refs"
import { BASE_10_RADIX, DEFAULT_DEPTH, DEFAULT_REMOTE } from "#consts"
import never from "#never"

interface FetchRef extends Ref {
	optional?: boolean
}

interface Ctx {
	$: ExecaScript
	pino: Logger
}

interface Props {
	refs: Array<FetchRef>
	remote?: string
	depth?: number
	deepen?: boolean
}

type RefSpecs = [expected: Array<string>, optional: Array<string>]

const appendRefSpec = (
	name: string,
	type: REF_TYPE,
	remote: string,
	refSpecs: Array<string>
): void => {
	switch (type) {
		case BRANCH: {
			refSpecs.push(`refs/heads/${name}:refs/remotes/${remote}/${name}`)
			return
		}
		case TAG: {
			refSpecs.push(`refs/tags/${name}:refs/tags/${name}`)
			return
		}
		default: {
			return never()
		}
	}
}

const buildRefSpecs = (refs: Array<FetchRef>, remote: string): RefSpecs =>
	refs.reduce<RefSpecs>(
		([expectedRefSpecs, optionalRefSpecs], { name, type = BRANCH, optional = false }) => {
			const collector = optional ? optionalRefSpecs : expectedRefSpecs
			appendRefSpec(name, type, remote, collector)

			return [expectedRefSpecs, optionalRefSpecs]
		},
		[[], []]
	)

const FETCH_RESULT = {
	EMPTY_REFS: "EMPTY_REFS",
	FOUND: "FOUND",
	NOT_FOUND: "NOT_FOUND",
	ERROR: "ERROR",
} as const

type FetchResult = (typeof FETCH_RESULT)[keyof typeof FETCH_RESULT]

interface DoFetchProps {
	optional: boolean
	remote: string
	depth: number
	deepen: boolean
	refSpecs: Array<string>
}

const doFetch = async (
	{ $, pino }: Ctx,
	{ optional, remote, depth, deepen, refSpecs }: DoFetchProps
): Promise<FetchResult> => {
	// eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Empty erray check
	if (refSpecs.length === 0) {
		return FETCH_RESULT.EMPTY_REFS
	}
	pino.info('Fetching ref specs "%s"', refSpecs.join(", "))

	const depthString = depth.toString(BASE_10_RADIX)

	const depthArg = deepen ? `--deepen=${depthString}` : `--depth=${depthString}`

	const { exitCode } = await $`git fetch ${depthArg} ${remote} ${refSpecs}`
	const FETCH_SUCCESS_CODE = 0
	const FETCH_ERROR_CODE = 128
	switch (true) {
		case exitCode === FETCH_SUCCESS_CODE: {
			return FETCH_RESULT.FOUND
		}
		case exitCode === FETCH_ERROR_CODE && optional: {
			pino.warn("Optional refs fetch failed")
			return FETCH_RESULT.NOT_FOUND
		}
		default: {
			pino.error("Fetch failed")
			return FETCH_RESULT.ERROR
		}
	}
}

/**
 * Fetch Error
 */
class FetchError extends Error {
	public override name = "FetchError" as const
}

/**
 * Fetches refs the remote repository.
 * @param ctx - Context object
 * @param ctx.$ - execa instance
 * @param ctx.pino - pino instance
 * @param props - Props object
 * @param props.refs - Refs to fetch
 * @param props.depth - Depth of the fetch
 * @param props.remote - Remote repository to fetch from
 * @param props.deepen - Whether to deepen the fetch
 * @returns - A promise that resolves when the fetch is complete
 */
const fetchRefs = async (
	{ $, pino }: Ctx,
	{ remote = DEFAULT_REMOTE, refs = [], depth = DEFAULT_DEPTH, deepen = false }: Props
): Promise<FetchResult> => {
	// eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Empty array check
	if (refs.length === 0) {
		pino.warn("No refs to fetch")
		return FETCH_RESULT.EMPTY_REFS
	}

	const [expectedRefSpecs, optionalRefSpecs] = buildRefSpecs(refs, remote)

	if (pino.isLevelEnabled("debug")) {
		pino.debug("Refs pre fetch")
		await printRefs({ $ })
	}

	const expectedRes = await doFetch(
		{ $, pino },
		{ optional: false, remote, depth, deepen, refSpecs: expectedRefSpecs }
	)
	const optionalRes = await doFetch(
		{ $, pino },
		{ optional: true, remote, depth, deepen, refSpecs: optionalRefSpecs }
	)

	const res = [expectedRes, optionalRes]

	if (res.includes(FETCH_RESULT.ERROR)) {
		throw new FetchError("Fetch operation encountered an error.")
	}

	if (pino.isLevelEnabled("debug")) {
		pino.debug("Refs post fetch")
		await printRefs({ $ })
	}
}

export default fetchRefs
export { FetchError, FETCH_RESULT }
export type { FetchRef }
