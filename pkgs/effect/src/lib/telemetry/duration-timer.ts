import { type Effect, Metric } from "effect"
import * as MetricLabels from "./metric-labels.ts"

interface TimerProps {
	readonly name: string
	readonly boundaries: ReadonlyArray<number>
	readonly description: string | undefined
	readonly tags?: MetricLabels.Tags
}

interface DurationProps {
	tags?: MetricLabels.Tags
}

/**
 * Track the duration of an executor.
 * @param props - Timer props.
 * @param props.name - The name of the timer.
 * @param props.boundaries - The boundaries for the timer.
 * @param props.description - The description of the timer.
 * @param props.tags - The tags associated with the timer.
 * @returns A function that tracks the duration of the effect argument.
 */
const make = ({ name, boundaries, description, tags: timerTags = {} }: TimerProps) => {
	const timer = Metric.timerWithBoundaries(name, boundaries, description).pipe(
		Metric.taggedWithLabels(MetricLabels.make(timerTags))
	)
	return ({ tags = {} }: DurationProps = {}) =>
		<A, E, R>(effect: Effect.Effect<A, E, R>): Effect.Effect<A, E, R> =>
			Metric.trackDuration(effect, timer.pipe(Metric.taggedWithLabels(MetricLabels.make(tags))))
}
export { make }
