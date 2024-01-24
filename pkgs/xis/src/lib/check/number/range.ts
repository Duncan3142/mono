import type { XisIssue } from "#core/error.js"
import { inRange, type RangeOpts } from "#util/rangeOpts.js"
import { Left, Right } from "purify-ts/Either"
import { XisSync, type ExecResultSync } from "#core/sync.js"
import type { XisMessages, XisMsgArgs, XisMsgBuilder } from "#core/messages.js"
import type { XisExecArgs } from "#core/args.js"

export type NumberRangeOpts = RangeOpts<number>

export type NumberRangeProps = {
	opts: NumberRangeOpts
}

export interface NumberRangeIssue extends XisIssue<"XIS_NUMBER_RANGE"> {
	received: number
	opts: NumberRangeOpts
}

export interface NumberRangeMessages extends XisMessages<NumberRangeIssue> {
	XIS_NUMBER_RANGE: XisMsgBuilder<number, NumberRangeProps>
}

export interface NumberRangeArgs {
	messages: NumberRangeMessages | null
	props: NumberRangeProps
}

export class XisRange extends XisSync<number, NumberRangeIssue> {
	#props: NumberRangeProps
	#messages: NumberRangeMessages

	constructor(args: NumberRangeArgs) {
		super()
		const { messages, props } = args
		this.#messages = messages ?? {
			XIS_NUMBER_RANGE: (args: XisMsgArgs<number, NumberRangeProps>) => {
				const {
					value,
					path,
					props: { opts },
				} = args
				return `${value} at ${JSON.stringify(path)} is not in range ${JSON.stringify(opts)}`
			},
		}
		this.#props = props
	}

	exec(args: XisExecArgs<number>): ExecResultSync<NumberRangeIssue, number> {
		const { opts } = this.#props
		const { locale, value, ctx, path } = args

		if (inRange(value, opts)) {
			return Right(value)
		}

		const message = this.#messages.XIS_NUMBER_RANGE({
			value,
			path,
			locale,
			props: { opts },
			ctx,
		})

		const err = {
			name: "XIS_NUMBER_RANGE" as const,
			path,
			received: value,
			message,
			opts,
		}
		return Left([err])
	}
}

export const range = (args: NumberRangeArgs): XisRange => new XisRange(args)
