import { ExecaError, type ExecaScriptMethod } from "execa"
import type { Logger } from "pino"
import printRefs, { BRANCH, TAG, type Ref, type REF_TYPE } from "#refs"
import { BASE_10_RADIX, DEFAULT_DEPTH, DEFAULT_REMOTE } from "#consts"
import never from "#never"

interface FetchRef extends Ref {
	optional?: boolean
}

interface Ctx {
	$: ExecaScriptMethod
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

const doFetch = async (
	{ $, pino }: Ctx,
	remote: string,
	depth: number,
	deepen: boolean,
	refSpecs: Array<string>
) => {
	// eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Empty erray check
	if (refSpecs.length > 0) {
		pino.info('Fetching ref specs "%s"', refSpecs.join(", "))

		const depthString = depth.toString(BASE_10_RADIX)

		const depthArg = deepen ? `--deepen=${depthString}` : `--depth=${depthString}`

		await $`git fetch ${depthArg} ${remote} ${refSpecs}`
	}
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
): Promise<void> => {
	// eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Empty array check
	if (refs.length === 0) {
		pino.warn("No refs to fetch")
		return
	}

	const [expectedRefSpecs, optionalRefSpecs] = buildRefSpecs(refs, remote)

	if (pino.isLevelEnabled("debug")) {
		pino.debug("Refs pre fetch")
		await printRefs({ $ })
	}

	await doFetch({ $, pino }, remote, depth, deepen, expectedRefSpecs)
	await doFetch({ $, pino }, remote, depth, deepen, optionalRefSpecs).catch((err: unknown) => {
		const GIT_FETCH_ERROR_CODE = 128
		if (err instanceof ExecaError && err.exitCode === GIT_FETCH_ERROR_CODE) {
			pino.warn("Optional refs fetch failed")
		} else {
			throw err
		}
	})

	if (pino.isLevelEnabled("debug")) {
		pino.debug("Refs post fetch")
		await printRefs({ $ })
	}
	return
}

export default fetchRefs
export type { FetchRef }
