import { Match, pipe, Data } from "effect"
import type * as Remote from "./remote.ts"
import type * as Reference from "./reference.ts"
import { TagFactory } from "#duncan3142/git-tools/const"

const REFERENCE_SPEC_TAG = TagFactory.make("domain", "ReferenceSpec")

interface ReferenceSpec {
	readonly _tag: typeof REFERENCE_SPEC_TAG
	readonly remote: Remote.Remote
	readonly ref: Reference.Reference
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
		// Reference.$match,
		// Reference.$is('Branch', ),
		Match.value(ref),
		Match.whenOr(
			{ _tag: "Branch" },
			{ _tag: "Head" },
			({ name }) => `refs/heads/${name}:refs/remotes/${remote}/${name}`
		),
		Match.when({ _tag: "Tag" }, ({ name }) => `refs/tags/${name}:refs/tags/${name}`),
		Match.exhaustive
	)

export { toString, REFERENCE_SPEC_TAG, ReferenceSpec }
