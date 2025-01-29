// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { SessionValidationResult } from "$lib/auth"

declare global {
	namespace App {
		interface Locals {
			user: SessionValidationResult["user"]
			session: SessionValidationResult["session"]
		}
	}
}

export {}
