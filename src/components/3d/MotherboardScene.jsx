import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float } from '@react-three/drei';
import * as THREE from 'three';
import { MOTHERBOARD_CHECKPOINTS } from '../../data/aokData';

// Komponen Motherboard 3D dengan Jalur Sirkuit Bercahaya (PCB Traces),
// VRM, Crystal Oscillator, Socket LGA, dan Penanda Interaktif AOK
export default function MotherboardScene({ isPowered, activeCheckpoint, onSelectCheckpoint }) {
  const tracesRef = useRef();
  const pulseMaterialRef = useRef();

  // Animasi denyut arus listrik di jalur sirkuit
  useFrame(({ clock }) => {
    if (pulseMaterialRef.current && isPowered) {
      pulseMaterialRef.current.dashOffset = -clock.getElapsedTime() * 2.5;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Papan PCB Utama (Dark Matte High-End PCB) */}
      <mesh receiveShadow position={[0, -0.2, 8]}>
        <boxGeometry args={[16, 0.4, 28]} />
        <meshStandardMaterial
          color="#0b1319"
          roughness={0.4}
          metalness={0.7}
        />
      </mesh>

      {/* Grid Sutra PCB (Silk Screen Lines) */}
      <gridHelper
        args={[28, 28, '#00ffff', '#052b36']}
        position={[0, 0.02, 8]}
        rotation={[0, 0, 0]}
      />

      {/* Jalur Tembaga Utama (Main Copper Bus Traces - Mengalirkan Arus dari Power SW ke CPU) */}
      <MainPowerTraces isPowered={isPowered} pulseMaterialRef={pulseMaterialRef} />

      {/* Titik 1: Front Panel Power Connector (PWR_SW Header) */}
      <FrontPanelHeader isPowered={isPowered} />

      {/* Titik 2: 24-Pin ATX Main Power Socket */}
      <AtxPowerConnector isPowered={isPowered} />

      {/* Titik 3: VRM (Voltage Regulator Module - Chokes, Caps, Mosfets) */}
      <VrmPhaseModule isPowered={isPowered} />

      {/* Titik 4: Crystal Oscillator (Clock Generator) */}
      <CrystalOscillator isPowered={isPowered} />

      {/* Titik 5: CPU Socket LGA & Heat Spreader Frame */}
      <CpuSocketModule isPowered={isPowered} />

      {/* Holographic Checkpoint Beacons untuk Kebutuhan Akademis */}
      {MOTHERBOARD_CHECKPOINTS.map((cp) => (
        <CheckpointBeacon
          key={cp.id}
          checkpoint={cp}
          isActive={activeCheckpoint === cp.id}
          isPowered={isPowered}
          onSelect={() => onSelectCheckpoint(cp)}
        />
      ))}
    </group>
  );
}

// Jalur bus sirkuit bercahaya yang menghubungkan tombol power ke CPU
function MainPowerTraces({ isPowered }) {
  const linePoints = [
    new THREE.Vector3(0, 0.05, 18), // Front Panel
    new THREE.Vector3(0, 0.05, 14),
    new THREE.Vector3(-1.5, 0.05, 13),
    new THREE.Vector3(-1.5, 0.05, 11), // VRM input
    new THREE.Vector3(0, 0.05, 10),
    new THREE.Vector3(1.5, 0.05, 8),
    new THREE.Vector3(1.5, 0.05, 5),  // Crystal Clock
    new THREE.Vector3(0, 0.05, 3),
    new THREE.Vector3(0, 0.05, -1),   // CPU Socket Entry
  ];

  const curve = new THREE.CatmullRomCurve3(linePoints);
  const tubeGeometry = new THREE.TubeGeometry(curve, 64, 0.12, 8, false);

  return (
    <group>
      {/* Dasar Jalur Tembaga PCB */}
      <mesh geometry={tubeGeometry} position={[0, 0.01, 0]}>
        <meshStandardMaterial
          color={isPowered ? '#00e5ff' : '#0d3d47'}
          emissive={isPowered ? '#00b4d8' : '#021e24'}
          emissiveIntensity={isPowered ? 1.8 : 0.1}
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>

      {/* Jalur Paralel Tambahan (Data Bus & Ground Plane Traces) */}
      {[-0.6, 0.6, -1.2, 1.2].map((offset, i) => (
        <mesh key={i} position={[offset, 0.02, 8]}>
          <boxGeometry args={[0.08, 0.02, 22]} />
          <meshStandardMaterial
            color={isPowered ? '#ffd166' : '#4a3b10'}
            emissive={isPowered ? '#ffb703' : '#1a1402'}
            emissiveIntensity={isPowered ? 0.8 : 0.05}
          />
        </mesh>
      ))}
    </group>
  );
}

// Header Tombol Power (Pin jumper emas tempat tombol casing dihubungkan)
function FrontPanelHeader({ isPowered }) {
  return (
    <group position={[0, 0, 18]}>
      {/* Blok header plastik hitam */}
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[1.6, 0.4, 0.8]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
      </mesh>
      {/* 2 pin emas PWR_SW */}
      {[-0.3, 0.3].map((x, i) => (
        <mesh key={i} position={[x, 0.5, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 0.6, 12]} />
          <meshStandardMaterial
            color="#ffd700"
            metalness={0.9}
            roughness={0.2}
            emissive={isPowered ? '#ffaa00' : '#000000'}
            emissiveIntensity={isPowered ? 0.8 : 0}
          />
        </mesh>
      ))}
      <Text
        position={[0, 0.8, 0.6]}
        fontSize={0.28}
        color={isPowered ? '#00ffff' : '#888888'}
        anchorX="center"
        anchorY="middle"
      >
        PWR_SW
      </Text>
    </group>
  );
}

// Soket Daya 24-Pin ATX
function AtxPowerConnector({ isPowered }) {
  return (
    <group position={[-6, 0, 10]}>
      <mesh position={[0, 0.6, 0]}>
        <boxGeometry args={[1.5, 1.2, 5]} />
        <meshStandardMaterial color="#ffffff" roughness={0.3} metalness={0.2} />
      </mesh>
      <Text
        position={[0, 1.3, 0]}
        rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
        fontSize={0.3}
        color="#333333"
      >
        24-PIN ATX (12V/5V/3.3V)
      </Text>
    </group>
  );
}

// Modul VRM (Chokes ferrite kubus, Solid Capacitors silinder, MOSFET heatsink)
function VrmPhaseModule({ isPowered }) {
  return (
    <group position={[-2.8, 0, 11]}>
      {/* Heatsink Aluminium Pendingin VRM */}
      <mesh position={[-0.8, 0.6, 0]}>
        <boxGeometry args={[1.2, 1.2, 4.5]} />
        <meshStandardMaterial
          color="#22252a"
          metalness={0.8}
          roughness={0.3}
        />
      </mesh>

      {/* 4 Choke Induktor Ferrite bertuliskan R80 */}
      {[ -1.5, -0.5, 0.5, 1.5 ].map((z, i) => (
        <group key={`choke-${i}`} position={[0.2, 0.35, z]}>
          <mesh>
            <boxGeometry args={[0.7, 0.7, 0.7]} />
            <meshStandardMaterial
              color="#1c2128"
              metalness={0.9}
              roughness={0.2}
            />
          </mesh>
          <Text
            position={[0, 0.36, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            fontSize={0.16}
            color={isPowered ? '#00e5ff' : '#666666'}
          >
            R80
          </Text>
        </group>
      ))}

      {/* Kapasitor Solid Aluminium Berjajar */}
      {[ -1.5, -0.5, 0.5, 1.5 ].map((z, i) => (
        <mesh key={`cap-${i}`} position={[1.1, 0.45, z]}>
          <cylinderGeometry args={[0.22, 0.22, 0.9, 16]} />
          <meshStandardMaterial
            color="#d1d5db"
            metalness={0.95}
            roughness={0.1}
          />
        </mesh>
      ))}

      <Text
        position={[0.2, 1.1, 0]}
        fontSize={0.25}
        color={isPowered ? '#00ffff' : '#777777'}
      >
        VRM (12V -&gt; ~1.2V VCore)
      </Text>
    </group>
  );
}

// Crystal Oscillator (Quartz Clock Generator)
function CrystalOscillator({ isPowered }) {
  const oscRef = useRef();

  useFrame(({ clock }) => {
    if (oscRef.current && isPowered) {
      // Efek getaran piezoelektrik mikro
      oscRef.current.position.y = 0.2 + Math.sin(clock.getElapsedTime() * 40) * 0.015;
    }
  });

  return (
    <group position={[2.5, 0, 5]} ref={oscRef}>
      {/* Silinder lonjong kristal logam perak */}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.25, 0.25, 0.8, 16]} rotation={[0, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color="#e0e0e0"
          metalness={0.95}
          roughness={0.1}
        />
      </mesh>
      {/* Pijar Sinyal Clock jika hidup */}
      {isPowered && (
        <pointLight color="#00ffcc" intensity={2} distance={2.5} position={[0, 0.5, 0]} />
      )}
      <Text
        position={[0, 0.7, 0]}
        fontSize={0.24}
        color={isPowered ? '#00ffcc' : '#888888'}
      >
        100MHz BCLK (Quartz)
      </Text>
    </group>
  );
}

// Soket LGA CPU dengan ILM Lever dan Heatspreader
function CpuSocketModule({ isPowered }) {
  return (
    <group position={[0, 0, -1]}>
      {/* Base Frame Soket LGA (Plastik abu-abu gelap) */}
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[5.2, 0.3, 5.2]} />
        <meshStandardMaterial color="#1a1c23" roughness={0.6} />
      </mesh>

      {/* Grid Pin LGA (Ribuan pin kontak emas berkilau) */}
      <mesh position={[0, 0.31, 0]}>
        <boxGeometry args={[4.2, 0.05, 4.2]} />
        <meshStandardMaterial
          color="#ffb703"
          metalness={0.9}
          roughness={0.2}
          emissive={isPowered ? '#fb8500' : '#000000'}
          emissiveIntensity={isPowered ? 0.6 : 0}
        />
      </mesh>

      {/* CPU IHS (Integrated Heat Spreader) Terbuka / Transparan agar karakter bisa masuk */}
      <mesh position={[0, 0.6, 0]}>
        <boxGeometry args={[3.8, 0.2, 3.8]} />
        <meshStandardMaterial
          color="#c0c0c0"
          metalness={0.9}
          roughness={0.2}
          transparent
          opacity={isPowered ? 0.35 : 0.85}
          wireframe={isPowered}
        />
      </mesh>

      {/* Gerbang Masuk Menuju Inti Silikon (Silicon Die Warp Gate) */}
      {isPowered && (
        <group position={[0, 0.8, 0]}>
          <pointLight color="#00e5ff" intensity={4} distance={6} />
          <Float speed={3} rotationIntensity={0.5} floatIntensity={0.5}>
            <Text
              position={[0, 1.2, 0]}
              fontSize={0.35}
              color="#00ffff"
              anchorX="center"
              anchorY="middle"
            >
              [ GERBANG SILICON DIE CPU ]
            </Text>
          </Float>
        </group>
      )}
    </group>
  );
}

// Hologram Penanda Titik Edukasi AOK
function CheckpointBeacon({ checkpoint, isActive, isPowered, onSelect }) {
  const ringRef = useRef();

  useFrame(({ clock }) => {
    if (ringRef.current) {
      ringRef.current.rotation.y = clock.getElapsedTime() * 1.5;
    }
  });

  const [x, y, z] = checkpoint.position;

  return (
    <group position={[x, y, z]} onClick={onSelect}>
      {/* Cincin Hologram Berputar */}
      <mesh ref={ringRef} position={[0, 0.6, 0]}>
        <torusGeometry args={[0.55, 0.04, 8, 24]} />
        <meshBasicMaterial
          color={isActive ? '#ff007f' : isPowered ? '#00e5ff' : '#555555'}
          wireframe
        />
      </mesh>

      {/* Kolom Cahaya Vertikal */}
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 1.2, 8]} />
        <meshBasicMaterial
          color={isActive ? '#ff007f' : '#00e5ff'}
          transparent
          opacity={isPowered ? 0.8 : 0.2}
        />
      </mesh>

      {/* Label Komponen AOK */}
      <Text
        position={[0, 2.0, 0]}
        fontSize={0.26}
        color={isActive ? '#ff70a6' : isPowered ? '#ffffff' : '#888888'}
        anchorX="center"
        anchorY="bottom"
      >
        {checkpoint.name}
      </Text>
    </group>
  );
}
