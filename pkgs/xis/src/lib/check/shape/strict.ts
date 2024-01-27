import type { XisExecArgs } from "#core/args.js"
import { XisSync, type ExecResultSync } from "#core/sync.js"
import { Effect } from "#core/book-keeping.js"
import type { XisMessages, XisMsgArgs, XisMsgBuilder } from "#core/messages.js"
import {
	XIS_MISSING_PROPERTY,
	type MissingPropertyIssue,
	type Shape,
	type ShapeKeyBase,
	type XisShapeProps,
	buildMissingIssues,
} from "./core.js"
import type { BaseObject, BaseProp, TruePropertyKey } from "#util/base-type.js"
import { Nothing, Just } from "purify-ts/Maybe"
import { Left, Right } from "purify-ts/Either"
import type { XisIssue } from "#core/error.js"
import type { XisPath } from "#core/path.js"

export interface ExtraPropertyIssue extends XisIssue<"XIS_EXTRA_PROPERTY"> {
	key: TruePropertyKey
	value: unknown
}

export type XIS_EXTRA_PROPERTY = XisMsgBuilder<BaseProp>

export const XIS_EXTRA_PROPERTY = (args: XisMsgArgs<BaseProp>) => {
	const { value, path } = args
	const [key, val] = value
	return `object has extra property "${String(key)}", with value ${JSON.stringify(val)}, at path "${JSON.stringify(path)}"`
}

export interface ExtraIssuesArgs {
	extraEntry: BaseProp
	locale: string
	msgBuilder: XIS_EXTRA_PROPERTY
	path: XisPath
}

export const extraIssue = (args: ExtraIssuesArgs): ExtraPropertyIssue => {
	const {
		extraEntry: [key, value],
		locale,
		msgBuilder,
		path,
	} = args

	return {
		name: "XIS_EXTRA_PROPERTY" as const,
		value,
		message: msgBuilder({ value: [key, value], path, locale, props: null, ctx: null }),
		path,
		key,
	}
}

export type XisStrictIssues = MissingPropertyIssue | ExtraPropertyIssue

export interface XisStrictMessages extends XisMessages<XisStrictIssues> {
	XIS_MISSING_PROPERTY: XIS_MISSING_PROPERTY
	XIS_EXTRA_PROPERTY: XIS_EXTRA_PROPERTY
}

export interface XisStrictArgs<Schema extends [...Array<ShapeKeyBase>]> {
	props: XisShapeProps<Schema>
	messages: XisStrictMessages | null
}

export class XisStrict<Schema extends [...Array<ShapeKeyBase>]> extends XisSync<
	BaseObject,
	XisStrictIssues,
	Shape<Schema>
> {
	#props: XisShapeProps<Schema>
	#messages: XisStrictMessages

	constructor(args: XisStrictArgs<Schema>) {
		super()
		this.#props = args.props
		this.#messages = args.messages ?? {
			XIS_MISSING_PROPERTY,
			XIS_EXTRA_PROPERTY,
		}
	}

	override get effect(): Effect {
		return Effect.Validate
	}

	exec(args: XisExecArgs<BaseObject>): ExecResultSync<XisStrictIssues, Shape<Schema>> {
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
		const extraIssues = [...remainingKeys.values()].map((key) =>
			extraIssue({
				extraEntry: [key, Reflect.get(value, key)],
				locale,
				path,
				msgBuilder: this.#messages.XIS_EXTRA_PROPERTY,
			})
		)
		const allIssues = missingIssues
			.map((issues) => [...issues, ...extraIssues])
			.alt(extraIssues.length > 0 ? Just(extraIssues) : Nothing)
		return allIssues.caseOf({
			Just: (issues) => Left(issues),
			Nothing: () => Right(value as Shape<Schema>),
		})
	}
}

export const strict = <Schema extends [...Array<ShapeKeyBase>]>(
	args: XisStrictArgs<Schema>
): XisStrict<Schema> => new XisStrict(args)
