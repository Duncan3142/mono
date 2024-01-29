import { it } from "node:test"
import { expect } from "expect"
import { assertLeft, assertRight, type ExtractValue } from "#util/either.js"
import { tuple } from "#check/tuple/sync.js"
import { isString } from "#check/base-type.js"
import { isInteger } from "#check/number/int.js"
import { CheckSide } from "#core/path.js"

const check = tuple([
	// break
	isString(),
	// break
	isInteger(),
])

void it("should pass a matching tuple", () => {
	const res = check.exec({
		value: ["oneTwoCatDog", 0],
		locale: null,
		ctx: {},
		path: [],
	})

	assertRight(res)

	const expected: ExtractValue<typeof res> = ["oneTwoCatDog", 0]

	expect(res.extract()).toEqual(expected)
})

void it("should fail an invalid elements tuple", () => {
	const res = check.exec({
		value: [false, 0.5],
		locale: null,
		ctx: {},
		path: [],
	})

	assertLeft(res)

	const expected: ExtractValue<typeof res> = [
		{
			name: "XIS_BASE_TYPE",
			message: 'Value "boolean" at [{"segment":0,"side":"VALUE"}] is not an instance of string',
			expected: "string",
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
			message: '0.5 at [{"segment":1,"side":"VALUE"}] is not an integer',
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
