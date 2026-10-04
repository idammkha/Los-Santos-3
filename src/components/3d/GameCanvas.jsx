import React, { useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, Text, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import MotherboardScene from './MotherboardScene';
import CpuExplodedScene from './CpuExplodedScene';
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
      ? new THREE.Vector3(0, 1.35, 18)
      : isInsideCpu && activeComponent?.roomPosition
        ? new THREE.Vector3(...activeComponent.roomPosition)
        : new THREE.Vector3(charPosition[0], 0, charPosition[2]);
    const offset = isInsideCpu
      ? new THREE.Vector3(4.8, 5.8, 9.2)
      : isPowerOff
        ? new THREE.Vector3(0, 3.4, 11.5)
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

function ComputerCase({ isPowered, isExploding, onPowerButtonPressed, onExplodeComplete }) {
  const leftPanelRef = useRef();
  const rightPanelRef = useRef();
  const topPanelRef = useRef();
  const frontPanelRef = useRef();
  const motherboardTrayRef = useRef();
  const fanRef = useRef();
  const resetFiredRef = useRef(false);
  const handlePhysicalPowerClick = (event) => {
    event.stopPropagation();
    if (!isPowered && !isExploding) onPowerButtonPressed?.();
  };

  useFrame((_, delta) => {
    const target = isExploding ? 1 : 0;
    const lerp = 1 - Math.exp(-delta * 2.8);
    if (leftPanelRef.current) leftPanelRef.current.position.x = THREE.MathUtils.lerp(leftPanelRef.current.position.x, -2.95 - 1.55 * target, lerp);
    if (rightPanelRef.current) rightPanelRef.current.position.x = THREE.MathUtils.lerp(rightPanelRef.current.position.x, 2.95 + 1.55 * target, lerp);
    if (topPanelRef.current) topPanelRef.current.position.y = THREE.MathUtils.lerp(topPanelRef.current.position.y, 2.75 + 1.45 * target, lerp);
    if (frontPanelRef.current) frontPanelRef.current.position.z = THREE.MathUtils.lerp(frontPanelRef.current.position.z, 4.35 + 1.7 * target, lerp);
    if (motherboardTrayRef.current) motherboardTrayRef.current.position.z = THREE.MathUtils.lerp(motherboardTrayRef.current.position.z, -0.05 - 0.45 * target, lerp);
    if (fanRef.current) fanRef.current.rotation.z += delta * (isPowered || isExploding ? 4 : 0.35);

    if (isExploding && !resetFiredRef.current) {
      resetFiredRef.current = true;
      window.setTimeout(() => onExplodeComplete?.(), 1250);
    }
    if (!isExploding) resetFiredRef.current = false;
  });

  return (
    <group position={[0, -0.4, 18]}>
      {/* Open chassis frame, raised feet, and power supply */}
      <mesh position={[0, 1.35, 0]} castShadow>
        <boxGeometry args={[5.8, 2.7, 9]} />
        <meshStandardMaterial color="#111820" metalness={0.82} roughness={0.3} wireframe />
      </mesh>
      {[-2.45, 2.45].flatMap((x) => [-3.9, 3.9].map((z) => (
        <mesh key={`case-foot-${x}-${z}`} position={[x, -0.08, z]} castShadow>
          <cylinderGeometry args={[0.3, 0.38, 0.34, 16]} />
          <meshStandardMaterial color="#080b10" metalness={0.3} roughness={0.72} />
        </mesh>
      )))}

      <group ref={motherboardTrayRef} position={[0, 1.45, -0.05]}>
        <RoundedBox args={[5.1, 0.16, 7.2]} radius={0.16} smoothness={4} castShadow receiveShadow>
          <meshStandardMaterial color="#1b4937" metalness={0.22} roughness={0.62} />
        </RoundedBox>
        <mesh position={[0, 0.13, -0.5]} castShadow>
          <boxGeometry args={[2.25, 0.38, 2.25]} />
          <meshStandardMaterial color="#9ca3af" metalness={0.86} roughness={0.22} />
        </mesh>
        <mesh position={[1.75, 0.2, -0.35]}>
          <boxGeometry args={[0.55, 0.45, 5.6]} />
          <meshStandardMaterial color="#111827" metalness={0.5} roughness={0.4} />
        </mesh>
        {[-1.1, 0, 1.1].map((x) => (
          <mesh key={`tray-ram-${x}`} position={[x, 0.18, -0.25]}>
            <boxGeometry args={[0.12, 0.18, 5.25]} />
            <meshStandardMaterial color="#eab308" metalness={0.85} roughness={0.2} />
          </mesh>
        ))}
        <mesh position={[-1.75, 0.2, -1.8]}>
          <boxGeometry args={[0.32, 0.36, 1.1]} />
          <meshStandardMaterial color="#f8fafc" metalness={0.2} roughness={0.45} />
        </mesh>
        <Text position={[0, 0.28, 2.2]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.22} color="#a7f3d0" fontStyle="bold">
          ATX MAINBOARD TRAY
        </Text>
      </group>

      {/* PSU and modular cable bundle */}
      <mesh position={[-1.65, 0.7, 3.05]} castShadow>
        <boxGeometry args={[2.25, 1.3, 1.6]} />
        <meshStandardMaterial color="#202631" metalness={0.74} roughness={0.34} />
      </mesh>
      <Text position={[-1.65, 1.38, 3.05]} fontSize={0.2} color="#fbbf24" fontStyle="bold" anchorX="center">
        850W PSU
      </Text>
      {[-0.9, -0.68, -0.46, -0.24, -0.02].map((x, index) => (
        <mesh key={`psu-cable-${index}`} position={[x, 1.08, 1.65]} rotation={[0.45, 0, 0]}>
          <cylinderGeometry args={[0.045, 0.045, 2.3, 8]} />
          <meshStandardMaterial color={index % 2 ? '#111827' : '#eab308'} roughness={0.54} />
        </mesh>
      ))}

      {/* Front panel with mesh, intake fan, USB/audio and physical power button */}
      <group ref={frontPanelRef} position={[0, 1.35, 4.35]}>
        <mesh castShadow>
          <boxGeometry args={[5.8, 2.7, 0.22]} />
          <meshStandardMaterial color="#18202a" metalness={0.8} roughness={0.26} />
        </mesh>
        <mesh position={[0, 0, 0.13]}>
          <boxGeometry args={[3.2, 2.25, 0.04]} />
          <meshStandardMaterial color="#0a1119" metalness={0.24} roughness={0.72} wireframe />
        </mesh>
        <group ref={fanRef} position={[-1.2, 0, 0.18]}>
          <mesh>
            <torusGeometry args={[0.76, 0.08, 12, 40]} />
            <meshStandardMaterial color={isPowered || isExploding ? '#22d3ee' : '#475569'} emissive={isPowered || isExploding ? '#0891b2' : '#000000'} emissiveIntensity={0.8} metalness={0.7} />
          </mesh>
          {[0, 1, 2, 3, 4, 5].map((blade) => (
            <mesh key={blade} rotation={[0, 0, (blade * Math.PI) / 3]} position={[0, 0, 0.015]}>
              <boxGeometry args={[0.14, 1.25, 0.06]} />
              <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.28} />
            </mesh>
          ))}
          <mesh>
            <cylinderGeometry args={[0.2, 0.2, 0.16, 20]} />
            <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.26} />
          </mesh>
        </group>
        <mesh position={[0.35, 0.8, 0.22]}>
          <boxGeometry args={[0.55, 0.12, 0.1]} />
          <meshStandardMaterial color="#111827" metalness={0.45} />
        </mesh>
        <mesh position={[0.98, 0.8, 0.22]}>
          <boxGeometry args={[0.28, 0.12, 0.1]} />
          <meshStandardMaterial color="#111827" metalness={0.45} />
        </mesh>
        <mesh position={[1.45, 0.8, 0.22]}>
          <cylinderGeometry args={[0.1, 0.1, 0.09, 16]} />
          <meshStandardMaterial color="#111827" metalness={0.5} />
        </mesh>
        <Text position={[0.7, 0.47, 0.22]} fontSize={0.13} color="#94a3b8" anchorX="center">
          USB-C   USB-A   AUDIO
        </Text>
        <mesh position={[2.05, 0.75, 0.42]} onClick={handlePhysicalPowerClick}>
          <circleGeometry args={[0.95, 36]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[2.05, 0.75, 0.24]} rotation={[Math.PI / 2, 0, 0]} onClick={handlePhysicalPowerClick}>
          <cylinderGeometry args={[0.34, 0.34, 0.14, 32]} />
          <meshStandardMaterial color={isPowered || isExploding ? '#22c55e' : '#334155'} emissive={isPowered || isExploding ? '#16a34a' : '#0891b2'} emissiveIntensity={isPowered || isExploding ? 1.4 : 0.32} metalness={0.7} roughness={0.2} />
        </mesh>
        <mesh position={[2.05, 0.85, 0.31]} onClick={handlePhysicalPowerClick}>
          <torusGeometry args={[0.22, 0.035, 10, 28]} />
          <meshBasicMaterial color={isPowered || isExploding ? '#4ade80' : '#22d3ee'} />
        </mesh>
        <Text position={[2.05, 0.22, 0.24]} fontSize={0.13} color="#cbd5e1" anchorX="center" fontStyle="bold" onClick={handlePhysicalPowerClick}>
          POWER
        </Text>
      </group>

      {/* Exploding side/top panels */}
      <group ref={leftPanelRef} position={[-2.95, 1.35, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.16, 2.7, 8.8]} />
          <meshStandardMaterial color="#26313d" metalness={0.84} roughness={0.24} />
        </mesh>
        <mesh position={[0.09, 0.1, 0]}>
          <boxGeometry args={[0.04, 1.25, 6.5]} />
          <meshStandardMaterial color="#111827" metalness={0.4} roughness={0.55} wireframe />
        </mesh>
      </group>
      <group ref={rightPanelRef} position={[2.95, 1.35, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.16, 2.7, 8.8]} />
          <meshStandardMaterial color="#26313d" metalness={0.84} roughness={0.24} />
        </mesh>
        {[-0.9, -0.5, -0.1, 0.3, 0.7].map((x) => (
          <mesh key={x} position={[0.1, 0.75, x]}>
            <boxGeometry args={[0.04, 0.65, 0.12]} />
            <meshStandardMaterial color="#64748b" metalness={0.7} />
          </mesh>
        ))}
      </group>
      <group ref={topPanelRef} position={[0, 2.75, 0]}>
        <mesh castShadow>
          <boxGeometry args={[5.8, 0.16, 8.8]} />
          <meshStandardMaterial color="#1e293b" metalness={0.82} roughness={0.25} />
        </mesh>
        <mesh position={[0, -0.09, 0]}>
          <boxGeometry args={[4.6, 0.04, 7.3]} />
          <meshStandardMaterial color="#0f172a" metalness={0.3} roughness={0.5} wireframe />
        </mesh>
      </group>

      <Text position={[0, 4.05, 0]} fontSize={0.42} color="#e2e8f0" fontStyle="bold" anchorX="center">
        ATX GAMING TOWER
      </Text>
      <Text position={[0, 3.55, 0]} fontSize={0.2} color="#22d3ee" anchorX="center" onClick={handlePhysicalPowerClick}>
        {isExploding ? 'CHASSIS DISASSEMBLY // MOTHERBOARD REVEALED' : 'PRESS THE PHYSICAL POWER BUTTON'}
      </Text>
    </group>
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
