// TODO: THIS IS THE LANDING PAGE THAT THE USER WILL ALWAYS FIRST SEE. make sure to update this page
// Make sure that the marketing text always reflects the app marketing. create an aesthetic properly-designed landing page that fits the theme of the app
// start completely from scratch to make this landing page using aesthetic design principles and tailwind styling to create a unique and thematic landing page.

import { AuthButton } from "@/components/auth/AuthButton";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { CheckCircle, Clock, Star, Zap } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20">
      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-6 flex items-center justify-between"
      >
        <div className="flex items-center space-x-2">
          <CheckCircle className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold tracking-tight">TodoFlow</span>
        </div>
        <AuthButton
          trigger={
            <Button size="lg" className="shadow-lg">
              Get Started Free
            </Button>
          }
          dashboardTrigger={
            <Button size="lg" variant="outline">
              Go to Dashboard
            </Button>
          }
        />
      </motion.nav>

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="container mx-auto px-4 py-20 text-center"
      >
        <div className="max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent"
          >
            Organize Your Life
            <br />
            <span className="text-primary">Effortlessly</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto"
          >
            The modern todo app that adapts to your workflow. 
            Simple, powerful, and beautifully designed.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <AuthButton
              trigger={
                <Button size="lg" className="text-lg px-8 py-6 shadow-lg">
                  Start Organizing Today
                </Button>
              }
            />
            <Button variant="outline" size="lg" className="text-lg px-8 py-6">
              Watch Demo
            </Button>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="container mx-auto px-4 py-20"
      >
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Everything you need to stay productive
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed to help you focus on what matters most
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: <Zap className="h-8 w-8 text-primary" />,
              title: "Lightning Fast",
              description: "Add and manage tasks in seconds with our intuitive interface"
            },
            {
              icon: <Star className="h-8 w-8 text-primary" />,
              title: "Priority System",
              description: "Organize tasks by priority to focus on what's important"
            },
            {
              icon: <Clock className="h-8 w-8 text-primary" />,
              title: "Due Dates",
              description: "Never miss a deadline with smart due date reminders"
            },
            {
              icon: <CheckCircle className="h-8 w-8 text-primary" />,
              title: "Categories",
              description: "Organize tasks into custom categories for better workflow"
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow"
            >
              <div className="mb-4 flex justify-center">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="container mx-auto px-4 py-20"
      >
        <div className="text-center bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-12 border">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Ready to get organized?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of users who have transformed their productivity with TodoFlow
          </p>
          <AuthButton
            trigger={
              <Button size="lg" className="text-lg px-8 py-6 shadow-lg">
                Get Started Now - It's Free
              </Button>
            }
          />
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t">
        <div className="text-center text-muted-foreground">
          <p>&copy; 2024 TodoFlow. Built with ❤️ for productivity.</p>
        </div>
      </footer>
    </div>
  );
}