import type { XisExecArgs } from "#core/args.js"
import { Effect } from "#core/book-keeping.js"
import type { XisIssue } from "#core/error.js"
import type { XisMessages, XisMsgArgs, XisMsgBuilder } from "#core/messages.js"
import { XisSync, type ExecResultSync } from "#core/sync.js"
import { Left, Right } from "purify-ts/Either"

export type IntegerIssue = XisIssue<"XIS_INTEGER">

export interface XisIntegerMessages extends XisMessages<IntegerIssue> {
	XIS_INTEGER: XisMsgBuilder<number>
}

export interface XisIntegerArgs {
	messages: XisIntegerMessages | null
}

export class XisInteger extends XisSync<number, IntegerIssue> {
	#messages: XisIntegerMessages
	constructor(args: XisIntegerArgs) {
		super()
		const { messages } = args
		this.#messages = messages ?? {
			XIS_INTEGER: (args: XisMsgArgs<number>) => {
				const { value, path } = args
				return `${value} at ${JSON.stringify(path)} is not an integer`
			},
		}
	}
	override get effect(): Effect {
		return Effect.Validate
	}
	exec(args: XisExecArgs<number>): ExecResultSync<IntegerIssue, number> {
		const { value, ctx, locale, path } = args
		if (Number.isInteger(value)) {
			return Right(value)
		}

		const message = this.#messages.XIS_INTEGER({
			value,
			path,
			locale,
			props: null,
			ctx,
		})

		const err = {
			name: "XIS_INTEGER" as const,
			message,
			path,
		}
		return Left([err])
	}
}

export const isInteger = (args: XisIntegerArgs) => new XisInteger(args)
