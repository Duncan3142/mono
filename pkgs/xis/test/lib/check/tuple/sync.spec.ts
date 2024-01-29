import { it } from "node:test"
import { expect } from "expect"
import { assertLeft, assertRight, type ExtractValue } from "#util/either.js"
import { tuple } from "#check/tuple/sync.js"

import { string } from "#check/string/string.js"
import { array } from "#check/array/sync.js"
import { unknown } from "#check/unknown.js"
import { number } from "#check/number/number.js"
import { literal } from "#check/literal.js"

import { CheckSide } from "#core/context.js"

const check = tuple([
	// break
	string,
	// break
	array(unknown),
	// break
	number,
	// break
	literal(null),
])

void it("should pass a matching tuple", () => {
	const res = check.exec(["oneTwoCatDog", [], 0, null], {
		ctx: {},
		path: [],
	})

	assertRight(res)

	const expected: ExtractValue<typeof res> = ["oneTwoCatDog", [], 0, null]

	expect(res.extract()).toEqual(expected)
})

void it("should fail an invalid elements tuple", () => {
	const res = check.exec(["meow", [], false, undefined], {
		ctx: {},
		path: [],
	})

	assertLeft(res)

	const expected: ExtractValue<typeof res> = [
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
			name: "LITERAL",
			expected: null,
			path: [
				{
					segment: 3,
					side: CheckSide.Value,
				},
			],
			value: undefined,
		},
	]

	expect(res.extract()).toEqual(expected)
})
