import type { RequestEvent } from "@sveltejs/kit"
import { eq } from "drizzle-orm"
import { sha256 } from "@oslojs/crypto/sha2"
import { encodeBase64url, encodeHexLowerCase } from "@oslojs/encoding"
import { db } from "$lib/db"
import * as table from "$lib/db/schema"

const MS_PER_SEC = 1000
const SEC_PER_MIN = 60
const MIN_PER_HOUR = 60
const HOUR_PER_DAY = 24
const DAY_IN_MS = MS_PER_SEC * SEC_PER_MIN * MIN_PER_HOUR * HOUR_PER_DAY
const DAYS_15 = 15
const DAYS_30 = 30

const sessionCookieName = "auth-session"

/**
 * Generate a session token
 * @returns A base64url encoded session token
 */
function generateSessionToken(): string {
	const BUFFER_BYTE_LENGTH = 18
	const bytes = crypto.getRandomValues(new Uint8Array(BUFFER_BYTE_LENGTH))
	const token = encodeBase64url(bytes)
	return token
}

type Session = {
	id: string
	userId: string
	expiresAt: Date
}

type User = {
	id: string
	username: string
}

/**
 * Create a session
 * @param token - session token
 * @param userId - user id
 * @returns Session details
 */
async function createSession(token: string, userId: string): Promise<Session> {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)))
	const session: table.Session = {
		id: sessionId,
		userId,
		expiresAt: new Date(Date.now() + DAY_IN_MS * DAYS_30),
	}
	await db.insert(table.session).values(session)
	return session
}

/**
 * Session validation result
 */
type SessionValidationResult =
	| {
			session: Session
			user: User
	  }
	| {
			session: null
			user: null
	  }

/**
 * Validate session token
 * @param token - session token
 * @returns Session details
 */
async function validateSessionToken(token: string): Promise<SessionValidationResult> {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)))
	const [result] = await db
		.select({
			// Adjust user table here to tweak returned data
			user: { id: table.user.id, username: table.user.username },
			session: table.session,
		})
		.from(table.session)
		.innerJoin(table.user, eq(table.session.userId, table.user.id))
		.where(eq(table.session.id, sessionId))

	if (typeof result === "undefined") {
		return { session: null, user: null }
	}
	const { session, user } = result

	const sessionExpired = Date.now() >= session.expiresAt.getTime()
	if (sessionExpired) {
		await db.delete(table.session).where(eq(table.session.id, session.id))
		return { session: null, user: null }
	}

	const renewSession = Date.now() >= session.expiresAt.getTime() - DAY_IN_MS * DAYS_15
	if (renewSession) {
		session.expiresAt = new Date(Date.now() + DAY_IN_MS * DAYS_30)
		await db
			.update(table.session)
			.set({ expiresAt: session.expiresAt })
			.where(eq(table.session.id, session.id))
	}

	return { session, user }
}

/**
 * Invalidate session
 * @param sessionId - session id
 */
async function invalidateSession(sessionId: string): Promise<void> {
	await db.delete(table.session).where(eq(table.session.id, sessionId))
}

/**
 * Set session token cookie
 * @param event - request event
 * @param token - session token
 * @param expiresAt - session expiration date
 */
function setSessionTokenCookie(event: RequestEvent, token: string, expiresAt: Date): void {
	event.cookies.set(sessionCookieName, token, {
		expires: expiresAt,
		path: "/",
	})
}

/**
 * Delete session token cookie
 * @param event - delete session event
 */
function deleteSessionTokenCookie(event: RequestEvent): void {
	event.cookies.delete(sessionCookieName, {
		path: "/",
	})
}

export {
	sessionCookieName,
	deleteSessionTokenCookie,
	setSessionTokenCookie,
	invalidateSession,
	validateSessionToken,
	createSession,
	generateSessionToken,
	type SessionValidationResult,
}
