import type { XisExecArgs } from "#core/args.js"
import type { XisIssue } from "#core/error.js"
import type { XisMessages, XisMsgArgs, XisMsgBuilder } from "#core/messages.js"
import { XisSync, type ExecResultSync } from "#core/sync.js"
import { Left, Right } from "purify-ts/Either"

export type NumberDivisibleProps = {
	divisor: number
}

export interface NumberDivisibleIssue extends XisIssue<"XIS_DIVISIBLE"> {
	value: number
	divisor: number
	remainder: number
}

export type NumberDivisibleMsgProps = NumberDivisibleProps & { remainder: number }

export interface XisDivisibleMessages extends XisMessages<NumberDivisibleIssue> {
	XIS_DIVISIBLE: XisMsgBuilder<number, NumberDivisibleMsgProps>
}

export interface XisDivisibleArgs {
	props: NumberDivisibleProps
	messages: XisDivisibleMessages | null
}

export class XisDivisible extends XisSync<number, NumberDivisibleIssue> {
	#messages: XisDivisibleMessages
	#props: NumberDivisibleProps
	constructor(args: XisDivisibleArgs) {
		super()
		const { messages, props } = args
		this.#props = props
		this.#messages = messages ?? {
			XIS_DIVISIBLE: (args: XisMsgArgs<number, NumberDivisibleMsgProps>) => {
				const { value, path } = args
				return `${value} at ${JSON.stringify(path)} is not a finite`
			},
		}
	}
	exec(args: XisExecArgs<number>): ExecResultSync<NumberDivisibleIssue, number> {
		const { value, ctx, locale, path } = args
		const { divisor } = this.#props

		const remainder = value % divisor
		if (remainder === 0) {
			return Right(value)
		}

		const message = this.#messages.XIS_DIVISIBLE({
			value,
			path,
			locale,
			props: { ...this.#props, remainder },
			ctx,
		})

		const err = {
			name: "XIS_DIVISIBLE" as const,
			path,
			value,
			message,
			divisor,
			remainder,
		}
		return Left([err])
	}
}

export const isDivisible = (args: XisDivisibleArgs) => new XisDivisible(args)
