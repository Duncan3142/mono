import { type NonEmptyReadonlyArray, map } from "effect/Array"
import { value, when, exhaustive } from "effect/Match"
import { pipe } from "effect/Function"
import { BRANCH, TAG, type Reference, type as referenceType } from "./reference.ts"
import type { Remote } from "./remote.ts"

interface ReferenceSpec {
	remote: Remote
	ref: Reference
}

interface ReferenceSpecs {
	remote: Remote
	refs: NonEmptyReadonlyArray<Reference>
}

interface ReferenceSpecsStrings {
	remote: string
	refs: NonEmptyReadonlyArray<string>
}

const toString = ({ remote: { name: remote }, ref }: ReferenceSpec): string => {
	const { name } = ref
	const type = referenceType(ref)
	return pipe(
		value(type),
		when(BRANCH, () => `refs/heads/${name}:refs/remotes/${remote}/${name}`),
		when(TAG, () => `refs/tags/${name}:refs/tags/${name}`),
		exhaustive
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
		refs: map(refs, (reference) => toString({ remote, ref: reference })),
	}
}

export { toStrings }
export type { ReferenceSpecs, ReferenceSpecsStrings }
