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
import {
	objectEntries,
	type BaseObject,
	type BaseProp,
	type TruePropertyKey,
} from "#util/base-type.js"
import { Left, Right } from "purify-ts/Either"
import type { XisIssue } from "#core/error.js"
import type { XisPath } from "#core/path.js"
import type { ObjArgBase } from "#util/arg.js"

export interface ExtraPropertyIssue extends XisIssue<"XIS_EXTRA_PROPERTY"> {
	key: TruePropertyKey
	value: unknown
}

export type XIS_EXTRA_PROPERTY = XisMsgBuilder<BaseProp>

export const XIS_EXTRA_PROPERTY = (args: XisMsgArgs<BaseProp>) => {
	const { input, path } = args
	const [key, val] = input
	return `object has extra property "${String(key)}", with value ${JSON.stringify(val)}, at path "${JSON.stringify(path)}"`
}

export interface ExtraIssuesArgs {
	extraEntry: BaseProp
	locale: string
	msgBuilder: XIS_EXTRA_PROPERTY
	path: XisPath
	ctx: ObjArgBase
}

export const extraIssue = (args: ExtraIssuesArgs): ExtraPropertyIssue => {
	const {
		extraEntry: [key, value],
		locale,
		msgBuilder,
		path,
		ctx,
	} = args

	return {
		name: "XIS_EXTRA_PROPERTY" as const,
		value,
		message: msgBuilder({ input: [key, value], path, locale, ctx }),
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

	override get effect(): typeof Effect.Validate {
		return Effect.Validate
	}

	exec(args: XisExecArgs<BaseObject>): ExecResultSync<XisStrictIssues, Shape<Schema>> {
		const { value, path, locale, ctx } = args
		const { keys: desired } = this.#props

		const { missing, remaining } = buildMissingIssues({
			desired,
			entries: objectEntries(value),
			locale,
			path,
			ctx,
			msgBuilder: this.#messages.XIS_MISSING_PROPERTY,
		})
		const extras = Array.from(remaining.entries()).map(([key, prop]) =>
			extraIssue({
				extraEntry: [key, prop],
				locale,
				path,
				msgBuilder: this.#messages.XIS_EXTRA_PROPERTY,
				ctx,
			})
		)
		const allIssues = [...missing, ...extras]
		return allIssues.length > 0 ? Left(allIssues) : Right(value as Shape<Schema>)
	}
}

export const stricti18n = <Schema extends [...Array<ShapeKeyBase>]>(
	keys: [...Schema],
	messages: XisStrictMessages
): XisStrict<Schema> =>
	new XisStrict({
		messages,
		props: {
			keys,
		},
	})
export const strict = <Schema extends [...Array<ShapeKeyBase>]>(
	keys: [...Schema]
): XisStrict<Schema> =>
	new XisStrict({
		messages: null,
		props: {
			keys,
		},
	})
