import type { XisArg, XisCtxBase } from "#core/context.js"
import type { XisIssueBase } from "#core/error.js"
import type { EitherAsync } from "purify-ts/EitherAsync"
import type { ExecResultSync } from "./sync.js"
import { BookkeepingError, type XisBookKeeping } from "./book-keeping.js"
import type { XisPropsBase } from "./prop.js"
import { Nothing, type Maybe, Just } from "purify-ts/Maybe"

export type ExecEitherAsync<Issues extends XisIssueBase, Out> = EitherAsync<Array<Issues>, Out>

export type ExecResultAsync<Issues extends XisIssueBase, Out> = Promise<
	ExecResultSync<Issues, Out>
>
export type ExecResultAsyncBase = ExecResultAsync<XisIssueBase, unknown>

export type XisAsyncFn<
	in In,
	out Issues extends XisIssueBase = never,
	out Out = In,
	Ctx extends XisCtxBase = undefined,
> = (args: XisArg<In, Ctx>) => ExecResultAsync<Issues, Out>

const ASYNC = "ASYNC"

export abstract class XisAsync<
	In,
	Issues extends XisIssueBase = never,
	Out = In,
	Props extends XisPropsBase = XisPropsBase,
	Ctx extends XisCtxBase = undefined,
> {
	#props: Props
	get mode(): typeof ASYNC {
		return ASYNC
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
	abstract exec(args: XisArg<In, Ctx>): ExecResultAsync<Issues, Out>
}

export type XisAsyncBase = XisAsync<any, XisIssueBase, unknown, any, any>
