import type { XisArg, XisCtxBase } from "#core/context.js"
import type { XisIssueBase } from "#core/error.js"
import type { EitherAsync } from "purify-ts/EitherAsync"
import type { ExecResultSync } from "./sync.js"
import { BookkeepingError, type XisBookKeeping } from "./book-keeping.js"
import type { XisProps } from "./prop.js"

export type ExecEitherAsync<Issues extends XisIssueBase, Out> = EitherAsync<Array<Issues>, Out>
export type ExecResultAsync<Issues extends XisIssueBase, Out> = Promise<
	ExecResultSync<Issues, Out>
>
export type ExecResultAsyncBase = ExecResultAsync<XisIssueBase, unknown>

export type XisAsyncFn<
	in In,
	out Issues extends XisIssueBase = never,
	out Out = In,
	Ctx extends XisCtxBase = null,
> = (args: XisArg<In, Ctx>) => ExecResultAsync<Issues, Out>

const ASYNC = "ASYNC"

export abstract class XisAsync<
	In,
	Issues extends XisIssueBase = never,
	Out = In,
	Props extends XisProps<Issues> = XisProps<Issues>,
	Ctx extends XisCtxBase = null,
> {
	#props: Props
	get mode(): typeof ASYNC {
		return ASYNC
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
	abstract exec(args: XisArg<In, Ctx>): ExecResultAsync<Issues, Out>
}

export type XisAsyncBase = XisAsync<any, XisIssueBase, unknown, any, any>
