import { type NonEmptyReadonlyArray, map } from "effect/Array"
import { BRANCH, TAG, type Reference, type as referenceType } from "./reference.ts"
import type { Remote } from "./remote.ts"
import never from "#error/never"

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
	switch (type) {
		case BRANCH: {
			return `refs/heads/${name}:refs/remotes/${remote}/${name}`
		}
		case TAG: {
			return `refs/tags/${name}:refs/tags/${name}`
		}
		default: {
			return never(type)
		}
	}
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
