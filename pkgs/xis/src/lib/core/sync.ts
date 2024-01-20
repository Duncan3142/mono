import type { XisArg, XisCtxBase } from "#core/context.js"
import type { Either } from "purify-ts/Either"
import type { XisIssueBase } from "#core/error.js"
import { BookkeepingError, type XisBookKeeping } from "./book-keeping.js"
import type { XisProps } from "./prop.js"

export type ExecResultSync<Issues extends XisIssueBase, Out> = Either<Array<Issues>, Out>
export type ExecResultSyncBase = ExecResultSync<XisIssueBase, unknown>

export type XisSyncFn<
	in In,
	out Issues extends XisIssueBase = never,
	out Out = In,
	Ctx extends XisCtxBase = null,
> = (args: XisArg<In, Ctx>) => ExecResultSync<Issues, Out>

const SYNC = "SYNC"

export abstract class XisSync<
	In,
	Issues extends XisIssueBase = never,
	Out = In,
	Props extends XisProps<Issues> = XisProps<Issues>,
	Ctx extends XisCtxBase = null,
> {
	#props: Props
	get mode(): typeof SYNC {
		return SYNC
	}
	get messages(): Props["messages"] {
		return this.props.messages
	}
	get props(): Props {
		return this.#props
	}
	constructor(props: Props) {
		this.#props = props
	}
	get types(): XisBookKeeping<In, Issues, Out, Ctx> {
		throw new BookkeepingError()
	}
	abstract exec(args: XisArg<In, Ctx>): ExecResultSync<Issues, Out>
}

export type XisSyncBase = XisSync<any, XisIssueBase, unknown, any, any>

/* ---------------------------------- Test ---------------------------------- */

// type TestIssue = XisIssue<"TOO_HIGH"> | XisIssue<"TOO_LOW">

// interface TestProps extends XisProps<TestIssue> {
// 	limit: number
// 	messages: {
// 		TOO_HIGH?: string | ((limit: number) => string)
// 		TOO_LOW?: string | ((floor: number) => string)
// 	} | null
// }

// interface TestCtxObj extends XisCtxObj {
// 	getFloor: () => number
// }

// export class TestClass<Props extends TestProps> extends XisSync<
// 	number,
// 	TestIssue,
// 	number,
// 	Props,
// 	TestCtxObj
// > {
// 	exec(arg: XisArg<number, TestCtxObj>): ExecResultSync<TestIssue, number> {
// 		const { value, ctx, path } = arg
// 		const { limit } = this.props
// 		const floor = ctx.getFloor()
// 		if (value < limit && value > floor) {
// 			return Right(value)
// 		} else if (value < floor) {
// 			const builder = this.messages?.TOO_LOW
// 			const message =
// 				builder === undefined
// 					? "Too low"
// 					: typeof builder === "string"
// 						? builder
// 						: builder(floor)

// 			return Left([{ name: "TOO_LOW", message, path }])
// 		} else {
// 			const builder = this.messages?.TOO_HIGH
// 			const message =
// 				builder === undefined
// 					? "Too high"
// 					: typeof builder === "string"
// 						? builder
// 						: builder(floor)
// 			return Left([{ name: "TOO_HIGH", message, path }])
// 		}
// 	}
// }

// const test = new TestClass({
// 	limit: 10,
// 	// messages: null,
// 	messages: {
// 		TOO_HIGH: (limit: number) => `Must be less than ${limit}`,
// 	},
// })

// test.exec({
// 	value: 11,
// 	path: [],
// 	ctx: {
// 		getFloor: () => 0,
// 	},
// })

// export const m = test.messages.TOO_HIGH(10)
