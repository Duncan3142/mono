import type { XisArg, XisCtxObj } from "#core/context.js"
import type { XisIssue } from "#core/error.js"
import { XisSync, type ExecResultSync } from "#core/sync.js"
import { Left, Right } from "purify-ts/Either"

type TestIssue = XisIssue<"TOO_HIGH"> | XisIssue<"TOO_LOW">

type TestMessages = {
	TOO_HIGH?: (limit: number) => string
	TOO_LOW?: string | ((floor: number) => string)
} | null

interface TestProps<Messages extends TestMessages> {
	limit: number
	messages: Messages
}

interface TestCtxObj extends XisCtxObj {
	getFloor: () => number
}

export class TestClass<Messages extends TestMessages> extends XisSync<
	number,
	TestIssue,
	number,
	Messages,
	TestCtxObj
> {
	#props: TestProps<Messages>

	constructor(props: TestProps<Messages>) {
		super()
		this.#props = props
	}
	override get messages(): Messages {
		return this.#props.messages
	}
	exec(args: XisArg<number, TestCtxObj>): ExecResultSync<TestIssue, number> {
		const { value, ctx, path } = args
		const { limit } = this.#props
		const floor = ctx.getFloor()
		if (value < limit && value > floor) {
			return Right(value)
		} else if (value < floor) {
			const builder = this.messages?.TOO_LOW
			const message =
				builder === undefined
					? "Too low"
					: typeof builder === "string"
						? builder
						: builder(floor)

			return Left([{ name: "TOO_LOW", message, path }])
		} else {
			const builder = this.messages?.TOO_HIGH
			const message = builder === undefined ? `${value} is too high` : builder(limit)
			return Left([{ name: "TOO_HIGH", message, path }])
		}
	}
}

const test = new TestClass({
	limit: 10,
	// messages: null,
	messages: {
		TOO_HIGH: (limit: number) => `Must be less than ${limit}`,
	},
})

test.exec({
	value: 11,
	path: [],
	ctx: {
		getFloor: () => 0,
	},
})

export const m = test.messages.TOO_HIGH(10)
