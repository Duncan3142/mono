import { CheckSide, addElement as addCtxElement, type XisCtx } from "#core/context.js"
import { objectEntries, type TruePropertyKey } from "#util/base-type.js"

import {
	type ExIn,
	type InvokeMode,
	invoke,
	type ExCtx,
	type ExInvoke,
	type XisBase,
} from "#core/kernel.js"
import {
	type RecordIn,
	type RecordGuardIssues,
	type RecordExecIssues,
	type RecordOut,
	type RecordArgs,
	reduce,
	type PropertyKeyBase,
} from "./core.js"

import { isBaseObject } from "#core/base-type.js"
import { XisAsync, type ExecResultAsync, type ParseResultAsync } from "#core/async.js"
import { EitherAsync } from "purify-ts/EitherAsync"

export class XisRecordAsync<
	KeySchema extends PropertyKeyBase,
	ValueSchema extends XisBase,
> extends XisAsync<
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
	): ParseResultAsync<
		RecordGuardIssues<KeySchema, ValueSchema>,
		RecordExecIssues<KeySchema, ValueSchema>,
		RecordOut<KeySchema, ValueSchema>
	> {
		return EitherAsync.liftEither(isBaseObject(value, ctx))
			.chain((rec) => this.#invoke("parse", rec, ctx))
			.run()
	}

	exec(
		value: RecordIn<KeySchema, ValueSchema>,
		ctx: XisCtx<RecordArgs<KeySchema, ValueSchema>>
	): ExecResultAsync<
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

		return Promise.all(
			sourceEntries.map(async ([key, val]) => {
				const keyRes = Promise.resolve(
					invoke(
						mode,
						this.#keyCheck,
						key as ExIn<KeySchema>,
						addCtxElement(ctx, {
							segment: key,
							side: CheckSide.Key,
						}) as ExCtx<KeySchema>
					)
				)
				const valRes = Promise.resolve(
					invoke(
						mode,
						this.#valCheck,
						val as ExIn<ValueSchema>,
						addCtxElement(ctx, {
							segment: key,
							side: CheckSide.Value,
						}) as ExCtx<ValueSchema>
					)
				)

				const res = [await keyRes, await valRes] satisfies [
					Awaited<ExInvoke<KeySchema, Mode>>,
					Awaited<ExInvoke<ValueSchema, Mode>>,
				]
				return res
			})
		).then((results) => reduce(results)) as Res
	}
}

export const record = <KeySchema extends PropertyKeyBase, ValueSchema extends XisBase>(
	keyCheck: ExIn<KeySchema> extends TruePropertyKey ? KeySchema : never,
	valueCheck: ValueSchema
): XisRecordAsync<KeySchema, ValueSchema> => new XisRecordAsync(keyCheck, valueCheck)
