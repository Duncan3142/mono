import { type ExecResultSync, XisSync } from "#core/sync.js"
import { trueTypeOf } from "#util/base-type.js"
import { Right } from "purify-ts/Either"
import { coerceIssue, XIS_COERCE, type CoerceIssue, type XisCoerceMessages } from "./core.js"
import type { XisExecArgs } from "#core/args.js"

export type SymbolInput = number | string | undefined

export interface XisCoerceSymbolArgs {
	messages: XisCoerceMessages | null
}

export class XisCoerceSymbol extends XisSync<SymbolInput, CoerceIssue, symbol> {
	#messages: XisCoerceMessages
	constructor(args: XisCoerceSymbolArgs) {
		super()
		this.#messages = args.messages ?? {
			XIS_COERCE,
		}
	}
	exec(args: XisExecArgs): ExecResultSync<CoerceIssue, symbol> {
		const { value, locale, path } = args
		const valueType = trueTypeOf(value)
		switch (typeof value) {
			case "number":
			case "string":
			case "undefined":
				return Right(Symbol(value))
			default: {
				const message = this.#messages.XIS_COERCE({
					value,
					path,
					locale,
					ctx: null,
					props: {
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

export const symbol = (args: XisCoerceSymbolArgs) => new XisCoerceSymbol(args)
