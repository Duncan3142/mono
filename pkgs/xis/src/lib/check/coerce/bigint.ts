import { XisSync, type ExecResultSync } from "#core/sync.js"
import { trueTypeOf } from "#util/base-type.js"
import { Either, Left, Right } from "purify-ts/Either"
import {
	coerceIssue,
	XIS_COERCE,
	type CoerceIssue,
	type XisCoerceArgs,
	type XisCoerceMessages,
} from "./core.js"
import type { XisExecArgs } from "#core/args.js"

export type BigIntInput = bigint | number | string | boolean

function isBigIntInput(valueType: string, value: unknown): value is BigIntInput {
	switch (valueType) {
		case "number":
		case "string":
		case "boolean":
			return true
		default:
			return false
	}
}

export class XisCoerceBigInt extends XisSync<unknown, CoerceIssue, bigint> {
	#messages: XisCoerceMessages
	constructor(args: XisCoerceArgs) {
		super()
		this.#messages = args.messages ?? {
			XIS_COERCE,
		}
	}
	exec(args: XisExecArgs): ExecResultSync<CoerceIssue, bigint> {
		const { value, locale, path } = args
		const valueType = trueTypeOf(value)
		if (valueType === "bigint") {
			return Right(value as bigint)
		}
		const res = isBigIntInput(valueType, value) ? Either.encase(() => BigInt(value)) : Left(NaN)
		return res.chainLeft((_) => {
			const message = this.#messages.XIS_COERCE({
				value,
				path,
				locale,
				ctx: null,
				props: {
					desired: "bigint",
					type: valueType,
				},
			})
			return coerceIssue({
				desired: "bigint",
				received: value,
				type: valueType,
				message,
				path,
			})
		})
	}
}

export const bigint = (args: XisCoerceArgs) => new XisCoerceBigInt(args)
