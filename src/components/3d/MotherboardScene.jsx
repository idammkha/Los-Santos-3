import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { MOTHERBOARD_CHECKPOINTS } from '../../data/aokData';

const PCB_SIGNAL_TRACES = [
  [-5.2, 10.5, 4.8, 0],
  [-3.2, 8.8, 3.2, -0.6],
  [-2.1, 6.5, 3.2, -0.7],
  [-0.8, 3.6, 3.4, -0.3],
  [0, 1.1, 3.4, 0],
  [2.5, 5.1, 2.8, 0.65],
  [4.5, 2.8, 3.4, -0.5],
  [6.1, 7.2, 2.4, 0],
  [-6.1, 1.8, 3.1, 1.1],
  [6.4, -1.1, 3.8, 0],
  [-4.2, -3.1, 3.1, 0.75],
  [3.8, -8.1, 3.5, 0],
];

// Motherboard 3D Realistis: Papan Sirkuit Tingkat Tinggi (High-End ATX Motherboard)
// Lengkap dengan jalur tembaga berlapis, VRM 16-fase berheatsink aluminium bersirip,
// soket LGA 1700 dengan tuas ILM, kristal kuarsa, kabel ATX 24-pin berselubung, dan slot RAM/PCIe.
export default function MotherboardScene({ isPowered, activeCheckpoint, onSelectCheckpoint }) {
  return (
    <group position={[0, 0, 0]}>
      {/* 1. PCB Utama (Dark Matte Black Multi-Layer PCB dengan tekstur sirkuit) */}
      <MotherboardPcbBase isPowered={isPowered} />

      {/* 2. Jalur Bus Tembaga (Copper Power Traces & Signal Arcs) */}
      <MainPowerTraces isPowered={isPowered} />

      {/* 3. Komponen Nyata 1: Front Panel Header (JFP1 Pin Jumper PWR_SW) */}
      <RealisticFrontPanelHeader isPowered={isPowered} />

      {/* 4. Komponen Nyata 2: 24-Pin ATX Main Power Cable Bundle */}
      <RealisticAtxConnector />

      {/* 5. Komponen Nyata 3: VRM 16-Phase Power Delivery (Dual Fin-Heatsink & Heatpipe) */}
      <RealisticVrmSection isPowered={isPowered} />

      {/* 6. Komponen Nyata 4: Quartz Crystal Oscillator (BCLK 100MHz Can) */}
      <RealisticCrystalOscillator isPowered={isPowered} />

      {/* 7. Komponen Nyata 5: LGA 1700 CPU Socket & Core i9 IHS Package */}
      <RealisticCpuSocket isPowered={isPowered} />

      {/* 8. Komponen Pendukung Realistis Motherboard (RAM DIMM, PCIe 5.0, M.2 Heatsink, Rear I/O) */}
      <SurroundingMotherboardHardware />
      <MotherboardSilkscreenAndSmallParts isPowered={isPowered} />

      {/* 9. Beacon Penanda Checkpoint Interaktif AOK */}
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

// 1. Papan PCB Utama Realistis
function MotherboardPcbBase({ isPowered }) {
  return (
    <group position={[0, -0.25, 7.5]}>
      {/* FR-4 substrate with copper foil exposed only as a thin board-edge layer */}
      <RoundedBox args={[18, 0.42, 26]} radius={0.14} smoothness={4} receiveShadow castShadow>
        <meshPhysicalMaterial
          color="#14231d"
          roughness={0.68}
          metalness={0.12}
          clearcoat={0.18}
          clearcoatRoughness={0.56}
        />
      </RoundedBox>

      <mesh position={[0, -0.215, 0]}>
        <boxGeometry args={[18.04, 0.025, 26.04]} />
        <meshStandardMaterial
          color="#a66d3b"
          roughness={0.56}
          metalness={0.62}
        />
      </mesh>

      <group position={[0, 0.22, 0]}>
        {PCB_SIGNAL_TRACES.map(([x, z, length, angle], index) => (
          <mesh key={`pcb-signal-${index}`} position={[x, 0, z]} rotation={[0, angle, 0]}>
            <boxGeometry args={[length, 0.008, 0.026]} />
            <meshBasicMaterial
              color={isPowered ? '#55745d' : '#31473b'}
              transparent
              opacity={isPowered ? 0.88 : 0.58}
            />
          </mesh>
        ))}
      </group>

      {/* Lubang Baut Pemasangan Motherboard (Stand-off Holes berlapis emas) */}
      {[
        [-8.2, 0.22, -12],
        [8.2, 0.22, -12],
        [-8.2, 0.22, 0],
        [8.2, 0.22, 0],
        [-8.2, 0.22, 12],
        [8.2, 0.22, 12],
      ].map(([x, y, z], i) => (
        <group key={`mount-hole-${i}`} position={[x, y, z]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.3, 0.55, 20]} />
            <meshStandardMaterial color="#d97706" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[0, -0.1, 0]}>
            <cylinderGeometry args={[0.25, 0.25, 0.3, 16]} />
            <meshStandardMaterial color="#111827" roughness={0.8} />
          </mesh>
        </group>
      ))}

      {/* Teks Silkscreen Motherboard Asli */}
      <Text
        position={[-3.5, 0.23, 11]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.42}
        color="#38bdf8"
        fontStyle="bold"
      >
        AOK Z790-APEX MOTHERBOARD
      </Text>
      <Text
        position={[-3.5, 0.23, 11.6]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.2}
        color="#94a3b8"
      >
        PCIe Gen 5.0 | DDR5 XMP 3.0 | LGA1700 SOCKET
      </Text>
    </group>
  );
}

