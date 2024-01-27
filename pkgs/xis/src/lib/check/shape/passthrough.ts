import type { XisExecArgs } from "#core/args.js"
import { XisSync, type ExecResultSync } from "#core/sync.js"
import { Effect } from "#core/book-keeping.js"
import type { XisMessages } from "#core/messages.js"
import {
	XIS_MISSING_PROPERTY,
	type MissingPropertyIssue,
	type Shape,
	type ShapeKeyBase,
	exKeyName,
	isOptionalKey,
	missingIssue,
} from "./core.js"
import type { BaseObject } from "#util/base-type.js"
import { type Maybe, Nothing, Just } from "purify-ts/Maybe"
import { Left, Right } from "purify-ts/Either"

export interface XisPassthroughMessages extends XisMessages<MissingPropertyIssue> {
	XIS_MISSING_PROPERTY: XIS_MISSING_PROPERTY
}

export interface XisPassthroughProps<Schema extends [...Array<ShapeKeyBase>]> {
	keys: Schema
}

export interface XisPassthroughArgs<Schema extends [...Array<ShapeKeyBase>]> {
	props: XisPassthroughProps<Schema>
	messages: XisPassthroughMessages | null
}

export class XisPassthrough<Schema extends [...Array<ShapeKeyBase>]> extends XisSync<
	BaseObject,
	MissingPropertyIssue,
	Shape<Schema>
> {
	#props: XisPassthroughProps<Schema>
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
		const keys = Reflect.ownKeys(value)
		const reduced = desired.reduce<Maybe<Array<MissingPropertyIssue>>>((acc, key) => {
			const keyName = exKeyName(key)
			if (keys.includes(keyName) || isOptionalKey(key)) return acc
			const issue = missingIssue({
				key: keyName,
				locale,
				path,
				msgBuilder: this.#messages.XIS_MISSING_PROPERTY,
			})
			return acc.caseOf({
				Just: (issues) => Just([...issues, issue]),
				Nothing: () => Just([issue]),
			})
		}, Nothing)
		return reduced.caseOf({
			Just: (issues) => Left(issues),
			Nothing: () => Right(value as Shape<Schema>),
		})
	}
}

export const passthrough = <Schema extends [...Array<ShapeKeyBase>]>(
	args: XisPassthroughArgs<Schema>
): XisPassthrough<Schema> => new XisPassthrough(args)
