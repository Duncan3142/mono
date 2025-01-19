import { drizzle } from "drizzle-orm/postgres-js"
import * as postgres from "postgres"
import { env } from "$env/dynamic/private"

const { DATABASE_URL } = env

if (typeof DATABASE_URL !== "undefined" && DATABASE_URL !== "") {
	throw new Error("DATABASE_URL is not set")
}
const client = postgres(DATABASE_URL)
const db = drizzle(client)

export { db }
export default db