// 2. Jalur Bus Tembaga (Copper Traces) dengan Animasi Aliran Elektron
function MainPowerTraces({ isPowered }) {
  const linePoints = useMemo(
    () => [
      new THREE.Vector3(0, 0.05, 18),     // 1. Front Panel Switch
      new THREE.Vector3(-1.5, 0.05, 14.5), // 2. 24-Pin ATX Main Power
      new THREE.Vector3(-1.8, 0.05, 11),   // 3. VRM VCore Regulator
      new THREE.Vector3(0, 0.05, 8),
      new THREE.Vector3(2.2, 0.05, 5),     // 4. Quartz Crystal Oscillator
      new THREE.Vector3(0, 0.05, 2),
      new THREE.Vector3(0, 0.05, -1),      // 5. CPU Socket LGA 1700
    ],
    []
  );

  const curve = useMemo(() => new THREE.CatmullRomCurve3(linePoints), [linePoints]);
  const tubeGeo = useMemo(() => new THREE.TubeGeometry(curve, 96, 0.16, 8, false), [curve]);
  const sparkRef = useRef();

  useFrame(({ clock }) => {
    if (sparkRef.current && isPowered) {
      const t = (clock.getElapsedTime() * 0.4) % 1;
      const pt = curve.getPointAt(t);
      sparkRef.current.position.copy(pt);
      sparkRef.current.position.y += 0.2;
    }
  });

  return (
    <group>
      {/* Pipa Jalur Tembaga Utama Berkabut Listrik */}
      <mesh geometry={tubeGeo} position={[0, 0.02, 0]}>
        <meshStandardMaterial
          color={isPowered ? '#3b746b' : '#263e37'}
          emissive={isPowered ? '#28695f' : '#07110e'}
          emissiveIntensity={isPowered ? 0.72 : 0.04}
          metalness={0.9}
          roughness={0.15}
        />
      </mesh>

      {/* Jalur Paralel Tambahan (Data Bus 64-bit & Ground Lines) */}
      {[-0.6, 0.6, -1.2, 1.2, -2.4, 2.4].map((offset, i) => (
        <mesh key={`power-trace-${i}`} position={[offset, 0.02, 8]}>
          <boxGeometry args={[0.026, 0.009, 22]} />
          <meshStandardMaterial
            color={isPowered ? '#9a7547' : '#493a2b'}
            emissive={isPowered ? '#9a5c2e' : '#000000'}
            emissiveIntensity={isPowered ? 0.24 : 0.01}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      ))}

      {/* Percikan Listrik Bergerak (Moving Electric Arc) */}
      {isPowered && (
        <group ref={sparkRef}>
          <pointLight color="#00ffff" intensity={4} distance={3.5} />
          <mesh>
            <sphereGeometry args={[0.2, 12, 12]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </group>
      )}
    </group>
  );
}

// 3. Front Panel Header Realistis (JFP1 9-pin Block & Jumper Cable)
function RealisticFrontPanelHeader({ isPowered }) {
  return (
    <group position={[0, 0, 18]}>
      {/* Blok Plastik Hitam Konektor JFP1 */}
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[2.2, 0.4, 1.1]} />
        <meshStandardMaterial color="#171923" roughness={0.7} />
      </mesh>

      {/* 9 Pin Header Jumper Berlapis Emas */}
      {[-0.8, -0.4, 0, 0.4, 0.8].map((x, col) =>
        [-0.25, 0.25].map((z, row) => {
          if (row === 1 && col === 4) return null;
          const isPwrPin = row === 0 && (col === 2 || col === 3);

          return (
            <mesh key={`${col}-${row}`} position={[x, 0.55, z]}>
              <cylinderGeometry args={[0.04, 0.04, 0.6, 12]} />
              <meshStandardMaterial
                color={isPwrPin ? '#fbbf24' : '#e2e8f0'}
                metalness={0.95}
                roughness={0.15}
                emissive={isPwrPin && isPowered ? '#f59e0b' : '#000000'}
                emissiveIntensity={isPowered ? 1.2 : 0}
              />
            </mesh>
          );
        })
      )}

      {/* Kabel Switch Casing (Black/Red Twisted Wire melingkar keluar) */}
      <group position={[0.2, 0.7, -0.25]}>
        <mesh position={[0, 0.15, 0]}>
          <boxGeometry args={[0.55, 0.35, 0.35]} />
          <meshStandardMaterial color="#dc2626" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.35, 0.3]}>
          <cylinderGeometry args={[0.08, 0.08, 0.7, 8]} rotation={[0.4, 0, 0]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
      </group>

      <Text
        position={[0, 0.02, 0.8]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.24}
        color={isPowered ? '#38bdf8' : '#64748b'}
        fontStyle="bold"
      >
        JFP1: PWR_SW / RST_SW
      </Text>
    </group>
  );
}

