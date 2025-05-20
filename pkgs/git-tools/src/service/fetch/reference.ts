import { isNonEmptyReadonlyArray, type NonEmptyReadonlyArray } from "effect/Array"
import { type ContingentReferenceSpecs, EXPECTED, OPTIONAL } from "./command.ts"
import { BRANCH, TAG, type Ref, type REF_TYPE } from "#service/refs"
import never from "#error/never"

/**
 * Type of the ref spec - expected or optional
 */
type ReferenceSpecs =
	| [ContingentReferenceSpecs<typeof EXPECTED>]
	| [ContingentReferenceSpecs<typeof OPTIONAL>]
	| [ContingentReferenceSpecs<typeof EXPECTED>, ContingentReferenceSpecs<typeof OPTIONAL>]

interface FetchReference extends Ref {
	optional?: boolean
}

interface Properties {
	refs: NonEmptyReadonlyArray<FetchReference>
	remote: string
}

/**
 * Builds reference specifications for fetching from a remote repository.
 * @param props - The properties for building reference specifications
 * @param props.refs - The references to fetch
 * @param props.remote - The remote repository to fetch from
 * @returns An array of reference specifications
 */
const buildReferenceSpecs = ({ refs: references, remote }: Properties): ReferenceSpecs => {
	interface AppendArguments {
		type: REF_TYPE
		name: string
		specs: Array<string>
	}

	const append = ({ type, name, specs }: AppendArguments): void => {
		switch (type) {
			case BRANCH: {
				specs.push(`refs/heads/${name}:refs/remotes/${remote}/${name}`)
				return
			}
			case TAG: {
				specs.push(`refs/tags/${name}:refs/tags/${name}`)
				return
			}
			default: {
				return never()
			}
		}
	}

	const [expectedSpecs, optionalSpecs]: [ReadonlyArray<string>, ReadonlyArray<string>] =
		references.reduce<[Array<string>, Array<string>]>(
			(
				[expectedReferenceSpecs, optionalReferenceSpecs],
				{ name, type = BRANCH, optional = false }
			) => {
				const specs = optional ? optionalReferenceSpecs : expectedReferenceSpecs
				append({ type, name, specs })

				return [expectedReferenceSpecs, optionalReferenceSpecs]
			},
			[[], []]
		)

	return isNonEmptyReadonlyArray(expectedSpecs) && isNonEmptyReadonlyArray(optionalSpecs)
		? [
				{ type: EXPECTED, refs: expectedSpecs },
				{ type: OPTIONAL, refs: optionalSpecs },
			]
		: isNonEmptyReadonlyArray(expectedSpecs)
			? [{ type: EXPECTED, refs: expectedSpecs }]
			: isNonEmptyReadonlyArray(optionalSpecs)
				? [{ type: OPTIONAL, refs: optionalSpecs }]
				: never()
}

export type { FetchReference, ReferenceSpecs }
export default buildReferenceSpecs
