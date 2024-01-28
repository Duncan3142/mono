import { XisSync, type ExecResultSync, type XisSyncBase } from "#core/sync.js"
import type { XisObjectIssues, XisObjectOut, XisObjectCtx, XisObjectIn } from "./core.js"
import type { XisExecArgs } from "#core/args.js"
import { Effect } from "#core/book-keeping.js"
import { exKeyName, type ShapeKeyBase } from "../shape/core.js"
import { objectEntries, type TruePropertyKey } from "#util/base-type.js"
import { Right } from "purify-ts/Either"
import { CheckSide, addElement } from "#core/path.js"
import { mergeIssues } from "#core/kernel.js"

export type XisSyncPropBase = [ShapeKeyBase, XisSyncBase]

export type XisObjectSyncProps<Schema extends [...Array<XisSyncPropBase>]> = {
	schema: [...Schema]
}

export interface XisObjectSyncArgs<Schema extends [...Array<XisSyncPropBase>]> {
	props: XisObjectSyncProps<Schema>
}

export class XisObjectSync<Schema extends [...Array<XisSyncPropBase>]> extends XisSync<
	XisObjectIn<Schema>,
	XisObjectIssues<Schema>,
	XisObjectOut<Schema>,
	typeof Effect.Transform,
	XisObjectCtx<Schema>
> {
	readonly #props: XisObjectSyncProps<Schema>

	constructor(args: XisObjectSyncArgs<Schema>) {
		super()
		this.#props = args.props
	}

	override get effect(): typeof Effect.Transform {
		return Effect.Transform
	}

	#process(args: XisExecArgs<XisObjectIn<Schema>, XisObjectCtx<Schema>>): {
		remaining: Map<TruePropertyKey, unknown>
		result: ExecResultSync<XisObjectIssues<Schema>, Map<TruePropertyKey, unknown>>
	} {
		const { schema } = this.#props
		const { value, ctx, path, locale } = args
		const entries = objectEntries(value)
		return schema.reduce<{
			remaining: Map<TruePropertyKey, unknown>
			result: ExecResultSync<XisObjectIssues<Schema>, Map<TruePropertyKey, unknown>>
		}>(
			({ remaining, result: acc }, [key, check]) => {
				const keyName = exKeyName(key)
				if (remaining.has(keyName)) {
					const prop = remaining.get(keyName)
					remaining.delete(keyName)
					const res = check.exec({
						value: prop,
						ctx,
						path: addElement(path, {
							segment: keyName,
							side: CheckSide.Value,
						}),
						locale,
					})
					const result = res.caseOf({
						Left: (issues) => mergeIssues(acc, issues as XisObjectIssues<Schema>),
						Right: (prop) => acc.map((current) => current.set(keyName, prop)),
					})

					return { remaining, result }
				}

				return {
					remaining,
					result: acc,
				}
			},
			{
				remaining: new Map(entries),
				result: Right(new Map<TruePropertyKey, unknown>()),
			}
		)
	}

	exec(
		args: XisExecArgs<XisObjectIn<Schema>, XisObjectCtx<Schema>>
	): ExecResultSync<XisObjectIssues<Schema>, XisObjectOut<Schema>> {
		const { result, remaining } = this.#process(args)
		return result.map(
			(entries) => Object.fromEntries([...entries, ...remaining]) as XisObjectOut<Schema>
		)
	}
}

export const object = <Schema extends [...Array<XisSyncPropBase>]>(
	args: XisObjectSyncArgs<Schema>
): XisObjectSync<Schema> => new XisObjectSync(args)
