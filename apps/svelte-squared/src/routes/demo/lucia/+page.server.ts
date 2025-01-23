import { fail, redirect } from "@sveltejs/kit"
// eslint-disable-next-line boundaries/no-ignored -- Unable to resolve
import type { Actions, PageServerLoad } from "./$types"
import * as auth from "$lib/server/auth"
import { STATUS_302, STATUS_401 } from "$lib/http"

/**
 * Load event handler
 * @param event - Load event
 * @param event.locals - Event locals
 * @param event.locals.user - User details
 * @returns Redirect when user is not logged in, otherwise user object
 */
const load: PageServerLoad = ({ locals: { user } }) => {
	if (user === null) {
		return redirect(STATUS_302, "/demo/lucia/login")
	}
	return { user }
}

const actions: Actions = {
	logout: async (event) => {
		const {
			locals: { session },
		} = event
		if (session === null) {
			return fail(STATUS_401)
		}
		await auth.invalidateSession(session.id)
		auth.deleteSessionTokenCookie(event)

		return redirect(STATUS_302, "/demo/lucia/login")
	},
}

export { load, actions }
