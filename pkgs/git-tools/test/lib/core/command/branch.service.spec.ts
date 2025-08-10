import { expect, describe, it } from "@effect/vitest"
import { NodeContext } from "@effect/platform-node"
import { Effect, Layer } from "effect"
import { GitToolsLive } from "#duncan3142/git-tools/layer"
import {
	TagMode,
	ConfigMode,
	Repository,
	Reference,
	CheckoutMode,
} from "#duncan3142/git-tools/domain"
import {
	MergeBaseCommand,
	BranchCommand,
	InitCommand,
	AddCommand,
	CheckoutCommand,
	CommitCommand,
	ConfigCommand,
	FetchCommand,
	PushCommand,
	RemoteCommand,
	RevParseCommand,
	TagCommand,
} from "#duncan3142/git-tools/command"
import { RepositoryContext } from "#duncan3142/git-tools/context"
import { TestRepoDir, TestRepoFile } from "#duncan3142/git-tools/test-setup"
import { FetchDepth, FetchDepthFactory } from "#duncan3142/git-tools/state"

const ProgramLive = GitToolsLive.pipe(Layer.provide(NodeContext.layer))

const setupRemote = Effect.gen(function* () {
	const [init, config, add, commit, checkout, tag] = yield* Effect.all(
		[
			InitCommand.InitCommand,
			ConfigCommand.ConfigCommand,
			AddCommand.AddCommand,
			CommitCommand.CommitCommand,
			CheckoutCommand.CheckoutCommand,
			TagCommand.TagCommand,
		],
		{
			concurrency: "unbounded",
		}
	)
	yield* init()
	yield* config({ mode: ConfigMode.Set({ key: "user.name", value: "Test User" }) })
	yield* config({ mode: ConfigMode.Set({ key: "user.email", value: "test@test.com" }) })
	yield* TestRepoFile.make("one.md")
	yield* add()
	yield* commit({ message: "Initial commit" })
	yield* tag({ mode: TagMode.Create({ name: "1.0.0" }) })
	yield* checkout({ ref: Reference.Branch({ name: "feature" }), mode: CheckoutMode.Create() })
	yield* TestRepoFile.make("two.md")
	yield* add()
	yield* commit({ message: "Feature commit one" })
	yield* tag({ mode: TagMode.Create({ name: "2.0.0" }) })
}).pipe(Effect.provide(ProgramLive))

const setupLocal = Effect.gen(function* () {
	const [init, config, remote, fetch, fetchDepthFactory, checkout, add, commit, push] =
		yield* Effect.all(
			[
				InitCommand.InitCommand,
				ConfigCommand.ConfigCommand,
				RemoteCommand.RemoteCommand,
				FetchCommand.FetchCommand,
				FetchDepthFactory.FetchDepthFactory,
				CheckoutCommand.CheckoutCommand,
				AddCommand.AddCommand,
				CommitCommand.CommitCommand,
				PushCommand.PushCommand,
			],
			{
				concurrency: "unbounded",
			}
		)
	yield* init()
	yield* config({ mode: ConfigMode.Set({ key: "user.name", value: "Test User" }) })
	yield* config({ mode: ConfigMode.Set({ key: "user.email", value: "test@test.com" }) })
	yield* remote()
	yield* fetch({
		refs: [
			Reference.Branch({ name: "main" }),
			Reference.Branch({ name: "feature" }),
			Reference.Tag({ name: "1.0.0" }),
			Reference.Tag({ name: "2.0.0" }),
		],
	}).pipe(Effect.provideServiceEffect(FetchDepth.FetchDepth, fetchDepthFactory))
	yield* checkout({ ref: Reference.Branch({ name: "feature" }), mode: CheckoutMode.Standard() })
	yield* TestRepoFile.make("three.md")
	yield* add()
	yield* commit({ message: "Feature commit two" })
	yield* push({ ref: Reference.Branch({ name: "feature" }) })
}).pipe(Effect.provide(ProgramLive))

describe("BranchCommand", () => {
	it.scoped("prints", () =>
		Effect.gen(function* () {
			const remoteDir = yield* TestRepoDir.make

			yield* setupRemote.pipe(
				Effect.provideService(
					RepositoryContext.RepositoryContext,
					Repository.Repository({ directory: remoteDir })
				)
			)

			const localDir = yield* TestRepoDir.make

			yield* setupLocal.pipe(
				Effect.provideService(
					RepositoryContext.RepositoryContext,
					Repository.Repository({ directory: localDir })
				)
			)

			const [mergeBase, revParse, branch] = yield* Effect.all(
				[
					MergeBaseCommand.MergeBaseCommand,
					RevParseCommand.RevParseCommand,
					BranchCommand.BranchCommand,
				],
				{ concurrency: "unbounded" }
			).pipe(
				Effect.provide(ProgramLive),
				Effect.provideService(
					RepositoryContext.RepositoryContext,
					Repository.Repository({ directory: localDir })
				)
			)

			const base = yield* mergeBase({
				baseRef: Reference.Branch({ name: "main" }),
				headRef: Reference.Branch({ name: "feature" }),
			})

			const sha = yield* revParse({
				ref: Reference.Branch({ name: "feature" }),
			})

			yield* branch()

			expect(base).toMatch(/abc/)
			expect(sha).toMatch(/def/)
		})
	)
})
