import { describe, it } from "node:test"
import { ok } from "node:assert/strict"

void describe("template", () => {
	void it("should pass", () => {
		const num = Math.random()
		ok(num >= 0)
		ok(num < 1)
	})
})
