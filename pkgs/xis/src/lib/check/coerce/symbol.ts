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

export type SymbolInput = number | string | undefined

export class XisCoerceSymbol extends XisSync<
	unknown,
	CoerceIssue,
	symbol,
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
	exec(args: XisExecArgs): ExecResultSync<CoerceIssue, symbol> {
		const { value, locale, path, ctx } = args
		const valueType = trueTypeOf(value)
		switch (typeof value) {
			case "number":
			case "string":
			case "undefined":
				return Right(Symbol(value))
			default: {
				const message = this.#messages.XIS_COERCE({
					path,
					locale,
					ctx,
					input: {
						value,
						desired: "symbol",
						type: valueType,
					},
				})
				return coerceIssue({
					desired: "symbol",
					message,
					received: value,
					type: valueType,
					path,
				})
			}
		}
	}
}

export const symboli18n = (messages: XisCoerceMessages) =>
	new XisCoerceSymbol({
		messages,
	})
export const symbol = () =>
	new XisCoerceSymbol({
		messages: null,
	})
