import { it } from "node:test"
import { deepEqual } from "node:assert/strict"
import { assertLeft, assertRight, type ExtractValue } from "#util/either.js"
import { union } from "#check/union/sync.js"

import { string } from "#check/string/string.js"
import { array } from "#check/array/sync.js"
import { number } from "#check/number/number.js"
import { literal } from "#check/literal.js"

const arr = array(string)
const lit = literal(null)

const check = union([
	// break
	string,
	// break
	arr,
	// break
	number,
	// break
	lit,
])

void it("should pass a matching string", () => {
	const res = check.parse("oneTwoCatDog", {
		args: undefined,
		path: [],
	})

	assertRight(res)

	const expected: ExtractValue<typeof res> = "oneTwoCatDog"

	deepEqual(res.extract(), expected)
})

void it("should fail an invalid value", () => {
	const res = check.parse(true, {
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
			name: "LITERAL",
			expected: null,
			path: [],
			value: true,
		},
	]

	deepEqual(res.extract(), expected)
})
