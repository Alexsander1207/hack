import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

function Fox({ mouse }) {
  const group = useRef();
  const { scene } = useGLTF("/models/fox.glb"); // coloca tu fox.glb en public/models

  useFrame(() => {
    if (group.current) {
      // gira la cabeza del zorro según el mouse
      group.current.rotation.y = (mouse.x - 0.5) * 0.8; 
      group.current.rotation.x = (mouse.y - 0.5) * 0.3;
    }
  });

  return <primitive ref={group} object={scene} scale={1.5} />;
}

export default function FoxScene() {
  const mouse = useRef({ x: 0.5, y: 0.5 });

  const handleMouseMove = (e) => {
    mouse.current = {
      x: e.clientX / window.innerWidth,
      y: e.clientY / window.innerHeight,
    };
  };

  return (
    <div
      style={{ width: "100%", height: "300px" }}
      onMouseMove={handleMouseMove}
    >
      <Canvas camera={{ position: [0, 1, 3], fov: 50 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <Fox mouse={mouse.current} />
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  );
}
