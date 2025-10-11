import { DurationTimer } from "@duncan3142/effect"
import { Array, pipe } from "effect"

const BUCKET_COUNT = 10
const MAX_TIME = 4000 // 4 seconds
const scaleBuckets = (bucket: number) => Math.floor((bucket * MAX_TIME) / BUCKET_COUNT)

const duration = DurationTimer.make({
	name: "git.executor.duration",
	boundaries: pipe(Array.range(0, BUCKET_COUNT), Array.map(scaleBuckets)),
	description: "Git executor duration in milliseconds",
	tags: { timer_core_key: "timer_core_value" },
})

export { duration }
