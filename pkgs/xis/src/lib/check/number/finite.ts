import type { XisExecArgs } from "#core/args.js"
import { Effect } from "#core/book-keeping.js"
import type { XisIssue } from "#core/error.js"
import type { XisMessages, XisMsgArgs, XisMsgBuilder } from "#core/messages.js"
import { XisSync, type ExecResultSync } from "#core/sync.js"
import { Left, Right } from "purify-ts/Either"

export interface FiniteIssue extends XisIssue<"XIS_FINITE"> {
	value: number
}

export interface XisFiniteMessages extends XisMessages<FiniteIssue> {
	XIS_FINITE: XisMsgBuilder<number>
}

export interface XisFiniteArgs {
	messages: XisFiniteMessages | null
}

export class XisFinite extends XisSync<number, FiniteIssue> {
	#messages: XisFiniteMessages
	constructor(args: XisFiniteArgs) {
		super()
		const { messages } = args
		this.#messages = messages ?? {
			XIS_FINITE: (args: XisMsgArgs<number>) => {
				const { input } = args
				return `${input} is not finite`
			},
		}
	}
	override get effect(): typeof Effect.Validate {
		return Effect.Validate
	}
	exec(args: XisExecArgs<number>): ExecResultSync<FiniteIssue, number> {
		const { value, ctx, locale, path } = args
		if (Number.isFinite(value)) {
			return Right(value)
		}

		const message = this.#messages.XIS_FINITE({
			input: value,
			path,
			locale,
			ctx,
		})

		const err = {
			name: "XIS_FINITE" as const,
			message,
			value,
			path,
		}
		return Left([err])
	}
}

export const isFinite = () => new XisFinite({ messages: null })
export const isFinitei18n = (messages: XisFiniteMessages) =>
	new XisFinite({
		messages,
	})
