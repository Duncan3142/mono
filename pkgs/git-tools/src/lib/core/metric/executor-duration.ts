import { type Effect, Metric } from "effect"

const timer = Metric.timer("git-executor-duration", "A timer for git executor duration")

/**
 * Track the duration of an executor.
 * @param effect - The effect to track.
 * @returns A new effect that tracks the duration of the original effect.
 */
const duration = <A, E, R>(effect: Effect.Effect<A, E, R>): Effect.Effect<A, E, R> =>
	Metric.trackDuration(effect, timer)

export { duration }
