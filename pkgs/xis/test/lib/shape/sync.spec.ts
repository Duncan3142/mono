import { describe, it } from "node:test"
import { deepEqual } from "node:assert/strict"
import { assertLeft, assertRight, type ExtractValue } from "#util/either.js"
import { shape } from "#check/shape/sync.js"

import { array } from "#check/array/sync.js"
import { unknown } from "#check/unknown.js"
import { CheckSide } from "#core/context.js"
import { string } from "#check/string/string.js"
import { number } from "#check/number/number.js"
import { k, ko, kwo } from "#check/shape/core.js"
import { boolean } from "#check/boolean.js"

const arr = array(unknown)

void describe("strip", () => {
	const check = shape([
		[k("a"), string],
		[ko("b"), arr],
		[
			k("c"),
			shape([
				[k("d"), number],
				[ko("e"), arr],
			]).strip(),
		],
	]).strip()

	void it("should pass a matching object", () => {
		const obj = {
			a: "a",
			b: ["b"],
			x: true,
			c: {
				d: 0,
				e: ["e"],
				y: false,
			},
		}
		const res = check.parse(obj, {
			args: undefined,
			path: [],
		})

		assertRight(res)

		const expected: ExtractValue<typeof res> = {
			a: "a",
			b: ["b"],
			c: {
				d: 0,
				e: ["e"],
			},
		}

		deepEqual(res.extract(), expected)
	})

	void it("should fail an invalid object", () => {
		const res = check.parse(
			{
				a: [],
				c: {
					d: 0,
					e: true,
				},
			},
			{
				args: undefined,
				path: [],
			}
		)

		assertLeft(res)

		const expected: ExtractValue<typeof res> = [
			{
				expected: "string",
				name: "INVALID_TYPE",
				path: [
					{
						segment: "a",
						side: CheckSide.Value,
					},
				],
				received: "array",
			},
			{
				name: "INVALID_TYPE",
				expected: "array",
				path: [
					{
						segment: "c",
						side: CheckSide.Value,
					},
					{
						segment: "e",
						side: CheckSide.Value,
					},
				],
				received: "boolean",
			},
		]

		deepEqual(res.extract(), expected)
	})
})

void describe("strict", () => {
	const check = shape([
		[k("a"), string],
		[ko("b"), arr],
		[
			k("c"),
			shape([
				[k("d"), boolean],
				[kwo("e"), arr],
			]).strict(),
		],
	]).strict()

	void it("should pass a matching object", () => {
		const res = check.parse(
			{
				a: "a",
				b: ["b"],
				c: {
					d: true,
					e: ["e"],
				},
			},
			{
				args: undefined,
				path: [],
			}
		)

		assertRight(res)

		const expected: ExtractValue<typeof res> = {
			a: "a",
			b: ["b"],
			c: {
				d: true,
				e: ["e"],
			},
		}

		deepEqual(res.extract(), expected)
	})

	void it("should fail an invalid object", () => {
		const obj = {
			a: false,
			b: [],
			c: {
				e: true,
				y: false,
			},
		}
		const res = check.parse(obj, {
			args: undefined,
			path: [],
		})

		assertLeft(res)

		const expected: ExtractValue<typeof res> = [
			{
				expected: "string",
				name: "INVALID_TYPE",
				path: [
					{
						segment: "a",
						side: CheckSide.Value,
					},
				],
				received: "boolean",
			},
			{
				name: "EXTRA_PROPERTY",
				path: [
					{
						segment: "c",
						side: CheckSide.Value,
					},
					{
						segment: "y",
						side: CheckSide.Value,
					},
				],
				value: false,
			},
			{
				name: "MISSING_PROPERTY",
				path: [
					{
						segment: "c",
						side: CheckSide.Value,
					},
					{
						segment: "d",
						side: CheckSide.Value,
					},
				],
			},
		]

		deepEqual(res.extract(), expected)
	})
})

void describe("passThrough", () => {
	const check = shape([
		[k("a"), string],
		[ko("b"), arr],
		[
			k("c"),
			shape([
				[k("d"), number],
				[ko("e"), arr],
			]).passThrough(),
		],
	]).passThrough()

	void it("should pass a matching object", () => {
		const res = check.parse(
			{
				a: "a",
				b: ["b"],
				x: true,
				c: {
					d: 0,
					e: ["e"],
					y: false,
				},
			},
			{
				args: undefined,
				path: [],
			}
		)

		assertRight(res)

		const expected: ExtractValue<typeof res> = {
			a: "a",
			b: ["b"],
			x: true,
			c: {
				d: 0,
				e: ["e"],
				y: false,
			},
		}

		deepEqual(res.extract(), expected)
	})

	void it("should fail an invalid object", () => {
		const res = check.parse(
			{
				a: [],
				c: {
					d: 0,
					e: true,
				},
			},
			{
				args: undefined,
				path: [],
			}
		)

		assertLeft(res)

		const expected: ExtractValue<typeof res> = [
			{
				expected: "string",
				name: "INVALID_TYPE",
				path: [
					{
						segment: "a",
						side: CheckSide.Value,
					},
				],
				received: "array",
			},
			{
				name: "INVALID_TYPE",
				expected: "array",
				path: [
					{
						segment: "c",
						side: CheckSide.Value,
					},
					{
						segment: "e",
						side: CheckSide.Value,
					},
				],
				received: "boolean",
			},
		]

		deepEqual(res.extract(), expected)
	})
})
