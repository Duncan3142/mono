import { Match, pipe, Data } from "effect"
import { type Reference, BRANCH_REF_TAG, TAG_REF_TAG } from "./reference.ts"
import type { Remote } from "./remote.ts"
import { tag } from "#const"

const REFERENCE_SPEC_TAG = tag("domain", "ReferenceSpec")

interface ReferenceSpec {
	readonly _tag: typeof REFERENCE_SPEC_TAG
	readonly remote: Remote
	readonly ref: Reference
}

const ReferenceSpec = Data.tagged<ReferenceSpec>(REFERENCE_SPEC_TAG)

/**
 * Reference specification string
 * @param spec - Reference specification to convert
 * @param spec.remote - Remote to use
 * @param spec.remote.name - Name of the remote
 * @param spec.ref - Reference to convert
 * @returns Reference specification string
 */
const toString = ({ remote: { name: remote }, ref }: ReferenceSpec): string =>
	pipe(
		Match.value(ref),
		Match.when(
			{ _tag: BRANCH_REF_TAG },
			({ name }) => `refs/heads/${name}:refs/remotes/${remote}/${name}`
		),
		Match.when({ _tag: TAG_REF_TAG }, ({ name }) => `refs/tags/${name}:refs/tags/${name}`),
		Match.exhaustive
	)

export { toString, REFERENCE_SPEC_TAG, ReferenceSpec }
