import { describe, it } from "node:test"
import { expect } from "expect"
import { isDivisible } from "#check/number/divisible.js"
import { isFinite } from "#check/number/finite.js"
import { isNaN } from "#check/number/nan.js"
import { isInteger } from "#check/number/int.js"
import { toString } from "#check/number/string.js"
import { range } from "#check/number/range.js"
import { assertLeft, assertRight, type ExtractValue } from "#util/either.js"
import type { NumberRangeOpts } from "#check/number/range.js"

void describe("number", () => {
	void it("should pass an integer", () => {
		const res = isInteger().exec({
			value: 0,
			ctx: {},
			locale: null,
			path: [],
		})
		assertRight(res)
		expect(res.extract()).toBe(0)
	})
	void it("should fail a float", () => {
		const res = isInteger().exec({
			value: 0.5,
			ctx: {},
			locale: null,
			path: [],
		})
		assertLeft(res)
		const expected: ExtractValue<typeof res> = [
			{
				name: "XIS_INTEGER",
				message: "Expected an integer",
				path: [],
			},
		]
		expect(res.extract()).toEqual(expected)
	})
	void it("should fail infinity", () => {
		const res = isFinite().exec({
			value: Infinity,
			ctx: {},
			locale: null,
			path: [],
		})
		assertLeft(res)
		const expected: ExtractValue<typeof res> = [
			{
				name: "XIS_FINITE",
				message: "Expected a finite number",
				path: [],
			},
		]
		expect(res.extract()).toEqual(expected)
	})
	void it("should pass NaN", () => {
		const res = isNaN().exec({
			value: NaN,
			ctx: {},
			locale: null,
			path: [],
		})
		assertRight(res)
		expect(res.extract()).toBeNaN()
	})
	void it("should fail a non divisible number", () => {
		const res = isDivisible(3).exec({
			value: 5,
			ctx: {},
			path: [],
			locale: null,
		})
		assertLeft(res)

		const expected: ExtractValue<typeof res> = [
			{
				name: "XIS_DIVISIBLE",
				divisor: 3,
				path: [],
				message: "Expected a number divisible by 3",
				remainder: 2,
				value: 5,
			},
		]
		expect(res.extract()).toEqual(expected)
	})
	void it("should pass a divisible number", () => {
		const res = isDivisible(3).exec({
			value: 6,
			ctx: {},
			locale: null,
			path: [],
		})
		assertRight(res)
		expect(res.extract()).toBe(6)
	})
	void it("should fail not NaN", () => {
		const res = isNaN().exec({
			value: 0,
			ctx: {},
			locale: null,
			path: [],
		})
		assertLeft(res)
		const expected: ExtractValue<typeof res> = [
			{
				name: "XIS_NAN",
				message: "Expected NaN",
				path: [],
			},
		]
		expect(res.extract()).toEqual(expected)
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
					const res = range(opts).exec({
						value: input,
						ctx: {},
						locale: null,
						path: [],
					})

					assertRight(res)
					expect(res.extract()).toBe(input)
				})
			)
		)
	})

	void it("should fail a range", () => {
		const res = range([{ op: "gt", bound: 8 }]).exec({
			value: 0,
			ctx: {},
			locale: null,
			path: [],
		})
		assertLeft(res)
		const expected: ExtractValue<typeof res> = [
			{
				name: "XIS_NUMBER_RANGE",
				message: "Expected a number greater than 8",
				path: [],
				opts: [{ op: "gt", bound: 8 }],
				received: 0,
			},
		]
		expect(res.extract()).toEqual(expected)
	})
	void it("should stringify a number", () => {
		const res = toString(10).exec({
			value: 42,
			ctx: {},
			locale: null,

			path: [],
		})
		assertRight(res)
		expect(res.extract()).toBe("42")
	})
})
