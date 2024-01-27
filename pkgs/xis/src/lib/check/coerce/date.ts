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

export type DateInput = Date | number | string

function isDateInput(valueType: string, value: unknown): value is DateInput {
	switch (valueType) {
		case "number":
		case "string":
		case "date":
			return true
		default:
			return false
	}
}

export class XisCoerceDate extends XisSync<unknown, CoerceIssue, Date> {
	#messages: XisCoerceMessages
	constructor(args: XisCoerceArgs) {
		super()
		this.#messages = args.messages ?? {
			XIS_COERCE,
		}
	}
	override get effect(): Effect {
		return Effect.Transform
	}
	exec(args: XisExecArgs): ExecResultSync<CoerceIssue, Date> {
		const { value, locale, path } = args
		const valueType = trueTypeOf(value)
		const date = isDateInput(valueType, value) ? new Date(value) : new Date(NaN)

		if (Number.isFinite(date.valueOf())) {
			return Right(date)
		}

		const message = this.#messages.XIS_COERCE({
			value,
			path,
			locale,
			ctx: null,
			props: {
				desired: "date",
				type: valueType,
			},
		})
		return coerceIssue({ desired: "date", message, received: value, type: valueType, path })
	}
}

export const date = (args: XisCoerceArgs) => new XisCoerceDate(args)
