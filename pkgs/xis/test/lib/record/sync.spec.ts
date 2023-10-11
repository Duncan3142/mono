import { it } from "node:test"
import { deepEqual } from "node:assert/strict"
import { assertLeft, assertRight, type ExtractValue } from "#util/either.js"
import { union } from "#check/union/sync.js"

import { divisible } from "#check/number/divisible.js"

import { literal } from "#check/literal.js"

import { record } from "#check/record/sync.js"

import { string } from "#check/string/string.js"

import { CheckSide } from "#core/context.js"

const sym = Symbol("test")
const check = record(
	union([literal(sym), literal("meow"), literal("8")]),
	union([string, literal(null), divisible({ divisor: 2 })])
)

void it("should pass a record", () => {
	const res = check.parse(
		{ meow: "string", [sym]: null, 8: 6 },
		{
			args: undefined,
			path: [],
		}
	)

	assertRight(res)

	const expected: ExtractValue<typeof res> = { meow: "string", [sym]: null, 8: 6 }

	deepEqual(res.extract(), expected)
})
void it("should fail bad keys", () => {
	const anotherSym = Symbol("another")
	const res = check.parse(
		{ badKey: "string", [anotherSym]: null, 16: "number" },
		{
			args: undefined,
			path: [],
		}
	)

	assertLeft(res)

	const expected: ExtractValue<typeof res> = [
		{
			expected: sym,
			name: "LITERAL",
			path: [
				{
					segment: "16",
					side: CheckSide.Key,
				},
			],
			value: "16",
		},
		{
			expected: "meow",
			name: "LITERAL",
			path: [
				{
					segment: "16",
					side: CheckSide.Key,
				},
			],
			value: "16",
		},
		{
			expected: "8",
			name: "LITERAL",
			path: [
				{
					segment: "16",
					side: CheckSide.Key,
				},
			],
			value: "16",
		},
		{
			expected: sym,
			name: "LITERAL",
			path: [
				{
					segment: "badKey",
					side: CheckSide.Key,
				},
			],
			value: "badKey",
		},
		{
			expected: "meow",
			name: "LITERAL",
			path: [
				{
					segment: "badKey",
					side: CheckSide.Key,
				},
			],
			value: "badKey",
		},
		{
			expected: "8",
			name: "LITERAL",
			path: [
				{
					segment: "badKey",
					side: CheckSide.Key,
				},
			],
			value: "badKey",
		},
		{
			expected: sym,
			name: "LITERAL",
			path: [
				{
					segment: anotherSym,
					side: CheckSide.Key,
				},
			],
			value: anotherSym,
		},
		{
			expected: "meow",
			name: "LITERAL",
			path: [
				{
					segment: anotherSym,
					side: CheckSide.Key,
				},
			],
			value: anotherSym,
		},
		{
			expected: "8",
			name: "LITERAL",
			path: [
				{
					segment: anotherSym,
					side: CheckSide.Key,
				},
			],
			value: anotherSym,
		},
	]

	deepEqual(res.extract(), expected)
})
void it("should fail bad values", () => {
	const d = new Date()
	const res = check.parse(
		{ meow: undefined, [sym]: d, 8: false },
		{
			args: undefined,
			path: [],
		}
	)

	assertLeft(res)

	const expected: ExtractValue<typeof res> = [
		{
			name: "INVALID_TYPE",
			expected: "string",
			path: [
				{
					segment: "8",
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
					segment: "8",
					side: CheckSide.Value,
				},
			],
			value: false,
		},
		{
			name: "INVALID_TYPE",
			expected: "number",
			path: [
				{
					segment: "8",
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
					segment: "meow",
					side: CheckSide.Value,
				},
			],
			received: "undefined",
		},
		{
			expected: null,
			name: "LITERAL",
			path: [
				{
					segment: "meow",
					side: CheckSide.Value,
				},
			],
			value: undefined,
		},
		{
			name: "INVALID_TYPE",
			expected: "number",
			path: [
				{
					segment: "meow",
					side: CheckSide.Value,
				},
			],
			received: "undefined",
		},
		{
			expected: "string",
			name: "INVALID_TYPE",
			path: [
				{
					segment: sym,
					side: CheckSide.Value,
				},
			],
			received: "date",
		},
		{
			expected: null,
			name: "LITERAL",
			path: [
				{
					segment: sym,
					side: CheckSide.Value,
				},
			],
			value: d,
		},
		{
			expected: "number",
			name: "INVALID_TYPE",
			path: [
				{
					segment: sym,
					side: CheckSide.Value,
				},
			],
			received: "date",
		},
	]

	deepEqual(res.extract(), expected)
})
void it("should fail bad keys and values", () => {
	const anotherSym = Symbol("bad")
	const res = check.parse(
		{ badKey: null, [anotherSym]: 3, 16: false },
		{
			args: undefined,
			path: [],
		}
	)

	assertLeft(res)

	const expected: ExtractValue<typeof res> = [
		{
			expected: sym,
			name: "LITERAL",
			path: [
				{
					segment: "16",
					side: CheckSide.Key,
				},
			],
			value: "16",
		},
		{
			expected: "meow",
			name: "LITERAL",
			path: [
				{
					segment: "16",
					side: CheckSide.Key,
				},
			],
			value: "16",
		},
		{
			expected: "8",
			name: "LITERAL",
			path: [
				{
					segment: "16",
					side: CheckSide.Key,
				},
			],
			value: "16",
		},
		{
			name: "INVALID_TYPE",
			expected: "string",
			path: [
				{
					segment: "16",
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
					segment: "16",
					side: CheckSide.Value,
				},
			],
			value: false,
		},
		{
			name: "INVALID_TYPE",
			expected: "number",
			path: [
				{
					segment: "16",
					side: CheckSide.Value,
				},
			],
			received: "boolean",
		},
		{
			expected: sym,
			name: "LITERAL",
			path: [
				{
					segment: "badKey",
					side: CheckSide.Key,
				},
			],
			value: "badKey",
		},
		{
			expected: "meow",
			name: "LITERAL",
			path: [
				{
					segment: "badKey",
					side: CheckSide.Key,
				},
			],
			value: "badKey",
		},
		{
			expected: "8",
			name: "LITERAL",
			path: [
				{
					segment: "badKey",
					side: CheckSide.Key,
				},
			],
			value: "badKey",
		},
		{
			expected: sym,
			name: "LITERAL",
			path: [
				{
					segment: anotherSym,
					side: CheckSide.Key,
				},
			],
			value: anotherSym,
		},
		{
			expected: "meow",
			name: "LITERAL",
			path: [
				{
					segment: anotherSym,
					side: CheckSide.Key,
				},
			],
			value: anotherSym,
		},
		{
			expected: "8",
			name: "LITERAL",
			path: [
				{
					segment: anotherSym,
					side: CheckSide.Key,
				},
			],
			value: anotherSym,
		},
		{
			expected: "string",
			name: "INVALID_TYPE",
			path: [
				{
					segment: anotherSym,
					side: CheckSide.Value,
				},
			],
			received: "number",
		},
		{
			expected: null,
			name: "LITERAL",
			path: [
				{
					segment: anotherSym,
					side: CheckSide.Value,
				},
			],
			value: 3,
		},
		{
			divisor: 2,
			name: "DIVISIBLE",
			path: [
				{
					segment: anotherSym,
					side: CheckSide.Value,
				},
			],
			remainder: 1,
			value: 3,
		},
	]

	deepEqual(res.extract(), expected)
})
