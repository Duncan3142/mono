import { objectEntries, tup, type TruePropertyKey } from "#util/base-type.js"
import { type ExIn } from "#core/kernel.js"
import {
	type RecordIn,
	type RecordIssues,
	type RecordOut,
	type RecordCtx,
	reduce,
} from "./core.js"
import { XisSync, type ExecResultSync, type XisSyncBase } from "#core/sync.js"
import type { XisIssueBase } from "#core/error.js"
import type { XisExecArgs } from "#core/args.js"
import { addElement, CheckSide } from "#core/path.js"

type SyncPropertyKeyBase = XisSync<any, XisIssueBase, TruePropertyKey, any>

export interface XisRecordSyncProps<
	KeySchema extends SyncPropertyKeyBase,
	ValueSchema extends XisSyncBase,
> {
	keyCheck: [ExIn<KeySchema>] extends [TruePropertyKey] ? KeySchema : never
	valueCheck: ValueSchema
}

export interface XisRecordSyncArgs<
	KeySchema extends SyncPropertyKeyBase,
	ValueSchema extends XisSyncBase,
> {
	props: XisRecordSyncProps<KeySchema, ValueSchema>
}

export class XisRecordSync<
	KeySchema extends SyncPropertyKeyBase,
	ValueSchema extends XisSyncBase,
> extends XisSync<
	RecordIn<KeySchema, ValueSchema>,
	RecordIssues<KeySchema, ValueSchema>,
	RecordOut<KeySchema, ValueSchema>,
	RecordCtx<KeySchema, ValueSchema>
> {
	readonly #props: XisRecordSyncProps<KeySchema, ValueSchema>

	constructor(args: XisRecordSyncArgs<KeySchema, ValueSchema>) {
		super()
		this.#props = args.props
	}

	exec(
		args: XisExecArgs<RecordIn<KeySchema, ValueSchema>, RecordCtx<KeySchema, ValueSchema>>
	): ExecResultSync<RecordIssues<KeySchema, ValueSchema>, RecordOut<KeySchema, ValueSchema>> {
		const { value, ctx, locale, path } = args
		const { keyCheck, valueCheck } = this.#props
		const sourceEntries = objectEntries(value)

		const results = sourceEntries.map(([key, val]) => {
			const keyRes = keyCheck.exec({
				value: key,
				locale,
				path: addElement(path, {
					segment: key,
					side: CheckSide.Key,
				}),
				ctx,
			})
			const valRes = valueCheck.exec({
				value: val,
				locale,
				path: addElement(path, {
					segment: key,
					side: CheckSide.Value,
				}),
				ctx,
			})

			return tup(keyRes, valRes)
		})

		return reduce(results) as ExecResultSync<
			RecordIssues<KeySchema, ValueSchema>,
			RecordOut<KeySchema, ValueSchema>
		>
	}
}

export const record = <KeySchema extends SyncPropertyKeyBase, ValueSchema extends XisSyncBase>(
	args: XisRecordSyncArgs<KeySchema, ValueSchema>
): XisRecordSync<KeySchema, ValueSchema> => new XisRecordSync(args)
