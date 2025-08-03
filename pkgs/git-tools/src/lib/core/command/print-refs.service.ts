import { Effect, Console, pipe } from "effect"
import PrintRefsExecutor from "#executor/print-refs.service"
import { TAG, BRANCH } from "#domain/reference"
import { tag } from "#const"

interface Arguments {
	readonly directory: string
}

/**
 * Print refs service
 */
class PrintRefsCommand extends Effect.Service<PrintRefsCommand>()(
	tag(`command`, `print-refs`),
	{
		effect: Effect.gen(function* () {
			const commandExecutor = yield* PrintRefsExecutor

			return ({ directory }: Arguments): Effect.Effect<void> =>
				Effect.gen(function* () {
					yield* pipe(
						Effect.all(
							[
								Console.log("Branches:"),
								commandExecutor({ type: BRANCH, directory }),
								Console.log("Tags:"),
								commandExecutor({ type: TAG, directory }),
							],
							{
								discard: true,
							}
						)
					)
				})
		}),
	}
) {}

export default PrintRefsCommand
export type { Arguments }
