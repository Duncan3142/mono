import { it } from "node:test"
import { deepEqual, equal } from "node:assert/strict"
import { assertLeft, assertRight, type ExtractValue } from "#util/either.js"
import { bigint } from "#check/coerce/bigint.js"
import { boolean } from "#check/coerce/boolean.js"
import { date } from "#check/coerce/date.js"
import { number } from "#check/coerce/number.js"
import { string } from "#check/coerce/string.js"
import { symbol } from "#check/coerce/symbol.js"

void it("should coerce a string", () => {
	const res = string.parse("false")
	assertRight(res)
	equal(res.extract(), "false")
})
void it("should coerce date", () => {
	const res = date.parse("2000-01-01", {
		args: undefined,
		path: [],
	})
	assertRight(res)
	deepEqual(res.extract(), new Date("2000-01-01"))
})
void it("should fail to coerce date", () => {
	const res = date.parse("meow", {
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
	const res = bigint.parse([], {
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
	const res = bigint.parse(true, {
		args: undefined,
		path: [],
	})
	assertRight(res)
	equal(res.extract(), 1n)
})
void it("should coerce a boolean", () => {
	const res = boolean.parse("")
	assertRight(res)
	equal(res.extract(), false)
})
void it("should coerce a number", () => {
	const res = number.parse("0", {
		args: undefined,
		path: [],
	})
	assertRight(res)
	equal(res.extract(), 0)
})
void it("should coerce a symbol", () => {
	const res = symbol.parse("test", {
		args: undefined,
		path: [],
	})
	assertRight(res)
	const rex = res.extract()
	equal(rex.description, "test")
})
void it("should fail to coerce a symbol", () => {
	const res = symbol.parse(true, {
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
