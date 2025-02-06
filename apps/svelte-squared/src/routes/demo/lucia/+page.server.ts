import { fail, redirect } from "@sveltejs/kit"
import { TEMPORARY_REDIRECT, UNAUTHORIZED } from "http-errors-enhanced"
import type { Actions, PageServerLoad } from "./$types"
import * as auth from "$lib/auth"

/**
 * Load event handler
 * @param event - Load event
 * @param event.locals - Event locals
 * @param event.locals.user - User details
 * @returns Redirect when user is not logged in, otherwise user object
 */
const load: PageServerLoad = ({ locals: { user } }) => {
	if (user === null) {
		return redirect(TEMPORARY_REDIRECT, "/demo/lucia/login")
	}
	return { user }
}

const actions: Actions = {
	logout: async (event) => {
		const {
			locals: { session },
		} = event
		if (session === null) {
			return fail(UNAUTHORIZED)
		}
		await auth.invalidateSession(session.id)
		auth.deleteSessionTokenCookie(event)

		return redirect(TEMPORARY_REDIRECT, "/demo/lucia/login")
	},
}

export { load, actions }
