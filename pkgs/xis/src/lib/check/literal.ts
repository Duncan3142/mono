import type { XisIssue } from "#core/error.js"

import { XisSync, type ExecResultSync } from "#core/sync.js"

import type { XisArgs } from "#core/context.js"
import { Left, Right } from "purify-ts/Either"

export interface LiteralIssue<L> extends XisIssue<"XIS_LITERAL"> {
	expected: L
	value: unknown
}

export type LiteralMessages<L> = {
	XIS_LITERAL?: (args: { value: unknown; expected: L }) => string
} | null

export interface LiteralProps<L> {
	literal: L
	messages?: LiteralMessages<L>
}

export class XisLiteral<const Literal> extends XisSync<
	unknown,
	LiteralIssue<Literal>,
	Literal,
	LiteralMessages<Literal>
> {
	readonly #props: LiteralProps<Literal>

	constructor(props: LiteralProps<Literal>) {
		super()
		this.#props = props
	}

	exec(
		args: XisArgs<unknown, LiteralMessages<Literal>, null>
	): ExecResultSync<LiteralIssue<Literal>, Literal> {
		const { value, path, messages } = args
		if (value === this.#props.literal) {
			return Right(value as Literal)
		}

		const builder =
			this.#props?.messages?.XIS_LITERAL ??
			messages?.XIS_LITERAL ??
			((args: { value: unknown; expected: Literal }) =>
				`Value "${String(args.value)}" is not literal ${String(args.expected)}`)

		const err = {
			name: "XIS_LITERAL" as const,
			path,
			expected: this.#props.literal,
			message: builder({ value, expected: this.#props.literal }),
			value,
		}
		return Left([err])
	}
}

export const literal = <const Literal>(props: LiteralProps<Literal>): XisLiteral<Literal> =>
	new XisLiteral(props)
