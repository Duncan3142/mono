import { sequence } from "@sveltejs/kit/hooks"
import type { Handle } from "@sveltejs/kit"
import { i18n } from "$lib/i18n"
import * as auth from "$lib/auth"
import ai from "$io/ollama"
import db from "$io/pg"

const handleAuth: Handle = async ({ event, resolve }) => {
	const { cookies } = event
	event.locals.db = db
	event.locals.ai = ai
	const sessionToken = event.cookies.get(auth.sessionCookieName)
	if (sessionToken === "" || typeof sessionToken !== "string") {
		event.locals.user = null
		event.locals.session = null
		return resolve(event)
	}

	const { session, user } = await auth.validateSessionToken(db, sessionToken)
	if (session !== null) {
		auth.setSessionTokenCookie(cookies, sessionToken, session.expiresAt)
	} else {
		auth.deleteSessionTokenCookie(cookies)
	}

	event.locals.user = user
	event.locals.session = session

	return resolve(event)
}

const handleParaglide: Handle = i18n.handle()

/**
 * Handler
 */
export const handle: Handle = sequence(handleAuth, handleParaglide)
export default handle
