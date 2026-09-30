import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Trail, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { sound } from '../../audio/SoundEffects';

// Karakter 3D Cyber-Electron "VOLT"
// Mewakili aliran muatan listrik / elektron yang mengalir dari tombol power ke CPU
export default function Character({
  position,
  rotation = [0, 0, 0],
  isMoving = false,
  isPowered = true,
  color = '#00ffff',
}) {
  const groupRef = useRef();
  const coreRef = useRef();
  const leftArmRef = useRef();
  const rightArmRef = useRef();
  const leftLegRef = useRef();
  const rightLegRef = useRef();
  const auraRingRef = useRef();
  const lastFootstepTime = useRef(0);

  // Animasi prosedural berjalan, melayang, dan detak energi elektron
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (groupRef.current) {
      // Rotasi cincin aura elektron mengelilingi karakter
      if (auraRingRef.current) {
        auraRingRef.current.rotation.x = t * 2.0;
        auraRingRef.current.rotation.y = t * 2.8;
      }

      // Detak napas energi / denyut plasma inti
      if (coreRef.current) {
        const pulse = 1 + Math.sin(t * 8) * 0.12;
        coreRef.current.scale.set(pulse, pulse, pulse);
      }

      if (isMoving) {
        // Animasi berlari (Run cycle)
        const stride = Math.sin(t * 14);
        const counterStride = -stride;

        // Ayunan lengan
        if (leftArmRef.current) leftArmRef.current.rotation.x = stride * 0.7;
        if (rightArmRef.current) rightArmRef.current.rotation.x = counterStride * 0.7;

        // Ayunan kaki
        if (leftLegRef.current) leftLegRef.current.rotation.x = counterStride * 0.75;
        if (rightLegRef.current) rightLegRef.current.rotation.x = stride * 0.75;

        // Angkat dan turunkan badan saat melangkah
        groupRef.current.position.y = (position[1] || 0.4) + Math.abs(Math.sin(t * 14)) * 0.12;

        // Suara langkah kaki elektron
        if (t - lastFootstepTime.current > 0.22) {
          sound.playFootstep();
          lastFootstepTime.current = t;
        }
      } else {
        // Animasi mengambang santai (Idle hovering)
        groupRef.current.position.y = (position[1] || 0.4) + Math.sin(t * 3) * 0.06;

        if (leftArmRef.current) leftArmRef.current.rotation.x = Math.sin(t * 2) * 0.1;
        if (rightArmRef.current) rightArmRef.current.rotation.x = -Math.sin(t * 2) * 0.1;
        if (leftLegRef.current) leftLegRef.current.rotation.x = 0;
        if (rightLegRef.current) rightLegRef.current.rotation.x = 0;
      }
    }
  });

  return (
    <group
      ref={groupRef}
      position={[position[0], position[1] || 0.4, position[2]]}
      rotation={rotation}
    >
      {/* Jejak Cahaya Listrik di belakang karakter saat bergerak (Trail Effect) */}
      <Trail
        width={0.6}
        length={6}
        color={color}
        attenuation={(t) => t * t}
      >
        {/* Inti Energi Plasma Karakter (The Electron Core) */}
        <mesh ref={coreRef} position={[0, 0.7, 0]}>
          <sphereGeometry args={[0.22, 24, 24]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive={color}
            emissiveIntensity={isPowered ? 3.0 : 0.2}
            roughness={0.1}
          />
        </mesh>
      </Trail>

      {/* Cahaya Penerang Karakter (Point Light) */}
      {isPowered && (
        <pointLight color={color} intensity={2.5} distance={3.5} position={[0, 0.8, 0]} />
      )}

      {/* Cincin Aura Medan Magnetik / Orbit Elektron */}
      <mesh ref={auraRingRef} position={[0, 0.7, 0]}>
        <torusGeometry args={[0.42, 0.02, 8, 24]} />
        <meshBasicMaterial color={color} wireframe />
      </mesh>

      {/* Kepala Robotik dengan Visor Neon */}
      <group position={[0, 1.05, 0]}>
        {/* Helm Cyber */}
        <mesh>
          <sphereGeometry args={[0.18, 16, 16]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Visor Bercahaya */}
        <mesh position={[0, 0.02, 0.14]}>
          <boxGeometry args={[0.2, 0.08, 0.08]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={2.0}
          />
        </mesh>
      </group>

      {/* Torso / Bodi Pelindung Arus */}
      <mesh position={[0, 0.65, 0]}>
        <cylinderGeometry args={[0.14, 0.1, 0.4, 8]} />
        <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.3} />
      </mesh>

      {/* Lengan Kiri */}
      <group ref={leftArmRef} position={[-0.24, 0.75, 0]}>
        <mesh position={[0, -0.18, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.35, 8]} />
          <meshStandardMaterial color="#334155" metalness={0.7} />
        </mesh>
        {/* Gauntlet Energi */}
        <mesh position={[0, -0.32, 0]}>
          <sphereGeometry args={[0.06, 12, 12]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.5} />
        </mesh>
      </group>

      {/* Lengan Kanan */}
      <group ref={rightArmRef} position={[0.24, 0.75, 0]}>
        <mesh position={[0, -0.18, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.35, 8]} />
          <meshStandardMaterial color="#334155" metalness={0.7} />
        </mesh>
        {/* Gauntlet Energi */}
        <mesh position={[0, -0.32, 0]}>
          <sphereGeometry args={[0.06, 12, 12]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.5} />
        </mesh>
      </group>

      {/* Kaki Kiri */}
      <group ref={leftLegRef} position={[-0.11, 0.45, 0]}>
        <mesh position={[0, -0.22, 0]}>
          <cylinderGeometry args={[0.045, 0.035, 0.4, 8]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} />
        </mesh>
        {/* Thruster Sepatu */}
        <mesh position={[0, -0.42, 0.03]}>
          <boxGeometry args={[0.08, 0.06, 0.15]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.2} />
        </mesh>
      </group>

      {/* Kaki Kanan */}
      <group ref={rightLegRef} position={[0.11, 0.45, 0]}>
        <mesh position={[0, -0.22, 0]}>
          <cylinderGeometry args={[0.045, 0.035, 0.4, 8]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} />
        </mesh>
        {/* Thruster Sepatu */}
        <mesh position={[0, -0.42, 0.03]}>
          <boxGeometry args={[0.08, 0.06, 0.15]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.2} />
        </mesh>
      </group>

      {/* Percikan Listrik Bergerak (Sparkles) */}
      {isPowered && (
        <Sparkles
          count={18}
          scale={1.2}
          size={2}
          speed={0.8}
          noise={0.3}
          color={color}
        />
      )}
    </group>
  );
}
