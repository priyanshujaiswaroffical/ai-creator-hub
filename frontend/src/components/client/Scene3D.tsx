/**
 * Scene3D — The core React Three Fiber canvas rendering a premium abstract geometric shape.
 * This acts as the placeholder since no .GLB was provided.
 */

'use client';

import { useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Environment, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { useScrollStore } from '@/store/scroll-store';

function AbstractGeometry() {
  const meshRef = useRef<THREE.Mesh>(null);
  const targetRef = useRef(new THREE.Vector3());
  const mousePosition = useScrollStore((s) => s.mousePosition);
  const { viewport } = useThree();

  // Dynamically scale based on viewport width to prevent it being massive on mobile
  const isMobile = viewport.width < 5;
  const targetScale = isMobile ? 0.9 : 1.2;

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Slow continuous rotation
    meshRef.current.rotation.x += delta * 0.15;
    meshRef.current.rotation.y += delta * 0.2;

    // High-intensity mouse follow
    targetRef.current.set(mousePosition.x * 5, mousePosition.y * 3, 0);
    meshRef.current.position.lerp(targetRef.current, 0.03);
    
    // Slight tilt towards mouse
    meshRef.current.rotation.z = THREE.MathUtils.lerp(
      meshRef.current.rotation.z,
      mousePosition.x * 0.5,
      0.03
    );
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={meshRef} position={[0, 0, 0]} scale={targetScale}>
        <icosahedronGeometry args={[1, 0]} />
        <MeshDistortMaterial
          color="#00F0FF"
          emissive="#7000FF"
          emissiveIntensity={0.5}
          clearcoat={1}
          clearcoatRoughness={0.1}
          metalness={0.8}
          roughness={0.2}
          envMapIntensity={2}
          distort={0.4}
          speed={2}
        />
      </mesh>
    </Float>
  );
}

export default function Scene3D() {
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.6 }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 1.5]} // Capped at 1.5 to prevent massive lag on retina mobile screens
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={2} color="#00F0FF" />
        <directionalLight position={[-10, -10, -5]} intensity={1.5} color="#7000FF" />
        
        <AbstractGeometry />
        
        {/* Floating particles background */}
        <Sparkles count={80} scale={10} size={2} speed={0.4} color="#00F0FF" opacity={0.4} />
        
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
