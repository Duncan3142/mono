import type { XisOptArgs } from "./context.js"
import type { XisIssueBase } from "./error.js"

interface XBK<
	In,
	GuardIssues extends XisIssueBase = never,
	ExecIssues extends XisIssueBase = never,
	Out = In,
	Args extends XisOptArgs = undefined,
> {
	i: In
	gi: GuardIssues
	ei: ExecIssues
	o: Out
	a: Args
}

export class XisBookKeeping<
	In,
	GuardIssues extends XisIssueBase = never,
	ExecIssues extends XisIssueBase = never,
	Out = In,
	Args extends XisOptArgs = undefined,
> {
	get _bk(): XBK<In, GuardIssues, ExecIssues, Out, Args> {
		throw new Error("This is type-system book keeping")
	}
}
