import type { XisExecArgs } from "#core/args.js"
import { Effect } from "#core/book-keeping.js"
import { XisSync, type ExecResultSync } from "#core/sync.js"
import { Right } from "purify-ts/Either"

export interface XisToStringProps {
	radix: number
}

export interface XisToStringArgs {
	props: XisToStringProps
}

export class XisToString extends XisSync<number, never, string> {
	#props

	constructor(args: XisToStringArgs) {
		super()
		this.#props = args.props
	}
	override get effect(): Effect {
		return Effect.Transform
	}

	exec(args: XisExecArgs<number>): ExecResultSync<never, string> {
		const { radix } = this.#props
		const { value } = args

		return Right(value.toString(radix))
	}
}

export const toString = (args: XisToStringArgs): XisToString => new XisToString(args)
