import { describe, it } from "node:test"
import { expect } from "expect"
import { assertLeft, assertRight, type ExtractValue } from "#util/either.js"
import { chain } from "#core/chain/sync.js"
import { split } from "#check/string/split.js"
import { isLength, toLength } from "#check/string/length.js"
import { trimmed } from "#check/string/trimmed.js"

void describe("string", () => {
	void describe("isLength", () => {
		void it("should pass a string of length 3", () => {
			const res = isLength([{ bound: 1, op: "gte" }]).exec({
				value: "abc",
				ctx: {},
				path: [],
				locale: null,
			})
			assertRight(res)

			expect(res.extract()).toBe("abc")
		})

		void it("should fail a string of length 2", () => {
			const x = isLength([{ bound: 3, op: "gte" }])
			const res = x.exec({
				value: "ab",
				ctx: {},
				path: [],
				locale: null,
			})

			assertLeft(res)

			const expected: ExtractValue<typeof res> = [
				{
					name: "XIS_STRING_LENGTH",
					path: [],
					value: "ab",
					length: 2,
					message: '"ab" length not in range [{"bound":3,"op":"gte"}]',
					opts: [{ bound: 3, op: "gte" }],
				},
			]

			expect(res.extract()).toEqual(expected)
		})
	})

	void describe("toChars", () => {
		void it("should transform", () => {
			const res = split("").exec({
				value: "abc",
				ctx: {},
				path: [],
				locale: null,
			})

			assertRight(res)
			expect(res.extract()).toEqual(["a", "b", "c"])
		})
	})

	void describe("trimmed > toLength", () => {
		void it("should transform", () => {
			const res = chain([trimmed(), toLength()]).exec({
				value: "ABC ",
				ctx: {},
				path: [],
				locale: null,
			})
			assertRight(res)
			expect(res.extract()).toBe(3)
		})
	})
})
