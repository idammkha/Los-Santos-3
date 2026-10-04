import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float } from '@react-three/drei';
import * as THREE from 'three';
import { CPU_COMPONENTS } from '../../data/aokData';

// Objek 3D Paket Instruksi Komputer ("ADD R1, #5")
// Bergerak turun mengikuti exploded CPU stack selama Fetch - Decode - Execute - Writeback.
export default function InstructionPacket({ currentStep = 1, isVisible = true }) {
  const meshRef = useRef();

  const getComponentPosition = (id) => CPU_COMPONENTS.find((component) => component.id === id)?.roomPosition;
  const targetPositions = {
    1: getComponentPosition('registers'),
    2: getComponentPosition('cu'),
    3: getComponentPosition('alu'),
    4: getComponentPosition('registers'),
  };

  const currentTarget = targetPositions[currentStep] || getComponentPosition('registers') || [0, 0.75, 0];

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
      <mesh position={[0, 0.85, 0]}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial
          color="#00ffff"
          emissive="#00b4d8"
          emissiveIntensity={2.5}
          wireframe
        />
      </mesh>

      {/* Inti Biner Bercahaya */}
      <mesh position={[0, 0.85, 0]}>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffff00"
          emissiveIntensity={3.0}
        />
      </mesh>

      {/* Cahaya Dinamis Mengikuti Paket */}
      <pointLight color="#00ffff" intensity={3} distance={4} position={[0, 0.85, 0]} />

      {/* Label Instruksi Melayang */}
      <Float speed={2} floatIntensity={0.2}>
        <Text
          position={[0, 1.45, 0]}
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
