import { describe, it, expect } from "vitest"
import { TagFactory } from "#duncan3142/git-tools/internal"

describe("tag", () => {
	it("should generate a namespaced tag string", () => {
		const result = TagFactory.make("foo", "bar", "baz")
		expect(result).toBe("@duncan3142/git-tools/foo/bar/baz")
	})
})
