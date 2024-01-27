import type { XisIssue } from "#core/error.js"
import type { XisMsgArgs, XisMsgBuilder } from "#core/messages.js"
import { type XisPath } from "#core/path.js"
import type { BaseProp, TruePropertyKey } from "#util/base-type.js"

export interface ExtraPropertyIssue extends XisIssue<"XIS_EXTRA_PROPERTY"> {
	key: TruePropertyKey
	value: unknown
}

export type XIS_EXTRA_PROPERTY = XisMsgBuilder<BaseProp>

export const XIS_EXTRA_PROPERTY = (args: XisMsgArgs<BaseProp>) => {
	const { value, path } = args
	const [key, val] = value
	return `object has extra property "${String(key)}", with value ${JSON.stringify(val)}, at path "${JSON.stringify(path)}"`
}

export interface ExtraIssuesArgs {
	extraEntries: Array<BaseProp>
	locale: string
	msgBuilder: XIS_EXTRA_PROPERTY
	path: XisPath
}

export const extraIssues = (args: ExtraIssuesArgs): Array<ExtraPropertyIssue> => {
	const { extraEntries, locale, msgBuilder, path } = args
	return extraEntries.map(([key, value]) => {
		return {
			name: "XIS_EXTRA_PROPERTY",
			value,
			message: msgBuilder({ value: [key, value], path, locale, props: null, ctx: null }),
			path,
			key,
		}
	})
}
