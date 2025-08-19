import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { motion } from "framer-motion";
import { Calendar, MoreHorizontal, Trash2 } from "lucide-react";
import { useMutation } from "convex/react";
import { toast } from "sonner";

interface TodoItemProps {
  todo: Doc<"todos"> & { category?: Doc<"categories"> | null };
}

export function TodoItem({ todo }: TodoItemProps) {
  const toggleTodo = useMutation(api.todos.toggleTodo);
  const deleteTodo = useMutation(api.todos.deleteTodo);

  const handleToggle = async () => {
    try {
      await toggleTodo({ id: todo._id });
      toast.success(todo.completed ? "Task marked as pending" : "Task completed!");
    } catch (error) {
      toast.error("Failed to update task");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTodo({ id: todo._id });
      toast.success("Task deleted");
    } catch (error) {
      toast.error("Failed to delete task");
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-500";
      case "medium": return "text-yellow-500";
      case "low": return "text-green-500";
      default: return "text-muted-foreground";
    }
  };

  const formatDueDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays === -1) return "Yesterday";
    if (diffDays < 0) return `${Math.abs(diffDays)} days ago`;
    return `In ${diffDays} days`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`group p-4 rounded-lg border bg-card hover:shadow-md transition-all ${
        todo.completed ? "opacity-60" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        <Checkbox
          checked={todo.completed}
          onCheckedChange={handleToggle}
          className="mt-1"
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className={`font-medium ${todo.completed ? "line-through text-muted-foreground" : ""}`}>
              {todo.title}
            </h3>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {todo.description && (
            <p className={`text-sm mt-1 ${todo.completed ? "line-through text-muted-foreground" : "text-muted-foreground"}`}>
              {todo.description}
            </p>
          )}
          
          <div className="flex items-center gap-4 mt-2">
            <span className={`text-xs font-medium ${getPriorityColor(todo.priority)}`}>
              {todo.priority.toUpperCase()}
            </span>
            
            {todo.category && (
              <div className="flex items-center gap-1">
                <div 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: todo.category.color }}
                />
                <span className="text-xs text-muted-foreground">{todo.category.name}</span>
              </div>
            )}
            
            {todo.dueDate && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span className={new Date(todo.dueDate) < new Date() && !todo.completed ? "text-red-500" : ""}>
                  {formatDueDate(todo.dueDate)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
