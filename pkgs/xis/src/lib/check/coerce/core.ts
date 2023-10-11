import type { TrueBaseTypeName } from "#util/base-type.js"
import type { XisCtxBase } from "#core/context.js"
import type { XisIssue } from "#core/error.js"
import type { ExecResultSync } from "#core/sync.js"
import { Left } from "purify-ts/Either"

export interface CoerceIssue<N extends TrueBaseTypeName> extends XisIssue<"COERCE"> {
	desired: N
	received: unknown
	type: TrueBaseTypeName
}

export const coerceErr = <D extends TrueBaseTypeName>(
	desired: D,
	value: unknown,
	type: TrueBaseTypeName,
	ctx: XisCtxBase
): ExecResultSync<CoerceIssue<D>, never> => {
	const err = [
		{
			name: "COERCE",
			desired,
			received: value,
			type,
			path: ctx.path,
		} satisfies CoerceIssue<D>,
	]

	return Left(err)
}
