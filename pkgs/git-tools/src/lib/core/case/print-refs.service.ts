import { Effect, LogLevel, pipe } from "effect"
import PrintRefsCommandExecutor from "#command/print-refs-executor.service"
import { type REF_TYPE, TAG, BRANCH } from "#domain/reference"
import { tag } from "#const"
import RepositoryConfig from "#config/repository-config.service"
import { Repository } from "#domain/repository"

interface Arguments {
	level: Exclude<LogLevel.Literal, "None" | "All">
	message: string
}

/**
 * Print refs service
 */
class PrintRefs extends Effect.Service<PrintRefs>()(tag(`case`, `print-refs`), {
	effect: Effect.gen(function* () {
		const [commandExecutor, { directory }] = yield* Effect.all(
			[PrintRefsCommandExecutor, RepositoryConfig],
			{ concurrency: "unbounded" }
		)

		return ({ message, level: logLevelLiteral }: Arguments): Effect.Effect<void> =>
			Effect.gen(function* () {
				const doPrint = (type: REF_TYPE) =>
					commandExecutor({ type, repository: Repository({ directory }) })
				const logLevel = LogLevel.fromLiteral(logLevelLiteral)
				yield* pipe(
					Effect.all([Effect.logWithLevel(logLevel, message), doPrint(BRANCH), doPrint(TAG)], {
						discard: true,
					}),
					Effect.whenLogLevel(logLevel)
				)
			})
	}),
}) {}

export default PrintRefs
export type { Arguments }