// 4. Soket ATX 24-Pin Realistis dengan Bundel Kabel Berwarna
function RealisticAtxConnector() {
  const wireColors = [
    '#facc15', '#facc15', '#ef4444', '#ef4444', '#f97316', '#f97316',
    '#0f172a', '#0f172a', '#22c55e', '#64748b', '#a855f7', '#0f172a'
  ];

  return (
    <group position={[-6.8, 0, 11]}>
      <mesh position={[0, 0.7, 0]} castShadow>
        <boxGeometry args={[1.6, 1.4, 6.2]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.35} metalness={0.1} />
      </mesh>

      <mesh position={[-0.88, 0.7, 0]}>
        <boxGeometry args={[0.18, 0.8, 1.8]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.4} />
      </mesh>

      {[-0.4, 0.4].map((x, r) =>
        Array.from({ length: 12 }).map((_, c) => (
          <group key={`${r}-${c}`} position={[x, 1.41, -2.75 + c * 0.5]}>
            <mesh>
              <boxGeometry args={[0.26, 0.04, 0.26]} />
              <meshStandardMaterial color="#eab308" metalness={0.9} roughness={0.2} />
            </mesh>
            <mesh position={[x * 0.4, 0.5, 0]}>
              <cylinderGeometry args={[0.09, 0.09, 0.9, 8]} />
              <meshStandardMaterial
                color={wireColors[c] || '#0f172a'}
                roughness={0.6}
              />
            </mesh>
          </group>
        ))
      )}

      <Text
        position={[0, 1.5, 0]}
        rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
        fontSize={0.28}
        color="#0f172a"
        fontStyle="bold"
      >
        EATXPWR 24-PIN (12V/5V/3.3V)
      </Text>
    </group>
  );
}

