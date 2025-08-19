import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Sphere, Text3D, Float, Stars } from "@react-three/drei";
import * as THREE from "three";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Zap, 
  Sparkles, 
  Rocket, 
  Brain, 
  Eye, 
  Heart, 
  Star,
  Palette,
  Music,
  Gamepad2
} from "lucide-react";

// Crazy floating orbs component
function FloatingOrbs() {
  const groupRef = useRef<THREE.Group>(null);
  const [orbs] = useState(() => 
    Array.from({ length: 50 }, () => ({
      position: [
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20
      ],
      scale: Math.random() * 0.5 + 0.2,
      speed: Math.random() * 0.02 + 0.01,
      rotation: Math.random() * Math.PI * 2
    }))
  );

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.005;
      groupRef.current.rotation.x += 0.003;
      
      groupRef.current.children.forEach((child, i) => {
        const orb = orbs[i];
        child.position.y += Math.sin(state.clock.elapsedTime * orb.speed) * 0.01;
        child.rotation.z += orb.speed * 2;
      });
    }
  });

  return (
    <group ref={groupRef}>
      {orbs.map((orb, i) => (
        <Float key={i} speed={orb.speed} rotationIntensity={1} floatIntensity={2}>
          <Sphere args={[orb.scale, 8, 8]} position={orb.position as [number, number, number]}>
            <meshStandardMaterial 
              color={new THREE.Color().setHSL(Math.random(), 0.8, 0.6)}
              emissive={new THREE.Color().setHSL(Math.random(), 0.8, 0.3)}
              emissiveIntensity={0.5}
              transparent
              opacity={0.8}
            />
          </Sphere>
        </Float>
      ))}
    </group>
  );
}

// Particle explosion component
function ParticleExplosion({ count = 100 }: { count?: number }) {
  const [particles] = useState(() => 
    Array.from({ length: count }, () => ({
      position: [0, 0, 0],
      velocity: [
        (Math.random() - 0.5) * 0.2,
        (Math.random() - 0.5) * 0.2,
        (Math.random() - 0.5) * 0.2
      ],
      color: new THREE.Color().setHSL(Math.random(), 0.8, 0.6)
    }))
  );

  useFrame((state) => {
    particles.forEach((particle, i) => {
      particle.position[0] += particle.velocity[0];
      particle.position[1] += particle.velocity[1];
      particle.position[2] += particle.velocity[2];
    });
  });

  return (
    <group>
      {particles.map((particle, i) => (
        <Sphere key={i} args={[0.05, 4, 4]} position={particle.position as [number, number, number]}>
          <meshStandardMaterial 
            color={particle.color}
            emissive={particle.color}
            emissiveIntensity={0.5}
          />
        </Sphere>
      ))}
    </group>
  );
}

// Crazy text component
function CrazyText() {
  const textRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (textRef.current) {
      textRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
      textRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
      if (hovered) {
        textRef.current.scale.setScalar(1.2);
      } else {
        textRef.current.scale.setScalar(1);
      }
    }
  });

  return (
    <Text3D
      ref={textRef}
      font="/fonts/helvetiker_regular.typeface.json"
      size={1}
      height={0.2}
      curveSegments={12}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      TASK SPARK
      <meshStandardMaterial 
        color={hovered ? "#ff00ff" : "#00ffff"}
        emissive={hovered ? "#ff00ff" : "#00ffff"}
        emissiveIntensity={0.5}
      />
    </Text3D>
  );
}

// Main 3D scene
function Scene() {
  const { camera } = useThree();
  
  useEffect(() => {
    camera.position.set(0, 0, 10);
  }, [camera]);

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff00ff" />
      
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      <FloatingOrbs />
      
      <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
        <CrazyText />
      </Float>
      
      <ParticleExplosion count={200} />
      
      <OrbitControls 
        enableZoom={true}
        enablePan={true}
        enableRotate={true}
        autoRotate={true}
        autoRotateSpeed={0.5}
      />
    </>
  );
}

