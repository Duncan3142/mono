import { describe, it } from "node:test"
import { equal, deepEqual } from "node:assert/strict"

import { divisible } from "#check/number/divisible.js"
import { finite } from "#check/number/finite.js"
import { isNaN } from "#check/number/nan.js"
import { integer } from "#check/number/int.js"
import { toString } from "#check/number/string.js"
import { range } from "#check/number/range.js"
import { assertLeft, assertRight, type ExtractValue } from "#util/either.js"

import type { NumberRangeOpts } from "#check/number/range.js"

void describe("number", () => {
	void it("should pass an integer", () => {
		const res = integer.parse(0, {
			args: undefined,
			path: [],
		})
		assertRight(res)
		equal(res.extract(), 0)
	})
	void it("should fail a float", () => {
		const res = integer.parse(0.1, {
			args: undefined,
			path: [],
		})
		assertLeft(res)
		const expected: ExtractValue<typeof res> = [
			{
				name: "INTEGER",
				path: [],
			},
		]
		deepEqual(res.extract(), expected)
	})
	void it("should fail infinity", () => {
		const res = finite.parse(Infinity, {
			args: undefined,
			path: [],
		})
		assertLeft(res)
		const expected: ExtractValue<typeof res> = [
			{
				name: "FINITE",
				path: [],
			},
		]
		deepEqual(res.extract(), expected)
	})
	void it("should pass NaN", () => {
		const res = isNaN.parse(NaN, {
			args: undefined,
			path: [],
		})
		assertRight(res)
		equal(res.extract(), NaN)
	})
	void it("should fail a non divisible number", () => {
		const res = divisible({ divisor: 3 }).parse(5, {
			args: undefined,
			path: [],
		})
		assertLeft(res)

		const expected: ExtractValue<typeof res> = [
			{
				name: "DIVISIBLE",
				divisor: 3,
				path: [],
				remainder: 2,
				value: 5,
			},
		]
		deepEqual(res.extract(), expected)
	})
	void it("should pass a divisible number", () => {
		const res = divisible({ divisor: 3 }).parse(6, {
			args: undefined,
			path: [],
		})
		assertRight(res)
		equal(res.extract(), 6)
	})
	void it("should fail not NaN", () => {
		const res = isNaN.parse(0, {
			args: undefined,
			path: [],
		})
		assertLeft(res)
		const expected: ExtractValue<typeof res> = [
			{
				name: "NAN",
				path: [],
			},
		]
		deepEqual(res.extract(), expected)
	})

	void it("range", async (t) => {
		const cases: Array<[NumberRangeOpts, number]> = [
			[
				[
					{ op: "gte", bound: 2 },
					{ op: "lte", bound: 8 },
				] satisfies NumberRangeOpts,
				2,
			],
			[
				[
					{ op: "gte", bound: 2 },
					{ op: "lte", bound: 8 },
				] satisfies NumberRangeOpts,
				5,
			],
			[
				[
					{ op: "gte", bound: 2 },
					{ op: "lte", bound: 8 },
				] satisfies NumberRangeOpts,
				8,
			],
			[
				[
					{ op: "gte", bound: 2 },
					{ op: "lt", bound: 8 },
				] satisfies NumberRangeOpts,
				2,
			],
			[
				[
					{ op: "gte", bound: 2 },
					{ op: "lt", bound: 8 },
				] satisfies NumberRangeOpts,
				3,
			],
			[
				[
					{ op: "gte", bound: 2 },
					{ op: "lt", bound: 8 },
				] satisfies NumberRangeOpts,
				7,
			],
			[
				[
					{ op: "gt", bound: 2 },
					{ op: "lte", bound: 8 },
				] satisfies NumberRangeOpts,
				3,
			],
			[
				[
					{ op: "gt", bound: 2 },
					{ op: "lte", bound: 8 },
				] satisfies NumberRangeOpts,
				5,
			],
			[
				[
					{ op: "gt", bound: 2 },
					{ op: "lte", bound: 8 },
				] satisfies NumberRangeOpts,
				8,
			],
			[
				[
					{ op: "gt", bound: 2 },
					{ op: "lt", bound: 8 },
				] satisfies NumberRangeOpts,
				5,
			],
			[[{ op: "gte", bound: 2 }] satisfies NumberRangeOpts, 2],
			[[{ op: "gte", bound: 2 }] satisfies NumberRangeOpts, 3],
			[[{ op: "lte", bound: 8 }] satisfies NumberRangeOpts, 7],
			[[{ op: "lte", bound: 8 }] satisfies NumberRangeOpts, 8],
			[[{ op: "gt", bound: 2 }] satisfies NumberRangeOpts, 3],
			[[{ op: "lt", bound: 8 }] satisfies NumberRangeOpts, 7],
		]

		await Promise.all(
			cases.map(async ([opts, input], idx) =>
				t.test(`passes: ${idx}`, () => {
					const res = range(opts).parse(input, {
						args: undefined,
						path: [],
					})

					assertRight(res)
					equal(res.extract(), input)
				})
			)
		)
	})

	void it("should fail a range", () => {
		const res = range([{ op: "gt", bound: 8 }]).parse(0, {
			args: undefined,
			path: [],
		})
		assertLeft(res)
		const expected: ExtractValue<typeof res> = [
			{
				name: "NUMBER_RANGE",
				path: [],
				opts: [{ op: "gt", bound: 8 }],
				received: 0,
			},
		]
		deepEqual(res.extract(), expected)
	})
	void it("should stringify a number", () => {
		const res = toString({ radix: 10 }).parse(42, {
			args: undefined,
			path: [],
		})
		assertRight(res)
		equal(res.extract(), "42")
	})
})