// 5. Bagian VRM Realistis (16-Phase Power Delivery dengan Heatsink Aluminium Bersirip & Heatpipe)
function RealisticVrmSection({ isPowered }) {
  return (
    <group position={[-2.8, 0, 11]}>
      <group position={[-1.1, 0, 0]}>
        <mesh position={[0, 0.4, 0]} castShadow>
          <boxGeometry args={[1.5, 0.8, 5.8]} />
          <meshStandardMaterial
            color="#1e242c"
            metalness={0.88}
            roughness={0.25}
          />
        </mesh>
        {Array.from({ length: 14 }).map((_, i) => (
          <mesh key={`vrm-fin-${i}`} position={[0, 1.1, -2.6 + i * 0.4]}>
            <boxGeometry args={[1.4, 0.7, 0.08]} />
            <meshStandardMaterial
              color="#333b47"
              metalness={0.92}
              roughness={0.2}
            />
          </mesh>
        ))}
        <mesh position={[0.4, 0.9, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 5.2, 16]} />
          <meshStandardMaterial
            color="#b45309"
            metalness={0.95}
            roughness={0.15}
          />
        </mesh>
      </group>

      {Array.from({ length: 8 }).map((_, i) => (
        <group key={`choke-${i}`} position={[0.2, 0.38, -2.2 + i * 0.62]}>
          <mesh castShadow>
            <boxGeometry args={[0.72, 0.72, 0.54]} />
            <meshStandardMaterial
              color="#0f172a"
              metalness={0.85}
              roughness={0.3}
            />
          </mesh>
          <mesh position={[0, 0.37, 0]}>
            <boxGeometry args={[0.65, 0.02, 0.45]} />
            <meshStandardMaterial color="#1e293b" metalness={0.9} />
          </mesh>
          <Text
            position={[0, 0.38, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            fontSize={0.18}
            color={isPowered ? '#38bdf8' : '#64748b'}
            fontStyle="bold"
          >
            R15
          </Text>
        </group>
      ))}

      {Array.from({ length: 8 }).map((_, i) => (
        <group key={`cap-${i}`} position={[1.15, 0.45, -2.2 + i * 0.62]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.22, 0.22, 0.9, 20]} />
            <meshStandardMaterial
              color="#111827"
              metalness={0.92}
              roughness={0.15}
            />
          </mesh>
          <mesh position={[0, 0.46, 0]}>
            <cylinderGeometry args={[0.21, 0.21, 0.03, 16]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.95} roughness={0.1} />
          </mesh>
          <mesh position={[0.18, 0, 0]}>
            <boxGeometry args={[0.04, 0.8, 0.1]} />
            <meshStandardMaterial color="#eab308" metalness={0.9} />
          </mesh>
        </group>
      ))}

      <Text
        position={[0.3, 1.25, 0]}
        fontSize={0.3}
        color={isPowered ? '#38bdf8' : '#64748b'}
        fontStyle="bold"
      >
        VRM (Buck Converter: 12V -&gt; ~1.2V VCore)
      </Text>
    </group>
  );
}

// 6. Crystal Oscillator Realistis (HC-49 / SMD Metal Can dengan Getaran Piezo)
function RealisticCrystalOscillator({ isPowered }) {
  const crystalRef = useRef();

  useFrame(({ clock }) => {
    if (crystalRef.current && isPowered) {
      crystalRef.current.position.y = 0.25 + Math.sin(clock.getElapsedTime() * 45) * 0.02;
    }
  });

  return (
    <group position={[2.6, 0, 5]} ref={crystalRef}>
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[1.3, 0.04, 0.7]} />
        <meshStandardMaterial color="#ca8a04" metalness={0.9} roughness={0.2} />
      </mesh>

      <mesh position={[0, 0.35, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.26, 0.26, 1.05, 24]} />
        <meshStandardMaterial
          color="#e2e8f0"
          metalness={0.96}
          roughness={0.12}
        />
      </mesh>

      <Text
        position={[0, 0.63, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.16}
        color="#0f172a"
        fontStyle="bold"
      >
        100.000 TXC
      </Text>

      {isPowered && (
        <group position={[0, 0.7, 0]}>
          <pointLight color="#22c55e" intensity={2.5} distance={3} />
          <Float speed={4} floatIntensity={0.3}>
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.5, 0.6, 24]} />
              <meshBasicMaterial color="#4ade80" transparent opacity={0.6} wireframe />
            </mesh>
          </Float>
        </group>
      )}

      <Text
        position={[0, 0.95, 0]}
        fontSize={0.25}
        color={isPowered ? '#4ade80' : '#64748b'}
        fontStyle="bold"
      >
        100MHz Quartz Crystal BCLK
      </Text>
    </group>
  );
}

