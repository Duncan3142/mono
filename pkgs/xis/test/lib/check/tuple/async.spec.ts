import { it } from "node:test"
import { expect } from "expect"
import { assertLeft, assertRight, type ExtractValue } from "#util/either.js"
import { tuple } from "#check/tuple/async.js"

import { string } from "#check/string/string.js"
import { array } from "#check/array/async.js"
import { unknown } from "#check/unknown.js"

import { literal } from "#check/literal.js"
import { number } from "#check/number/number.js"

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

void it("should pass a matching tuple", async () => {
	const res = await check.exec(["oneTwoCatDog", [], 0, null], {
		ctx: {},
		path: [],
	})

	assertRight(res)

	const expected: ExtractValue<typeof res> = ["oneTwoCatDog", [], 0, null]

	expect(res.extract()).toEqual(expected)
})

void it("should fail an invalid elements tuple", async () => {
	const res = await check.exec(["meow", [], false, undefined], {
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
			expected: null,
			name: "LITERAL",
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
