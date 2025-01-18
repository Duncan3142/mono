import { describe, it, expect } from "vitest"

const ONE = 1,
	TWO = 2,
	THREE = 3

describe("sum test", () => {
	it("adds 1 + 2 to equal 3", () => {
		expect(ONE + TWO).toBe(THREE)
	})
})