// 7. Soket LGA 1700 Realistis dengan Tuas Stainless Steel & Core i9 IHS
function RealisticCpuSocket({ isPowered }) {
  return (
    <group position={[0, 0, -1]}>
      <mesh position={[0, 0.2, 0]} castShadow>
        <boxGeometry args={[6.2, 0.4, 6.2]} />
        <meshStandardMaterial color="#18181b" roughness={0.7} />
      </mesh>

      <mesh position={[0, 0.42, 0]}>
        <boxGeometry args={[4.8, 0.05, 4.8]} />
        <meshStandardMaterial
          color="#eab308"
          metalness={0.95}
          roughness={0.2}
          emissive={isPowered ? '#d97706' : '#000000'}
          emissiveIntensity={isPowered ? 0.7 : 0}
        />
      </mesh>

      <mesh position={[0, 0.46, 0]}>
        <boxGeometry args={[5.6, 0.1, 5.6]} />
        <meshStandardMaterial
          color="#94a3b8"
          metalness={0.92}
          roughness={0.18}
          wireframe={isPowered}
        />
      </mesh>

      <group position={[2.9, 0.5, 0]}>
        <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 5.4, 12]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.1} />
        </mesh>
        <mesh position={[0, 0.12, 2.7]}>
          <boxGeometry args={[0.2, 0.25, 0.35]} />
          <meshStandardMaterial color="#0284c7" />
        </mesh>
      </group>

      <group position={[0, 0.65, 0]}>
        <mesh castShadow>
          <boxGeometry args={[4.2, 0.25, 4.2]} />
          <meshStandardMaterial
            color="#cbd5e1"
            metalness={0.96}
            roughness={0.15}
            transparent
            opacity={isPowered ? 0.4 : 0.95}
          />
        </mesh>

        <Text
          position={[0, 0.14, -0.8]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.28}
          color="#0f172a"
          fontStyle="bold"
        >
          INTEL® CORE™ i9
        </Text>
        <Text
          position={[0, 0.14, -0.3]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.22}
          color="#334155"
        >
          AOK-14900K 3.60GHz
        </Text>
        <Text
          position={[0, 0.14, 0.4]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.16}
          color="#64748b"
        >
          LGA1700 | 24 CORES 32 THREADS
        </Text>
      </group>

      {isPowered && (
        <group position={[0, 1.2, 0]}>
          <pointLight color="#38bdf8" intensity={5} distance={8} />
          <Float speed={3} rotationIntensity={0.3} floatIntensity={0.4}>
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[1.5, 1.7, 32]} />
              <meshBasicMaterial color="#00e5ff" wireframe />
            </mesh>
            <Text
              position={[0, 0.4, 0]}
              fontSize={0.38}
              color="#38bdf8"
              fontStyle="bold"
              anchorX="center"
              anchorY="middle"
            >
              [ GERBANG MASUK SILICON DIE ]
            </Text>
          </Float>
        </group>
      )}
    </group>
  );
}