export default function Landing() {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-indigo-900 overflow-hidden relative">
      {/* Background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 100 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <motion.header 
          className="p-6 flex justify-between items-center"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
        >
          <div className="flex items-center space-x-2">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Zap className="h-8 w-8 text-yellow-400" />
            </motion.div>
            <span className="text-2xl font-bold text-white">TASK SPARK</span>
          </div>
          
          <div className="flex space-x-4">
            <Badge variant="secondary" className="bg-pink-500/20 text-pink-300 border-pink-500/50">
              <Sparkles className="h-4 w-4 mr-1" />
              INSANE
            </Badge>
            <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/50">
              <Brain className="h-4 w-4 mr-1" />
              CRAZY
            </Badge>
          </div>
        </motion.header>

        {/* Hero section */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
            {/* Left side - 3D Canvas */}
            <motion.div 
              className="h-[600px] relative"
              style={{ perspective: 1000 }}
              onMouseMove={handleMouseMove}
              onMouseLeave={() => {
                mouseX.set(0);
                mouseY.set(0);
              }}
            >
              <Canvas className="rounded-2xl border-2 border-purple-500/50 bg-black/20 backdrop-blur-sm">
                <Scene />
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
                <Heart className="h-6 w-6 text-white" />
              </motion.div>
            </motion.div>

            {/* Right side - Content */}
            <motion.div 
              className="space-y-8"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="space-y-4">
                <motion.h1 
                  className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400"
                  animate={{ 
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  TASK SPARK
                </motion.h1>
                
                <motion.p 
                  className="text-2xl text-gray-300 leading-relaxed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  The most <span className="text-pink-400 font-bold">INSANE</span> and <span className="text-purple-400 font-bold">CRAZY</span> task management app ever created! 
                  Prepare to have your mind blown with psychedelic 3D experiences and chaotic productivity!
                </motion.p>
              </div>

              <div className="space-y-4">
                <motion.div 
                  className="flex flex-wrap gap-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  {[
                    { icon: Rocket, text: "3D Navigation", color: "from-red-500 to-pink-500" },
                    { icon: Palette, text: "Psychedelic UI", color: "from-purple-500 to-indigo-500" },
                    { icon: Music, text: "Audio Chaos", color: "from-green-500 to-blue-500" },
                    { icon: Gamepad2, text: "Gamified Tasks", color: "from-yellow-500 to-orange-500" }
                  ].map((feature, i) => (
                    <motion.div
                      key={i}
                      className={`bg-gradient-to-r ${feature.color} p-3 rounded-lg flex items-center space-x-2`}
                      whileHover={{ scale: 1.05, rotate: 5 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <feature.icon className="h-5 w-5 text-white" />
                      <span className="text-white font-medium">{feature.text}</span>
                    </motion.div>
                  ))}
                </motion.div>

                <motion.div 
                  className="flex space-x-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                >
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold text-lg px-8 py-6"
                    whileHover={{ scale: 1.05, rotate: 2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={createExplosion}
                  >
                    <Rocket className="h-6 w-6 mr-2" />
                    LAUNCH INTO CHAOS!
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="border-purple-500 text-purple-300 hover:bg-purple-500/20 font-bold text-lg px-8 py-6"
                    whileHover={{ scale: 1.05, rotate: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Star className="h-6 w-6 mr-2" />
                    EXPLORE MADNESS
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom section */}
        <motion.div 
          className="p-6 text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
        >
          <p className="text-gray-400 text-lg">
            Ready to experience the most <span className="text-pink-400 font-bold">BONKERS</span> productivity tool? 
            Click anywhere to create explosions! 💥✨🚀
          </p>
        </motion.div>
      </div>

      {/* Explosion effects */}
      {explosions.map((explosion) => (
        <motion.div
          key={explosion.id}
          className="absolute pointer-events-none"
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
