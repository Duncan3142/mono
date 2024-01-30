import { it } from "node:test"
import { expect } from "expect"
import { assertLeft, assertRight, type ExtractValue } from "#util/either.js"
import { tuple } from "#check/tuple/async.js"
import { isString } from "#check/base-type.js"
import { isInteger } from "#check/number/int.js"
import { CheckSide } from "#core/path.js"
import { lift } from "#core/lift.js"

const check = tuple([
	// break
	isString(),
	// break
	lift(isInteger()),
])

void it("should pass a matching tuple", async () => {
	const res = await check.exec({
		value: ["oneTwoCatDog", 0],
		locale: null,
		ctx: {},
		path: [],
	})

	assertRight(res)

	const expected: ExtractValue<typeof res> = ["oneTwoCatDog", 0]

	expect(res.extract()).toEqual(expected)
})

void it("should fail an invalid elements tuple", async () => {
	const res = await check.exec({
		value: [false, 0.5],
		locale: null,
		ctx: {},
		path: [],
	})

	assertLeft(res)

	const expected: ExtractValue<typeof res> = [
		{
			name: "XIS_BASE_TYPE",
			message: "boolean is not a string",
			expected: "string",
			value: false,
			path: [
				{
					segment: 0,
					side: CheckSide.Value,
				},
			],
			received: "boolean",
		},
		{
			name: "XIS_INTEGER",
			message: "0.5 is not an integer",
			value: 0.5,
			path: [
				{
					segment: 1,
					side: CheckSide.Value,
				},
			],
		},
	]

	expect(res.extract()).toEqual(expected)
})
