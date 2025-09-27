import { describe, it, expect } from "vitest"
import { TagFactory } from "#duncan3142/effect/lib/tag"

describe("tag", () => {
	it("should generate a namespaced tag string", () => {
		const factory = TagFactory.make("@namespace")
		const result = factory("foo", "bar", "baz")
		expect(result).toBe("@namespace/foo/bar/baz")
	})
})
