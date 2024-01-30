import type { XisIssue } from "#core/error.js"
import { inRange, type RangeOpts } from "#util/rangeOpts.js"
import { Left, Right } from "purify-ts/Either"
import { XisSync, type ExecResultSync } from "#core/sync.js"
import type { XisExecArgs } from "#core/args.js"
import type { XisMessages, XisMsgArgs, XisMsgBuilder } from "#core/messages.js"
import { Effect } from "#core/book-keeping.js"

export type StringLengthOpts = RangeOpts<number>

export class XisToLength extends XisSync<string, never, number, typeof Effect.Transform> {
	override get effect(): typeof Effect.Transform {
		return Effect.Transform
	}
	exec(args: XisExecArgs<string>): ExecResultSync<never, number> {
		const { value } = args
		return Right(value.length)
	}
}

export const toLength = () => new XisToLength()

export interface StringLengthIssue extends XisIssue<"XIS_STRING_LENGTH"> {
	length: number
	value: string
	opts: StringLengthOpts
}

export type StringLengthProps<Opts extends StringLengthOpts> = {
	opts: Opts
}

export interface StringLengthMessageProps {
	value: string
	opts: StringLengthOpts
}

export interface StringLengthMessages extends XisMessages<StringLengthIssue> {
	XIS_STRING_LENGTH: XisMsgBuilder<StringLengthMessageProps>
}

export interface StringLengthArgs<Opts extends StringLengthOpts> {
	props: StringLengthProps<Opts>
	messages: StringLengthMessages | null
}

export class XisIsLength<Opts extends StringLengthOpts> extends XisSync<
	string,
	StringLengthIssue
> {
	#props: StringLengthProps<Opts>
	#messages: StringLengthMessages

	constructor(args: StringLengthArgs<Opts>) {
		super()
		const { props, messages } = args
		this.#props = props
		this.#messages = messages ?? {
			XIS_STRING_LENGTH: (args: XisMsgArgs<StringLengthMessageProps>) => {
				const {
					input: { value, opts },
				} = args

				return `"${value}" length is not in range ${JSON.stringify(opts)}`
			},
		}
	}

	override get effect(): typeof Effect.Validate {
		return Effect.Validate
	}
	exec(args: XisExecArgs<string>): ExecResultSync<StringLengthIssue, string> {
		const { value, path, locale, ctx } = args
		const { opts } = this.#props

		if (inRange(value.length, opts)) {
			return Right(value)
		}

		const message = this.#messages.XIS_STRING_LENGTH({
			input: {
				value,
				opts,
			},
			locale,
			path,
			ctx,
		})

		const err = {
			name: "XIS_STRING_LENGTH" as const,
			path,
			message,
			value,
			length: value.length,
			opts,
		}

		return Left([err])
	}
}

export const isLengthi18n = <Opts extends StringLengthOpts>(
	opts: Opts,
	messages: StringLengthMessages
): XisIsLength<Opts> =>
	new XisIsLength({
		messages,
		props: { opts },
	})

export const isLength = <Opts extends StringLengthOpts>(opts: Opts): XisIsLength<Opts> =>
	new XisIsLength({
		messages: null,
		props: { opts },
	})
