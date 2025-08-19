import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get all todos for the current user
export const getTodos = query({
  args: {
    completed: v.optional(v.boolean()),
    categoryId: v.optional(v.id("categories")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    let todosQuery;

    if (args.completed !== undefined) {
      todosQuery = ctx.db
        .query("todos")
        .withIndex("by_user_and_completed", (q) => 
          q.eq("userId", userId).eq("completed", args.completed!)
        );
    } else {
      todosQuery = ctx.db
        .query("todos")
        .withIndex("by_user", (q) => q.eq("userId", userId));
    }

    let todos = await todosQuery.collect();

    // Filter by category if specified
    if (args.categoryId) {
      todos = todos.filter(todo => todo.categoryId === args.categoryId);
    }
    
    // Get categories for each todo
    const todosWithCategories = await Promise.all(
      todos.map(async (todo) => {
        const category = todo.categoryId 
          ? await ctx.db.get(todo.categoryId)
          : null;
        return { ...todo, category };
      })
    );

    return todosWithCategories.sort((a, b) => {
      // Sort by priority (high -> medium -> low), then by creation time
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return b._creationTime - a._creationTime;
    });
  },
});

// Create a new todo
export const createTodo = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
    dueDate: v.optional(v.number()),
    categoryId: v.optional(v.id("categories")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    return await ctx.db.insert("todos", {
      ...args,
      userId,
      completed: false,
    });
  },
});

// Toggle todo completion
export const toggleTodo = mutation({
  args: { id: v.id("todos") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const todo = await ctx.db.get(args.id);
    if (!todo || todo.userId !== userId) {
      throw new Error("Todo not found or unauthorized");
    }

    return await ctx.db.patch(args.id, {
      completed: !todo.completed,
    });
  },
});

// Update todo
export const updateTodo = mutation({
  args: {
    id: v.id("todos"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    priority: v.optional(v.union(v.literal("low"), v.literal("medium"), v.literal("high"))),
    dueDate: v.optional(v.number()),
    categoryId: v.optional(v.id("categories")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const todo = await ctx.db.get(args.id);
    if (!todo || todo.userId !== userId) {
      throw new Error("Todo not found or unauthorized");
    }

    const { id, ...updates } = args;
    return await ctx.db.patch(id, updates);
  },
});

// Delete todo
export const deleteTodo = mutation({
  args: { id: v.id("todos") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const todo = await ctx.db.get(args.id);
    if (!todo || todo.userId !== userId) {
      throw new Error("Todo not found or unauthorized");
    }

    return await ctx.db.delete(args.id);
  },
});

// Get todo statistics
export const getTodoStats = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const todos = await ctx.db
      .query("todos")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const completed = todos.filter(todo => todo.completed).length;
    const pending = todos.filter(todo => !todo.completed).length;
    const highPriority = todos.filter(todo => todo.priority === "high" && !todo.completed).length;

    return {
      total: todos.length,
      completed,
      pending,
      highPriority,
    };
  },
});