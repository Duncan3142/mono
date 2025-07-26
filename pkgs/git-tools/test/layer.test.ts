import {
	gen as effectGen,
	provide as effectProvide,
	exit as effectExit,
	void as effectVoid,
} from "effect/Effect"
import { provide as layerProvide } from "effect/Layer"
import { NodeContext } from "@effect/platform-node"
import { expect, describe, it } from "@effect/vitest"
import GitLive from "#layer"
import Git from "#service"
import FetchLive from "#case/fetch.layer"
import FetchCommandLive from "#git/command/fetch.layer"
import PrintRefsLive from "#case/print-refs.layer"
import RepositoryConfigLive from "#config/repository-config.layer"
import PrintRefsCommandLive from "#git/command/print-refs.layer"

const ProgramLive = GitLive.pipe(
	layerProvide(FetchLive.pipe(layerProvide(FetchCommandLive))),
	layerProvide(PrintRefsLive),
	layerProvide(PrintRefsCommandLive),
	layerProvide(NodeContext.layer),
	layerProvide(RepositoryConfigLive)
)

const program = effectGen(function* () {
	const git = yield* Git
	return yield* git.printRefs({
		level: "Info",
		repoDirectory: process.cwd(),
		message: "Print refs test",
	})
}).pipe(effectProvide(ProgramLive))

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
