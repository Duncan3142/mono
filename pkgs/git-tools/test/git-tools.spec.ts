/* eslint-disable @typescript-eslint/unbound-method -- Test spies */
import { expect, describe, it } from "@effect/vitest"
import { NodeContext } from "@effect/platform-node"
import { ConfigProvider, Effect, Layer, Logger } from "effect"
import { MockConsole, MockOtel } from "@duncan3142/effect"
import { GitToolsLive } from "#duncan3142/git-tools"
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
import { TestRepoDir, TestRepoFile } from "#duncan3142/git-tools/test/setup"
import { FetchDepth, FetchDepthFactory } from "#duncan3142/git-tools/core/state"

const console = MockConsole.make()

const otel = MockOtel.make({ serviceName: "git-tools-test" })

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
				expect.assertions(61)
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
				expect(console.log).toHaveBeenCalledTimes(33)
				expect(console.error).toHaveBeenCalledTimes(24)

				expect(console.log).toHaveBeenNthCalledWith(
					1,
					expect.stringMatching(
						/^Initialized empty Git repository in \/tmp\/test-repo-[a-zA-Z0-9]{6}\/$/
					)
				)

				expect(console.log).toHaveBeenNthCalledWith(
					2,
					expect.stringMatching(
						/^Initialized empty Git repository in \/tmp\/test-repo-[a-zA-Z0-9]{6}\/\.git\/$/
					)
				)

				expect(console.log).toHaveBeenNthCalledWith(
					3,
					expect.stringMatching(/^\[main \(root-commit\) [a-f0-9]{7}\] Initial commit$/)
				)

				expect(console.log).toHaveBeenNthCalledWith(
					4,
					expect.stringMatching(/^ 1 file changed, 0 insertions\(\+\), 0 deletions\(-\)$/)
				)

				expect(console.log).toHaveBeenNthCalledWith(
					5,
					expect.stringMatching(/^ create mode 100644 one\.md$/)
				)

				expect(console.error).toHaveBeenNthCalledWith(
					1,
					expect.stringMatching(/^Switched to a new branch 'feature'$/)
				)

				expect(console.log).toHaveBeenNthCalledWith(
					6,
					expect.stringMatching(/^\[feature [a-f0-9]{7}\] Feature commit A$/)
				)

				expect(console.log).toHaveBeenNthCalledWith(
					7,
					expect.stringMatching(/^ 1 file changed, 0 insertions\(\+\), 0 deletions\(-\)$/)
				)

				expect(console.log).toHaveBeenNthCalledWith(
					8,
					expect.stringMatching(/^ create mode 100644 two\.md$/)
				)

				expect(console.error).toHaveBeenNthCalledWith(
					2,
					expect.stringMatching(/^To \/tmp\/test-repo-[a-zA-Z0-9]{6}$/)
				)

				expect(console.error).toHaveBeenNthCalledWith(
					3,
					expect.stringMatching(/^ \* \[new branch\] {6}feature -> feature$/)
				)

				expect(console.error).toHaveBeenNthCalledWith(
					4,
					expect.stringMatching(/^To \/tmp\/test-repo-[a-zA-Z0-9]{6}$/)
				)

				expect(console.error).toHaveBeenNthCalledWith(
					5,
					expect.stringMatching(/^ \* \[new tag\] {9}1\.0\.0 -> 1\.0\.0$/)
				)

				expect(console.error).toHaveBeenNthCalledWith(
					6,
					expect.stringMatching(/^To \/tmp\/test-repo-[a-zA-Z0-9]{6}$/)
				)

				expect(console.error).toHaveBeenNthCalledWith(
					7,
					expect.stringMatching(/^ \* \[new branch\] {6}main -> main$/)
				)

				expect(console.error).toHaveBeenNthCalledWith(
					8,
					expect.stringMatching(/^To \/tmp\/test-repo-[a-zA-Z0-9]{6}$/)
				)

				expect(console.error).toHaveBeenNthCalledWith(
					9,
					expect.stringMatching(/^ \* \[new tag\] {9}2\.0\.0 -> 2\.0\.0$/)
				)

				expect(console.log).toHaveBeenNthCalledWith(
					9,
					expect.stringMatching(
						/^Initialized empty Git repository in \/tmp\/test-repo-[a-zA-Z0-9]{6}\/\.git\/$/
					)
				)

				expect(console.error).toHaveBeenNthCalledWith(
					10,
					expect.stringMatching(/^From \/tmp\/test-repo-[a-zA-Z0-9]{6}$/)
				)

				expect(console.error).toHaveBeenNthCalledWith(
					11,
					expect.stringMatching(/^ \* \[new branch\] {6}main {7}-> origin\/main$/)
				)

				expect(console.error).toHaveBeenNthCalledWith(
					12,
					expect.stringMatching(/^ \* \[new branch\] {6}feature {4}-> origin\/feature$/)
				)

				expect(console.error).toHaveBeenNthCalledWith(
					13,
					expect.stringMatching(/^ \* \[new tag\] {9}1\.0\.0 {6}-> 1\.0\.0$/)
				)

				expect(console.error).toHaveBeenNthCalledWith(
					14,
					expect.stringMatching(/^ \* \[new tag\] {9}2\.0\.0 {6}-> 2\.0\.0$/)
				)

				expect(console.error).toHaveBeenNthCalledWith(
					15,
					expect.stringMatching(/^Switched to a new branch 'feature'$/)
				)

				expect(console.log).toHaveBeenNthCalledWith(
					10,
					expect.stringMatching(/^branch 'feature' set up to track 'origin\/feature'\.$/)
				)

				expect(console.log).toHaveBeenNthCalledWith(
					11,
					expect.stringMatching(/^\[feature [a-f0-9]{7}\] Feature commit B$/)
				)

				expect(console.log).toHaveBeenNthCalledWith(
					12,
					expect.stringMatching(/^ 1 file changed, 0 insertions\(\+\), 0 deletions\(-\)$/)
				)

				expect(console.log).toHaveBeenNthCalledWith(
					13,
					expect.stringMatching(/^ create mode 100644 three\.md$/)
				)

				expect(console.error).toHaveBeenNthCalledWith(
					16,
					expect.stringMatching(/^To \/tmp\/test-repo-[a-zA-Z0-9]{6}$/)
				)

				expect(console.error).toHaveBeenNthCalledWith(
					17,
					expect.stringMatching(/^ {3}[a-f0-9]{7}\.\.[a-f0-9]{7} {2}feature -> feature$/)
				)

				expect(console.log).toHaveBeenNthCalledWith(
					14,
					expect.stringMatching(
						/^Initialized empty Git repository in \/tmp\/test-repo-[a-zA-Z0-9]{6}\/\.git\/$/
					)
				)

				expect(console.error).toHaveBeenNthCalledWith(
					18,
					expect.stringMatching(/^From \/tmp\/test-repo-[a-zA-Z0-9]{6}$/)
				)

				expect(console.error).toHaveBeenNthCalledWith(
					19,
					expect.stringMatching(/^ \* \[new branch\] {6}main {7}-> origin\/main$/)
				)

				expect(console.error).toHaveBeenNthCalledWith(
					20,
					expect.stringMatching(/^ \* \[new branch\] {6}feature {4}-> origin\/feature$/)
				)

				expect(console.error).toHaveBeenNthCalledWith(
					21,
					expect.stringMatching(/^ \* \[new tag\] {9}1\.0\.0 {6}-> 1\.0\.0$/)
				)

				expect(console.error).toHaveBeenNthCalledWith(
					22,
					expect.stringMatching(/^ \* \[new tag\] {9}2\.0\.0 {6}-> 2\.0\.0$/)
				)

				expect(console.error).toHaveBeenNthCalledWith(
					23,
					expect.stringMatching(/^Already on 'main'$/)
				)

				expect(console.log).toHaveBeenNthCalledWith(
					15,
					expect.stringMatching(/^branch 'main' set up to track 'origin\/main'\.$/)
				)

				expect(console.error).toHaveBeenNthCalledWith(
					24,
					expect.stringMatching(/^Switched to a new branch 'feature'$/)
				)

				expect(console.log).toHaveBeenNthCalledWith(
					16,
					expect.stringMatching(/^branch 'feature' set up to track 'origin\/feature'\.$/)
				)

				expect(console.log).toHaveBeenNthCalledWith(17, expect.stringMatching(/^[a-f0-9]{40}$/))

				expect(console.log).toHaveBeenNthCalledWith(18, expect.stringMatching(/^[a-f0-9]{40}$/))

				expect(console.log).toHaveBeenNthCalledWith(
					19,
					expect.stringMatching(
						/^\* feature {16}[a-f0-9]{7} \[origin\/feature: behind 2\] Initial commit$/
					)
				)

				expect(console.log).toHaveBeenNthCalledWith(
					20,
					expect.stringMatching(/^ {2}main {19}[a-f0-9]{7} \[origin\/main\] Initial commit$/)
				)

				expect(console.log).toHaveBeenNthCalledWith(
					21,
					expect.stringMatching(/^ {2}remotes\/origin\/feature [a-f0-9]{7} Feature commit B$/)
				)

				expect(console.log).toHaveBeenNthCalledWith(
					22,
					expect.stringMatching(/^ {2}remotes\/origin\/main {4}[a-f0-9]{7} Initial commit$/)
				)

				expect(console.log).toHaveBeenNthCalledWith(23, expect.stringMatching(/^1\.0\.0$/))

				expect(console.log).toHaveBeenNthCalledWith(24, expect.stringMatching(/^2\.0\.0$/))

				expect(console.log).toHaveBeenNthCalledWith(
					25,
					expect.stringMatching(/^On branch feature$/)
				)

				expect(console.log).toHaveBeenNthCalledWith(
					26,
					expect.stringMatching(
						/^Your branch is behind 'origin\/feature' by 2 commits, and can be fast-forwarded\.$/
					)
				)

				expect(console.log).toHaveBeenNthCalledWith(
					27,
					expect.stringMatching(/^ {2}\(use "git pull" to update your local branch\)$/)
				)

				expect(console.log).toHaveBeenNthCalledWith(28, expect.stringMatching(/^$/))

				expect(console.log).toHaveBeenNthCalledWith(
					29,
					expect.stringMatching(/^Changes to be committed:$/)
				)

				expect(console.log).toHaveBeenNthCalledWith(
					30,
					expect.stringMatching(/^ {2}\(use "git restore --staged <file>\.\.\." to unstage\)$/)
				)

				expect(console.log).toHaveBeenNthCalledWith(
					31,
					expect.stringMatching(/^\tnew file: {3}three\.md$/)
				)

				expect(console.log).toHaveBeenNthCalledWith(
					32,
					expect.stringMatching(/^\tnew file: {3}two\.md$/)
				)

				expect(console.log).toHaveBeenNthCalledWith(33, expect.stringMatching(/^$/))
			}).pipe(
				Effect.withSpan("git-tools-test"),
				Effect.provide(otel.layer),
				Effect.provide(Logger.json),
				Effect.withConsole(console)
			),
		{
			timeout: 10_000,
		}
	)
})
/* eslint-enable @typescript-eslint/unbound-method -- Test spies */
