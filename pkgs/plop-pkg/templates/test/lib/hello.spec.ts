import { describe, it } from "node:test"
import { equal } from "node:assert/strict"

void describe("hello", () => {
	void it("equals", () => {
		equal(1, 1)
	})
})
