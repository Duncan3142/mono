import type { Either } from "purify-ts/Either"

export function assertLeft<L, R>(e: Either<L, R>): asserts e is Either<L, never> {
	if (e.isRight()) {
		throw new Error("Expected Left, got Right")
	}
}

export function assertRight<L, R>(e: Either<L, R>): asserts e is Either<never, R> {
	if (e.isLeft()) {
		throw new Error("Expected Right, got Left")
	}
}

export type ExtractValue<E extends Either<unknown, unknown>> = ReturnType<E["extract"]>
