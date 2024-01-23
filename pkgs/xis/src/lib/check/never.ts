import type { XisIssue } from "#core/error.js"

import { XisSync, type ExecResultSync } from "#core/sync.js"
import type { XisExecArgs } from "#core/args.js"
import { Left } from "purify-ts/Either"
import type { XisMsgBuilder, XisMessages, XisMsgArgs } from "#core/messages.js"

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
				const { value, path } = args
				const valueStr = typeof value === "string" ? `"${value}"` : String(value)
				return `never value ${valueStr} encountered at ${JSON.stringify(path)}`
			},
		}
	}

	exec(args: XisExecArgs<unknown, null>): ExecResultSync<NeverIssue, never> {
		const { value, path } = args
		const message = this.#messages.XIS_NEVER({
			value,
			path,
			ctx: null,
			props: null,
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
