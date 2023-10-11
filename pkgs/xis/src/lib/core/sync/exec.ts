// exec(value: [Same<Args, undefined>] extends [true] ? In : never) {
//   return this.execArgs(value, undefined as Args)
// }
// execArgs(value: In, args: Args) {
//   return this._exec(value, { path: [], args }).mapLeft((fail) => new XisError(fail))
// }

// export type ExecError<ExecIssues extends XisIssueBase> = XisError<ExecIssues>
