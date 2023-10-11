import { it } from "node:test"
import { deepEqual } from "node:assert/strict"
import { assertLeft, assertRight, type ExtractValue } from "#util/either.js"
import { union } from "#check/union/async.js"
import { string } from "#check/string/string.js"
import { number } from "#check/number/number.js"
import { unknown } from "#check/unknown.js"

import { array } from "#check/array/async.js"
import { literal } from "#check/literal.js"

const check = union([
	// break
	string,
	// break
	array(unknown),
	// break
	number,
	// break
	literal(null),
])

void it("should pass a matching string", async () => {
	const res = await check.parse("oneTwoCatDog", {
		args: undefined,
		path: [],
	})

	assertRight(res)

	const expected: ExtractValue<typeof res> = "oneTwoCatDog"

	deepEqual(res.extract(), expected)
})

void it("should fail an invalid value", async () => {
	const res = await check.parse(true, {
		args: undefined,
		path: [],
	})

	assertLeft(res)

	const expected: ExtractValue<typeof res> = [
		{
			name: "INVALID_TYPE",
			expected: "string",
			path: [],
			received: "boolean",
		},
		{
			name: "INVALID_TYPE",
			expected: "array",
			path: [],
			received: "boolean",
		},
		{
			name: "INVALID_TYPE",
			expected: "number",
			path: [],
			received: "boolean",
		},
		{
			expected: null,
			name: "LITERAL",
			path: [],
			value: true,
		},
	]

	deepEqual(res.extract(), expected)
})
