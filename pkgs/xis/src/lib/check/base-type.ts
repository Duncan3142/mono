import type { XisIssue } from "#core/error.js"
import type { XisExecArgs } from "#core/args.js"
import {
	trueTypeOf,
	type TrueBaseTypeName,
	isBaseType,
	type TrueBaseTypeNameMap,
} from "#util/base-type.js"
import { Left, Right } from "purify-ts/Either"
import { XisSync, type ExecResultSync } from "#core/sync.js"
import type { XisMessages, XisMsgArgs, XisMsgBuilder } from "#core/messages.js"
import { Effect } from "#core/book-keeping.js"

export interface BaseTypeIssue extends XisIssue<"XIS_BASE_TYPE"> {
	expected: TrueBaseTypeName
	received: TrueBaseTypeName
}

export type BaseTypeProps<N extends TrueBaseTypeName> = {
	expected: N
}

export type BaseTypeMessageProps = {
	expected: TrueBaseTypeName
	received: TrueBaseTypeName
}

export interface BaseTypeMessages extends XisMessages<BaseTypeIssue> {
	XIS_BASE_TYPE: XisMsgBuilder<BaseTypeMessageProps>
}

export interface BaseTypeArgs<N extends TrueBaseTypeName> {
	props: BaseTypeProps<N>
	messages: BaseTypeMessages | null
}

export class XisTypeCheck<N extends TrueBaseTypeName> extends XisSync<
	unknown,
	BaseTypeIssue,
	TrueBaseTypeNameMap[N]
> {
	#props: BaseTypeProps<N>
	#messages: BaseTypeMessages
	constructor(args: BaseTypeArgs<N>) {
		super()
		const { props, messages } = args
		this.#props = props
		this.#messages = messages ?? {
			XIS_BASE_TYPE: (args: XisMsgArgs<BaseTypeMessageProps>) => {
				const {
					input: { expected, received },
					path,
				} = args

				return `Value "${received}" at ${JSON.stringify(path)} is not an instance of ${expected}`
			},
		}
	}
	override get effect(): typeof Effect.Validate {
		return Effect.Validate
	}
	exec(args: XisExecArgs): ExecResultSync<BaseTypeIssue, TrueBaseTypeNameMap[N]> {
		const { value, path, locale, ctx } = args
		const { expected } = this.#props
		const received = trueTypeOf(value)
		if (isBaseType(expected, value)) {
			return Right(value)
		}

		const message = this.#messages.XIS_BASE_TYPE({
			input: { expected, received },
			path,
			locale,
			ctx,
		})

		const err = {
			name: "XIS_BASE_TYPE" as const,
			expected,
			received,
			message,
			path,
		}

		return Left([err])
	}
}

export const typeCheckLocale =
	(msgs: BaseTypeMessages | null) =>
	<N extends TrueBaseTypeName>(name: N) =>
		new XisTypeCheck<N>({
			props: { expected: name },
			messages: msgs,
		})

export const typeCheck = <N extends TrueBaseTypeName>(name: N) => typeCheckLocale(null)(name)

export const isNull = typeCheck("null")
export const isUndefined = typeCheck("undefined")
export const isString = typeCheck("string")
export const isNumber = typeCheck("number")
export const isBoolean = typeCheck("boolean")
export const isBigInt = typeCheck("bigint")
export const isSymbol = typeCheck("symbol")
export const isBaseArray = typeCheck("array")
export const isBaseObject = typeCheck("object")
export const isBaseFunction = typeCheck("function")
export const isDate = typeCheck("date")
export const isBaseMap = typeCheck("map")
export const isBaseSet = typeCheck("set")