// 8. Komponen Tambahan Motherboard Nyata (RAM Slots, PCIe 5.0, M.2 Heatsink, Rear IO)
function SurroundingMotherboardHardware() {
  return (
    <group>
      <group position={[5.2, 0, -1]}>
        {[-0.9, -0.3, 0.3, 0.9].map((x, i) => (
          <group key={`ram-${i}`} position={[x, 0.4, 0]}>
            <mesh position={[0, 0, 0]} castShadow>
              <boxGeometry args={[0.35, 0.7, 6.2]} />
              <meshStandardMaterial color="#1e242c" roughness={0.7} />
            </mesh>
            <mesh position={[0, 0.36, 0]}>
              <boxGeometry args={[0.1, 0.05, 5.8]} />
              <meshStandardMaterial color="#eab308" metalness={0.9} />
            </mesh>
            {[-3.0, 3.0].map((z, k) => (
              <mesh key={k} position={[0, 0.4, z]}>
                <boxGeometry args={[0.3, 0.35, 0.25]} />
                <meshStandardMaterial color="#f1f5f9" />
              </mesh>
            ))}
          </group>
        ))}
        <Text
          position={[0, 0.9, 3.4]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.2}
          color="#94a3b8"
        >
          DDR5 DUAL-CHANNEL
        </Text>
      </group>

      <group position={[0, 0, 3.5]}>
        <mesh position={[-1.5, 0.35, 0]} castShadow>
          <boxGeometry args={[7.2, 0.6, 0.6]} />
          <meshStandardMaterial
            color="#94a3b8"
            metalness={0.95}
            roughness={0.15}
          />
        </mesh>
        <Text
          position={[-1.5, 0.75, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.2}
          color="#38bdf8"
          fontStyle="bold"
        >
          PCIe 5.0 x16 STEEL ARMOR
        </Text>
      </group>

      <group position={[0, 0, 6.5]}>
        <mesh position={[-1.5, 0.3, 0]} castShadow>
          <boxGeometry args={[5.5, 0.35, 1.4]} />
          <meshStandardMaterial
            color="#181e24"
            metalness={0.85}
            roughness={0.25}
          />
        </mesh>
        <Text
          position={[-1.5, 0.5, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.22}
          color="#64748b"
        >
          M.2 PCIe 4.0 NVMe HEATSINK
        </Text>
      </group>

      <group position={[-8.2, 0, -2]}>
        <mesh position={[0, 1.2, 0]} castShadow>
          <boxGeometry args={[1.2, 2.2, 9]} />
          <meshStandardMaterial
            color="#0f172a"
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>
        <Text
          position={[0.62, 1.4, 0]}
          rotation={[0, Math.PI / 2, 0]}
          fontSize={0.26}
          color="#38bdf8"
          fontStyle="bold"
        >
          REAR I/O SHIELD (USB-C / 10G LAN / AUDIO)
        </Text>
      </group>
    </group>
  );
}

function MotherboardSilkscreenAndSmallParts({ isPowered }) {
  const capacitorRows = [
    [-7.2, 7.2, 5],
    [7.2, 6.3, 4],
    [3.6, 11.8, 5],
    [-5.4, -1.5, 4],
  ];

  return (
    <group>
      {capacitorRows.flatMap(([x, z, count], row) =>
        Array.from({ length: count }).map((_, index) => (
          <mesh key={`small-cap-${row}-${index}`} position={[x + index * 0.42, 0.34, z]} castShadow>
            <cylinderGeometry args={[0.12, 0.12, 0.42, 16]} />
            <meshStandardMaterial color="#111827" metalness={0.82} roughness={0.2} />
          </mesh>
        ))
      )}

      {[-5.8, -3.7, -1.6, 0.5, 2.6, 4.7].map((x, index) => (
        <group key={`sata-${index}`} position={[x, 0.35, 16.2]}>
          <mesh castShadow>
            <boxGeometry args={[1.1, 0.45, 0.55]} />
            <meshStandardMaterial color="#0f172a" roughness={0.62} />
          </mesh>
          <mesh position={[0, 0.25, 0.28]}>
            <boxGeometry args={[0.82, 0.05, 0.08]} />
            <meshStandardMaterial color="#eab308" metalness={0.85} roughness={0.22} />
          </mesh>
        </group>
      ))}

      {[-7.8, 7.8].map((x) => (
        <group key={`edge-ruler-${x}`} position={[x, 0.28, 6.5]}>
          {Array.from({ length: 18 }).map((_, index) => (
            <mesh key={index} position={[0, 0, -10 + index * 1.15]}>
              <boxGeometry args={[0.08, 0.01, index % 5 === 0 ? 0.46 : 0.24]} />
              <meshBasicMaterial color={isPowered ? '#38bdf8' : '#475569'} transparent opacity={0.6} />
            </mesh>
          ))}
        </group>
      ))}

      <Text position={[5.9, 0.28, 13.6]} rotation={[-Math.PI / 2, 0, -Math.PI / 2]} fontSize={0.24} color="#94a3b8">
        SATA 6Gb/s PORTS
      </Text>
      <Text position={[7.2, 0.28, 8.8]} rotation={[-Math.PI / 2, 0, -Math.PI / 2]} fontSize={0.22} color="#64748b">
        BOARD EDGE / FRONT USB / FAN HEADERS
      </Text>
    </group>
  );
}

// 9. Checkpoint Beacon Interaktif AOK
function CheckpointBeacon({ checkpoint, isActive, isPowered, onSelect }) {
  const ringRef = useRef();

  useFrame(({ clock }) => {
    if (ringRef.current) {
      ringRef.current.rotation.y = clock.getElapsedTime() * 1.8;
    }
  });

  const [x, y, z] = checkpoint.position;

  return (
    <group position={[x, y, z]} onClick={onSelect}>
      <mesh ref={ringRef} position={[0, 0.7, 0]}>
        <torusGeometry args={[0.6, 0.05, 8, 28]} />
        <meshBasicMaterial
          color={isActive ? '#f43f5e' : isPowered ? '#38bdf8' : '#64748b'}
          wireframe
        />
      </mesh>

      <mesh position={[0, 1.4, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 1.4, 8]} />
        <meshBasicMaterial
          color={isActive ? '#f43f5e' : '#38bdf8'}
          transparent
          opacity={0.8}
        />
      </mesh>

      {isActive && (
        <pointLight color="#f43f5e" intensity={4} distance={3} position={[0, 1.2, 0]} />
      )}
    </group>
  );
}

