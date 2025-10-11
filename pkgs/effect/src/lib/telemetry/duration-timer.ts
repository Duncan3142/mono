import { type Effect, Metric, pipe, Array } from "effect"
import * as MetricLabels from "./metric-labels.ts"

type Milliseconds = number

interface TimerProps {
	readonly name: string
	readonly bucketCount: number
	readonly maxTime: Milliseconds
	readonly description?: string
	readonly tags?: MetricLabels.Tags
}

interface DurationProps {
	tags?: MetricLabels.Tags
}

/**
 * Track the duration of an executor.
 * @param props - Timer props.
 * @param props.name - The name of the timer.
 * @param props.description - The description of the timer.
 * @param props.tags - The tags associated with the timer.
 * @param props.bucketCount - The number of buckets to use for the timer.
 * @param props.maxTime - The maximum time for the timer range.
 * @returns A function that tracks the duration of the effect argument.
 */
const make = ({
	name,
	bucketCount,
	maxTime,
	description,
	tags: timerTags = {},
}: TimerProps) => {
	const scaleBuckets = (bucket: number) => Math.floor((bucket * maxTime) / bucketCount)
	const boundaries = pipe(Array.range(0, bucketCount), Array.map(scaleBuckets))
	const timer = Metric.timerWithBoundaries(name, boundaries, description).pipe(
		Metric.taggedWithLabels(MetricLabels.make(timerTags))
	)
	return ({ tags = {} }: DurationProps = {}) =>
		<A, E, R>(effect: Effect.Effect<A, E, R>): Effect.Effect<A, E, R> =>
			Metric.trackDuration(effect, timer.pipe(Metric.taggedWithLabels(MetricLabels.make(tags))))
}
export { make }
export type { TimerProps, DurationProps, Milliseconds }
