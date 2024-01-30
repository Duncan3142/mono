import type { XisExecArgs } from "#core/args.js"
import { Effect } from "#core/book-keeping.js"
import type { XisIssue } from "#core/error.js"
import type { XisMessages, XisMsgArgs, XisMsgBuilder } from "#core/messages.js"
import { XisSync, type ExecResultSync } from "#core/sync.js"
import { Left, Right } from "purify-ts/Either"

export interface IntegerIssue extends XisIssue<"XIS_INTEGER"> {
	value: number
}

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
				const { input } = args
				return `Expected integer, received ${input}`
			},
		}
	}
	override get effect(): typeof Effect.Validate {
		return Effect.Validate
	}
	exec(args: XisExecArgs<number>): ExecResultSync<IntegerIssue, number> {
		const { value, ctx, locale, path } = args
		if (Number.isInteger(value)) {
			return Right(value)
		}

		const message = this.#messages.XIS_INTEGER({
			input: value,
			path,
			locale,
			ctx,
		})

		const err = {
			name: "XIS_INTEGER" as const,
			message,
			value,
			path,
		}
		return Left([err])
	}
}

export const isIntegeri18n = (messages: XisIntegerMessages) =>
	new XisInteger({
		messages,
	})
export const isInteger = () =>
	new XisInteger({
		messages: null,
	})
