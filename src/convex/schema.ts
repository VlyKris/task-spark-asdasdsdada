import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

// default user roles. can add / remove based on the project as needed
export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  MEMBER: "member",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.USER),
  v.literal(ROLES.MEMBER),
);
export type Role = Infer<typeof roleValidator>;

const schema = defineSchema(
  {
    // default auth tables using convex auth.
    ...authTables, // do not remove or modify

    // the users table is the default users table that is brought in by the authTables
    users: defineTable({
      name: v.optional(v.string()), // name of the user. do not remove
      image: v.optional(v.string()), // image of the user. do not remove
      email: v.optional(v.string()), // email of the user. do not remove
      emailVerificationTime: v.optional(v.number()), // email verification time. do not remove
      isAnonymous: v.optional(v.boolean()), // is the user anonymous. do not remove

      role: v.optional(roleValidator), // role of the user. do not remove
    }).index("email", ["email"]), // index for the email. do not remove or modify

    // Todo tables
    todos: defineTable({
      title: v.string(),
      description: v.optional(v.string()),
      completed: v.boolean(),
      priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
      dueDate: v.optional(v.number()),
      userId: v.id("users"),
      categoryId: v.optional(v.id("categories")),
    })
      .index("by_user", ["userId"])
      .index("by_user_and_completed", ["userId", "completed"])
      .index("by_category", ["categoryId"]),

    categories: defineTable({
      name: v.string(),
      color: v.string(),
      userId: v.id("users"),
    }).index("by_user", ["userId"]),
  },
  {
    schemaValidation: false,
  },
);

export default schema;