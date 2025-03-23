// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { SessionValidationResult } from "$lib/auth"
import type { DB } from "$io/pg"
import type { AI } from "$io/ollama"

declare global {
	namespace App {
		interface Locals {
			user: SessionValidationResult["user"]
			session: SessionValidationResult["session"]
			db: DB
			ai: AI
		}
	}
}

export {}
