import type { XisArg, XisCtxBase } from "#core/context.js"
import type { Either } from "purify-ts/Either"
import { type Maybe, Just, Nothing } from "purify-ts/Maybe"
import type { XisIssueBase } from "#core/error.js"
import { BookkeepingError, type XisBookKeeping } from "./book-keeping.js"
import type { XisPropsBase } from "./prop.js"

export type ExecResultSync<Issues extends XisIssueBase, Out> = Either<Array<Issues>, Out>
export type ExecResultSyncBase = ExecResultSync<XisIssueBase, unknown>

export type XisSyncFn<
	in In,
	out Issues extends XisIssueBase = never,
	out Out = In,
	Ctx extends XisCtxBase = undefined,
> = (args: XisArg<In, Ctx>) => ExecResultSync<Issues, Out>

const SYNC = "SYNC"

export abstract class XisSync<
	In,
	Issues extends XisIssueBase = never,
	Out = In,
	Props extends XisPropsBase = XisPropsBase,
	Ctx extends XisCtxBase = undefined,
> {
	#props: Props
	get mode(): typeof SYNC {
		return SYNC
	}
	get messages(): Maybe<Props["messages"]> {
		if (this.props.messages === undefined) {
			return Nothing
		}
		return Just(this.props.messages)
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

// interface TestProps extends XisPropsBase {
// 	limit: number
// }

// interface TestCtx extends XisCtx {
// 	getFloor: () => number
// }

// export class TestClass<Props extends TestProps> extends XisSync<
// 	number,
// 	XisIssue<"TOO_HIGH">,
// 	number,
// 	Props,
// 	TestCtx
// > {
// 	exec(arg: XisArg<number, TestCtx>): ExecResultSync<XisIssue<"TOO_HIGH">, number> {
// 		const { value, ctx, path } = arg
// 		const { limit } = this.props
// 		const floor = ctx.getFloor()
// 		if (value < limit && value > floor) {
// 			return Right(value)
// 		} else {
// 			return Left([{ name: "TOO_HIGH", path }])
// 		}
// 	}
// }

// const test = new TestClass({
// 	limit: 10,
// 	messages: {
// 		TOO_HIGH: (limit: number) => `Must be less than ${limit}`,
// 	},
// })

// test.messages.extract()?.TOO_HIGH(10)
