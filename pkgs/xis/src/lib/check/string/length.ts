import type { XisIssue } from "#core/error.js"
import { inRange, type RangeOpts } from "#util/rangeOpts.js"
import { Left, Right } from "purify-ts/Either"
import { XisSync, type ExecResultSync } from "#core/sync.js"
import type { XisExecArgs } from "#core/args.js"
import type { XisMessages, XisMsgBuilder } from "#core/messages.js"
import { Effect } from "#core/book-keeping.js"

export type StringLengthOpts = RangeOpts<number>

export class XisToLength extends XisSync<string, never, number> {
	override get effect(): Effect {
		return Effect.Transform
	}
	exec(args: XisExecArgs<string>): ExecResultSync<never, number> {
		const { value } = args
		return Right(value.length)
	}
}

export const toLength: XisToLength = new XisToLength()

export interface StringLengthIssue extends XisIssue<"XIS_STRING_LENGTH"> {
	length: number
	opts: StringLengthOpts
}

export type StringLengthProps<Opts extends StringLengthOpts> = {
	opts: Opts
}

export interface StringLengthMessages<Opts extends StringLengthOpts>
	extends XisMessages<StringLengthIssue> {
	XIS_STRING_LENGTH: XisMsgBuilder<string, StringLengthProps<Opts>>
}

export interface StringLengthArgs<Opts extends StringLengthOpts> {
	props: StringLengthProps<Opts>
	message: StringLengthMessages<Opts>
}

export class XisIsLength<Opts extends StringLengthOpts> extends XisSync<
	string,
	StringLengthIssue
> {
	#props: StringLengthProps<Opts>
	#message: StringLengthMessages<Opts>

	constructor(args: StringLengthArgs<Opts>) {
		super()
		const { props, message } = args
		this.#props = props
		this.#message = message
	}

	override get effect(): Effect {
		return Effect.Validate
	}
	exec(args: XisExecArgs<string>): ExecResultSync<StringLengthIssue, string> {
		const { value, path, locale } = args
		const { opts } = this.#props

		if (inRange(value.length, opts)) {
			return Right(value)
		}

		const message = this.#message.XIS_STRING_LENGTH({
			value,
			locale,
			path,
			props: this.#props,
			ctx: null,
		})

		const err = {
			name: "XIS_STRING_LENGTH" as const,
			path,
			message,
			length: value.length,
			opts,
		}

		return Left([err])
	}
}

export const isLength = <Opts extends StringLengthOpts>(
	args: StringLengthArgs<Opts>
): XisIsLength<Opts> => new XisIsLength(args)
