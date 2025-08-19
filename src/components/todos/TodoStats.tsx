import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { motion } from "framer-motion";
import { CheckCircle, Clock, AlertTriangle, ListTodo } from "lucide-react";
import { useQuery } from "convex/react";

export function TodoStats() {
  const stats = useQuery(api.todos.getTodoStats);

  if (!stats) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-muted rounded w-20"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-12"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statItems = [
    {
      title: "Total Tasks",
      value: stats.total,
      icon: <ListTodo className="h-4 w-4" />,
      color: "text-blue-500",
    },
    {
      title: "Completed",
      value: stats.completed,
      icon: <CheckCircle className="h-4 w-4" />,
      color: "text-green-500",
    },
    {
      title: "Pending",
      value: stats.pending,
      icon: <Clock className="h-4 w-4" />,
      color: "text-yellow-500",
    },
    {
      title: "High Priority",
      value: stats.highPriority,
      icon: <AlertTriangle className="h-4 w-4" />,
      color: "text-red-500",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((item, index) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {item.title}
              </CardTitle>
              <div className={item.color}>
                {item.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.value}</div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
