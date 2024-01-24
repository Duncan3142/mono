import type { XisExecArgs } from "#core/args.js"
import type { XisIssue } from "#core/error.js"
import type { XisMessages, XisMsgArgs, XisMsgBuilder } from "#core/messages.js"
import { XisSync, type ExecResultSync } from "#core/sync.js"
import { Left, Right } from "purify-ts/Either"

export type NaNIssue = XisIssue<"XIS_NAN">

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
				const { value, path } = args
				return `${value} at ${JSON.stringify(path)} is not a NaN`
			},
		}
	}
	exec(args: XisExecArgs<number>): ExecResultSync<NaNIssue, number> {
		const { value, ctx, locale, path } = args
		if (Number.isNaN(value)) {
			return Right(value)
		}

		const message = this.#messages.XIS_NAN({
			value,
			path,
			locale,
			props: null,
			ctx,
		})

		const err = {
			name: "XIS_NAN" as const,
			message,
			path,
		}
		return Left([err])
	}
}

export const isNaN = (args: XisNaNArgs) => new XisNan(args)
