// TODO: THIS IS THE DEFAULT DASHBOARD PAGE THAT THE USER WILL SEE AFTER AUTHENTICATION. ADD MAIN FUNCTIONALITY HERE.
// This is the entry point for users who have just signed in

import { CategoryForm } from "@/components/todos/CategoryForm";
import { TodoForm } from "@/components/todos/TodoForm";
import { TodoItem } from "@/components/todos/TodoItem";
import { TodoStats } from "@/components/todos/TodoStats";
import { UserButton } from "@/components/auth/UserButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useAuth } from "@/hooks/use-auth";
import { Protected } from "@/lib/protected-page";
import { motion } from "framer-motion";
import { CheckCircle, Search, Filter, Trash2 } from "lucide-react";
import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { toast } from "sonner";

export default function Dashboard() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Id<"categories"> | "all">("all");
  const [activeTab, setActiveTab] = useState("all");

  const todos = useQuery(api.todos.getTodos, {
    completed: activeTab === "completed" ? true : activeTab === "pending" ? false : undefined,
    categoryId: selectedCategory === "all" ? undefined : selectedCategory,
  }) || [];

  const categories = useQuery(api.categories.getCategories) || [];
  const deleteCategory = useMutation(api.categories.deleteCategory);

  const filteredTodos = todos.filter(todo =>
    todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (todo.description && todo.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleDeleteCategory = async (categoryId: Id<"categories">) => {
    try {
      await deleteCategory({ id: categoryId });
      toast.success("Category deleted");
      if (selectedCategory === categoryId) {
        setSelectedCategory("all");
      }
    } catch (error) {
      toast.error("Failed to delete category");
    }
  };

  return (
    <Protected>
      <div className="min-h-screen bg-gradient-to-br from-background to-accent/10">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50"
        >
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold tracking-tight">TodoFlow</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                Welcome back, {user?.name || "User"}!
              </span>
              <UserButton />
            </div>
          </div>
        </motion.header>

        <div className="container mx-auto px-4 py-8">
          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8"
          >
            <TodoStats />
          </motion.div>

          {/* Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-6 space-y-4"
          >
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex gap-2">
                <TodoForm />
                <CategoryForm />
              </div>
              
              <div className="flex gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tasks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as Id<"categories"> | "all")}>
                  <SelectTrigger className="w-40">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category._id} value={category._id}>
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: category.color }}
                            />
                            {category.name}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto p-1 ml-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteCategory(category._id);
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </motion.div>

          {/* Tabs and Todo List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full max-w-md grid-cols-3">
                <TabsTrigger value="all">All Tasks</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="space-y-4">
                {filteredTodos.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                  >
                    <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-muted-foreground mb-2">
                      {searchQuery ? "No tasks found" : activeTab === "completed" ? "No completed tasks yet" : "No tasks yet"}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {searchQuery ? "Try adjusting your search terms" : "Create your first task to get started!"}
                    </p>
                    {!searchQuery && <TodoForm />}
                  </motion.div>
                ) : (
                  <div className="grid gap-4">
                    {filteredTodos.map((todo) => (
                      <TodoItem key={todo._id} todo={todo} />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </Protected>
  );
}