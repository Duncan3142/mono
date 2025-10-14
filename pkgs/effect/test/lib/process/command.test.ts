import { describe, it, expect } from "@effect/vitest"
import { Command } from "#duncan3142/effect/lib/process"

describe("Command", () => {
	it.scoped("should execute", () => {
		const factory = Command.make("@namespace")
		const result = factory("foo", "bar", "baz")
		expect(result).toBe("@namespace/foo/bar/baz")
	})
})
