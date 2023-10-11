import type { XisIssue } from "#core/error.js"

import { XisSync, type ExecResultSync, type ParseResultSync } from "#core/sync.js"

import type { XisCtxBase } from "#core/context.js"
import { Left, Right } from "purify-ts/Either"

export interface LiteralIssue<L> extends XisIssue<"LITERAL"> {
	expected: L
	value: unknown
}

export class XisLiteral<const Literal> extends XisSync<Literal, LiteralIssue<Literal>> {
	readonly #lit: Literal

	constructor(lit: Literal) {
		super()
		this.#lit = lit
	}

	parse(
		value: unknown,
		ctx: XisCtxBase
	): ParseResultSync<LiteralIssue<Literal>, never, Literal> {
		if (value === this.#lit) {
			return Right(value as Literal)
		}
		const err = {
			name: "LITERAL",
			path: ctx.path,
			expected: this.#lit,
			value,
		} satisfies LiteralIssue<Literal>
		return Left([err])
	}

	exec(value: Literal): ExecResultSync<never, Literal> {
		return Right(value)
	}
}

export const literal = <const Literal>(literal: Literal): XisLiteral<Literal> =>
	new XisLiteral(literal)
