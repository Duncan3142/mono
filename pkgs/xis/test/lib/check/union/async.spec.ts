import { it } from "node:test"
import { expect } from "expect"
import { assertLeft, assertRight, type ExtractValue } from "#util/either.js"
import { union } from "#check/union/async.js"
import { isNumber, isBoolean } from "#check/base-type.js"
import { lift } from "#core/lift.js"

const check = union([
	// break
	lift(isNumber()),
	// break
	isBoolean(),
])

void it("should pass a matching string", async () => {
	const res = await check.exec({
		value: 4,
		locale: null,
		ctx: {},
		path: [],
	})

	assertRight(res)

	const expected: ExtractValue<typeof res> = 4

	expect(res.extract()).toBe(expected)
})

void it("should fail an invalid value", async () => {
	const res = await check.exec({
		value: "bad",
		locale: null,
		ctx: {},
		path: [],
	})

	assertLeft(res)

	const expected: ExtractValue<typeof res> = [
		{
			name: "XIS_BASE_TYPE",
			value: "bad",
			message: 'Value "string" at [] is not an instance of number',
			received: "string",
			path: [],
			expected: "number",
		},
		{
			name: "XIS_BASE_TYPE",
			value: "bad",
			message: 'Value "string" at [] is not an instance of boolean',
			received: "string",
			path: [],
			expected: "boolean",
		},
	]

	expect(res.extract()).toEqual(expected)
})
