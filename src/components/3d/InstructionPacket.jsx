import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float } from '@react-three/drei';
import * as THREE from 'three';

// Objek 3D Paket Instruksi Komputer ("ADD R1, #5")
// Bergerak melintasi komponen CPU selama simulasi Siklus Instruksi (Fetch - Decode - Execute - Writeback)
export default function InstructionPacket({ currentStep = 1, isVisible = true }) {
  const meshRef = useRef();

  // Posisi dinamis target per siklus:
  // Step 1 (Fetch): Memori Cache / Register Bank (IR) [7, 1.6, 4]
  // Step 2 (Decode): Control Unit (CU) [0, 1.8, -6]
  // Step 3 (Execute): ALU Reactor [7, 1.8, -4]
  // Step 4 (Writeback): Register ACC [7, 1.6, 4]
  const targetPositions = {
    1: [7, 1.6, 4],
    2: [0, 1.8, -6],
    3: [7, 1.8, -4],
    4: [7, 1.6, 4],
  };

  const currentTarget = targetPositions[currentStep] || [7, 1.6, 4];

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Interpolasi mulus menuju lokasi komponen target
      meshRef.current.position.lerp(
        new THREE.Vector3(...currentTarget),
        delta * 3.5
      );
      meshRef.current.rotation.x += delta * 1.5;
      meshRef.current.rotation.y += delta * 2.0;
    }
  });

  if (!isVisible) return null;

  const stepLabels = {
    1: 'FETCH: [IR <- Mem[PC]]',
    2: 'DECODE: [Opcode: ADD]',
    3: 'EXECUTE: [10 + 5]',
    4: 'WRITEBACK: [ACC <- 15]',
  };

  return (
    <group ref={meshRef} position={currentTarget}>
      {/* Kubus Kristal Data Instruksi */}
      <mesh>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial
          color="#00ffff"
          emissive="#00b4d8"
          emissiveIntensity={2.5}
          wireframe
        />
      </mesh>

      {/* Inti Biner Bercahaya */}
      <mesh>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffff00"
          emissiveIntensity={3.0}
        />
      </mesh>

      {/* Cahaya Dinamis Mengikuti Paket */}
      <pointLight color="#00ffff" intensity={3} distance={4} />

      {/* Label Instruksi Melayang */}
      <Float speed={2} floatIntensity={0.2}>
        <Text
          position={[0, 0.6, 0]}
          fontSize={0.2}
          color="#ffffff"
          anchorX="center"
          anchorY="bottom"
        >
          {stepLabels[currentStep] || 'INSTRUCTION PACKET'}
        </Text>
      </Float>
    </group>
  );
}
