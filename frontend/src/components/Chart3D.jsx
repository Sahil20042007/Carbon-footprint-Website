import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';

const DonutSegment = ({ startAngle, endAngle, color, radius, label, value, index }) => {
  const meshRef = useRef();
  const textRef = useRef();
  
  useFrame(({ clock }) => {
    if (meshRef.current) {
      const hover = Math.sin(clock.getElapsedTime() * 2 + index) * 0.1;
      meshRef.current.scale.set(1 + hover * 0.1, 1 + hover * 0.1, 1);
    }
  });

  const shape = new THREE.Shape();
  const innerRadius = radius * 0.5;
  const outerRadius = radius;
  
  // Create donut segment
  for (let i = 0; i <= 32; i++) {
    const angle = startAngle + (endAngle - startAngle) * (i / 32);
    const x = Math.cos(angle) * outerRadius;
    const y = Math.sin(angle) * outerRadius;
    if (i === 0) {
      shape.moveTo(x, y);
    } else {
      shape.lineTo(x, y);
    }
  }
  
  for (let i = 32; i >= 0; i--) {
    const angle = startAngle + (endAngle - startAngle) * (i / 32);
    const x = Math.cos(angle) * innerRadius;
    const y = Math.sin(angle) * innerRadius;
    shape.lineTo(x, y);
  }
  
  const extrudeSettings = {
    depth: 0.5,
    bevelEnabled: true,
    bevelThickness: 0.1,
    bevelSize: 0.1,
    bevelSegments: 3
  };

  const midAngle = (startAngle + endAngle) / 2;
  const textRadius = (innerRadius + outerRadius) / 2;
  const textX = Math.cos(midAngle) * textRadius;
  const textY = Math.sin(midAngle) * textRadius;

  return (
    <group>
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <extrudeGeometry args={[shape, extrudeSettings]} />
        <meshStandardMaterial 
          color={color} 
          metalness={0.3} 
          roughness={0.4}
          emissive={color}
          emissiveIntensity={0.2}
        />
      </mesh>
      
      <Text
        ref={textRef}
        position={[textX, textY, 0.5]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {value}%
      </Text>
    </group>
  );
};

const Chart3D = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = 0;

  const colors = [
    '#3b82f6', // Blue
    '#f59e0b', // Orange
    '#10b981', // Green
    '#8b5cf6', // Purple
    '#ef4444'  // Red
  ];

  return (
    <div className="w-full h-96 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden shadow-2xl relative">
      <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#3b82f6" />
        
        <group>
          {data.map((item, index) => {
            const percentage = (item.value / total) * 100;
            const angleSize = (item.value / total) * Math.PI * 2;
            const segment = (
              <DonutSegment
                key={index}
                startAngle={currentAngle}
                endAngle={currentAngle + angleSize}
                color={colors[index % colors.length]}
                radius={3}
                label={item.name}
                value={percentage.toFixed(1)}
                index={index}
              />
            );
            currentAngle += angleSize;
            return segment;
          })}
          
          {/* Center text */}
          <Text
            position={[0, 0, 0.6]}
            fontSize={0.8}
            color="white"
            anchorX="center"
            anchorY="middle"
            font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
          >
            Total
          </Text>
          <Text
            position={[0, -0.8, 0.6]}
            fontSize={0.5}
            color="#10b981"
            anchorX="center"
            anchorY="middle"
            font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
          >
            {total.toFixed(0)} kg
          </Text>
        </group>
        
        <OrbitControls 
          enableZoom={false}
          autoRotate
          autoRotateSpeed={2}
          enablePan={false}
        />
      </Canvas>

      {/* Legend */}
      <div className="absolute top-4 right-4 bg-black bg-opacity-60 backdrop-blur-sm rounded-lg p-4 space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-4 h-4 rounded" 
              style={{ backgroundColor: colors[index % colors.length] }}
            ></div>
            <span className="text-white text-sm font-medium">{item.name}</span>
          </div>
        ))}
      </div>

      <div className="absolute bottom-4 left-4 right-4 text-white text-center bg-black bg-opacity-50 backdrop-blur-sm rounded-lg p-3">
        <p className="text-sm font-semibold">
          🎯 Interactive 3D Carbon Breakdown
        </p>
        <p className="text-xs opacity-80">
          Drag to rotate • Auto-rotating view
        </p>
      </div>
    </div>
  );
};

export default Chart3D;