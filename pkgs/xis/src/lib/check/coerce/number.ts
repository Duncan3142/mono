import { type ExecResultSync, XisSync } from "#core/sync.js"
import { trueTypeOf } from "#util/base-type.js"
import { Right } from "purify-ts/Either"

import {
	coerceIssue,
	XIS_COERCE,
	type CoerceIssue,
	type XisCoerceMessages,
	type XisCoerceArgs,
} from "./core.js"
import type { XisExecArgs } from "#core/args.js"
import { Effect } from "#core/book-keeping.js"

export class XisCoerceNumber extends XisSync<
	unknown,
	CoerceIssue,
	number,
	typeof Effect.Transform
> {
	#messages: XisCoerceMessages
	constructor(args: XisCoerceArgs) {
		super()
		this.#messages = args.messages ?? {
			XIS_COERCE,
		}
	}
	override get effect(): typeof Effect.Transform {
		return Effect.Transform
	}
	exec(args: XisExecArgs): ExecResultSync<CoerceIssue, number> {
		const { value, locale, path, ctx } = args
		const valueType = trueTypeOf(value)
		const num = valueType === "symbol" ? NaN : Number(value)

		if (Number.isFinite(num)) {
			return Right(num)
		}

		const message = this.#messages.XIS_COERCE({
			path,
			locale,
			ctx,
			input: {
				value,
				desired: "number",
				type: valueType,
			},
		})
		return coerceIssue({ desired: "number", received: value, type: valueType, path, message })
	}
}

export const numberi18n = (messages: XisCoerceMessages) =>
	new XisCoerceNumber({
		messages,
	})
export const number = () =>
	new XisCoerceNumber({
		messages: null,
	})
