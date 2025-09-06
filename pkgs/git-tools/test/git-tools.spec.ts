/* eslint-disable @typescript-eslint/unbound-method -- Test spies */
import { expect, describe, it } from "@effect/vitest"
import { NodeContext } from "@effect/platform-node"
import { ConfigProvider, Effect, Layer } from "effect"
import { MockConsole } from "./mock/index.ts"
import { GitToolsLive } from "#duncan3142/git-tools/layer"
import {
	TagMode,
	ConfigMode,
	Repository,
	Reference,
	CheckoutMode,
	FetchMode,
	ResetMode,
} from "#duncan3142/git-tools/core/domain"
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
} from "#duncan3142/git-tools/core/command"
import { RepositoryContext } from "#duncan3142/git-tools/core/context"
import { TestRepoDir, TestRepoFile } from "#duncan3142/git-tools/test-setup"
import { FetchDepth, FetchDepthFactory } from "#duncan3142/git-tools/core/state"
import { TelemetryLive } from "#duncan3142/git-tools/telemetry"

const console = MockConsole.make()

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
	const [
		init,
		config,
		remote,
		fetch,
		fetchDepthFactory,
		checkout,
		reset,
		mergeBase,
		revParse,
		branch,
		tag,
		status,
	] = yield* Effect.all(
		[
			InitCommand.InitCommand,
			ConfigCommand.ConfigCommand,
			RemoteCommand.RemoteCommand,
			FetchCommand.FetchCommand,
			FetchDepthFactory.FetchDepthFactory,
			CheckoutCommand.CheckoutCommand,
			ResetCommand.ResetCommand,

			MergeBaseCommand.MergeBaseCommand,
			RevParseCommand.RevParseCommand,
			BranchCommand.BranchCommand,
			TagCommand.TagCommand,
			StatusCommand.StatusCommand,
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
	return { base, sha }
}).pipe(Effect.provide(ProgramLive))

