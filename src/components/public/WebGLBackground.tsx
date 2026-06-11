"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function SynthwaveGrid() {
  const gridRef = useRef<THREE.GridHelper>(null);
  
  // Animate the grid moving towards the camera to simulate moving forward
  useFrame((state, delta) => {
    if (gridRef.current) {
      gridRef.current.position.z += delta * 2;
      // Loop the grid to make it look infinite
      if (gridRef.current.position.z > 2) {
        gridRef.current.position.z = 0;
      }
    }
  });

  return (
    <group position={[0, -2, 0]}>
      {/* Glow effect under the grid */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial color="#ff00ff" transparent opacity={0.1} />
      </mesh>
      
      <gridHelper 
        ref={gridRef}
        args={[100, 100, "#00ffff", "#ff00ff"]} 
        position={[0, 0, 0]}
      />
    </group>
  );
}

function StarsScene() {
  const starsRef = useRef<THREE.Points>(null);

  const [positions, sizes] = useMemo(() => {
    const positions = new Float32Array(3000);
    const sizes = new Float32Array(1000);
    for (let i = 0; i < 1000; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 50;
      sizes[i] = Math.random() * 0.5;
    }
    return [positions, sizes];
  }, []);

  useFrame((state, delta) => {
    if (starsRef.current) {
      starsRef.current.rotation.y += delta * 0.05;
      starsRef.current.rotation.x += delta * 0.02;
    }
  });

  return (
    <points ref={starsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={1000}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={1000}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial color="#ffffff" sizeAttenuation transparent opacity={0.8} />
    </points>
  );
}

export default function WebGLBackground({ scene = "synthwave" }: { scene?: string }) {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none bg-black">
      {/* We set dpr (device pixel ratio) to max 2 to save performance on high-density displays like iPhones */}
      <Canvas dpr={[1, 2]} camera={{ position: [0, 1, 5], fov: 60 }}>
        {/* Ambient light for subtle lighting */}
        <ambientLight intensity={0.2} />
        
        {/* Render scene conditionally */}
        {scene === "synthwave" && <SynthwaveGrid />}
        {scene === "stars" && <StarsScene />}
        
        {/* Fog to hide the edges of the 3D world */}
        <fog attach="fog" args={["#000000", 5, 25]} />
      </Canvas>
    </div>
  );
}
