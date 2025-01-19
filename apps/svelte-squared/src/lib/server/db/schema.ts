import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core"

const user = pgTable("user", {
	id: text("id").primaryKey(),
	age: integer("age"),
	username: text("username").notNull().unique(),
	passwordHash: text("password_hash").notNull(),
})

const session = pgTable("session", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => user.id),
	expiresAt: timestamp("expires_at", { withTimezone: true, mode: "date" }).notNull(),
})

/**
 * Session
 */
type Session = typeof session.$inferSelect

/**
 * User
 */
type User = typeof user.$inferSelect

export type { User, Session }
export { user, session }
