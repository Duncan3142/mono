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
	const res = string.exec("false")
	assertRight(res)
	equal(res.extract(), "false")
})
void it("should coerce date", () => {
	const res = date.exec("2000-01-01", {
		args: undefined,
		path: [],
	})
	assertRight(res)
	deepEqual(res.extract(), new Date("2000-01-01"))
})
void it("should fail to coerce date", () => {
	const res = date.exec("meow", {
		args: undefined,
		path: [],
	})
	assertLeft(res)
	const expected: ExtractValue<typeof res> = [
		{
			name: "COERCE",
			type: "string",
			desired: "date",
			path: [],
			received: "meow",
		},
	]

	deepEqual(res.extract(), expected)
})
void it("should fail to coerce a bigint", () => {
	const res = bigint.exec([], {
		args: undefined,
		path: [],
	})
	assertLeft(res)
	const expected: ExtractValue<typeof res> = [
		{
			name: "COERCE",
			desired: "bigint",
			path: [],
			type: "array",
			received: [],
		},
	]

	deepEqual(res.extract(), expected)
})
void it("should coerce a bigint", () => {
	const res = bigint.exec(true, {
		args: undefined,
		path: [],
	})
	assertRight(res)
	equal(res.extract(), 1n)
})
void it("should coerce a boolean", () => {
	const res = boolean.exec("")
	assertRight(res)
	equal(res.extract(), false)
})
void it("should coerce a number", () => {
	const res = number.exec("0", {
		args: undefined,
		path: [],
	})
	assertRight(res)
	equal(res.extract(), 0)
})
void it("should coerce a symbol", () => {
	const res = symbol.exec("test", {
		args: undefined,
		path: [],
	})
	assertRight(res)
	const rex = res.extract()
	equal(rex.description, "test")
})
void it("should fail to coerce a symbol", () => {
	const res = symbol.exec(true, {
		args: undefined,
		path: [],
	})
	assertLeft(res)
	const expected: ExtractValue<typeof res> = [
		{
			name: "COERCE",
			type: "boolean",
			desired: "symbol",
			path: [],
			received: true,
		},
	]

	deepEqual(res.extract(), expected)
})
