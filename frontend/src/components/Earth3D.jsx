import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial, Stars } from '@react-three/drei';
import * as THREE from 'three';

const AnimatedEarth = ({ footprint }) => {
  const meshRef = useRef();
  
  // Color changes based on carbon footprint
  const getEarthColor = () => {
    if (footprint < 4000) return '#10b981'; // Green - Good
    if (footprint < 6000) return '#3b82f6'; // Blue - Moderate
    if (footprint < 8100) return '#f59e0b'; // Orange - High
    return '#ef4444'; // Red - Very High
  };

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.3;
      meshRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.2) * 0.1;
    }
  });

  return (
    <Sphere ref={meshRef} args={[2, 100, 100]} scale={1}>
      <MeshDistortMaterial
        color={getEarthColor()}
        attach="material"
        distort={0.3}
        speed={1.5}
        roughness={0.4}
        metalness={0.8}
      />
    </Sphere>
  );
};

const ParticleRing = () => {
  const points = useRef();
  
  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(500 * 3);
    for (let i = 0; i < 500; i++) {
      const angle = (i / 500) * Math.PI * 2;
      const radius = 3 + Math.random() * 0.5;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 0.5;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
    }
    return positions;
  }, []);

  useFrame(({ clock }) => {
    if (points.current) {
      points.current.rotation.y = clock.getElapsedTime() * 0.5;
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlesPosition.length / 3}
          array={particlesPosition}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#10b981"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
};

const Earth3D = ({ footprint = 5000 }) => {
  return (
    <div className="w-full h-96 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 rounded-2xl overflow-hidden shadow-2xl">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#3b82f6" />
        
        <Stars radius={100} depth={50} count={5000} factor={4} fade speed={1} />
        
        <AnimatedEarth footprint={footprint} />
        <ParticleRing />
        
        <OrbitControls 
          enableZoom={false} 
          autoRotate 
          autoRotateSpeed={0.5}
          enablePan={false}
        />
      </Canvas>
      
      <div className="absolute bottom-4 left-4 right-4 text-white text-center bg-black bg-opacity-50 backdrop-blur-sm rounded-lg p-3">
        <p className="text-sm font-semibold">
          🌍 Your Carbon Impact Visualization
        </p>
        <p className="text-xs opacity-80">
          Color changes based on your footprint
        </p>
      </div>
    </div>
  );
};

export default Earth3D;