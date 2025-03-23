import { env } from "process"
import { defineConfig } from "drizzle-kit"

const { POSTGRES_PORT, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB, POSTGRES_HOST } = env

const [port, user, password, database, host] = [
	Number.parseInt(POSTGRES_PORT ?? "", 10),
	POSTGRES_USER ?? "",
	POSTGRES_PASSWORD ?? "",
	POSTGRES_DB ?? "",
	POSTGRES_HOST ?? "",
]

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

export default defineConfig({
	schema: "./src/lib/server/db/schema.ts",
	dbCredentials: {
		port,
		user,
		password,
		database,
		host,
	},
	verbose: true,
	strict: true,
	dialect: "postgresql",
})
