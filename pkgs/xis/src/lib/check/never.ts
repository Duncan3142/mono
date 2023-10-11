import type { XisIssue } from "#core/error.js"

import { XisSync, type ExecResultSync, type ParseResultSync } from "#core/sync.js"
import type { XisCtxBase } from "#core/context.js"
import { Left } from "purify-ts/Either"

export interface NeverIssue extends XisIssue<"NEVER"> {
	value: unknown
}

const neverIssue = (value: unknown, ctx: XisCtxBase): ExecResultSync<NeverIssue, never> => {
	const err = {
		name: "NEVER",
		path: ctx.path,
		value,
	} satisfies NeverIssue
	return Left([err])
}

export class XisNever extends XisSync<never, NeverIssue, NeverIssue> {
	parse(value: unknown, ctx: XisCtxBase): ParseResultSync<NeverIssue, NeverIssue, never> {
		return neverIssue(value, ctx)
	}
	exec(value: never, ctx: XisCtxBase): ExecResultSync<NeverIssue, never> {
		return neverIssue(value, ctx)
	}
}

export const never: XisNever = new XisNever()
