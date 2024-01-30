import type { XisIssue } from "#core/error.js"
import { XisSync, type ExecResultSync } from "#core/sync.js"
import type { XisExecArgs } from "#core/args.js"
import { Left, Right } from "purify-ts/Either"
import type { XisMessages, XisMsgArgs, XisMsgBuilder } from "#core/messages.js"
import { Effect } from "#core/book-keeping.js"
import { stringify, type TruePrimitiveType } from "#util/base-type.js"

export interface LiteralIssue<L> extends XisIssue<"XIS_LITERAL"> {
	expected: L
	value: unknown
}

export type LiteralProps<L extends TruePrimitiveType> = {
	literal: L
}

export type LiteralMessageProps<L extends TruePrimitiveType> = {
	expected: L
	found: unknown
}

export interface LiteralMessages<L extends TruePrimitiveType>
	extends XisMessages<LiteralIssue<L>> {
	XIS_LITERAL: XisMsgBuilder<LiteralMessageProps<L>>
}

export interface LiteralArgs<L extends TruePrimitiveType> {
	props: LiteralProps<L>
	messages: LiteralMessages<L> | null
}

export class XisLiteral<const Literal extends TruePrimitiveType> extends XisSync<
	unknown,
	LiteralIssue<Literal>,
	Literal
> {
	#props: LiteralProps<Literal>
	#messages: LiteralMessages<Literal>

	constructor(args: LiteralArgs<Literal>) {
		super()
		this.#props = args.props
		this.#messages = args.messages ?? {
			XIS_LITERAL: (args: XisMsgArgs<LiteralMessageProps<Literal>>) => {
				const {
					input: { expected, found },
				} = args
				return `Expected ${stringify(expected)}, received ${stringify(found)}`
			},
		}
	}
	override get effect(): typeof Effect.Validate {
		return Effect.Validate
	}

	exec(args: XisExecArgs): ExecResultSync<LiteralIssue<Literal>, Literal> {
		const { value, path, locale, ctx } = args
		const { literal } = this.#props
		if (value === this.#props.literal) {
			return Right(value as Literal)
		}

		const message = this.#messages.XIS_LITERAL({
			input: {
				expected: literal,
				found: value,
			},
			path,
			locale,
			ctx,
		})

		const err = {
			name: "XIS_LITERAL" as const,
			path,
			expected: this.#props.literal,
			message,
			value,
		}
		return Left([err])
	}
}

export const literali18n = <const Literal extends TruePrimitiveType>(
	literal: Literal,
	messages: LiteralMessages<Literal>
): XisLiteral<Literal> =>
	new XisLiteral({
		messages,
		props: {
			literal,
		},
	})
export const literal = <const Literal extends TruePrimitiveType>(
	literal: Literal
): XisLiteral<Literal> =>
	new XisLiteral({
		messages: null,
		props: {
			literal,
		},
	})
