import { describe, it } from "node:test"
import { expect } from "expect"
import { assertLeft, assertRight, type ExtractValue } from "#util/either.js"
import { object } from "#check/object/async.js"
import { CheckSide } from "#core/path.js"
import { uuid } from "#check/string/uuid.js"
import { isInteger } from "#check/number/int.js"

void describe("object", () => {
	const check = object([
		[["a", "!"], uuid(4)],
		[["b", "?"], isInteger()],
		[
			["c", "!"],
			object([
				[["d", "?"], isInteger()],
				[["e", "!"], uuid(4)],
			]),
		],
	])

	void it("should pass a matching object", async () => {
		const obj = {
			a: "c8199460-77b1-4b9f-83ee-6abe4c341f07",
			b: 0,
			x: true,
			c: {
				e: "3da0acd0-68a5-42ae-bd63-e3a06513e3bc",
				y: false,
			},
		}
		const res = await check.exec({
			value: obj,
			locale: null,
			ctx: {},
			path: [],
		})

		assertRight(res)

		expect(res.extract()).toEqual(obj)
	})

	void it("should fail an invalid object", async () => {
		const obj = {
			a: "bad",
			b: NaN,
			c: {
				d: 0.5,
				e: "fail",
			},
		}
		const res = await check.exec({
			value: obj,
			locale: null,
			ctx: {},
			path: [],
		})

		assertLeft(res)

		const expected: ExtractValue<typeof res> = [
			{
				name: "XIS_UUID",
				expected: 4,
				message: 'Expected UUID 4, received "bad"',
				path: [
					{
						segment: "a",
						side: CheckSide.Value,
					},
				],
				received: "bad",
			},
			{
				message: "Expected integer, received NaN",
				name: "XIS_INTEGER",
				path: [
					{
						segment: "b",
						side: CheckSide.Value,
					},
				],
				value: NaN,
			},
			{
				message: "Expected integer, received 0.5",
				name: "XIS_INTEGER",
				path: [
					{
						segment: "c",
						side: CheckSide.Value,
					},
					{
						segment: "d",
						side: CheckSide.Value,
					},
				],
				value: 0.5,
			},
			{
				expected: 4,
				message: 'Expected UUID 4, received "fail"',
				name: "XIS_UUID",
				path: [
					{
						segment: "c",
						side: CheckSide.Value,
					},
					{
						segment: "e",
						side: CheckSide.Value,
					},
				],
				received: "fail",
			},
		]

		expect(res.extract()).toEqual(expected)
	})
})
