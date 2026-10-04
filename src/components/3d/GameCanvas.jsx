import React, { useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import MotherboardScene from './MotherboardScene';
import CpuExplodedScene from './CpuExplodedScene';
import ComputerCase from './ComputerCase';
import Character from './Character';
import InstructionPacket from './InstructionPacket';
import MovementController from './MovementController';
import { HARDWARE_STAGES, MOTHERBOARD_CHECKPOINTS } from '../../data/aokData';

// Reframe only on scene changes; OrbitControls stays in charge between transitions.
function CameraController({ charPosition, stage, activeComponent, cameraMoveRef }) {
  const { camera } = useThree();
  const cameraRef = useRef(camera);
  const controlsRef = useRef();
  const directionRef = useRef(new THREE.Vector3());
  const forwardRef = useRef(new THREE.Vector3());
  const rightRef = useRef(new THREE.Vector3());
  const upRef = useRef(new THREE.Vector3(0, 1, 0));
  const lastPositionRef = useRef(new THREE.Vector3(...charPosition));
  const previousStageRef = useRef(null);

  useFrame(() => {
    if (!controlsRef.current) return;
    camera.getWorldDirection(directionRef.current);
    forwardRef.current.set(directionRef.current.x, 0, directionRef.current.z);
    if (forwardRef.current.lengthSq() < 0.001) forwardRef.current.set(0, 0, -1);
    forwardRef.current.normalize();
    rightRef.current.crossVectors(forwardRef.current, upRef.current).normalize();
    cameraMoveRef.current.forward[0] = forwardRef.current.x;
    cameraMoveRef.current.forward[1] = forwardRef.current.z;
    cameraMoveRef.current.right[0] = rightRef.current.x;
    cameraMoveRef.current.right[1] = rightRef.current.z;

    const dx = charPosition[0] - lastPositionRef.current.x;
    const dy = charPosition[1] - lastPositionRef.current.y;
    const dz = charPosition[2] - lastPositionRef.current.z;
    if (dx === 0 && dy === 0 && dz === 0) return;

    cameraRef.current.position.x += dx;
    cameraRef.current.position.y += dy;
    cameraRef.current.position.z += dz;
    controlsRef.current.target.x += dx;
    controlsRef.current.target.y += dy;
    controlsRef.current.target.z += dz;
    lastPositionRef.current.set(...charPosition);
  });

  useEffect(() => {
    if (previousStageRef.current === stage) return;
    const isInsideCpu =
      stage === HARDWARE_STAGES.INSIDE_CPU ||
      stage === HARDWARE_STAGES.CYCLE_SIMULATION ||
      stage === HARDWARE_STAGES.QUIZ;
    const isPowerOff = stage === HARDWARE_STAGES.POWER_OFF;
    const focus = isPowerOff
      ? new THREE.Vector3(0, 2.0, 18)
      : isInsideCpu && activeComponent?.roomPosition
        ? new THREE.Vector3(...activeComponent.roomPosition)
        : new THREE.Vector3(charPosition[0], 0, charPosition[2]);
    const offset = isInsideCpu
      ? new THREE.Vector3(4.8, 5.8, 9.2)
      : isPowerOff
        ? new THREE.Vector3(-4.6, 2.2, 9.6)
        : new THREE.Vector3(0, 9, 16);

    if (controlsRef.current) {
      controlsRef.current.target.copy(focus);
      cameraRef.current.position.copy(focus).add(offset);
      controlsRef.current.update();
    }
    lastPositionRef.current.set(...charPosition);
    previousStageRef.current = stage;
  }, [stage, activeComponent, charPosition]);

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enableDamping
      dampingFactor={0.06}
      enablePan
      enableRotate
      enableZoom
      maxPolarAngle={Math.PI / 1.85}
      minDistance={3}
      maxDistance={55}
    />
  );
}