describe("Integration", () => {
	it.scopedLive(
		"executes",
		() =>
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

				const { base, sha } = yield* setupC.pipe(
					Effect.provideService(
						RepositoryContext.RepositoryContext,
						Repository.Repository({ directory: localC })
					),
					Effect.withConfigProvider(
						ConfigProvider.fromMap(new Map([["GIT_TOOLS.DEFAULT_REMOTE.URL", remoteDir]]))
					)
				)

				expect(base).toMatch(/[a-f0-9]{40}/)
				expect(sha).toMatch(/[a-f0-9]{40}/)
				expect(console.log).toHaveBeenCalledTimes(15)
				expect(console.error).toHaveBeenCalledTimes(17)

				expect(console.log).toHaveBeenNthCalledWith(
					1,
					expect.stringMatching(
						/^Initialized empty Git repository in \/tmp\/test-repo-[a-zA-Z0-9]{6}\/\n$/
					)
				)

				expect(console.log).toHaveBeenNthCalledWith(
					2,
					expect.stringMatching(
						/^Initialized empty Git repository in \/tmp\/test-repo-[a-zA-Z0-9]{6}\/\.git\/\n$/
					)
				)

				expect(console.log).toHaveBeenNthCalledWith(
					3,
					expect.stringMatching(
						/^\[main \(root-commit\) [a-f0-9]{7}\] Initial commit\n 1 file changed, 0 insertions\(\+\), 0 deletions\(-\)\n create mode 100644 one\.md\n$/
					)
				)

				expect(console.error).toHaveBeenNthCalledWith(
					1,
					expect.stringMatching(/^Switched to a new branch 'feature'\n$/)
				)

				expect(console.log).toHaveBeenNthCalledWith(
					4,
					expect.stringMatching(
						/^\[feature [a-f0-9]{7}\] Feature commit A\n 1 file changed, 0 insertions\(\+\), 0 deletions\(-\)\n create mode 100644 two\.md\n$/
					)
				)

				expect(console.error).toHaveBeenNthCalledWith(
					2,
					expect.stringMatching(
						/^To \/tmp\/test-repo-[a-zA-Z0-9]{6}\n \* \[new branch\] {6}feature -> feature\n$/
					)
				)

				expect(console.error).toHaveBeenNthCalledWith(
					3,
					expect.stringMatching(
						/^To \/tmp\/test-repo-[a-zA-Z0-9]{6}\n \* \[new tag\] {9}1\.0\.0 -> 1\.0\.0\n$/
					)
				)

				expect(console.error).toHaveBeenNthCalledWith(
					4,
					expect.stringMatching(
						/^To \/tmp\/test-repo-[a-zA-Z0-9]{6}\n \* \[new branch\] {6}main -> main\n$/
					)
				)

				expect(console.error).toHaveBeenNthCalledWith(
					5,
					expect.stringMatching(
						/^To \/tmp\/test-repo-[a-zA-Z0-9]{6}\n \* \[new tag\] {9}2\.0\.0 -> 2\.0\.0\n$/
					)
				)

				expect(console.log).toHaveBeenNthCalledWith(
					5,
					expect.stringMatching(
						/^Initialized empty Git repository in \/tmp\/test-repo-[a-zA-Z0-9]{6}\/\.git\/\n$/
					)
				)

				expect(console.error).toHaveBeenNthCalledWith(
					6,
					expect.stringMatching(
						/^From \/tmp\/test-repo-[a-zA-Z0-9]{6}\n \* \[new branch\] {6}main {7}-> origin\/main\n$/
					)
				)

				expect(console.error).toHaveBeenNthCalledWith(
					7,
					expect.stringMatching(/^ \* \[new branch\] {6}feature {4}-> origin\/feature\n$/)
				)

				expect(console.error).toHaveBeenNthCalledWith(
					8,
					expect.stringMatching(/^ \* \[new tag\] {9}1\.0\.0 {6}-> 1\.0\.0\n$/)
				)

				expect(console.error).toHaveBeenNthCalledWith(
					9,
					expect.stringMatching(/^ \* \[new tag\] {9}2\.0\.0 {6}-> 2\.0\.0\n$/)
				)

				expect(console.error).toHaveBeenNthCalledWith(
					10,
					expect.stringMatching(/^Switched to a new branch 'feature'\n$/)
				)

				expect(console.log).toHaveBeenNthCalledWith(
					6,
					expect.stringMatching(/^branch 'feature' set up to track 'origin\/feature'\.\n$/)
				)

				expect(console.log).toHaveBeenNthCalledWith(
					7,
					expect.stringMatching(
						/^\[feature [a-f0-9]{7}\] Feature commit B\n 1 file changed, 0 insertions\(\+\), 0 deletions\(-\)\n create mode 100644 three\.md\n$/
					)
				)

				expect(console.error).toHaveBeenNthCalledWith(
					11,
					expect.stringMatching(
						/^To \/tmp\/test-repo-[a-zA-Z0-9]{6}\n {3}[a-f0-9]{7}\.\.[a-f0-9]{7} {2}feature -> feature\n$/
					)
				)

				expect(console.log).toHaveBeenNthCalledWith(
					8,
					expect.stringMatching(
						/^Initialized empty Git repository in \/tmp\/test-repo-[a-zA-Z0-9]{6}\/\.git\/\n$/
					)
				)

				expect(console.error).toHaveBeenNthCalledWith(
					12,
					expect.stringMatching(
						/^From \/tmp\/test-repo-[a-zA-Z0-9]{6}\n \* \[new branch\] {6}main {7}-> origin\/main\n$/
					)
				)

				expect(console.error).toHaveBeenNthCalledWith(
					13,
					expect.stringMatching(/^ \* \[new branch\] {6}feature {4}-> origin\/feature\n$/)
				)

				expect(console.error).toHaveBeenNthCalledWith(
					14,
					expect.stringMatching(/^ \* \[new tag\] {9}1\.0\.0 {6}-> 1\.0\.0\n$/)
				)

				expect(console.error).toHaveBeenNthCalledWith(
					15,
					expect.stringMatching(/^ \* \[new tag\] {9}2\.0\.0 {6}-> 2\.0\.0\n$/)
				)

				expect(console.error).toHaveBeenNthCalledWith(
					16,
					expect.stringMatching(/^Already on 'main'\n$/)
				)

				expect(console.log).toHaveBeenNthCalledWith(
					9,
					expect.stringMatching(/^branch 'main' set up to track 'origin\/main'\.\n$/)
				)

				expect(console.error).toHaveBeenNthCalledWith(
					17,
					expect.stringMatching(/^Switched to a new branch 'feature'\n$/)
				)

				expect(console.log).toHaveBeenNthCalledWith(
					10,
					expect.stringMatching(/^branch 'feature' set up to track 'origin\/feature'\.\n$/)
				)

				expect(console.log).toHaveBeenNthCalledWith(
					11,
					expect.stringMatching(/^[a-f0-9]{40}\n$/)
				)

				expect(console.log).toHaveBeenNthCalledWith(
					12,
					expect.stringMatching(/^[a-f0-9]{40}\n$/)
				)

				expect(console.log).toHaveBeenNthCalledWith(
					13,
					expect.stringMatching(
						/^\* feature {16}[a-f0-9]{7} \[origin\/feature: behind 2\] Initial commit\n {2}main {19}[a-f0-9]{7} \[origin\/main\] Initial commit\n {2}remotes\/origin\/feature [a-f0-9]{7} Feature commit B\n {2}remotes\/origin\/main {4}[a-f0-9]{7} Initial commit\n$/
					)
				)

				expect(console.log).toHaveBeenNthCalledWith(
					14,
					expect.stringMatching(/^1\.0\.0\n2\.0\.0\n$/)
				)

				expect(console.log).toHaveBeenNthCalledWith(
					15,
					expect.stringMatching(
						/^On branch feature\nYour branch is behind 'origin\/feature' by 2 commits, and can be fast-forwarded\.\n {2}\(use "git pull" to update your local branch\)\n\nChanges to be committed:\n {2}\(use "git restore --staged <file>\.\.\." to unstage\)\n\tnew file: {3}three\.md\n\tnew file: {3}two\.md\n\n$/
					)
				)
			}).pipe(
				Effect.withSpan("git-tools-test"),
				Effect.provide(TelemetryLive),
				Effect.withConsole(console)
			),
		{
			timeout: 10_000,
		}
	)
})
/* eslint-enable @typescript-eslint/unbound-method -- Test spies */
