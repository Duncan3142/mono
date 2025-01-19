import { defineConfig } from "drizzle-kit"

const { DATABASE_URL } = process.env

if (typeof DATABASE_URL === "undefined" || DATABASE_URL === "") {
	throw new Error("DATABASE_URL is not set")
}

export default defineConfig({
	schema: "./src/lib/server/db/schema.ts",

	dbCredentials: {
		url: DATABASE_URL,
	},

	verbose: true,
	strict: true,
	dialect: "postgresql",
})
