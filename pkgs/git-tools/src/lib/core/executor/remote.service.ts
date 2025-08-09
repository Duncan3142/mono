import { Data, type Duration, type Effect } from "effect"
import { Context } from "effect"
import { tag } from "#const"
import type { GitCommandFailedError, GitCommandTimeoutError } from "#domain/git.error"
import type { Remote } from "#domain/remote"

type RemoteMode = Data.TaggedEnum<{
	Add: { readonly remote: Remote }
}>

const { Add, $is, $match } = Data.taggedEnum<RemoteMode>()

interface Arguments {
	readonly mode: RemoteMode
	readonly directory: string
	readonly timeout: Duration.DurationInput
}

/**
 * Checkout command service
 */
class RemoteExecutor extends Context.Tag(tag(`executor`, `remote`))<
	RemoteExecutor,
	(args: Arguments) => Effect.Effect<void, GitCommandFailedError | GitCommandTimeoutError>
>() {}

export default RemoteExecutor

export { Add, $is, $match }

export type { Arguments }
