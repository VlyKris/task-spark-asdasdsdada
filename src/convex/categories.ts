import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get all categories for the current user
export const getCategories = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    return await ctx.db
      .query("categories")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  },
});

// Create a new category
export const createCategory = mutation({
  args: {
    name: v.string(),
    color: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    return await ctx.db.insert("categories", {
      ...args,
      userId,
    });
  },
});

// Delete category
export const deleteCategory = mutation({
  args: { id: v.id("categories") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const category = await ctx.db.get(args.id);
    if (!category || category.userId !== userId) {
      throw new Error("Category not found or unauthorized");
    }

    // Remove category from all todos
    const todos = await ctx.db
      .query("todos")
      .withIndex("by_category", (q) => q.eq("categoryId", args.id))
      .collect();

    for (const todo of todos) {
      await ctx.db.patch(todo._id, { categoryId: undefined });
    }

    return await ctx.db.delete(args.id);
  },
});
