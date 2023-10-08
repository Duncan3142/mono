export interface Extends {
	covariant: {
		scalar: {
			yes: 0 | 1 extends number ? true : false
			no: number extends 0 | 1 ? true : false
		}
		object: {
			yes: { a: 0 | 1; b: "meow" | "woof" } extends { a: number; b: string } ? true : false
			no: { a: 0 | 1; b: "meow" | "woof" } extends { a: number; b: string; c: symbol }
				? true
				: false
		}
	}
	contravariant: {
		yes: ((a: number) => string) extends (a: 0 | 1) => string ? true : false
		no: ((a: 0 | 1) => string) extends (a: number) => string ? true : false
	}
}
