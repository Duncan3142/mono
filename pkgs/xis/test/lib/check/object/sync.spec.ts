import { describe, it } from "node:test"
import { expect } from "expect"
import { assertLeft, assertRight, type ExtractValue } from "#util/either.js"
import { object } from "#check/object/sync.js"
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

	void it("should pass a matching object", () => {
		const obj = {
			a: "c8199460-77b1-4b9f-83ee-6abe4c341f07",
			b: 0,
			x: true,
			c: {
				e: "3da0acd0-68a5-42ae-bd63-e3a06513e3bc",
				y: false,
			},
		}
		const res = check.exec({
			value: obj,
			locale: null,
			ctx: {},
			path: [],
		})

		assertRight(res)

		expect(res.extract()).toEqual(obj)
	})

	void it("should fail an invalid object", () => {
		const obj = {
			a: "bad",
			b: NaN,
			c: {
				d: 0.5,
				e: "fail",
			},
		}
		const res = check.exec({
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
				message: "Expected a UUID of length 4",
				path: [
					{
						segment: "a",
						side: CheckSide.Value,
					},
				],
				received: "bad",
			},
		]

		expect(res.extract()).toEqual(expected)
	})
})
