import { DurationTimer } from "@duncan3142/effect"

const BUCKET_COUNT = 10
const MAX_TIME = 4000 // 4 seconds

const duration = DurationTimer.make({
	name: "git.executor.duration",
	bucketCount: BUCKET_COUNT,
	maxTime: MAX_TIME,

	description: "Git executor duration in milliseconds",
	tags: { timer_core_key: "timer_core_value" },
})

export { duration }
