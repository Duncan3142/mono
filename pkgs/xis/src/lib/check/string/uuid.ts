import { isString, type BaseTypeIssue } from "#core/base-type.js"
import type { XisCtxBase } from "#core/context.js"
import type { XisIssue } from "#core/error.js"
import { XisSync, type ExecResultSync, type ParseResultSync } from "#core/sync.js"
import { Right, Left } from "purify-ts/Either"

export type UUID = `${string}-${string}-${string}-${string}-${string}`

const uuidPatterns = {
	1: /^[0-9A-F]{8}-[0-9A-F]{4}-1[0-9A-F]{3}-[0-9A-F]{4}-[0-9A-F]{12}$/i,
	2: /^[0-9A-F]{8}-[0-9A-F]{4}-2[0-9A-F]{3}-[0-9A-F]{4}-[0-9A-F]{12}$/i,
	3: /^[0-9A-F]{8}-[0-9A-F]{4}-3[0-9A-F]{3}-[0-9A-F]{4}-[0-9A-F]{12}$/i,
	4: /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
	5: /^[0-9A-F]{8}-[0-9A-F]{4}-5[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
	all: /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i,
}

export const Version = {
	1: 1,
	2: 2,
	3: 3,
	4: 4,
	5: 5,
	all: "all",
} as const

export type Version = (typeof Version)[keyof typeof Version]

export const isUUID = <V extends Version = "all">(
	str: string,
	version: V,
	ctx: XisCtxBase
): ExecResultSync<UUIDIssue<V>, UUID> => {
	const pattern = uuidPatterns[version]
	switch (pattern.test(str)) {
		case true:
			return Right(str as UUID)
		case false:
			return Left([
				{
					name: "UUID",
					expected: version,
					received: str,
					path: ctx.path,
				},
			])
	}
}

export interface UUIDIssue<V extends Version> extends XisIssue<"UUID"> {
	expected: V
	received: string
}

export class XisUUID<V extends Version> extends XisSync<
	string,
	BaseTypeIssue<"string">,
	UUIDIssue<V>,
	UUID
> {
	#version: V

	constructor(version: V) {
		super()
		this.#version = version
	}

	parse(
		value: unknown,
		ctx: XisCtxBase
	): ParseResultSync<BaseTypeIssue<"string">, UUIDIssue<V>, UUID> {
		return isString(value, ctx).chain((v) => this.exec(v, ctx))
	}
	exec(value: string, ctx: XisCtxBase): ExecResultSync<UUIDIssue<V>, UUID> {
		return isUUID(value, this.#version, ctx)
	}
}

export const uuid = <V extends Version>(v: V): XisUUID<V> => new XisUUID(v)
