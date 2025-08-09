import { describe, it, expect } from "vitest"
import { Tag } from "#const"

describe("tag", () => {
	it("should generate a namespaced tag string", () => {
		const result = Tag.make("foo", "bar", "baz")
		expect(result).toBe("@duncan3142/git-tools/foo/bar/baz")
	})
})
