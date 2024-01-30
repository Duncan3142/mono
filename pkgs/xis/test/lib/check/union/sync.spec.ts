import { it } from "node:test"
import { expect } from "expect"
import { assertLeft, assertRight, type ExtractValue } from "#util/either.js"
import { union } from "#check/union/sync.js"
import { isInteger } from "#check/number/int.js"
import { range } from "#check/number/range.js"

const check = union([
	// break
	range([{ op: "gt", bound: 3 }]),
	// break
	isInteger(),
])

void it("should pass a matching string", () => {
	const res = check.exec({
		value: 4,
		locale: null,
		ctx: {},
		path: [],
	})

	assertRight(res)

	const expected: ExtractValue<typeof res> = 4

	expect(res.extract()).toBe(expected)
})

void it("should fail an invalid value", () => {
	const res = check.exec({
		value: 2.1,
		locale: null,
		ctx: {},
		path: [],
	})

	assertLeft(res)

	const expected: ExtractValue<typeof res> = [
		{
			name: "XIS_NUMBER_RANGE",
			opts: [{ op: "gt", bound: 3 }],
			message: '2.1 not in range [{"op":"gt","bound":3}]',
			received: 2.1,
			path: [],
		},
		{
			message: "Expected integer, received 2.1",
			name: "XIS_INTEGER",
			path: [],
			value: 2.1,
		},
	]

	expect(res.extract()).toEqual(expected)
})
