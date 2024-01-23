import type { XisIssue } from "#core/error.js"

import { XisSync, type ExecResultSync } from "#core/sync.js"
import type { XisArgs } from "#core/context.js"
import { Left } from "purify-ts/Either"

export interface NeverIssue extends XisIssue<"XIS_NEVER"> {
	value: unknown
}

export type NeverMessages = {
	XIS_NEVER?: string
} | null

export type NeverProps = {
	messages: NeverMessages
}

export class XisNever extends XisSync<unknown, NeverIssue, never, NeverMessages> {
	#props: NeverProps
	constructor(props: NeverProps) {
		super()
		this.#props = props
	}
	exec(args: XisArgs<unknown, NeverMessages, null>): ExecResultSync<NeverIssue, never> {
		const { value, messages, path } = args
		const message =
			this.#props?.messages?.XIS_NEVER ?? messages?.XIS_NEVER ?? "never value encountered"
		const err = {
			name: "XIS_NEVER" as const,
			path,
			message,
			value,
		}
		return Left([err])
	}
}

export const never = (props: NeverProps) => new XisNever(props)
