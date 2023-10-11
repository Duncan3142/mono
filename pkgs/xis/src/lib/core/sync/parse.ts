// parse(value: [Same<Args, undefined>] extends [true] ? unknown : never) {
//   return this.parseArgs(value, undefined as Args)
// }
// parseArgs(value: unknown, args: Args) {
//   const ctx = { path: [], args }

//   return this._guard(value, ctx).caseOf<
//     Either<XisError<GuardIssues> | XisError<ExecIssues>, Out>
//   >({
//     Left: (fail) => Left(new XisError(fail)),
//     Right: (pass) => this._exec(pass, ctx).mapLeft((fail) => new XisError(fail)),
//   })
// }

// export type ParseError<GuardIssues extends XisIssueBase, ExecIssues extends XisIssueBase> =
// 	| XisError<GuardIssues>
// 	| XisError<ExecIssues>
