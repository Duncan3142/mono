import type { XisExecArgs } from "#core/args.js"
import { Effect } from "#core/book-keeping.js"
import type { XisIssue } from "#core/error.js"
import type { XisMessages, XisMsgArgs, XisMsgBuilder } from "#core/messages.js"
import { XisSync, type ExecResultSync } from "#core/sync.js"
import { Left, Right } from "purify-ts/Either"

export interface NaNIssue extends XisIssue<"XIS_NAN"> {
	value: number
}

export interface XisNaNMessages extends XisMessages<NaNIssue> {
	XIS_NAN: XisMsgBuilder<number>
}

export interface XisNaNArgs {
	messages: XisNaNMessages | null
}

export class XisNan extends XisSync<number, NaNIssue> {
	#messages: XisNaNMessages
	constructor(args: XisNaNArgs) {
		super()
		const { messages } = args
		this.#messages = messages ?? {
			XIS_NAN: (args: XisMsgArgs<number>) => {
				const { input } = args
				return `${input} is not a NaN`
			},
		}
	}
	override get effect(): typeof Effect.Validate {
		return Effect.Validate
	}
	exec(args: XisExecArgs<number>): ExecResultSync<NaNIssue, number> {
		const { value, ctx, locale, path } = args
		if (Number.isNaN(value)) {
			return Right(value)
		}

		const message = this.#messages.XIS_NAN({
			input: value,
			path,
			locale,
			ctx,
		})

		const err = {
			name: "XIS_NAN" as const,
			message,
			value,
			path,
		}
		return Left([err])
	}
}

export const isNaNi18n = (messages: XisNaNMessages) =>
	new XisNan({
		messages,
	})
export const isNaN = () =>
	new XisNan({
		messages: null,
	})
