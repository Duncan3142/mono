import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import { env } from "$env/dynamic/private"

const { POSTGRES_PORT, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB, POSTGRES_HOST } = env

/* eslint-disable @typescript-eslint/no-unnecessary-condition -- Vars may not always be set */
const [port, user, password, database, host] = [
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
if (user === "") {
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
const client = postgres({
	port,
	user,
	password,
	database,
	host,
})
const db = drizzle(client)

export default db
