import type { ExecaScriptMethod } from "execa"

type BaseExecOptions =
	ExecaScriptMethod extends ExecaScriptMethod<infer Options> ? Options : never

/**
 * ExecOptions type
 */
type ExecOptions = Omit<BaseExecOptions, "reject">

/**
 * Custom ExecaScript type that extends the ExecaScriptMethod type
 */
type ExecaScript<Options extends ExecOptions = ExecOptions> = ExecaScriptMethod<
	Options & { reject: false }
>

export type { ExecaScript, ExecOptions }
