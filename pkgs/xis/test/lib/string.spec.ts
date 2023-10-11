import { describe, it } from "node:test"
import { equal, deepEqual } from "node:assert/strict"
import { assertLeft, assertRight, type ExtractValue } from "#util/either.js"
import { chain } from "#core/chain/sync.js"
import { split } from "#check/string/split.js"
import { isLength, toLength } from "#check/string/length.js"
import { trimmed } from "#check/string/trimmed.js"

void describe("string", () => {
	void describe("isLength", () => {
		void it("should pass a string of length 3", () => {
			const res = isLength([{ bound: 1, op: "gte" }]).parse("abc", {
				args: undefined,
				path: [],
			})
			assertRight(res)

			equal(res.extract(), "abc")
		})

		void it("should fail a string of length 2", () => {
			const x = isLength([{ bound: 3, op: "gte" }])
			const res = x.parse("ab", {
				args: undefined,
				path: [],
			})

			assertLeft(res)

			const expected: ExtractValue<typeof res> = [
				{
					name: "STRING_LENGTH",
					path: [],
					length: 2,
					opts: [{ bound: 3, op: "gte" }],
				},
			]

			deepEqual(res.extract(), expected)
		})
	})

	void describe("toChars", () => {
		void it("should transform", () => {
			const res = split("").parse("abc", {
				args: undefined,
				path: [],
			})

			assertRight(res)
			deepEqual(res.extract(), ["a", "b", "c"])
		})
	})

	void describe("trimmed > toLength", () => {
		void it("should transform", () => {
			const res = chain([trimmed, toLength]).parse("ABC ", {
				args: undefined,
				path: [],
			})
			assertRight(res)
			equal(res.extract(), 3)
		})
	})
})
