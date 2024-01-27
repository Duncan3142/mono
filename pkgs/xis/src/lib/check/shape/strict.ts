import type { TruePropertyKey } from "#util/base-type.js"
import { CheckSide, addElement as addCtxElement, type XisCtx } from "#core/context.js"
import {
	XisSync,
	type ExecResultSync,
	type ParseResultSync,
	type XisSyncBase,
} from "#core/sync.js"
import {
	guard,
	reduce,
	type ShapeIn,
	type ShapeGuardIssues,
	type ShapeExecIssues,
	type ShapeOut,
	type ShapeArgs,
	ShapeCheckMode,
	type PassThrough,
	type Strip,
	type Strict,
	type ShapeDefaultMode,
	type BaseKey,
	type Prop,
} from "./core.js"

export type BaseSyncProp = Prop<BaseKey, XisSyncBase>

export class XisShapeSync<
	S extends [...Array<BaseSyncProp>],
	CM extends ShapeCheckMode,
> extends XisSync<
	ShapeIn<S, CM>,
	ShapeGuardIssues<S, CM>,
	ShapeExecIssues<S, CM>,
	ShapeOut<S, CM>,
	ShapeArgs<S>
> {
	readonly #shape: [...S]

	readonly #mode: CM

	constructor(shp: [...S], mode: CM) {
		super()
		this.#shape = shp
		this.#mode = mode
	}

	get schema(): [...S] {
		return this.#shape
	}

	get mode(): CM {
		return this.#mode
	}

	parse(
		value: unknown,
		ctx: XisCtx<ShapeArgs<S>>
	): ParseResultSync<ShapeGuardIssues<S, CM>, ShapeExecIssues<S, CM>, ShapeOut<S, CM>> {
		type Res = ParseResultSync<ShapeGuardIssues<S, CM>, ShapeExecIssues<S, CM>, ShapeOut<S, CM>>
		return guard(value, this.#shape, this.#mode, ctx).chain(([pending, extra]) => {
			const mapped = pending.map(([key, check, value]) =>
				check
					.parse(value, addCtxElement(ctx, { segment: key, side: CheckSide.Value }))
					.map((out) => [key, out] satisfies [TruePropertyKey, unknown])
			)

			return reduce(mapped, extra)
		}) as Res
	}

	exec(
		value: ShapeIn<S, CM>,
		ctx: XisCtx<ShapeArgs<S>>
	): ExecResultSync<ShapeExecIssues<S, CM>, ShapeOut<S, CM>> {
		type Res = ExecResultSync<ShapeExecIssues<S, CM>, ShapeOut<S, CM>>
		return this.parse(value, ctx) as Res
	}

	passThrough(): XisShapeSync<S, PassThrough> {
		return new XisShapeSync(this.#shape, ShapeCheckMode.PASS_THROUGH)
	}

	strip(): XisShapeSync<S, Strip> {
		return new XisShapeSync(this.#shape, ShapeCheckMode.STRIP)
	}

	strict(): XisShapeSync<S, Strict> {
		return new XisShapeSync(this.#shape, ShapeCheckMode.STRICT)
	}
}

export const shape = <S extends [...Array<BaseSyncProp>]>(
	shape: [...S]
): XisShapeSync<S, ShapeDefaultMode> =>
	new XisShapeSync<S, ShapeDefaultMode>(shape, ShapeCheckMode.STRIP)
