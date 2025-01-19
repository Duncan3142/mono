import { fail, redirect } from "@sveltejs/kit"
// eslint-disable-next-line boundaries/no-ignored -- Unable to resolved
import type { Actions, PageServerLoad } from "./$types"
import * as auth from "$lib/server/auth"
import { STATUS_302, STATUS_401 } from "$lib/http"

/**
 * Load event handler
 * @param event - Load event
 * @param event.locals - Event locals
 * @returns Redirect when user is not logged in, otherwise user object
 */
const load: PageServerLoad = ({ locals }) => {
	if (!locals.user) {
		return redirect(STATUS_302, "/demo/lucia/login")
	}
	return { user: locals.user }
}

const actions: Actions = {
	logout: async (event) => {
		if (!event.locals.session) {
			return fail(STATUS_401)
		}
		await auth.invalidateSession(event.locals.session.id)
		auth.deleteSessionTokenCookie(event)

		return redirect(STATUS_302, "/demo/lucia/login")
	},
}

export { load, actions }