function AmbientParticles({ isInsideCpu, isPowered }) {
  const pointsRef = useRef();
  const { positions, colors } = useMemo(() => {
    const count = 360;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    for (let index = 0; index < count; index += 1) {
      const angle = index * 2.399963;
      const radius = 3 + ((index * 37) % 100) / 8;
      positions[index * 3] = Math.cos(angle) * radius;
      positions[index * 3 + 1] = ((index * 19) % 120) / 10 - 3;
      positions[index * 3 + 2] = Math.sin(angle) * radius + (isInsideCpu ? 0 : 8);
      const color = new THREE.Color(index % 7 === 0 ? '#a78bfa' : '#22d3ee');
      colors[index * 3] = color.r;
      colors[index * 3 + 1] = color.g;
      colors[index * 3 + 2] = color.b;
    }
    return { positions, colors };
  }, [isInsideCpu]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y += delta * (isPowered ? 0.035 : 0.012);
    pointsRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.3;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={isPowered ? 0.075 : 0.045}
        vertexColors
        transparent
        opacity={isPowered ? 0.9 : 0.4}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

function ObjectiveShockwave({ position, color }) {
  const ringRef = useRef();

  useFrame(({ clock }) => {
    if (!ringRef.current) return;
    const t = (clock.getElapsedTime() % 1.4) / 1.4;
    const scale = 0.72 + t * 1.45;
    ringRef.current.scale.setScalar(scale);
    ringRef.current.material.opacity = 0.48 * (1 - t);
  });

  return (
    <mesh ref={ringRef} position={position} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0.34, 0.52, 32]} />
      <meshBasicMaterial color={color} transparent opacity={0.48} />
    </mesh>
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
  isExploding = false,
  onPowerButtonPressed,
  onExplodeComplete,
  cameraMoveRef,
  movementControllerProps,
}) {
  const isInsideCpu =
    stage === HARDWARE_STAGES.INSIDE_CPU ||
    stage === HARDWARE_STAGES.CYCLE_SIMULATION ||
    stage === HARDWARE_STAGES.QUIZ;

  const checkpointData =
    typeof activeCheckpoint === 'string'
      ? MOTHERBOARD_CHECKPOINTS.find((cp) => cp.id === activeCheckpoint) || null
      : activeCheckpoint || null;
  const groundHeight = -0.48;
  const groundOffsetZ = 8;

  return (
    <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
      <Canvas
        camera={{ position: [0, 8, 25], fov: 44 }}
        shadows
        dpr={[1, 1.35]}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      >
        {/* Warna Latar Belakang Cyber Space Gelap */}
        <color attach="background" args={['#030712']} />
        <fog attach="fog" args={['#030712', 18, 58]} />

        {/* Bintang / Partikel Angkasa Silikon */}
        <Stars radius={60} depth={40} count={650} factor={3} saturation={0.55} fade speed={0.7} />

        {!isInsideCpu && isPowered && (
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, groundHeight, groundOffsetZ]} receiveShadow>
            <planeGeometry args={[44, 44]} />
            <meshStandardMaterial color="#101316" metalness={0.12} roughness={0.94} />
          </mesh>
        )}

        {/* Pencahayaan Studio Ilmiah */}
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[10, 18, 12]}
          intensity={1.2}
          castShadow
          shadow-mapSize-width={512}
          shadow-mapSize-height={512}
        />
        <hemisphereLight args={['#bdc7d2', '#30343a', 0.22]} />

        {/* Controller Kamera Halus */}
        <CameraController
          charPosition={characterPos}
          stage={stage}
          activeComponent={activeComponent}
          cameraMoveRef={cameraMoveRef}
        />

        <AmbientParticles isInsideCpu={isInsideCpu} isPowered={isPowered} />
        {isPowered && <MovementController {...movementControllerProps} />}

        {/* Render Scene: Motherboard atau Bagian Dalam CPU */}
        {!isInsideCpu && isPowered ? (
          <MotherboardScene
            isPowered={isPowered}
            activeCheckpoint={activeCheckpoint}
            onSelectCheckpoint={onSelectCheckpoint}
          />
        ) : isInsideCpu ? (
          <CpuExplodedScene
            activeComponent={activeComponent?.id}
            onSelectComponent={onSelectComponent}
            currentCycleStep={currentCycleStep}
            isExecuting={isExecuting}
          />
        ) : (
          <ComputerCase
            isPowered={isPowered}
            isExploding={isExploding}
            onPowerButtonPressed={onPowerButtonPressed}
            onExplodeComplete={onExplodeComplete}
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

        {/* Penanda target aktif di dunia agar terasa seperti quest marker */}
        {checkpointData && !isInsideCpu && (
          <ObjectiveShockwave position={[checkpointData.position[0], 0.9, checkpointData.position[2]]} color="#22d3ee" />
        )}

        {activeComponent && isInsideCpu && (
          <ObjectiveShockwave position={[activeComponent.roomPosition[0], 0.9, activeComponent.roomPosition[2]]} color="#c084fc" />
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
