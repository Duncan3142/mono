import {
	gen as effectGen,
	provide as effectProvide,
	exit as effectExit,
	void as effectVoid,
} from "effect/Effect"
import { NodeContext } from "@effect/platform-node"
import { expect, describe, it } from "@effect/vitest"
import GitLive from "#layer"
import Git from "#service"

const program = effectGen(function* () {
	const git = yield* Git
	return yield* git.printRefs({
		level: "Info",
		repoDirectory: process.cwd(),
		message: "Print refs test",
	})
}).pipe(effectProvide(GitLive), effectProvide(NodeContext.layer))

describe("Git layer", () => {
	describe("printRefs", () => {
		it.live("prints references", () =>
			effectGen(function* () {
				const res = yield* program.pipe(effectExit)
				expect(res).toEqual(effectVoid)
			})
		)
	})
})
