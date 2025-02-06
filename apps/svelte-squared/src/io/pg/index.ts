import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import { env } from "$env/dynamic/private"
import { session, user, type Session, type User } from "./schema"

const { POSTGRES_PORT, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB, POSTGRES_HOST } = env

/* eslint-disable @typescript-eslint/no-unnecessary-condition -- Vars may not always be set */
const [port, dbUser, password, database, host] = [
	Number.parseInt(POSTGRES_PORT ?? "", 10),
	POSTGRES_USER ?? "",
	POSTGRES_PASSWORD ?? "",
	POSTGRES_DB ?? "",
	POSTGRES_HOST ?? "",
]
/* eslint-enable @typescript-eslint/no-unnecessary-condition -- Vars may not always be set */

if (Number.isNaN(port)) {
	throw new Error("POSTGRES_PORT is not set")
}
if (dbUser === "") {
	throw new Error("POSTGRES_USER is not set")
}
if (password === "") {
	throw new Error("POSTGRES_PASSWORD is not set")
}
if (database === "") {
	throw new Error("POSTGRES_DB is not set")
}
if (host === "") {
	throw new Error("POSTGRES_HOST is not set")
}
const pg = postgres({
	port,
	user: dbUser,
	password,
	database,
	host,
})
const client = drizzle(pg)

const db = {
	client,
	tables: {
		session,
		user,
	},
}

/**
 * Database
 */
type DB = typeof db

export type { DB, Session, User }

export default db
