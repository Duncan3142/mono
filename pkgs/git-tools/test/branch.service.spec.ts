import { expect, describe, it } from "@effect/vitest"
import { NodeContext } from "@effect/platform-node"
import { ConfigProvider, Effect, Layer } from "effect"
import { GitToolsLive } from "#duncan3142/git-tools/layer"
import {
	TagMode,
	ConfigMode,
	Repository,
	Reference,
	CheckoutMode,
	FetchMode,
	ResetMode,
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
	ResetCommand,
	StatusCommand,
} from "#duncan3142/git-tools/command"
import { RepositoryContext } from "#duncan3142/git-tools/context"
import { TestRepoDir, TestRepoFile } from "#duncan3142/git-tools/test-setup"
import { FetchDepth, FetchDepthFactory } from "#duncan3142/git-tools/state"

const ProgramLive = GitToolsLive.pipe(Layer.provide(NodeContext.layer))

const setupBare = Effect.gen(function* () {
	const [init] = yield* Effect.all([InitCommand.InitCommand], {
		concurrency: "unbounded",
	})
	yield* init({ bare: true })
}).pipe(Effect.provide(ProgramLive))

const setupA = Effect.gen(function* () {
	const [init, config, add, commit, checkout, tag, remote, push] = yield* Effect.all(
		[
			InitCommand.InitCommand,
			ConfigCommand.ConfigCommand,
			AddCommand.AddCommand,
			CommitCommand.CommitCommand,
			CheckoutCommand.CheckoutCommand,
			TagCommand.TagCommand,
			RemoteCommand.RemoteCommand,
			PushCommand.PushCommand,
		],
		{
			concurrency: "unbounded",
		}
	)
	yield* init({ initBranch: "main" })
	yield* config({ mode: ConfigMode.Set({ key: "user.name", value: "Test User" }) })
	yield* config({ mode: ConfigMode.Set({ key: "user.email", value: "test@test.com" }) })
	yield* remote()
	yield* TestRepoFile.make("one.md")
	yield* add()
	yield* commit({ message: "Initial commit" })
	yield* tag({ mode: TagMode.Create({ name: "1.0.0", message: "Version 1.0.0" }) })
	yield* checkout({ ref: Reference.Branch({ name: "feature" }), mode: CheckoutMode.Create() })
	yield* TestRepoFile.make("two.md")
	yield* add()
	yield* commit({ message: "Feature commit A" })
	yield* tag({ mode: TagMode.Create({ name: "2.0.0", message: "Version 2.0.0" }) })
	yield* push({ ref: Reference.Branch({ name: "feature" }) })
	yield* push({ ref: Reference.Tag({ name: "1.0.0" }) })
	yield* push({ ref: Reference.Branch({ name: "main" }) })
	yield* push({ ref: Reference.Tag({ name: "2.0.0" }) })
}).pipe(Effect.provide(ProgramLive))

const setupB = Effect.gen(function* () {
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
	yield* init({ initBranch: "main" })
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
	yield* commit({ message: "Feature commit B" })
	yield* push({ ref: Reference.Branch({ name: "feature" }) })
}).pipe(Effect.provide(ProgramLive))

const setupC = Effect.gen(function* () {
	const [init, config, remote, fetch, fetchDepthFactory, checkout, reset] = yield* Effect.all(
		[
			InitCommand.InitCommand,
			ConfigCommand.ConfigCommand,
			RemoteCommand.RemoteCommand,
			FetchCommand.FetchCommand,
			FetchDepthFactory.FetchDepthFactory,
			CheckoutCommand.CheckoutCommand,
			ResetCommand.ResetCommand,
		],
		{
			concurrency: "unbounded",
		}
	)
	yield* init({ initBranch: "main" })
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
		mode: FetchMode.Depth({ depth: 128 }),
	}).pipe(Effect.provideServiceEffect(FetchDepth.FetchDepth, fetchDepthFactory))
	yield* checkout({ ref: Reference.Branch({ name: "main" }), mode: CheckoutMode.Standard() })
	yield* checkout({ ref: Reference.Branch({ name: "feature" }), mode: CheckoutMode.Standard() })
	yield* reset({ ref: Reference.Branch({ name: "main" }), mode: ResetMode.Soft() })
}).pipe(Effect.provide(ProgramLive))

describe("Integration", () => {
	it.scopedLive("executes", () =>
		Effect.gen(function* () {
			const remoteDir = yield* TestRepoDir.make
			const localA = yield* TestRepoDir.make
			const localB = yield* TestRepoDir.make
			const localC = yield* TestRepoDir.make

			yield* setupBare.pipe(
				Effect.provideService(
					RepositoryContext.RepositoryContext,
					Repository.Repository({ directory: remoteDir })
				),
				Effect.withConfigProvider(
					ConfigProvider.fromMap(
						new Map([
							[
								"GIT_TOOLS.DEFAULT_REMOTE.URL",
								"https://cloudgit.dummy/dummy-user/dummy-repo.git",
							],
						])
					)
				)
			)

			yield* setupA.pipe(
				Effect.provideService(
					RepositoryContext.RepositoryContext,
					Repository.Repository({ directory: localA })
				),
				Effect.withConfigProvider(
					ConfigProvider.fromMap(new Map([["GIT_TOOLS.DEFAULT_REMOTE.URL", remoteDir]]))
				)
			)

			yield* setupB.pipe(
				Effect.provideService(
					RepositoryContext.RepositoryContext,
					Repository.Repository({ directory: localB })
				),
				Effect.withConfigProvider(
					ConfigProvider.fromMap(new Map([["GIT_TOOLS.DEFAULT_REMOTE.URL", remoteDir]]))
				)
			)

			yield* setupC.pipe(
				Effect.provideService(
					RepositoryContext.RepositoryContext,
					Repository.Repository({ directory: localC })
				),
				Effect.withConfigProvider(
					ConfigProvider.fromMap(new Map([["GIT_TOOLS.DEFAULT_REMOTE.URL", remoteDir]]))
				)
			)

			const [mergeBase, revParse, branch, tag, status] = yield* Effect.all(
				[
					MergeBaseCommand.MergeBaseCommand,
					RevParseCommand.RevParseCommand,
					BranchCommand.BranchCommand,
					TagCommand.TagCommand,
					StatusCommand.StatusCommand,
				],
				{ concurrency: "unbounded" }
			).pipe(
				Effect.provide(ProgramLive),
				Effect.provideService(
					RepositoryContext.RepositoryContext,
					Repository.Repository({ directory: localC })
				),
				Effect.withConfigProvider(
					ConfigProvider.fromMap(new Map([["GIT_TOOLS.DEFAULT_REMOTE.URL", remoteDir]]))
				)
			)

			const base = yield* mergeBase({
				baseRef: Reference.Branch({ name: "main" }),
				headRef: Reference.Tag({ name: "2.0.0" }),
			})

			const sha = yield* revParse({
				ref: Reference.Tag({ name: "2.0.0" }),
			})

			yield* branch()
			yield* tag()
			yield* status()

			expect(base).toMatch(/[a-f0-9]{40}/)
			expect(sha).toMatch(/[a-f0-9]{40}/)
		})
	)
})
