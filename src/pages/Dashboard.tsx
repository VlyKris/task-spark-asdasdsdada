// TODO: THIS IS THE DEFAULT DASHBOARD PAGE THAT THE USER WILL SEE AFTER AUTHENTICATION. ADD MAIN FUNCTIONALITY HERE.
// This is the entry point for users who have just signed in

import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Box, Text, Float, Stars, Sphere } from "@react-three/drei";
import * as THREE from "three";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Plus, 
  Trash2, 
  CheckCircle, 
  Circle, 
  Zap, 
  Sparkles, 
  Brain, 
  Eye, 
  Heart, 
  Star,
  Palette,
  Music,
  Gamepad2,
  Rocket,
  Fire,
  Lightning,
  Crown,
  Trophy,
  Target,
  Timer
} from "lucide-react";

// 3D Task Card Component
function TaskCard3D({ task, onComplete, onDelete, position }: {
  task: any;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
  position: [number, number, number];
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [completed, setCompleted] = useState(task.completed);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
      
      if (hovered) {
        meshRef.current.scale.setScalar(1.1);
      } else {
        meshRef.current.scale.setScalar(1);
      }
    }
  });

  const handleComplete = () => {
    setCompleted(!completed);
    onComplete(task.id);
  };

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
      <group position={position}>
        <Box 
          ref={meshRef}
          args={[3, 2, 0.2]}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <meshStandardMaterial 
            color={completed ? "#10b981" : "#8b5cf6"}
            emissive={completed ? "#10b981" : "#8b5cf6"}
            emissiveIntensity={0.3}
            transparent
            opacity={0.9}
          />
        </Box>
        
        <Text
          position={[0, 0.5, 0.15]}
          fontSize={0.2}
          color={completed ? "#ffffff" : "#f3f4f6"}
          anchorX="center"
          anchorY="middle"
        >
          {task.title}
        </Text>
        
        <Text
          position={[0, 0, 0.15]}
          fontSize={0.15}
          color="#9ca3af"
          anchorX="center"
          anchorY="middle"
          maxWidth={2.5}
        >
          {task.description}
        </Text>
        
        <Text
          position={[0, -0.5, 0.15]}
          fontSize={0.15}
          color={completed ? "#10b981" : "#f59e0b"}
          anchorX="center"
          anchorY="middle"
        >
          {completed ? "COMPLETED! 🎉" : "PENDING"}
        </Text>
      </group>
    </Float>
  );
}

// 3D Scene for Dashboard
function DashboardScene({ tasks, onComplete, onDelete }: {
  tasks: any[];
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const { camera } = useThree();
  
  useEffect(() => {
    camera.position.set(0, 0, 15);
  }, [camera]);

  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff00ff" />
      
      <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
      
      {tasks.map((task, index) => {
        const angle = (index / tasks.length) * Math.PI * 2;
        const radius = 8;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        
        return (
          <TaskCard3D
            key={task.id}
            task={task}
            onComplete={onComplete}
            onDelete={onDelete}
            position={[x, y, 0]}
          />
        );
      })}
      
      <OrbitControls 
        enableZoom={true}
        enablePan={true}
        enableRotate={true}
        autoRotate={true}
        autoRotateSpeed={0.3}
      />
    </>
  );
}

// Floating Particle System
function FloatingParticles() {
  const [particles] = useState(() => 
    Array.from({ length: 100 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 4 + 2,
      speed: Math.random() * 2 + 1,
      color: `hsl(${Math.random() * 360}, 70%, 60%)`
    }))
  );

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: particle.speed + 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  );
}

