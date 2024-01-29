import { it } from "node:test"
import { expect } from "expect"
import { assertLeft, assertRight, type ExtractValue } from "#util/either.js"
import {
	isNull,
	isBigInt,
	isBoolean,
	isBaseFunction,
	isSymbol,
	isUndefined,
} from "#core/base-type.js"

void it("should pass null", () => {
	const res = isNull(null, {
		args: {},
		path: [],
	})

	assertRight(res)
	expect(res.extract(), null)
})

void it("should fail not null", () => {
	const res = isNull(true, {
		args: {},
		path: [],
	})
	assertLeft(res)
	const expected: ExtractValue<typeof res> = [
		{
			name: "INVALID_TYPE",
			expected: "null",
			path: [],
			received: "boolean",
		},
	]

	expect(res.extract()).toEqual(expected)
})
void it("should pass a bigint", () => {
	const res = isBigInt(0n, {
		args: {},
		path: [],
	})

	assertRight(res)
	expect(res.extract(), 0n)
})
void it("should pass a boolean", () => {
	const res = isBoolean(true, {
		args: {},
		path: [],
	})

	assertRight(res)
	expect(res.extract(), true)
})
void it("should pass a function", () => {
	const func = () => null
	const res = isBaseFunction(func, {
		args: {},
		path: [],
	})

	assertRight(res)
	expect(res.extract(), func)
})
void it("should pass a symbol", () => {
	const sym = Symbol("test")
	const res = isSymbol(sym, {
		args: {},
		path: [],
	})

	assertRight(res)
	expect(res.extract(), sym)
})
void it("should pass undefined", () => {
	const res = isUndefined(undefined, {
		args: {},
		path: [],
	})

	assertRight(res)
	expect(res.extract(), undefined)
})
