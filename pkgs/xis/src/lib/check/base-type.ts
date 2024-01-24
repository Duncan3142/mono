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

export interface BaseTypeIssue<Expected extends TrueBaseTypeName>
	extends XisIssue<"XIS_BASE_TYPE"> {
	expected: Expected
	received: TrueBaseTypeName
}

export type BaseTypeProps<N extends TrueBaseTypeName> = {
	expected: N
}

export type BaseTypeMessageProps<N extends TrueBaseTypeName> = BaseTypeProps<N> & {
	received: string
}

export interface BaseTypeMessages<N extends TrueBaseTypeName>
	extends XisMessages<BaseTypeIssue<N>> {
	XIS_BASE_TYPE: XisMsgBuilder<unknown, BaseTypeMessageProps<N>>
}

export interface BaseTypeArgs<N extends TrueBaseTypeName> {
	props: BaseTypeProps<N>
	messages: BaseTypeMessages<N> | null
}

export class XisTypeCheck<N extends TrueBaseTypeName> extends XisSync<
	unknown,
	BaseTypeIssue<N>,
	TrueBaseTypeNameMap[N]
> {
	#props: BaseTypeProps<N>
	#messages: BaseTypeMessages<N>
	constructor(args: BaseTypeArgs<N>) {
		super()
		const { props, messages } = args
		this.#props = props
		this.#messages = messages ?? {
			XIS_BASE_TYPE: (args: XisMsgArgs<unknown, BaseTypeMessageProps<N>>) => {
				const { props, path } = args
				const { expected, received } = props
				return `Value "${received}" at ${JSON.stringify(path)} is not an instance of ${expected}`
			},
		}
	}
	exec(args: XisExecArgs): ExecResultSync<BaseTypeIssue<N>, TrueBaseTypeNameMap[N]> {
		const { value, path, locale } = args
		const { expected } = this.#props
		const received = trueTypeOf(value)
		if (isBaseType(expected, value)) {
			return Right(value)
		}

		const message = this.#messages.XIS_BASE_TYPE({
			value,
			path,
			locale,
			props: { ...this.#props, received },
			ctx: null,
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

const typeCheck =
	<N extends TrueBaseTypeName>(name: N) =>
	(msgs: BaseTypeMessages<N> | null) =>
		new XisTypeCheck<N>({
			props: { expected: name },
			messages: msgs,
		})

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
