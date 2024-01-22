import type { XisArgs } from "#core/context.js"
import type { XisIssue } from "#core/error.js"
import { lift } from "#core/lift.js"
import { XisSync, type ExecResultSync } from "#core/sync.js"
import { Right } from "purify-ts/Either"

type TestIssues = XisIssue<"BAD">

type TestMessages = {
	BAD?: () => string
	NO_GOOD?: string
} | null

interface TestProps<Messages extends TestMessages> {
	messages: Messages
}

type TestCtxObj = { now: Date }

export class XT<Messages extends TestMessages> extends XisSync<
	number,
	TestIssues,
	string,
	TestMessages,
	TestCtxObj
> {
	#props: TestProps<Messages>
	constructor(props: TestProps<Messages>) {
		super()
		this.#props = props
	}
	get messages(): Messages {
		return this.#props.messages
	}
	override exec(
		args: XisArgs<number, TestMessages, TestCtxObj>
	): ExecResultSync<TestIssues, string> {
		return Right(`Hello ${args.ctx.now.toISOString()}`)
	}
}

const inner = new XT({
	messages: {
		BAD: () => "MEANING GOOD",
	},
})

inner.messages

const x = lift(inner)

export const a = x.exec({
	value: 1,
	path: [],
	messages: {
		NO_GOOD: "No good",
	},
	ctx: {
		now: new Date(),
	},
})
