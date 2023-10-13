import { describe, it } from "node:test"
import { equal } from "node:assert/strict"
import { pkgRoot } from "#lib/root.js"
import { dirname } from "node:path"

void describe("pkgRoot", () => {
	void it("matches", () => {
		const root = pkgRoot(dirname(import.meta.url))
		equal(root, "/")
	})
})
