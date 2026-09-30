import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import MotherboardScene from './MotherboardScene';
import CpuInteriorScene from './CpuInteriorScene';
import Character from './Character';
import InstructionPacket from './InstructionPacket';
import { HARDWARE_STAGES } from '../../data/aokData';

// Kamera Dinamis yang mengikuti karakter atau bertransisi antar pemandangan
function CameraController({ charPosition, stage, activeCheckpoint, activeComponent }) {
  const { camera } = useThree();
  const controlsRef = useRef();

  useFrame((state, delta) => {
    let targetCamPos = new THREE.Vector3();
    let targetLookAt = new THREE.Vector3();

    if (stage === HARDWARE_STAGES.PCB_JOURNEY || stage === HARDWARE_STAGES.POWER_TRIGGERED) {
      // Mengikuti karakter dari belakang-atas secara sinematik
      targetCamPos.set(charPosition[0] * 0.4, 5.5, charPosition[2] + 7.5);
      targetLookAt.set(charPosition[0], 0.8, charPosition[2]);
    } else if (stage === HARDWARE_STAGES.INSIDE_CPU || stage === HARDWARE_STAGES.CYCLE_SIMULATION) {
      // Pemandangan makro di dalam Silicon Die CPU
      if (activeComponent) {
        // Fokuskan kamera ke komponen CPU yang dipilih
        const [cx, cy, cz] = activeComponent.roomPosition;
        targetCamPos.set(cx * 0.7, cy + 3.8, cz + 6.5);
        targetLookAt.set(cx, cy, cz);
      } else {
        // Tinjauan luas seluruh arsitektur
        targetCamPos.set(charPosition[0] * 0.5, 7.5, charPosition[2] + 9);
        targetLookAt.set(charPosition[0], 0.5, charPosition[2]);
      }
    } else {
      // Tampilan Overview Motherboard default
      targetCamPos.set(0, 9, 24);
      targetLookAt.set(0, 0, 10);
    }

    camera.position.lerp(targetCamPos, delta * 2.5);
    if (controlsRef.current) {
      controlsRef.current.target.lerp(targetLookAt, delta * 2.8);
      controlsRef.current.update();
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.06}
      maxPolarAngle={Math.PI / 2.05} // Mencegah kamera tembus ke bawah lantai
      minDistance={2}
      maxDistance={35}
    />
  );
}

// Komponen Utama Kanvas Game 3D
export default function GameCanvas({
  stage,
  isPowered,
  characterPos,
  characterRotation,
  isMoving,
  activeCheckpoint,
  activeComponent,
  onSelectCheckpoint,
  onSelectComponent,
  currentCycleStep,
  isExecuting,
}) {
  const isInsideCpu =
    stage === HARDWARE_STAGES.INSIDE_CPU ||
    stage === HARDWARE_STAGES.CYCLE_SIMULATION ||
    stage === HARDWARE_STAGES.QUIZ;

  return (
    <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
      <Canvas
        camera={{ position: [0, 8, 25], fov: 48 }}
        shadows
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      >
        {/* Warna Latar Belakang Cyber Space Gelap */}
        <color attach="background" args={['#030712']} />

        {/* Bintang / Partikel Angkasa Silikon */}
        <Stars radius={60} depth={40} count={1200} factor={3} saturation={0.8} fade speed={1.2} />

        {/* Pencahayaan Studio Ilmiah */}
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[10, 18, 12]}
          intensity={1.2}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <hemisphereLight args={['#00ffff', '#ff007f', 0.3]} />

        {/* Controller Kamera Halus */}
        <CameraController
          charPosition={characterPos}
          stage={stage}
          activeCheckpoint={activeCheckpoint}
          activeComponent={activeComponent}
        />

        {/* Render Scene: Motherboard atau Bagian Dalam CPU */}
        {!isInsideCpu ? (
          <MotherboardScene
            isPowered={isPowered}
            activeCheckpoint={activeCheckpoint}
            onSelectCheckpoint={onSelectCheckpoint}
          />
        ) : (
          <CpuInteriorScene
            activeComponent={activeComponent?.id}
            onSelectComponent={onSelectComponent}
            currentCycleStep={currentCycleStep}
            isExecuting={isExecuting}
          />
        )}

        {/* Karakter Elektron 3D "VOLT" */}
        {isPowered && (
          <Character
            position={characterPos}
            rotation={characterRotation}
            isMoving={isMoving}
            isPowered={isPowered}
            color={isInsideCpu ? '#00e5ff' : '#00ffff'}
          />
        )}

        {/* Paket Instruksi 3D (Hanya di dalam CPU) */}
        {isInsideCpu && (
          <InstructionPacket
            currentStep={currentCycleStep}
            isVisible={stage === HARDWARE_STAGES.CYCLE_SIMULATION}
          />
        )}
      </Canvas>
    </div>
  );
}
