import type { XisIssue } from "#core/error.js"

import { XisSync, type ExecResultSync } from "#core/sync.js"
import type { XisExecArgs } from "#core/args.js"
import { Left } from "purify-ts/Either"
import type { XisMsgBuilder, XisMessages, XisMsgArgs } from "#core/messages.js"
import { Effect } from "#core/book-keeping.js"

export interface NeverIssue extends XisIssue<"XIS_NEVER"> {
	value: unknown
}

export interface NeverMessages extends XisMessages<NeverIssue> {
	XIS_NEVER: XisMsgBuilder
}

export type NeverArgs = {
	messages: NeverMessages | null
}

export class XisNever extends XisSync<unknown, NeverIssue, never> {
	#messages: NeverMessages
	constructor(args: NeverArgs) {
		super()
		this.#messages = args.messages ?? {
			XIS_NEVER: (args: XisMsgArgs) => {
				const { input, path } = args
				const valueStr = typeof input === "string" ? `"${input}"` : String(input)
				return `never value ${valueStr} encountered at ${JSON.stringify(path)}`
			},
		}
	}
	override get effect(): Effect {
		return Effect.Validate
	}
	exec(args: XisExecArgs<unknown, null>): ExecResultSync<NeverIssue, never> {
		const { value, path, locale } = args
		const message = this.#messages.XIS_NEVER({
			input: value,
			path,
			locale,
			ctx: null,
		})
		const err = {
			name: "XIS_NEVER" as const,
			path,
			message,
			value,
		}
		return Left([err])
	}
}

export const never = (props: NeverArgs) => new XisNever(props)
