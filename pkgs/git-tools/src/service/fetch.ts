import { type Command, make as makeCommand } from "@effect/platform/Command"
import { type Effect, logInfo, logDebug, whenLogLevel, fail } from "effect/Effect"
import { isNonEmptyReadonlyArray, type NonEmptyReadonlyArray } from "effect/Array"
import { type Logger } from "effect/Logger"
import printRefs, { BRANCH, TAG, type Ref, type REF_TYPE } from "#service/refs"
import { BASE_10_RADIX, DEFAULT_DEPTH, DEFAULT_REMOTE } from "#config/consts"
import never from "#error/never"

interface FetchRef extends Ref {
	optional?: boolean
}

interface Ctx {
	$: Command.Command
	logger: Logger<unknown, void>
}

interface Props {
	refs: NonEmptyReadonlyArray<FetchRef>
	remote?: string
	depth?: number
	deepen?: boolean
}

const EXPECTED = "expected"
const OPTIONAL = "optional"

type Contingent = typeof EXPECTED | typeof OPTIONAL

interface ContingentRefSpecs<Type extends Contingent> {
	type: Type
	refs: NonEmptyReadonlyArray<string>
}

type RefSpecs =
	| [expected: NonEmptyReadonlyArray<string>, optional: NonEmptyReadonlyArray<string>]
	| ContingentRefSpecs<typeof EXPECTED>
	| ContingentRefSpecs<typeof OPTIONAL>

const buildRefSpecs = (refs: NonEmptyReadonlyArray<FetchRef>, remote: string): RefSpecs => {
	const append = (
		type: REF_TYPE,
		name: string,
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

	const [expected, optional]: [ReadonlyArray<string>, ReadonlyArray<string>] = refs.reduce<
		[Array<string>, Array<string>]
	>(
		([expectedRefSpecs, optionalRefSpecs], { name, type = BRANCH, optional = false }) => {
			const collector = optional ? optionalRefSpecs : expectedRefSpecs
			append(type, name, remote, collector)

			return [expectedRefSpecs, optionalRefSpecs]
		},
		[[], []]
	)

	return isNonEmptyReadonlyArray(expected) && isNonEmptyReadonlyArray(optional)
		? [expected, optional]
		: isNonEmptyReadonlyArray(expected)
			? { type: EXPECTED, refs: expected }
			: isNonEmptyReadonlyArray(optional)
				? { type: OPTIONAL, refs: optional }
				: never()
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
	{ $, logger: pino }: Ctx,
	{ refs, remote = DEFAULT_REMOTE, depth = DEFAULT_DEPTH, deepen = false }: Props
): Effect<Found, FetchError | FetchNotFoundError> => {
	const [expectedRefSpecs, optionalRefSpecs] = buildRefSpecs(refs, remote)


	whenLogLevel("Debug")) {
		pino.debug("Refs pre fetch")
		await printRefs({ $ })
	}

	const expectedRes = await doFetch(
		{ $, logger: pino },
		{ optional: false, remote, depth, deepen, refSpecs: expectedRefSpecs }
	)
	const optionalRes = await doFetch(
		{ $, logger: pino },
		{ optional: true, remote, depth, deepen, refSpecs: optionalRefSpecs }
	)

	const res = [expectedRes, optionalRes]

	if (res.includes(FETCH_RESULT.ERROR)) {
		throw new FetchError("Fetch operation encountered an error.")
	}

	if (pino.isLevelEnabled("debug")) {
		pino.log("Refs post fetch")
		await printRefs({ $ })
	}
}

export default fetchRefs
export { FetchError }
export type { FetchRef }
