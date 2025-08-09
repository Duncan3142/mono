import { Data, type Duration, type Effect } from "effect"
import { Context } from "effect"
import * as Const from "#const"
import * as GitCommandError from "#domain/git-command.error"
import * as Remote from "#domain/remote"

type RemoteMode = Data.TaggedEnum<{
	Add: { readonly remote: Remote.Remote }
}>

const RemoteMode = Data.taggedEnum<RemoteMode>()

interface Arguments {
	readonly mode: RemoteMode
	readonly directory: string
	readonly timeout: Duration.DurationInput
}

/**
 * Checkout command service
 */
class RemoteExecutor extends Context.Tag(Const.tag(`executor`, `remote`))<
	RemoteExecutor,
	(args: Arguments) => Effect.Effect<void, GitCommandError.Failed | GitCommandError.Timeout>
>() {}

export { RemoteExecutor, RemoteMode }
export type { Arguments }
