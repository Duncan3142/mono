import { hash, verify } from "@node-rs/argon2"
import { encodeBase32LowerCase } from "@oslojs/encoding"
import { fail, redirect } from "@sveltejs/kit"
import { eq } from "drizzle-orm"
import type { Actions, PageServerLoad } from "./$types"
import * as auth from "$lib/server/auth"
import { db } from "$lib/server/db"
import * as table from "$lib/server/db/schema"
import { STATUS_302, STATUS_400, STATUS_500 } from "$lib/http"

/**
 * Page load handler
 * @param event - Load event
 * @param event.locals - Event locals
 * @returns Page load redirect
 */
const load: PageServerLoad = ({ locals }) => {
	if (locals.user) {
		return redirect(STATUS_302, "/demo/lucia")
	}
	return {}
}

function generateUserId() {
	// ID with 120 bits of entropy, or about the same as UUID v4.
	const BYTE_LENGTH = 15
	const bytes = crypto.getRandomValues(new Uint8Array(BYTE_LENGTH))
	const id = encodeBase32LowerCase(bytes)
	return id
}

const MIN_NAME_LENGTH = 3,
	MAX_NAME_LENGTH = 31

function validateUsername(username: unknown): username is string {
	return (
		typeof username === "string" &&
		username.length >= MIN_NAME_LENGTH &&
		username.length <= MAX_NAME_LENGTH &&
		/^[a-z0-9_-]+$/.test(username)
	)
}

const MIN_PASSWORD_LENGTH = 3,
	MAX_PASSWORD_LENGTH = 31

function validatePassword(password: unknown): password is string {
	return (
		typeof password === "string" &&
		password.length >= MIN_PASSWORD_LENGTH &&
		password.length <= MAX_PASSWORD_LENGTH
	)
}

const MEM_COST = 19456,
	TIME_COST = 2,
	OUTPUT_LENGTH = 32,
	PARALLELISM = 1

const actions: Actions = {
	login: async (event) => {
		const formData = await event.request.formData()
		const username = formData.get("username")
		const password = formData.get("password")

		if (!validateUsername(username)) {
			return fail(STATUS_400, {
				message: "Invalid username (min 3, max 31 characters, alphanumeric only)",
			})
		}
		if (!validatePassword(password)) {
			return fail(STATUS_400, { message: "Invalid password (min 6, max 255 characters)" })
		}

		const results = await db.select().from(table.user).where(eq(table.user.username, username))

		const FIRST = 0

		const existingUser = results.at(FIRST)
		if (!existingUser) {
			return fail(STATUS_400, { message: "Incorrect username or password" })
		}

		const validPassword = await verify(existingUser.passwordHash, password, {
			memoryCost: MEM_COST,
			timeCost: TIME_COST,
			outputLen: OUTPUT_LENGTH,
			parallelism: PARALLELISM,
		})
		if (!validPassword) {
			return fail(STATUS_400, { message: "Incorrect username or password" })
		}

		const sessionToken = auth.generateSessionToken()
		const session = await auth.createSession(sessionToken, existingUser.id)
		auth.setSessionTokenCookie(event, sessionToken, session.expiresAt)

		return redirect(STATUS_302, "/demo/lucia")
	},
	register: async (event) => {
		const formData = await event.request.formData()
		const username = formData.get("username")
		const password = formData.get("password")

		if (!validateUsername(username)) {
			return fail(STATUS_400, { message: "Invalid username" })
		}
		if (!validatePassword(password)) {
			return fail(STATUS_400, { message: "Invalid password" })
		}

		const userId = generateUserId()
		const passwordHash = await hash(password, {
			// recommended minimum parameters
			memoryCost: MEM_COST,
			timeCost: TIME_COST,
			outputLen: OUTPUT_LENGTH,
			parallelism: PARALLELISM,
		})

		try {
			await db.insert(table.user).values({ id: userId, username, passwordHash })

			const sessionToken = auth.generateSessionToken()
			const session = await auth.createSession(sessionToken, userId)
			auth.setSessionTokenCookie(event, sessionToken, session.expiresAt)
		} catch {
			return fail(STATUS_500, { message: "An error has occurred" })
		}
		return redirect(STATUS_302, "/demo/lucia")
	},
}

export { load, actions }
