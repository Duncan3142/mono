import type { XisIssue } from "#core/error.js"
import type { BasicArg } from "#util/arg.js"
import { XisSync, type ExecResultSync } from "#core/sync.js"

import type { XisExecArgs } from "#core/args.js"
import { Left, Right } from "purify-ts/Either"
import type { XisMessages, XisMsgArgs, XisMsgBuilder } from "#core/messages.js"
import { Effect } from "#core/book-keeping.js"

export interface LiteralIssue<L> extends XisIssue<"XIS_LITERAL"> {
	expected: L
	value: unknown
}

export type LiteralProps<L extends BasicArg> = {
	literal: L
}

export interface LiteralMessages<L extends BasicArg> extends XisMessages<LiteralIssue<L>> {
	XIS_LITERAL: XisMsgBuilder<unknown, LiteralProps<L>>
}

export interface LiteralArgs<L extends BasicArg> {
	props: LiteralProps<L>
	messages: LiteralMessages<L> | null
}

export class XisLiteral<const Literal extends BasicArg> extends XisSync<
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
			XIS_LITERAL: (args: XisMsgArgs<unknown, LiteralProps<Literal>>) =>
				`Value "${String(args.value)}" is not literal ${String(args.props.literal)}`,
		}
	}
	override get effect(): Effect {
		return Effect.Validate
	}

	exec(args: XisExecArgs<unknown, null>): ExecResultSync<LiteralIssue<Literal>, Literal> {
		const { value, path, locale } = args
		if (value === this.#props.literal) {
			return Right(value as Literal)
		}

		const message = this.#messages.XIS_LITERAL({
			value,
			path,
			locale,
			props: this.#props,
			ctx: null,
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

export const literal = <const Literal extends BasicArg>(
	args: LiteralArgs<Literal>
): XisLiteral<Literal> => new XisLiteral(args)
