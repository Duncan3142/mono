import { describe, it } from "node:test"
import { throws, doesNotThrow } from "node:assert/strict"
import { assertIsNonEmptyArray, nonEmptyArray } from "#util/non-empty-array.js"

void describe("nonEmptyArray", () => {
	void it("should throw with an empty array", () => {
		throws(() => nonEmptyArray([]), new Error("Expected non-empty array"))
	})
})

void describe("assertIsNonEmptyArray", () => {
	void it("should pass a non empty array", () => {
		doesNotThrow(() => assertIsNonEmptyArray([true]))
	})
})
