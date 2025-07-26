import { type NonEmptyReadonlyArray, map as arrayMap } from "effect/Array"
import {
	value as matchValue,
	when as matchWhen,
	exhaustive as matchExhaustive,
} from "effect/Match"
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
		matchValue(type),
		matchWhen(BRANCH, () => `refs/heads/${name}:refs/remotes/${remote}/${name}`),
		matchWhen(TAG, () => `refs/tags/${name}:refs/tags/${name}`),
		matchExhaustive
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
		refs: arrayMap(refs, (reference) => toString({ remote, ref: reference })),
	}
}

export { toStrings }
export type { ReferenceSpecs, ReferenceSpecsStrings }
