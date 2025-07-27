import { Match, Array, pipe } from "effect"
import { BRANCH, TAG, type Reference, type as referenceType } from "./reference.ts"
import type { Remote } from "./remote.ts"

interface ReferenceSpec {
	remote: Remote
	ref: Reference
}

interface ReferenceSpecs {
	remote: Remote
	refs: Array.NonEmptyReadonlyArray<Reference>
}

interface ReferenceSpecsStrings {
	remote: string
	refs: Array.NonEmptyReadonlyArray<string>
}

const toString = ({ remote: { name: remote }, ref }: ReferenceSpec): string => {
	const { name } = ref
	const type = referenceType(ref)
	return pipe(
		Match.value(type),
		Match.when(BRANCH, () => `refs/heads/${name}:refs/remotes/${remote}/${name}`),
		Match.when(TAG, () => `refs/tags/${name}:refs/tags/${name}`),
		Match.exhaustive
	)
}

/**
 * Converts a reference specification to a string format.
 * @param specs - The reference specification
 * @param specs.remote - The remote repository
 * @param specs.refs - The references to fetch
 * @returns The string representation of the reference specification
 */
const toStrings = ({ remote, refs }: ReferenceSpecs): ReferenceSpecsStrings => {
	return {
		remote: remote.name,
		refs: Array.map(refs, (reference) => toString({ remote, ref: reference })),
	}
}

export { toStrings }
export type { ReferenceSpecs, ReferenceSpecsStrings }
