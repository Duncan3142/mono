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
import type { BaseObject } from "#util/base-type.js"
import { Left, Right } from "purify-ts/Either"

export interface XisPassthroughMessages extends XisMessages<MissingPropertyIssue> {
	XIS_MISSING_PROPERTY: XIS_MISSING_PROPERTY
}

export interface XisPassthroughArgs<Schema extends [...Array<ShapeKeyBase>]> {
	props: XisShapeProps<Schema>
	messages: XisPassthroughMessages | null
}

export class XisPassthrough<Schema extends [...Array<ShapeKeyBase>]> extends XisSync<
	BaseObject,
	MissingPropertyIssue,
	Shape<Schema>
> {
	#props: XisShapeProps<Schema>
	#messages: XisPassthroughMessages

	constructor(args: XisPassthroughArgs<Schema>) {
		super()
		this.#props = args.props
		this.#messages = args.messages ?? {
			XIS_MISSING_PROPERTY,
		}
	}

	override get effect(): Effect {
		return Effect.Validate
	}

	exec(args: XisExecArgs<BaseObject>): ExecResultSync<MissingPropertyIssue, Shape<Schema>> {
		const { value, path, locale } = args
		const { keys: desired } = this.#props
		const remainingKeys = new Set(Reflect.ownKeys(value))
		const missingIssues = buildMissingIssues({
			desired,
			remainingKeys,
			locale,
			path,
			msgBuilder: this.#messages.XIS_MISSING_PROPERTY,
		})
		return missingIssues.caseOf({
			Just: (issues) => Left(issues),
			Nothing: () => Right(value as Shape<Schema>),
		})
	}
}

export const passthrough = <Schema extends [...Array<ShapeKeyBase>]>(
	args: XisPassthroughArgs<Schema>
): XisPassthrough<Schema> => new XisPassthrough(args)
