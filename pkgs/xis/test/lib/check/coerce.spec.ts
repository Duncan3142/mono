import { it } from "node:test"
import { expect } from "expect"
import { assertLeft, assertRight, type ExtractValue } from "#util/either.js"
import { bigint } from "#check/coerce/bigint.js"
import { boolean } from "#check/coerce/boolean.js"
import { date } from "#check/coerce/date.js"
import { number } from "#check/coerce/number.js"
import { string } from "#check/coerce/string.js"
import { symbol } from "#check/coerce/symbol.js"

void it("should coerce a string", () => {
	const res = string().exec({
		value: "false",
		ctx: {},
		path: [],
		locale: null,
	})
	assertRight(res)
	expect(res.extract()).toBe("false")
})
void it("should coerce date", () => {
	const res = date().exec({
		value: "2000-01-01",
		ctx: {},
		locale: null,
		path: [],
	})
	assertRight(res)
	expect(res.extract()).toEqual(new Date("2000-01-01"))
})
void it("should fail to coerce date", () => {
	const res = date().exec({
		value: "meow",
		ctx: {},
		locale: null,
		path: [],
	})
	assertLeft(res)
	const expected: ExtractValue<typeof res> = [
		{
			name: "XIS_COERCE",
			message: "Failed to coerce value",
			type: "string",
			desired: "date",
			path: [],
			received: "meow",
		},
	]

	expect(res.extract()).toEqual(expected)
})
void it("should fail to coerce a bigint", () => {
	const res = bigint().exec({
		value: [],
		ctx: {},
		locale: null,
		path: [],
	})
	assertLeft(res)
	const expected: ExtractValue<typeof res> = [
		{
			name: "XIS_COERCE",
			message: "Failed to coerce value",
			desired: "bigint",
			path: [],
			type: "array",
			received: [],
		},
	]

	expect(res.extract()).toEqual(expected)
})
void it("should coerce a bigint", () => {
	const res = bigint().exec({
		value: true,
		ctx: {},
		locale: null,
		path: [],
	})
	assertRight(res)
	expect(res.extract()).toBe(1n)
})
void it("should coerce a boolean", () => {
	const res = boolean().exec({
		value: "",
		ctx: {},
		locale: null,
		path: [],
	})
	assertRight(res)
	expect(res.extract()).toBe(false)
})
void it("should coerce a number", () => {
	const res = number().exec({
		value: "0",
		locale: null,
		ctx: {},
		path: [],
	})
	assertRight(res)
	expect(res.extract()).toBe(0)
})
void it("should coerce a symbol", () => {
	const res = symbol().exec({
		value: "test",
		locale: null,
		ctx: {},
		path: [],
	})
	assertRight(res)
	const rex = res.extract()
	expect(rex.description).toBe("test")
})
void it("should fail to coerce a symbol", () => {
	const res = symbol().exec({
		value: true,
		locale: null,
		ctx: {},
		path: [],
	})
	assertLeft(res)
	const expected: ExtractValue<typeof res> = [
		{
			name: "XIS_COERCE",
			message: "Failed to coerce value",
			type: "boolean",
			desired: "symbol",
			path: [],
			received: true,
		},
	]

	expect(res.extract()).toEqual(expected)
})
