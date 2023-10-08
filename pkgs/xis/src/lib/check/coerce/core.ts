import type { TrueBaseTypeName } from "#util/base-type.js"
import type { XisIssue } from "#core/error.js"
import type { ExecResultSync } from "#core/sync.js"
import { Left } from "purify-ts/Either"
import type { XisPath } from "#core/path.js"
import type { XisMessages, XisMsgArgs, XisMsgBuilder } from "#core/messages.js"

export interface CoerceIssue extends XisIssue<"XIS_COERCE"> {
	desired: TrueBaseTypeName
	received: unknown
	type: TrueBaseTypeName
}

export interface CoerceIssueProps {
	desired: TrueBaseTypeName
	received: unknown
	type: TrueBaseTypeName
	path: XisPath
	message: string
}

export type CoerceIssueMsgProps = {
	value: unknown
	desired: TrueBaseTypeName
	type: TrueBaseTypeName
}

export type XIS_COERCE_MSG = XisMsgBuilder<CoerceIssueMsgProps>

export interface XisCoerceMessages extends XisMessages<CoerceIssue> {
	XIS_COERCE: XisMsgBuilder<CoerceIssueMsgProps>
}

export interface XisCoerceArgs {
	messages: XisCoerceMessages | null
}

export const XIS_COERCE = (args: XisMsgArgs<CoerceIssueMsgProps>) => {
	const {
		input: { desired, type },
	} = args
	return `Unable to coerce ${type} to ${desired}`
}

export const coerceIssue = (props: CoerceIssueProps): ExecResultSync<CoerceIssue, never> => {
	const { desired, received, type, path, message } = props
	const err = [
		{
			name: "XIS_COERCE" as const,
			desired,
			received,
			type,
			message,
			path,
		},
	]

	return Left(err)
}
