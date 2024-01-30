import { describe, it } from "node:test"
import { expect } from "expect"
import { nonEmptyArray } from "#util/non-empty-array.js"

void describe("nonEmptyArray", () => {
	void it("should throw with an empty array", () => {
		expect(() => nonEmptyArray([])).toThrow(new Error("Expected non-empty array"))
	})
})

void describe("assertIsNonEmptyArray", () => {
	void it("should pass a non empty array", () => {
		expect(() => nonEmptyArray([true])).not.toThrow()
	})
})
