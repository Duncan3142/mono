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
} from "#check/base-type.js"

void it("should pass null", () => {
	const res = isNull().exec({
		value: null,
		locale: null,
		ctx: {},
		path: [],
	})

	assertRight(res)
	expect(res.extract()).toBe(null)
})

void it("should fail not null", () => {
	const res = isNull().exec({
		value: true,
		locale: null,
		ctx: {},
		path: [],
	})
	assertLeft(res)
	const expected: ExtractValue<typeof res> = [
		{
			name: "XIS_BASE_TYPE",
			value: true,
			message: "Invalid type",
			expected: "null",
			path: [],
			received: "boolean",
		},
	]

	expect(res.extract()).toEqual(expected)
})
void it("should pass a bigint", () => {
	const res = isBigInt().exec({
		value: 0n,
		locale: null,
		ctx: {},
		path: [],
	})

	assertRight(res)
	expect(res.extract()).toBe(0n)
})
void it("should pass a boolean", () => {
	const res = isBoolean().exec({
		value: true,
		locale: null,
		ctx: {},
		path: [],
	})

	assertRight(res)
	expect(res.extract()).toBe(true)
})
void it("should pass a function", () => {
	const func = () => null
	const res = isBaseFunction().exec({
		value: func,
		locale: null,
		ctx: {},
		path: [],
	})

	assertRight(res)
	expect(res.extract()).toBe(func)
})
void it("should pass a symbol", () => {
	const sym = Symbol("test")
	const res = isSymbol().exec({
		value: sym,
		locale: null,
		ctx: {},
		path: [],
	})

	assertRight(res)
	expect(res.extract()).toBe(sym)
})
void it("should pass undefined", () => {
	const res = isUndefined().exec({
		value: undefined,
		locale: null,
		ctx: {},
		path: [],
	})

	assertRight(res)
	expect(res.extract()).toBe(undefined)
})