export default function Dashboard() {
  const [tasks, setTasks] = useState([
    { id: '1', title: 'Create Insane UI', description: 'Make the most bonkers interface ever', completed: false, priority: 'high' },
    { id: '2', title: 'Add 3D Animations', description: 'Blow minds with Three.js magic', completed: true, priority: 'high' },
    { id: '3', title: 'Implement Chaos Mode', description: 'Randomize everything for fun', completed: false, priority: 'medium' },
    { id: '4', title: 'Add Particle Effects', description: 'Explosions and sparkles everywhere', completed: false, priority: 'low' },
    { id: '5', title: 'Create Mind-Bending UX', description: 'Confuse and amaze users', completed: true, priority: 'high' },
  ]);
  
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'medium' });
  const [showAddForm, setShowAddForm] = useState(false);
  const [chaosMode, setChaosMode] = useState(false);
  const [explosions, setExplosions] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [explosionCount, setExplosionCount] = useState(0);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springX = useSpring(mouseX, { stiffness: 100, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 30 });
  
  const rotateX = useTransform(springY, [-300, 300], [15, -15]);
  const rotateY = useTransform(springX, [-300, 300], [-15, 15]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const createExplosion = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setExplosions(prev => [...prev, { id: explosionCount, x, y }]);
    setExplosionCount(prev => prev + 1);
    
    setTimeout(() => {
      setExplosions(prev => prev.filter(exp => exp.id !== explosionCount));
    }, 1000);
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const addTask = () => {
    if (newTask.title.trim()) {
      const task = {
        id: Date.now().toString(),
        title: newTask.title,
        description: newTask.description,
        completed: false,
        priority: newTask.priority
      };
      setTasks(prev => [...prev, task]);
      setNewTask({ title: '', description: '', priority: 'medium' });
      setShowAddForm(false);
    }
  };

  const toggleChaosMode = () => {
    setChaosMode(!chaosMode);
    if (!chaosMode) {
      // Create multiple explosions when chaos mode is activated
      for (let i = 0; i < 10; i++) {
        setTimeout(() => {
          const x = Math.random() * window.innerWidth;
          const y = Math.random() * window.innerHeight;
          setExplosions(prev => [...prev, { id: explosionCount + i, x, y }]);
        }, i * 100);
      }
      setExplosionCount(prev => prev + 10);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'from-red-500 to-pink-500';
      case 'medium': return 'from-yellow-500 to-orange-500';
      case 'low': return 'from-green-500 to-blue-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-indigo-900 overflow-hidden relative">
      <FloatingParticles />
      
      {/* Header */}
      <motion.header 
        className="p-6 flex justify-between items-center relative z-10"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, type: "spring" }}
      >
        <div className="flex items-center space-x-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Zap className="h-8 w-8 text-yellow-400" />
          </motion.div>
          <div>
            <h1 className="text-3xl font-black text-white">TASK SPARK DASHBOARD</h1>
            <p className="text-purple-300">Manage your tasks in 3D CHAOS! 🚀</p>
          </div>
        </div>
        
        <div className="flex space-x-4">
          <Button
            onClick={toggleChaosMode}
            className={`font-bold ${chaosMode ? 'bg-gradient-to-r from-red-500 to-pink-500' : 'bg-gradient-to-r from-purple-500 to-indigo-500'}`}
            whileHover={{ scale: 1.05, rotate: chaosMode ? 180 : 0 }}
            whileTap={{ scale: 0.95 }}
          >
            {chaosMode ? <Fire className="h-5 w-5 mr-2" /> : <Lightning className="h-5 w-5 mr-2" />}
            {chaosMode ? 'CHAOS MODE ON!' : 'Activate Chaos'}
          </Button>
          
          <Badge variant="secondary" className="bg-pink-500/20 text-pink-300 border-pink-500/50">
            <Brain className="h-4 w-4 mr-1" />
            {tasks.filter(t => t.completed).length}/{tasks.length} COMPLETED
          </Badge>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="flex-1 p-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Left Side - 3D Task View */}
          <motion.div 
            className="h-[600px] relative"
            style={{ perspective: 1000 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => {
              mouseX.set(0);
              mouseY.set(0);
            }}
            onClick={createExplosion}
          >
            <Canvas className="rounded-2xl border-2 border-purple-500/50 bg-black/20 backdrop-blur-sm">
              <DashboardScene 
                tasks={tasks}
                onComplete={toggleTask}
                onDelete={deleteTask}
              />
            </Canvas>
            
            {/* Floating UI elements */}
            <motion.div
              className="absolute top-4 left-4 bg-gradient-to-r from-pink-500 to-purple-500 p-3 rounded-full"
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Eye className="h-6 w-6 text-white" />
            </motion.div>
            
            <motion.div
              className="absolute top-4 right-4 bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-full"
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, -5, 5, 0]
              }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            >
              <Crown className="h-6 w-6 text-white" />
            </motion.div>
          </motion.div>

          {/* Right Side - Task Management */}
          <motion.div 
            className="space-y-6"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {/* Add Task Section */}
            <Card className="bg-black/20 border-purple-500/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-purple-300 flex items-center">
                  <Plus className="h-5 w-5 mr-2" />
                  Add New Task
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Task title..."
                  value={newTask.title}
                  onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                  className="bg-black/30 border-purple-500/50 text-white placeholder:text-purple-300"
                />
                <Textarea
                  placeholder="Task description..."
                  value={newTask.description}
                  onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                  className="bg-black/30 border-purple-500/50 text-white placeholder:text-purple-300"
                />
                <div className="flex space-x-2">
                  {['low', 'medium', 'high'].map((priority) => (
                    <Button
                      key={priority}
                      variant={newTask.priority === priority ? "default" : "outline"}
                      size="sm"
                      onClick={() => setNewTask(prev => ({ ...prev, priority }))}
                      className={newTask.priority === priority ? 
                        `bg-gradient-to-r ${getPriorityColor(priority)}` : 
                        'border-purple-500/50 text-purple-300'
                      }
                    >
                      {priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </Button>
                  ))}
                </div>
                <Button 
                  onClick={addTask}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Task
                </Button>
              </CardContent>
            </Card>

            {/* Task List */}
            <div className="space-y-4 max-h-96 overflow-y-auto">
              <AnimatePresence>
                {tasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ delay: index * 0.1 }}
                    layout
                  >
                    <Card className={`bg-black/20 border-${task.completed ? 'green' : 'purple'}-500/50 backdrop-blur-sm transition-all duration-300 ${
                      chaosMode ? 'animate-pulse' : ''
                    }`}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleTask(task.id)}
                                className="p-0 h-auto"
                              >
                                {task.completed ? (
                                  <CheckCircle className="h-5 w-5 text-green-400" />
                                ) : (
                                  <Circle className="h-5 w-5 text-purple-400" />
                                )}
                              </Button>
                              <h3 className={`font-semibold ${task.completed ? 'line-through text-green-400' : 'text-white'}`}>
                                {task.title}
                              </h3>
                              <Badge 
                                variant="secondary" 
                                className={`bg-gradient-to-r ${getPriorityColor(task.priority)} text-white`}
                              >
                                {task.priority.toUpperCase()}
                              </Badge>
                            </div>
                            <p className={`text-sm ${task.completed ? 'text-green-300' : 'text-gray-300'}`}>
                              {task.description}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteTask(task.id)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Stats */}
            <Card className="bg-black/20 border-purple-500/50 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-purple-400">{tasks.length}</div>
                    <div className="text-sm text-gray-400">Total Tasks</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-400">{tasks.filter(t => t.completed).length}</div>
                    <div className="text-sm text-gray-400">Completed</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-pink-400">{tasks.filter(t => !t.completed).length}</div>
                    <div className="text-sm text-gray-400">Pending</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Explosion effects */}
      {explosions.map((explosion) => (
        <motion.div
          key={explosion.id}
          className="absolute pointer-events-none z-50"
          style={{ left: explosion.x, top: explosion.y }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 3, opacity: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="w-4 h-4 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-full" />
        </motion.div>
      ))}

      {/* Interactive background */}
      <div 
        className="absolute inset-0 cursor-crosshair"
        onClick={createExplosion}
      />
    </div>
  );
}
