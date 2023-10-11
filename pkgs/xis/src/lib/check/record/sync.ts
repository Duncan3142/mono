import { CheckSide, addElement as addCtxElement, type XisCtx } from "#core/context.js"
import { objectEntries, type TruePropertyKey } from "#util/base-type.js"

import { type ExIn, type InvokeMode, invoke, type ExCtx, type ExInvoke } from "#core/kernel.js"
import {
	type RecordIn,
	type RecordGuardIssues,
	type RecordExecIssues,
	type RecordOut,
	type RecordArgs,
	reduce,
} from "./core.js"
import {
	XisSync,
	type ExecResultSync,
	type ParseResultSync,
	type XisSyncBase,
} from "#core/sync.js"
import type { XisIssueBase } from "#core/error.js"
import { isBaseObject } from "#core/base-type.js"

type SyncPropertyKeyBase = XisSync<any, XisIssueBase, XisIssueBase, TruePropertyKey, any>

export class XisRecordSync<
	KeySchema extends SyncPropertyKeyBase,
	ValueSchema extends XisSyncBase,
> extends XisSync<
	RecordIn<KeySchema, ValueSchema>,
	RecordGuardIssues<KeySchema, ValueSchema>,
	RecordExecIssues<KeySchema, ValueSchema>,
	RecordOut<KeySchema, ValueSchema>,
	RecordArgs<KeySchema, ValueSchema>
> {
	readonly #keyCheck: KeySchema

	readonly #valCheck: ValueSchema

	constructor(
		kCheck: ExIn<KeySchema> extends TruePropertyKey ? KeySchema : never,
		vCheck: ValueSchema
	) {
		super()
		this.#keyCheck = kCheck
		this.#valCheck = vCheck
	}

	parse(
		value: unknown,
		ctx: XisCtx<RecordArgs<KeySchema, ValueSchema>>
	): ParseResultSync<
		RecordGuardIssues<KeySchema, ValueSchema>,
		RecordExecIssues<KeySchema, ValueSchema>,
		RecordOut<KeySchema, ValueSchema>
	> {
		return isBaseObject(value, ctx).chain((rec) => this.#invoke("parse", rec, ctx))
	}

	exec(
		value: RecordIn<KeySchema, ValueSchema>,
		ctx: XisCtx<RecordArgs<KeySchema, ValueSchema>>
	): ExecResultSync<
		RecordExecIssues<KeySchema, ValueSchema>,
		RecordOut<KeySchema, ValueSchema>
	> {
		return this.#invoke("exec", value, ctx)
	}

	#invoke<Mode extends InvokeMode>(
		mode: Mode,
		value: Record<TruePropertyKey, unknown>,
		ctx: XisCtx<RecordArgs<KeySchema, ValueSchema>>
	): ExInvoke<this, Mode> {
		type Res = ExInvoke<this, Mode>
		const sourceEntries = objectEntries(value)

		const results = sourceEntries.map(([key, val]) => {
			const keyRes = invoke(
				mode,
				this.#keyCheck,
				key as ExIn<KeySchema>,
				addCtxElement(ctx, {
					segment: key,
					side: CheckSide.Key,
				}) as ExCtx<KeySchema>
			)
			const valRes = invoke(
				mode,
				this.#valCheck,
				val as ExIn<ValueSchema>,
				addCtxElement(ctx, {
					segment: key,
					side: CheckSide.Value,
				}) as ExCtx<ValueSchema>
			)

			return [keyRes, valRes] as [ExInvoke<KeySchema, Mode>, ExInvoke<ValueSchema, Mode>]
		})

		return reduce(results) as Res
	}
}

export const record = <KeySchema extends SyncPropertyKeyBase, ValueSchema extends XisSyncBase>(
	keyCheck: ExIn<KeySchema> extends TruePropertyKey ? KeySchema : never,
	valueCheck: ValueSchema
): XisRecordSync<KeySchema, ValueSchema> => new XisRecordSync(keyCheck, valueCheck)
