import type { XisExecArgs } from "#core/args.js"
import { Effect } from "#core/book-keeping.js"
import type { XisIssue } from "#core/error.js"
import type { XisMessages, XisMsgArgs, XisMsgBuilder } from "#core/messages.js"
import { XisSync, type ExecResultSync } from "#core/sync.js"
import { Left, Right } from "purify-ts/Either"

export type FiniteIssue = XisIssue<"XIS_FINITE">

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
				const { value, path } = args
				return `${value} at ${JSON.stringify(path)} is not a finite`
			},
		}
	}
	override get effect(): Effect {
		return Effect.Validate
	}
	exec(args: XisExecArgs<number>): ExecResultSync<FiniteIssue, number> {
		const { value, ctx, locale, path } = args
		if (Number.isFinite(value)) {
			return Right(value)
		}

		const message = this.#messages.XIS_FINITE({
			value,
			path,
			locale,
			props: null,
			ctx,
		})

		const err = {
			name: "XIS_FINITE" as const,
			message,
			path,
		}
		return Left([err])
	}
}

export const isFinite = (args: XisFiniteArgs) => new XisFinite(args)
