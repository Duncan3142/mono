import type { XisExecArgs } from "#core/args.js"
import { XisSync, type ExecResultSync } from "#core/sync.js"
import { Effect } from "#core/book-keeping.js"
import type { XisMessages } from "#core/messages.js"
import {
	XIS_MISSING_PROPERTY,
	type MissingPropertyIssue,
	type Shape,
	type ShapeKeyBase,
	type XisShapeProps,
	buildMissingIssues,
} from "./core.js"
import { objectEntries, type BaseObject } from "#util/base-type.js"
import { Left, Right } from "purify-ts/Either"

export interface XisStripMessages extends XisMessages<MissingPropertyIssue> {
	XIS_MISSING_PROPERTY: XIS_MISSING_PROPERTY
}

export interface XisStripArgs<Schema extends [...Array<ShapeKeyBase>]> {
	props: XisShapeProps<Schema>
	messages: XisStripMessages | null
}

export class XisStrip<Schema extends [...Array<ShapeKeyBase>]> extends XisSync<
	BaseObject,
	MissingPropertyIssue,
	Shape<Schema>
> {
	#props: XisShapeProps<Schema>
	#messages: XisStripMessages

	constructor(args: XisStripArgs<Schema>) {
		super()
		this.#props = args.props
		this.#messages = args.messages ?? {
			XIS_MISSING_PROPERTY,
		}
	}

	override get effect(): Effect {
		return Effect.Transform
	}

	exec(args: XisExecArgs<BaseObject>): ExecResultSync<MissingPropertyIssue, Shape<Schema>> {
		const { value, path, locale } = args
		const { keys: desired } = this.#props
		const { found, missing } = buildMissingIssues({
			desired,
			entries: objectEntries(value),
			locale,
			path,
			msgBuilder: this.#messages.XIS_MISSING_PROPERTY,
		})
		return missing.length > 0
			? Left(missing)
			: Right(Object.fromEntries(found) as Shape<Schema>)
	}
}

export const strip = <Schema extends [...Array<ShapeKeyBase>]>(
	args: XisStripArgs<Schema>
): XisStrip<Schema> => new XisStrip(args)
