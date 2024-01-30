import { it } from "node:test"
import { expect } from "expect"
import { assertLeft, assertRight, type ExtractValue } from "#util/either.js"
import { union } from "#check/union/sync.js"
import { isBoolean } from "#check/base-type.js"
import { literal } from "#check/literal.js"
import { record } from "#check/record/sync.js"
import { CheckSide } from "#core/path.js"

const sym = Symbol("test")
const check = record({
	key: union([literal(sym), literal("meow"), literal("8")]),
	value: union([literal(null), isBoolean()]),
})

void it("should pass a record", () => {
	const rec = { meow: false, [sym]: null, 8: true }
	const res = check.exec({
		value: rec,
		locale: null,
		ctx: {},
		path: [],
	})

	assertRight(res)

	const expected: ExtractValue<typeof res> = rec

	expect(res.extract()).toEqual(expected)
})
void it("should fail bad keys", () => {
	const res = check.exec({
		value: { badKey: [null] },
		locale: null,
		ctx: {},
		path: [],
	})

	assertLeft(res)

	const expected: ExtractValue<typeof res> = [
		{
			expected: sym,
			message: 'Value "badKey" is not literal Symbol(test)',
			name: "XIS_LITERAL",
			path: [
				{
					segment: "badKey",
					side: "KEY",
				},
			],
			value: "badKey",
		},
		{
			expected: "meow",
			message: 'Value "badKey" is not literal meow',
			name: "XIS_LITERAL",
			path: [
				{
					segment: "badKey",
					side: "KEY",
				},
			],
			value: "badKey",
		},
		{
			expected: "8",
			message: 'Value "badKey" is not literal 8',
			name: "XIS_LITERAL",
			path: [
				{
					segment: "badKey",
					side: "KEY",
				},
			],
			value: "badKey",
		},
		{
			expected: null,
			message: 'Value "" is not literal null',
			name: "XIS_LITERAL",
			path: [
				{
					segment: "badKey",
					side: "VALUE",
				},
			],
			value: [null],
		},
		{
			name: "XIS_BASE_TYPE",
			expected: "boolean",
			received: "array",
			message:
				'Value "array" at [{"segment":"badKey","side":"VALUE"}] is not an instance of boolean',
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
