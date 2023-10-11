import { describe, it } from "node:test"
import { deepEqual } from "node:assert/strict"

import { shape } from "#check/shape/async.js"
import { assertLeft, assertRight, type ExtractValue } from "#util/either.js"
import { string } from "#check/string/string.js"
import { number } from "#check/number/number.js"
import { array } from "#check/array/async.js"
import { unknown } from "#check/unknown.js"
import { CheckSide } from "#core/context.js"
import { k, ko, kw } from "#check/shape/core.js"

const arr = array(unknown)

void describe("strip", () => {
	const check = shape([
		[k("a"), string],
		[ko("b"), arr],
		[
			k("c"),
			shape([
				[kw("d"), number],
				[ko("e"), arr],
			]).strip(),
		],
	]).strip()

	void it("should pass a matching object", async () => {
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

		const res = await check.parse(obj, {
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

	void it("should fail an invalid object", async () => {
		const obj = {
			a: false,
			c: {
				d: 0,
				e: true,
			},
		}
		const res = await check.parse(obj, {
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
				[k("d"), number],
				[ko("e"), arr],
			]).strict(),
		],
	]).strict()

	void it("should pass a matching object", async () => {
		const res = await check.parse(
			{
				a: "a",
				b: ["b"],
				c: {
					d: 0,
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
				d: 0,
				e: ["e"],
			},
		}

		deepEqual(res.extract(), expected)
	})

	void it("should fail an invalid object", async () => {
		const obj = {
			a: [],
			c: {
				d: [],
				e: true,
				y: false,
			},
		}
		const res = await check.parse(obj, {
			args: undefined,
			path: [],
		})

		assertLeft(res)

		const expected: ExtractValue<typeof res> = [
			{
				name: "INVALID_TYPE",
				path: [
					{
						segment: "a",
						side: CheckSide.Value,
					},
				],
				expected: "string",
				received: "array",
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

	void it("should pass a matching object", async () => {
		const res = await check.parse(
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

	void it("should fail an invalid object", async () => {
		const res = await check.parse(
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
