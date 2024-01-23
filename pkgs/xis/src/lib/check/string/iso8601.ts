import { isString, type BaseTypeIssue } from "#core/base-type.js"
import type { XisArgObjBase } from "#core/context.js"
import type { XisIssue } from "#core/error.js"
import { XisSync, type ExecResultSync, type ParseResultSync } from "#core/sync.js"
import { Left, Right } from "purify-ts"

const regex = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})\.(\d{3})Z$/

export const Month = {
	Jan: 1,
	Feb: 2,
	Mar: 3,
	Apr: 4,
	May: 5,
	Jun: 6,
	Jul: 7,
	Aug: 8,
	Sep: 9,
	Oct: 10,
	Nov: 11,
	Dec: 12,
} as const

export type Month = (typeof Month)[keyof typeof Month]

export function isISO8601(str: string): boolean {
	const check = regex.exec(str)

	if (check === null) {
		return false
	}

	const [year, month, day, hour, min, sec, millisecond] = check
		.slice(1)
		.map((elem) => Number.parseInt(elem, 10)) as [
		number,
		number,
		number,
		number,
		number,
		number,
		number,
	]

	if (year < 1900 || year > 3000) {
		return false
	}

	const leapYear = year % 4 === 0
	const daysInFeb = leapYear ? 29 : 28

	if (day === 0) {
		return false
	}

	switch (month) {
		case Month.Feb:
			if (day > daysInFeb) {
				return false
			}
			break
		case Month.Jan:
		case Month.Mar:
		case Month.May:
		case Month.Jul:
		case Month.Aug:
		case Month.Oct:
		case Month.Dec:
			if (day > 31) {
				return false
			}
			break
		case Month.Apr:
		case Month.Jun:
		case Month.Sep:
		case Month.Nov:
			if (day > 30) {
				return false
			}
			break
		default:
			return false
	}

	if (hour > 23) {
		return false
	}

	if (min > 59 || sec > 59) {
		return false
	}

	if (millisecond > 999) {
		return false
	}

	return true
}

export interface ISO8601Issue extends XisIssue<"ISO8601"> {
	received: string
}

const isISO8601Either = (
	str: string,
	ctx: XisArgObjBase
): ExecResultSync<ISO8601Issue, string> => {
	switch (isISO8601(str)) {
		case true:
			return Right(str)
		case false:
			return Left([
				{
					name: "ISO8601",
					received: str,
					path: ctx.path,
				},
			])
	}
}

export class XisISO8601 extends XisSync<string, BaseTypeIssue<"string">, ISO8601Issue> {
	parse(
		value: unknown,
		ctx: XisArgObjBase
	): ParseResultSync<BaseTypeIssue<"string">, ISO8601Issue, string> {
		return isString(value, ctx).chain((v) => this.exec(v, ctx))
	}
	exec(value: string, ctx: XisArgObjBase): ExecResultSync<ISO8601Issue, string> {
		return isISO8601Either(value, ctx)
	}
}

export const iso8601: XisISO8601 = new XisISO8601()
