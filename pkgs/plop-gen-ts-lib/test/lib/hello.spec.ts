import { describe, it } from "node:test"
import { equal } from "node:assert/strict"
import { hello } from "#lib/hello.js"

void describe("hello", () => {
	void it("should pass a string of length 3", () => {
		const res = hello("World")

		equal(res, "Hello, World!")
	})
})
