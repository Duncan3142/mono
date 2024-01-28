import { it } from "node:test"
import { expect } from "expect"
import { assertLeft, assertRight, type ExtractValue } from "#util/either.js"
import { union } from "#check/union/sync.js"

import { array } from "#check/array/sync.js"

import { string } from "#check/string/string.js"
import { number } from "#check/number/number.js"

import { CheckSide } from "#core/context.js"

const unionCheck = union([
	// break
	string,
	// break
	number,
])

const check = array(unionCheck)

void it("should pass a matching array", () => {
	const res = check.exec(["a", 0, "b", 1], {
		args: undefined,
		path: [],
	})
	assertRight(res)
	const expected: ExtractValue<typeof res> = ["a", 0, "b", 1]
	deepEqual(res.extract(), expected)
})

void it("should fail an invalid value", () => {
	const res = check.exec(["a", 0, true, "b", 1, false], {
		args: undefined,
		path: [],
	})

	assertLeft(res)

	const expected: ExtractValue<typeof res> = [
		{
			name: "INVALID_TYPE",
			expected: "string",
			path: [
				{
					segment: 2,
					side: CheckSide.Value,
				},
			],
			received: "boolean",
		},
		{
			name: "INVALID_TYPE",
			expected: "number",
			path: [
				{
					segment: 2,
					side: CheckSide.Value,
				},
			],
			received: "boolean",
		},
		{
			name: "INVALID_TYPE",
			expected: "string",
			path: [
				{
					segment: 5,
					side: CheckSide.Value,
				},
			],
			received: "boolean",
		},
		{
			name: "INVALID_TYPE",
			expected: "number",
			path: [
				{
					segment: 5,
					side: CheckSide.Value,
				},
			],
			received: "boolean",
		},
	]

	deepEqual(res.extract(), expected)
})
