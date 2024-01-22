import type { XisIssue } from "#core/error.js"

import { XisSync, type ExecResultSync } from "#core/sync.js"
import type { XisArgs } from "#core/context.js"
import { Left } from "purify-ts/Either"

export interface NeverIssue extends XisIssue<"NEVER"> {
	value: unknown
}

export type NeverMessages = {
	NEVER?: string
}

export class XisNever extends XisSync<unknown, NeverIssue, never, NeverMessages> {
	exec(args: XisArgs<unknown, NeverMessages, null>): ExecResultSync<NeverIssue, never> {
		const { value, messages, path } = args
		const message = messages?.NEVER ?? "Value is never"
		const err = {
			name: "NEVER" as const,
			path,
			message,
			value,
		}
		return Left([err])
	}
}

export const never: XisNever = new XisNever()
