import { it } from "node:test"
import { expect } from "expect"
import { assertLeft, assertRight, type ExtractValue } from "#util/either.js"
import { union } from "#check/union/sync.js"
import { isBoolean } from "#check/base-type.js"
import { literal } from "#check/literal.js"
import { record } from "#check/record/async.js"
import { CheckSide } from "#core/path.js"

const sym = Symbol("test")
const check = record({
	key: union([literal(sym), literal("meow"), literal("8")]),
	value: union([literal(null), isBoolean()]),
})

void it("should pass a record", async () => {
	const rec = { meow: false, [sym]: null, 8: true }
	const res = await check.exec({
		value: rec,
		locale: null,
		ctx: {},
		path: [],
	})

	assertRight(res)

	const expected: ExtractValue<typeof res> = rec

	expect(res.extract()).toEqual(expected)
})
void it("should fail bad keys", async () => {
	const res = await check.exec({
		value: { badKey: [null] },
		locale: null,
		ctx: {},
		path: [],
	})

	assertLeft(res)

	const expected: ExtractValue<typeof res> = [
		{
			name: "XIS_BASE_TYPE",
			expected: "boolean",
			received: "array",
			value: [null],
			message: "Expected a boolean",
			path: [
				{
					segment: "badKey",
					side: CheckSide.Value,
				},
			],
		},
	]

	expect(res.extract()).toEqual(expected)
})
