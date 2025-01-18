import { sequence } from "@sveltejs/kit/hooks"
import type { Handle } from "@sveltejs/kit"
import { i18n } from "$lib/i18n"
import * as auth from "$lib/server/auth.js"

const handleAuth: Handle = async ({ event, resolve }) => {
	const sessionToken = event.cookies.get(auth.sessionCookieName)
	if (sessionToken === "" || typeof sessionToken !== "string") {
		event.locals.user = null
		event.locals.session = null
		return resolve(event)
	}

	const { session, user } = await auth.validateSessionToken(sessionToken)
	if (session) {
		auth.setSessionTokenCookie(event, sessionToken, session.expiresAt)
	} else {
		auth.deleteSessionTokenCookie(event)
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
