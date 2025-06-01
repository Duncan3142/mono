import type { YieldableError } from "effect/Cause"

/**
 * Tagged error type
 */
// eslint-disable-next-line @typescript-eslint/no-invalid-void-type -- Compatibility with TaggedError
type TaggedErrorCtor<Tag extends string> = new (args: void) => YieldableError & {
	readonly _tag: Tag
}

/**
 * Tagged error type with additional properties
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Contravariant type for constructor
type TaggedErrorExCtor<Tag extends string> = new <A extends Record<string, any>>(args: {
	readonly [P in keyof A as P extends "_tag" ? never : P]: A[P]
}) => YieldableError & { readonly _tag: Tag } & Readonly<A>

export type { TaggedErrorCtor, TaggedErrorExCtor }
