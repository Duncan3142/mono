import type { XisIssue } from "#core/error.js"
import { inRange, type RangeOpts } from "#util/rangeOpts.js"
import { Left, Right } from "purify-ts/Either"
import { XisSync, type ExecResultSync } from "#core/sync.js"
import type { XisMessages, XisMsgArgs, XisMsgBuilder } from "#core/messages.js"
import type { XisExecArgs } from "#core/args.js"
import { Effect } from "#core/book-keeping.js"

export type NumberRangeOpts = RangeOpts<number>

export type NumberRangeProps = {
	opts: NumberRangeOpts
}

export interface NumberRangeIssue extends XisIssue<"XIS_NUMBER_RANGE"> {
	received: number
	opts: NumberRangeOpts
}

export interface NumberRangeMessageProps {
	value: number
	opts: NumberRangeOpts
}

export interface NumberRangeMessages extends XisMessages<NumberRangeIssue> {
	XIS_NUMBER_RANGE: XisMsgBuilder<NumberRangeMessageProps>
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
			XIS_NUMBER_RANGE: (args: XisMsgArgs<NumberRangeMessageProps>) => {
				const {
					input: { value, opts },
					path,
				} = args
				return `${value} at ${JSON.stringify(path)} is not in range ${JSON.stringify(opts)}`
			},
		}
		this.#props = props
	}

	override get effect(): typeof Effect.Validate {
		return Effect.Validate
	}

	exec(args: XisExecArgs<number>): ExecResultSync<NumberRangeIssue, number> {
		const { opts } = this.#props
		const { locale, value, ctx, path } = args

		if (inRange(value, opts)) {
			return Right(value)
		}

		const message = this.#messages.XIS_NUMBER_RANGE({
			input: { value, opts },
			path,
			locale,
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

export const rangei18n = (opts: NumberRangeOpts, messages: NumberRangeMessages): XisRange =>
	new XisRange({
		props: { opts },
		messages,
	})
export const range = (opts: NumberRangeOpts): XisRange =>
	new XisRange({
		props: { opts },
		messages: null,
	})
