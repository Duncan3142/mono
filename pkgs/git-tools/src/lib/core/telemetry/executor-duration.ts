import { Array, type Effect, Metric } from "effect"

const timer = Metric.timerWithBoundaries(
	"git-executor-duration",
	Array.range(1, 1_024),
	"A timer for git executor duration"
)

/**
 * Track the duration of an executor.
 * @param executorName - The name of the executor.
 * @returns A function that tracks the duration of the effect arugument.
 */
const duration =
	(executorName: string) =>
	<A, E, R>(effect: Effect.Effect<A, E, R>): Effect.Effect<A, E, R> =>
		Metric.trackDuration(effect, timer.pipe(Metric.tagged("executor", executorName)))

export { duration }
