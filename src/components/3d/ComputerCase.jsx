import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

// -------------------------------------------------------------
// Sub-Komponen: Kipas Pendingin PC dengan Bilah dan Ring ARGB
// -------------------------------------------------------------
function PcCaseFan({ position, rotation = [0, 0, 0], scale = 1, isSpinning, isSurging, rgbColor = '#22d3ee' }) {
  const bladesRef = useRef();

  useFrame((_, delta) => {
    if (bladesRef.current) {
      const speed = isSurging ? 16 : isSpinning ? 5 : 0.8;
      bladesRef.current.rotation.z += delta * speed;
    }
  });

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Housing Frame Kipas Persegi dengan Lubang Baut */}
      <mesh>
        <boxGeometry args={[1.15, 1.15, 0.18]} />
        <meshStandardMaterial color="#0b0f14" roughness={0.7} metalness={0.4} />
      </mesh>
      {/* Lubang Intake Silinder Tengah */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.54, 0.54, 0.2, 32]} />
        <meshStandardMaterial color="#05080c" roughness={0.8} />
      </mesh>
      {/* Ring Lampu ARGB Outer Diffuser */}
      <mesh position={[0, 0, 0.08]}>
        <torusGeometry args={[0.5, 0.045, 16, 40]} />
        <meshStandardMaterial
          color={rgbColor}
          emissive={rgbColor}
          emissiveIntensity={isSurging ? 2.8 : 1.2}
          roughness={0.2}
        />
      </mesh>
      {/* Pusat Motor Rotor & Bilah Kipas Berputar */}
      <group ref={bladesRef} position={[0, 0, 0.02]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.14, 24]} />
          <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.25} />
        </mesh>
        {/* Logo Stiker Hologram Tengah */}
        <mesh position={[0, 0, 0.075]}>
          <circleGeometry args={[0.13, 24]} />
          <meshStandardMaterial
            color={rgbColor}
            emissive={rgbColor}
            emissiveIntensity={isSurging ? 1.5 : 0.4}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
        {/* 7 Bilah Aerodinamis Transparan / Frosted */}
        {[0, 1, 2, 3, 4, 5, 6].map((i) => {
          const angle = (i * Math.PI * 2) / 7;
          return (
            <mesh key={`blade-${i}`} rotation={[0, 0, angle]} position={[0, 0, 0]}>
              <boxGeometry args={[0.11, 0.38, 0.04]} />
              <meshStandardMaterial
                color="#e2e8f0"
                transparent
                opacity={0.68}
                roughness={0.3}
                metalness={0.1}
              />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}

// -------------------------------------------------------------
// Sub-Komponen: Kaki Casing (Machined Aluminum Hi-Fi Feet)
// -------------------------------------------------------------
function CaseFeet() {
  const positions = [
    [-1.25, 0.08, -2.35],
    [1.25, 0.08, -2.35],
    [-1.25, 0.08, 2.35],
    [1.25, 0.08, 2.35],
  ];

  return (
    <group>
      {positions.map(([x, y, z], i) => (
        <group key={`foot-${i}`} position={[x, y, z]}>
          {/* Cincin Karet Anti-Getaran Bawah */}
          <mesh position={[0, -0.05, 0]} castShadow>
            <cylinderGeometry args={[0.24, 0.26, 0.08, 24]} />
            <meshStandardMaterial color="#090d12" roughness={0.9} />
          </mesh>
          {/* Bodi Aluminium CNC Machined */}
          <mesh position={[0, 0.03, 0]} castShadow>
            <cylinderGeometry args={[0.22, 0.25, 0.1, 24]} />
            <meshStandardMaterial color="#475569" metalness={0.88} roughness={0.2} />
          </mesh>
          {/* Aksen Bevel Cincin Perak */}
          <mesh position={[0, 0.08, 0]}>
            <torusGeometry args={[0.22, 0.015, 8, 24]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.1} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// -------------------------------------------------------------
// Sub-Komponen: Basement / PSU Shroud & Storage
// -------------------------------------------------------------
function PsuShroud({ isSurging }) {
  return (
    <group position={[0, 0.72, 0]}>
      {/* Box Utama Shroud Bawah */}
      <mesh position={[0, 0, 0]} receiveShadow castShadow>
        <boxGeometry args={[2.7, 1.15, 5.25]} />
        <meshStandardMaterial color="#131922" metalness={0.7} roughness={0.38} />
      </mesh>

      {/* Garis Aksen Cahaya ARGB Samping Shroud */}
      <mesh position={[-1.36, 0.52, 0]}>
        <boxGeometry args={[0.02, 0.035, 5.2]} />
        <meshStandardMaterial
          color={isSurging ? '#34d399' : '#06b6d4'}
          emissive={isSurging ? '#10b981' : '#0891b2'}
          emissiveIntensity={isSurging ? 3.0 : 1.2}
        />
      </mesh>

      {/* Kisi Ventilasi Mesh di Permukaan Atas Shroud */}
      <mesh position={[0, 0.58, 0.2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.4, 3.8]} />
        <meshStandardMaterial color="#0a0f16" wireframe metalness={0.4} roughness={0.6} />
      </mesh>

      {/* Lubang Grommet Karet untuk Jalur Kabel Motherboard */}
      <mesh position={[0.95, 0.585, -0.2]}>
        <boxGeometry args={[0.25, 0.02, 1.4]} />
        <meshStandardMaterial color="#05070a" roughness={0.95} />
      </mesh>

      {/* Jendela Cutout Sisi Kiri Shroud memperlihatkan PSU 850W Gold */}
      <group position={[-1.36, 0, 1.15]}>
        {/* Unit Casing PSU */}
        <mesh castShadow>
          <boxGeometry args={[0.04, 0.75, 1.85]} />
          <meshStandardMaterial color="#1a2332" metalness={0.85} roughness={0.25} />
        </mesh>
        {/* Pelat Label Metalik PSU */}
        <mesh position={[-0.025, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[1.65, 0.55]} />
          <meshStandardMaterial color="#0f172a" metalness={0.6} roughness={0.4} />
        </mesh>
        <Text
          position={[-0.03, 0.1, 0]}
          rotation={[0, -Math.PI / 2, 0]}
          fontSize={0.16}
          color="#f59e0b"
          fontStyle="bold"
          anchorX="center"
        >
          850W GOLD
        </Text>
        <Text
          position={[-0.03, -0.1, 0]}
          rotation={[0, -Math.PI / 2, 0]}
          fontSize={0.09}
          color="#94a3b8"
          anchorX="center"
        >
          FULLY MODULAR ATX 3.0
        </Text>
      </group>

      {/* Bundel Kabel Modular Berselubung (Sleeved Cables) dengan Sisir (Cable Combs) */}
      <group position={[0.2, 0.8, 1.1]}>
        {[-0.24, -0.12, 0, 0.12, 0.24].map((offset, idx) => (
          <mesh key={`psu-cbl-${idx}`} position={[offset, 0, -idx * 0.06]} rotation={[0.3, 0, 0.1]}>
            <cylinderGeometry args={[0.028, 0.028, 1.1, 8]} />
            <meshStandardMaterial
              color={idx % 2 === 0 ? '#1e293b' : '#38bdf8'}
              roughness={0.65}
              metalness={0.2}
            />
          </mesh>
        ))}
        {/* Sisir Kabel Akrilik Hitam (Cable Comb) */}
        <mesh position={[0, 0.22, -0.1]}>
          <boxGeometry args={[0.62, 0.035, 0.08]} />
          <meshStandardMaterial color="#020617" roughness={0.4} metalness={0.7} />
        </mesh>
      </group>

      {/* 2x Unit 2.5" SSD Terpasang Rapi di Atas Shroud */}
      {[-0.6, 0.6].map((zPos, sIdx) => (
        <group key={`ssd-${sIdx}`} position={[-0.5, 0.61, zPos]}>
          <RoundedBox args={[0.7, 0.06, 1.05]} radius={0.015} smoothness={2} castShadow>
            <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.3} />
          </RoundedBox>
          <mesh position={[0, 0.032, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.55, 0.85]} />
            <meshStandardMaterial color="#0f172a" metalness={0.5} roughness={0.5} />
          </mesh>
          <Text position={[0, 0.035, 0]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.08} color="#38bdf8" fontStyle="bold">
            FAST SSD 1TB
          </Text>
          {/* Kabel Data SATA Tipis Merah */}
          <mesh position={[0.25, -0.01, 0.55]} rotation={[0, 0.2, 0]}>
            <boxGeometry args={[0.08, 0.02, 0.18]} />
            <meshStandardMaterial color="#ef4444" roughness={0.5} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// -------------------------------------------------------------
// Sub-Komponen: Hardware Internal Casing (GPU, AIO Cooler, RAM)
// -------------------------------------------------------------
function InternalHardware({ isPowered, isSurging, explodeOffset = 0, fanColor = '#06b6d4' }) {
  const gpuFan1Ref = useRef();
  const gpuFan2Ref = useRef();
  const gpuFan3Ref = useRef();
  const aioPumpPulseRef = useRef();

  useFrame((_, delta) => {
    const fanSpeed = isSurging ? 22 : isPowered ? 12 : 2.5;
    if (gpuFan1Ref.current) gpuFan1Ref.current.rotation.z += delta * fanSpeed;
    if (gpuFan2Ref.current) gpuFan2Ref.current.rotation.z += delta * fanSpeed;
    if (gpuFan3Ref.current) gpuFan3Ref.current.rotation.z += delta * fanSpeed;
    if (aioPumpPulseRef.current) aioPumpPulseRef.current.rotation.z += delta * 1.5;
  });

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Motherboard Tray & PCB Vertikal Utama */}
      <group position={[0.85, 2.9, -0.2]}>
        {/* Papan PCB Hitam Doff */}
        <RoundedBox args={[0.06, 2.8, 3.6]} radius={0.02} smoothness={2} castShadow receiveShadow>
          <meshStandardMaterial color="#0c131a" metalness={0.3} roughness={0.7} />
        </RoundedBox>

        {/* Pelat Armor I/O Belakang & Heatsink VRM Atas/Kiri */}
        <mesh position={[-0.08, 0.6, -1.25]} castShadow>
          <boxGeometry args={[0.18, 0.95, 0.6]} />
          <meshStandardMaterial color="#1e293b" metalness={0.88} roughness={0.22} />
        </mesh>
        <mesh position={[-0.08, 1.15, -0.3]} castShadow>
          <boxGeometry args={[0.18, 0.35, 1.1]} />
          <meshStandardMaterial color="#1e293b" metalness={0.88} roughness={0.22} />
        </mesh>
        {/* Pipa Tembaga Heatpipe VRM */}
        <mesh position={[-0.12, 1.05, -0.8]} rotation={[0, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.45, 12]} />
          <meshStandardMaterial color="#b45309" metalness={0.92} roughness={0.18} />
        </mesh>

        {/* Heatsink Chipset Motherboard Bawah Kanan */}
        <mesh position={[-0.06, -0.7, 0.9]} castShadow>
          <boxGeometry args={[0.12, 0.7, 0.85]} />
          <meshStandardMaterial color="#1e293b" metalness={0.85} roughness={0.25} />
        </mesh>
        <Text position={[-0.13, -0.7, 0.9]} rotation={[0, -Math.PI / 2, 0]} fontSize={0.09} color="#38bdf8" fontStyle="bold">
          AOK Z790
        </Text>

        {/* Heatsink Pelindung M.2 NVMe SSD dengan Aksen Biru */}
        <mesh position={[-0.06, -0.15, -0.2]}>
          <boxGeometry args={[0.08, 0.16, 0.95]} />
          <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[-0.11, -0.15, -0.2]}>
          <boxGeometry args={[0.02, 0.04, 0.8]} />
          <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={isSurging ? 2.5 : 0.8} />
        </mesh>

        {/* 4x Slot RAM DDR5 dengan 2x Modul RAM RGB Terpasang */}
        {[-0.22, -0.12, -0.02, 0.08].map((offset, rIdx) => {
          const isInstalled = rIdx === 1 || rIdx === 3;
          return (
            <group key={`ram-slot-${rIdx}`} position={[-0.06, 0.55, 0.4 + offset]}>
              {/* Slot DIMM Hitam */}
              <mesh>
                <boxGeometry args={[0.08, 1.1, 0.04]} />
                <meshStandardMaterial color="#090d14" roughness={0.8} />
              </mesh>
              {isInstalled && (
                <group position={[-0.08, 0, 0]}>
                  {/* Heatspreader Logam RAM */}
                  <mesh castShadow>
                    <boxGeometry args={[0.05, 1.05, 0.035]} />
                    <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} />
                  </mesh>
                  {/* Bilah Cahaya Diffuser ARGB di Punggung RAM */}
                  <mesh position={[-0.03, 0, 0]}>
                    <boxGeometry args={[0.02, 1.05, 0.03]} />
                    <meshStandardMaterial
                      color="#a855f7"
                      emissive="#a855f7"
                      emissiveIntensity={isSurging ? 3.0 : 1.4}
                    />
                  </mesh>
                </group>
              )}
            </group>
          );
        })}

        {/* 2. Sistem Pendingin CPU AIO Liquid Cooler (Pump Block & Tubing) */}
        <group position={[-0.12, 0.55, -0.45]}>
          {/* Blok Pompa CPU Silinder dengan Infinity Mirror */}
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.34, 0.34, 0.16, 32]} />
            <meshStandardMaterial color="#0f172a" metalness={0.88} roughness={0.2} />
          </mesh>
          {/* Cincin RGB Infinity Mirror Pompa */}
          <mesh ref={aioPumpPulseRef} position={[-0.09, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
            <torusGeometry args={[0.26, 0.03, 16, 32]} />
            <meshStandardMaterial
              color="#06b6d4"
              emissive="#06b6d4"
              emissiveIntensity={isSurging ? 3.2 : 1.5}
            />
          </mesh>
          <Text position={[-0.1, 0, 0]} rotation={[0, -Math.PI / 2, 0]} fontSize={0.11} color="#e0f2fe" fontStyle="bold">
            AOK CPU
          </Text>

          {/* Selang Pendingin Cairan Anyam (Braided Liquid Tubes) melengkung ke atas */}
          {[-0.08, 0.08].map((tOffset, tIdx) => (
            <group key={`tube-${tIdx}`} position={[0.02, 0.28, tOffset]}>
              <mesh rotation={[0.4 * (tIdx ? 1 : -1), 0, 0.35]}>
                <cylinderGeometry args={[0.045, 0.045, 1.15, 16]} />
                <meshStandardMaterial color="#1e293b" roughness={0.8} />
              </mesh>
            </group>
          ))}
        </group>
      </group>

      {/* 2b. Braket Radiator & 2x Kipas Samping Vertikal (Vertical Side Radiator & Dual Fans) */}
      <group position={[0.74, 2.85, 1.25]}>
        {/* Braket Radiator Logam Vertikal */}
        <mesh position={[0.04, 0, 0]} castShadow>
          <boxGeometry args={[0.04, 2.65, 1.35]} />
          <meshStandardMaterial color="#111827" metalness={0.85} roughness={0.25} />
        </mesh>
        {/* Kisi-Kisi Sirip Radiator (Radiator Fin Mesh) */}
        <mesh position={[0.01, 0, 0]}>
          <boxGeometry args={[0.02, 2.5, 1.25]} />
          <meshStandardMaterial color="#1f2937" metalness={0.7} roughness={0.4} wireframe />
        </mesh>

        {/* 2x Kipas Radiator Vertikal 120mm Menghadap Kaca Samping (-X) */}
        <PcCaseFan
          position={[-0.08, -0.62, 0]}
          rotation={[0, -Math.PI / 2, 0]}
          isSpinning={true}
          isSurging={isSurging}
          rgbColor={fanColor}
          scale={0.95}
        />
        <PcCaseFan
          position={[-0.08, 0.62, 0]}
          rotation={[0, -Math.PI / 2, 0]}
          isSpinning={true}
          isSurging={isSurging}
          rgbColor={fanColor}
          scale={0.95}
        />
      </group>

      {/* 3. Kartu Grafis Dedikasi Vertikal (Vertical PCIe Mounted Triple-Fan GPU) */}
      <group
        position={[0.15 - explodeOffset * 0.25, 2.15 - explodeOffset * 0.15, -0.1]}
      >
        {/* Bodi Utama Shroud GPU Vertikal */}
        <RoundedBox args={[0.26, 1.22, 2.85]} radius={0.04} smoothness={3} castShadow receiveShadow>
          <meshStandardMaterial color="#18202a" metalness={0.82} roughness={0.28} />
        </RoundedBox>

        {/* Pelat Belakang Logam (Metal Backplate) GPU - Sisi Kanan (+X) */}
        <mesh position={[0.135, 0, 0]} castShadow>
          <boxGeometry args={[0.015, 1.18, 2.82]} />
          <meshStandardMaterial color="#2d3748" metalness={0.92} roughness={0.18} />
        </mesh>
        {/* Cutout Aliran Udara di Ujung Backplate */}
        <mesh position={[0.145, 0, 0.95]}>
          <boxGeometry args={[0.01, 0.8, 0.55]} />
          <meshStandardMaterial color="#0b0f17" roughness={0.8} wireframe />
        </mesh>

        {/* Tulisan Logo RGB Sisi Atas Kartu Grafis */}
        <mesh position={[0, 0.615, -0.3]}>
          <boxGeometry args={[0.2, 0.02, 1.1]} />
          <meshStandardMaterial color="#0f172a" metalness={0.7} />
        </mesh>
        <Text
          position={[-0.135, 0.42, -0.3]}
          rotation={[0, -Math.PI / 2, 0]}
          fontSize={0.08}
          color={isSurging ? '#22c55e' : '#38bdf8'}
          fontStyle="bold"
        >
          GEFORCE AOK RTX
        </Text>

        {/* 3x Kipas Pendingin GPU Vertikal di Sisi Kiri Shroud (-X) Menghadap Panel Kaca */}
        {[-0.85, 0, 0.85].map((zPos, fanIdx) => {
          const fanRef = fanIdx === 0 ? gpuFan1Ref : fanIdx === 1 ? gpuFan2Ref : gpuFan3Ref;
          return (
            <group
              key={`gpu-fan-${fanIdx}`}
              position={[-0.135, 0, zPos]}
              rotation={[0, -Math.PI / 2, 0]}
            >
              {/* Ring Cekungan Fan Shroud */}
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.38, 0.38, 0.03, 24]} />
                <meshStandardMaterial color="#090d14" roughness={0.8} />
              </mesh>
              {/* Rotor & Bilah Berputar */}
              <group ref={fanRef}>
                <mesh position={[0, 0, 0.02]} rotation={[Math.PI / 2, 0, 0]}>
                  <cylinderGeometry args={[0.13, 0.13, 0.03, 16]} />
                  <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.2} />
                </mesh>
                {[0, 1, 2, 3, 4, 5, 6, 7].map((b) => (
                  <mesh key={`gpu-b-${b}`} rotation={[0, 0, (b * Math.PI) / 4]}>
                    <boxGeometry args={[0.08, 0.32, 0.02]} />
                    <meshStandardMaterial color="#1e293b" metalness={0.6} roughness={0.35} />
                  </mesh>
                ))}
              </group>
            </group>
          );
        })}

        {/* Kabel Daya 12VHPWR Sleeved di Bagian Atas GPU */}
        <group position={[0, 0.62, 0.2]}>
          <mesh>
            <boxGeometry args={[0.16, 0.08, 0.2]} />
            <meshStandardMaterial color="#020617" roughness={0.7} />
          </mesh>
          {/* Kabel Lengkung Mengarah ke Belakang Motherboard Tray */}
          {[-0.04, 0.04].map((cOffset, cIdx) => (
            <mesh key={`gpu-pcie-cbl-${cIdx}`} position={[0.2, 0.08, cOffset]} rotation={[0, 0, 1.2]}>
              <cylinderGeometry args={[0.025, 0.025, 0.45, 8]} />
              <meshStandardMaterial color="#0f172a" roughness={0.6} />
            </mesh>
          ))}
        </group>

        {/* Braket Logam PCIe Belakang (Vertical Expansion Bracket) */}
        <mesh position={[0, 0, -1.43]} castShadow>
          <boxGeometry args={[0.24, 1.15, 0.04]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.95} roughness={0.15} />
        </mesh>

        {/* Kabel Riser PCIe Vertikal (PCIe Riser Extension) ke Slot Motherboard */}
        <mesh position={[0.3, -0.65, 0]}>
          <boxGeometry args={[0.5, 0.04, 1.4]} />
          <meshStandardMaterial color="#1e293b" roughness={0.7} />
        </mesh>
      </group>
    </group>
  );
}

// -------------------------------------------------------------
// Komponen Utama Casing Komputer 3D (ATX Gaming Tower)
// -------------------------------------------------------------
export default function ComputerCase({
  isPowered,
  isExploding,
  onPowerButtonPressed,
  onExplodeComplete,
}) {
  const frontPanelRef = useRef();
  const leftGlassPanelRef = useRef();
  const rightSteelPanelRef = useRef();
  const topPanelRef = useRef();
  const rearPanelRef = useRef();
  const resetFiredRef = useRef(false);

  const [isHovered, setIsHovered] = useState(false);
  const [explodeProgress, setExplodeProgress] = useState(0);

  // Efek Cursor Pointer saat hover tombol power
  useEffect(() => {
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, []);

  const handlePowerClick = (e) => {
    e.stopPropagation();
    if (!isPowered && !isExploding) {
      document.body.style.cursor = 'auto';
      onPowerButtonPressed?.();
    }
  };

  // Loop Animasi Fisika & Ledakan Panel
  useFrame((state, delta) => {
    const target = isExploding ? 1 : 0;
    const lerpSpeed = 1 - Math.exp(-delta * 3.2);

    // Hitung Progres Ledakan [0 .. 1]
    const nextProg = THREE.MathUtils.lerp(explodeProgress, target, lerpSpeed);
    setExplodeProgress(nextProg);

    // 1. Panel Depan: Bergerak Maju (+Z)
    if (frontPanelRef.current) {
      frontPanelRef.current.position.z = THREE.MathUtils.lerp(
        frontPanelRef.current.position.z,
        2.78 + 2.4 * target,
        lerpSpeed
      );
    }

    // 2. Panel Kaca Tempered Kiri: Bergerak Keluar Kiri (-X) & Miring Elegan
    if (leftGlassPanelRef.current) {
      leftGlassPanelRef.current.position.x = THREE.MathUtils.lerp(
        leftGlassPanelRef.current.position.x,
        -1.42 - 2.5 * target,
        lerpSpeed
      );
      leftGlassPanelRef.current.rotation.y = THREE.MathUtils.lerp(
        leftGlassPanelRef.current.rotation.y,
        -0.22 * target,
        lerpSpeed
      );
    }

    // 3. Panel Baja Kanan: Bergerak Keluar Kanan (+X)
    if (rightSteelPanelRef.current) {
      rightSteelPanelRef.current.position.x = THREE.MathUtils.lerp(
        rightSteelPanelRef.current.position.x,
        1.42 + 2.5 * target,
        lerpSpeed
      );
    }

    // 4. Panel Atas: Bergerak Naik ke Atas (+Y)
    if (topPanelRef.current) {
      topPanelRef.current.position.y = THREE.MathUtils.lerp(
        topPanelRef.current.position.y,
        4.85 + 2.2 * target,
        lerpSpeed
      );
    }

    // 5. Panel Belakang: Bergerak Mundur (-Z)
    if (rearPanelRef.current) {
      rearPanelRef.current.position.z = THREE.MathUtils.lerp(
        rearPanelRef.current.position.z,
        -2.78 - 2.2 * target,
        lerpSpeed
      );
    }

    // Pemicu Selesai Ledakan setelah 1.25 detik
    if (isExploding && !resetFiredRef.current) {
      resetFiredRef.current = true;
      window.setTimeout(() => {
        onExplodeComplete?.();
      }, 1250);
    }
    if (!isExploding) {
      resetFiredRef.current = false;
    }
  });

  const fanColor = isExploding ? '#34d399' : '#06b6d4';

  return (
    <group position={[0, -0.4, 18]}>
      {/* -------------------------------------------------------- */}
      {/* 1. Rangka Utama Casing (Structural Skeleton & Pillars)   */}
      {/* -------------------------------------------------------- */}
      <CaseFeet />

      {/* Sudut Pilar Logam Casing 4 Sisi */}
      {[
        [-1.38, 2.45, -2.7],
        [1.38, 2.45, -2.7],
        [-1.38, 2.45, 2.7],
        [1.38, 2.45, 2.7],
      ].map(([px, py, pz], i) => (
        <mesh key={`corner-pillar-${i}`} position={[px, py, pz]} castShadow>
          <boxGeometry args={[0.08, 4.7, 0.08]} />
          <meshStandardMaterial color="#090d13" metalness={0.9} roughness={0.25} />
        </mesh>
      ))}

      {/* Rel Rangka Horizontal Bawah dan Atas */}
      <mesh position={[0, 0.16, 0]}>
        <boxGeometry args={[2.84, 0.08, 5.48]} />
        <meshStandardMaterial color="#0b0f16" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[0, 4.82, 0]}>
        <boxGeometry args={[2.84, 0.08, 5.48]} />
        <meshStandardMaterial color="#0b0f16" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* -------------------------------------------------------- */}
      {/* 2. Basement / PSU Shroud di Kompartemen Bawah           */}
      {/* -------------------------------------------------------- */}
      <PsuShroud isPowered={isPowered} isSurging={isExploding} />

      {/* -------------------------------------------------------- */}
      {/* 3. Komponen Hardware Internal (Motherboard, GPU, Cooler) */}
      {/* -------------------------------------------------------- */}
      <InternalHardware
        isPowered={isPowered}
        isSurging={isExploding}
        explodeOffset={explodeProgress}
        fanColor={fanColor}
      />

      {/* -------------------------------------------------------- */}
      {/* 4. Panel Depan Interaktif (Front Panel & Power Switch)  */}
      {/* -------------------------------------------------------- */}
      <group ref={frontPanelRef} position={[0, 2.45, 2.78]}>
        {/* Bingkai Panel Depan Beveled Matte Black */}
        <RoundedBox args={[2.82, 4.76, 0.22]} radius={0.06} smoothness={3} castShadow>
          <meshStandardMaterial color="#111822" metalness={0.78} roughness={0.32} />
        </RoundedBox>

        {/* Kisi Jala Udara Intake (High-Airflow Geometric Intake Mesh) */}
        <mesh position={[0, -0.22, 0.12]}>
          <boxGeometry args={[2.3, 3.8, 0.03]} />
          <meshStandardMaterial color="#05080c" metalness={0.4} roughness={0.65} wireframe />
        </mesh>

        {/* 3x Kipas Intake Depan 120mm dengan Lampu ARGB Synchronized */}
        <PcCaseFan
          position={[0, -1.35, 0.08]}
          isSpinning={true}
          isSurging={isExploding}
          rgbColor={fanColor}
        />
        <PcCaseFan
          position={[0, -0.2, 0.08]}
          isSpinning={true}
          isSurging={isExploding}
          rgbColor={fanColor}
        />
        <PcCaseFan
          position={[0, 0.95, 0.08]}
          isSpinning={true}
          isSurging={isExploding}
          rgbColor={fanColor}
        />

        {/* Strip Aksen Cahaya ARGB Vertikal Ganda Kiri & Kanan */}
        {[-1.24, 1.24].map((xStrip, idx) => (
          <mesh key={`rgb-strip-${idx}`} position={[xStrip, -0.2, 0.12]}>
            <boxGeometry args={[0.035, 3.7, 0.02]} />
            <meshStandardMaterial
              color={fanColor}
              emissive={fanColor}
              emissiveIntensity={isExploding ? 3.5 : 1.4}
              roughness={0.2}
            />
          </mesh>
        ))}

        {/* ======================================================== */}
        {/* CLUSTER FRONT I/O & SAKLAR TOMBOL POWER 3D               */}
        {/* ======================================================== */}
        <group position={[0, 2.05, 0.12]}>
          {/* Pelat I/O Bertekstur Aluminium Brushed */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[2.45, 0.44, 0.04]} />
            <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} />
          </mesh>

          {/* Area Hitbox Transparan Lebih Besar untuk Klik Nyaman */}
          <mesh
            position={[0.78, 0, 0.25]}
            onClick={handlePowerClick}
            onPointerOver={(e) => {
              e.stopPropagation();
              setIsHovered(true);
              document.body.style.cursor = 'pointer';
            }}
            onPointerOut={(e) => {
              e.stopPropagation();
              setIsHovered(false);
              document.body.style.cursor = 'auto';
            }}
          >
            <circleGeometry args={[0.65, 32]} />
            <meshBasicMaterial transparent opacity={0} depthWrite={false} side={THREE.DoubleSide} />
          </mesh>

          {/* Tombol Power 3D Logam Fisik */}
          <group
            position={[0.78, 0, 0.03]}
            onClick={handlePowerClick}
            onPointerOver={(e) => {
              e.stopPropagation();
              setIsHovered(true);
              document.body.style.cursor = 'pointer';
            }}
            onPointerOut={(e) => {
              e.stopPropagation();
              setIsHovered(false);
              document.body.style.cursor = 'auto';
            }}
          >
            {/* Bezel Luar Tombol */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.18, 0.19, 0.06, 32]} />
              <meshStandardMaterial color="#334155" metalness={0.92} roughness={0.18} />
            </mesh>
            {/* Cincin Halo Lampu LED Tombol Power (Pulsing di Standby) */}
            <mesh position={[0, 0, 0.032]} rotation={[0, 0, 0]}>
              <ringGeometry args={[0.12, 0.165, 32]} />
              <meshStandardMaterial
                color={isExploding ? '#34d399' : isHovered ? '#67e8f9' : '#06b6d4'}
                emissive={isExploding ? '#10b981' : isHovered ? '#22d3ee' : '#0891b2'}
                emissiveIntensity={isExploding ? 3.5 : isHovered ? 2.4 : 1.2}
              />
            </mesh>
            {/* Tutup Tombol Power Tengah yang Bergerak Saat Hover/Ditekan */}
            <mesh
              position={[0, 0, isHovered ? 0.02 : 0.035]}
              rotation={[Math.PI / 2, 0, 0]}
              onClick={handlePowerClick}
            >
              <cylinderGeometry args={[0.11, 0.11, 0.04, 32]} />
              <meshStandardMaterial
                color={isExploding ? '#10b981' : isHovered ? '#0284c7' : '#0f172a'}
                metalness={0.7}
                roughness={0.3}
              />
            </mesh>
            {/* Simbol Ikon Power Laser-Etched */}
            <mesh position={[0, 0.02, 0.056]} rotation={[0, 0, 0]}>
              <boxGeometry args={[0.02, 0.06, 0.005]} />
              <meshBasicMaterial color={isExploding ? '#ffffff' : '#67e8f9'} />
            </mesh>
            <mesh position={[0, -0.01, 0.056]} rotation={[0, 0, 0]}>
              <ringGeometry args={[0.04, 0.06, 24]} />
              <meshBasicMaterial color={isExploding ? '#ffffff' : '#67e8f9'} />
            </mesh>
          </group>

          {/* Label POWER di Bawah Tombol */}
          <Text
            position={[0.78, -0.16, 0.04]}
            fontSize={0.075}
            color={isHovered ? '#38bdf8' : '#cbd5e1'}
            fontStyle="bold"
            anchorX="center"
            onClick={handlePowerClick}
          >
            POWER
          </Text>

          {/* Tombol Reset Kecil */}
          <group position={[0.42, 0, 0.03]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.07, 0.07, 0.04, 20]} />
              <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.3} />
            </mesh>
            <Text position={[0, -0.16, 0.02]} fontSize={0.06} color="#64748b" anchorX="center">
              RESET
            </Text>
          </group>

          {/* 2x Port USB 3.0 Type-A (Warna Biru Khas) */}
          <group position={[0.05, 0.02, 0.03]}>
            {[-0.14, 0.14].map((uX, uIdx) => (
              <group key={`usb-a-${uIdx}`} position={[uX, 0, 0]}>
                <mesh>
                  <boxGeometry args={[0.18, 0.08, 0.03]} />
                  <meshStandardMaterial color="#020617" roughness={0.5} />
                </mesh>
                {/* Tab Plastik Biru USB 3.0 */}
                <mesh position={[0, 0.015, 0.01]}>
                  <boxGeometry args={[0.14, 0.025, 0.02]} />
                  <meshStandardMaterial color="#0284c7" roughness={0.3} />
                </mesh>
              </group>
            ))}
            <Text position={[0, -0.16, 0.02]} fontSize={0.06} color="#64748b" anchorX="center">
              USB 3.0
            </Text>
          </group>

          {/* Port USB 3.2 Gen 2 Type-C (Bentuk Oval) */}
          <group position={[-0.42, 0.02, 0.03]}>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.04, 0.04, 0.14, 16]} />
              <meshStandardMaterial color="#020617" roughness={0.4} metalness={0.6} />
            </mesh>
            <Text position={[0, -0.16, 0.02]} fontSize={0.06} color="#64748b" anchorX="center">
              TYPE-C
            </Text>
          </group>

          {/* Jack Audio & Mikrofon 3.5mm dengan Cincin Emas */}
          <group position={[-0.78, 0.02, 0.03]}>
            {[-0.09, 0.09].map((aX, aIdx) => (
              <mesh key={`audio-${aIdx}`} position={[aX, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.045, 0.045, 0.04, 16]} />
                <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.2} />
              </mesh>
            ))}
            <Text position={[0, -0.16, 0.02]} fontSize={0.06} color="#64748b" anchorX="center">
              AUDIO
            </Text>
          </group>

          {/* Lampu Indikator Aktivitas HDD LED */}
          <mesh position={[-1.02, 0.02, 0.03]}>
            <sphereGeometry args={[0.025, 12, 12]} />
            <meshStandardMaterial
              color="#f97316"
              emissive="#f97316"
              emissiveIntensity={isHovered || isExploding ? 2.5 : 0.8}
            />
          </mesh>
        </group>

        {/* Indikator Teks 3D Tombol Power Interaktif */}
        <group
          position={[0.78, 2.55, 0.2]}
          onClick={handlePowerClick}
          onPointerOver={(e) => {
            e.stopPropagation();
            setIsHovered(true);
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={(e) => {
            e.stopPropagation();
            setIsHovered(false);
            document.body.style.cursor = 'auto';
          }}
        >
          <Text
            fontSize={0.11}
            color={isExploding ? '#34d399' : '#38bdf8'}
            fontStyle="bold"
            anchorX="center"
          >
            {isExploding ? 'SISTEM MENYALA // MEMBUKA PANEL' : 'KLIK TOMBOL POWER'}
          </Text>
          <mesh position={[0, -0.12, 0]} rotation={[0, 0, Math.PI]}>
            <coneGeometry args={[0.05, 0.08, 3]} />
            <meshBasicMaterial color={isExploding ? '#34d399' : '#38bdf8'} />
          </mesh>
        </group>
      </group>

      {/* -------------------------------------------------------- */}
      {/* 5. Panel Kaca Tempered Kiri (Exploding Left -X)          */}
      {/* -------------------------------------------------------- */}
      <group ref={leftGlassPanelRef} position={[-1.42, 2.45, 0]}>
        {/* Kaca Tempered Semi-Transparan Smoky */}
        <mesh castShadow>
          <boxGeometry args={[0.04, 4.65, 5.35]} />
          <meshPhysicalMaterial
            color="#0b131f"
            transmission={0.84}
            opacity={1}
            transparent={true}
            roughness={0.06}
            metalness={0.1}
            ior={1.52}
            thickness={0.15}
          />
        </mesh>

        {/* Bezel Sablon Keramik Hitam (Black Silkscreen Border) */}
        {/* Bingkai Atas & Bawah */}
        <mesh position={[-0.025, 2.22, 0]}>
          <boxGeometry args={[0.01, 0.22, 5.35]} />
          <meshStandardMaterial color="#020617" roughness={0.9} />
        </mesh>
        <mesh position={[-0.025, -2.22, 0]}>
          <boxGeometry args={[0.01, 0.22, 5.35]} />
          <meshStandardMaterial color="#020617" roughness={0.9} />
        </mesh>
        {/* Bingkai Depan & Belakang */}
        <mesh position={[-0.025, 0, 2.57]}>
          <boxGeometry args={[0.01, 4.65, 0.22]} />
          <meshStandardMaterial color="#020617" roughness={0.9} />
        </mesh>
        <mesh position={[-0.025, 0, -2.57]}>
          <boxGeometry args={[0.01, 4.65, 0.22]} />
          <meshStandardMaterial color="#020617" roughness={0.9} />
        </mesh>

        {/* 4x Baut Tangan Thumbscrew Logam di Sudut-Sudut Kaca */}
        {[
          [-0.04, 2.18, -2.5],
          [-0.04, 2.18, 2.5],
          [-0.04, -2.18, -2.5],
          [-0.04, -2.18, 2.5],
        ].map(([tx, ty, tz], i) => (
          <group key={`thumbscrew-${i}`} position={[tx, ty, tz]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.07, 0.07, 0.04, 16]} />
            <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.25} />
          </group>
        ))}

        {/* Label Peringatan Kecil Kaca Tempered */}
        <Text
          position={[-0.03, -2.18, -1.8]}
          rotation={[0, -Math.PI / 2, 0]}
          fontSize={0.065}
          color="#94a3b8"
        >
          TEMPERED GLASS // HANDLE WITH CARE
        </Text>
      </group>

      {/* -------------------------------------------------------- */}
      {/* 6. Panel Baja Kanan (Exploding Right +X)                 */}
      {/* -------------------------------------------------------- */}
      <group ref={rightSteelPanelRef} position={[1.42, 2.45, 0]}>
        {/* Pelat Baja Tebal Matte Black */}
        <mesh castShadow>
          <boxGeometry args={[0.06, 4.65, 5.35]} />
          <meshStandardMaterial color="#151d28" metalness={0.82} roughness={0.3} />
        </mesh>
        {/* Lekukan Geometris Cable Management */}
        <mesh position={[0.035, 0.3, 0]}>
          <boxGeometry args={[0.02, 3.4, 4.2]} />
          <meshStandardMaterial color="#0f1622" metalness={0.7} roughness={0.4} />
        </mesh>
        {/* Ventilasi Kisi Sisi Kanan Depan */}
        {[-0.8, -0.4, 0, 0.4, 0.8].map((vY) => (
          <mesh key={`right-vent-${vY}`} position={[0.045, vY, 1.8]}>
            <boxGeometry args={[0.015, 0.18, 0.85]} />
            <meshStandardMaterial color="#05080d" roughness={0.9} />
          </mesh>
        ))}
      </group>

      {/* -------------------------------------------------------- */}
      {/* 7. Panel Atas & Filter Debu Magnetik (Exploding Up +Y)  */}
      {/* -------------------------------------------------------- */}
      <group ref={topPanelRef} position={[0, 4.85, 0]}>
        {/* Pelat Rangka Atas Logam dengan Rel Radiator */}
        <RoundedBox args={[2.8, 0.08, 5.45]} radius={0.02} smoothness={2} castShadow>
          <meshStandardMaterial color="#151d28" metalness={0.82} roughness={0.3} />
        </RoundedBox>

        {/* Rel Mounting Radiator & Ventilasi Aliran Udara */}
        {[-1.2, -0.6, 0, 0.6, 1.2].map((offsetZ, rIdx) => (
          <mesh key={`top-rail-${rIdx}`} position={[0, -0.02, offsetZ]}>
            <boxGeometry args={[1.8, 0.04, 0.12]} />
            <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.2} />
          </mesh>
        ))}

        {/* Filter Debu Magnetik (Magnetic Dust Filter Mesh) */}
        <mesh position={[0, 0.05, 0]}>
          <boxGeometry args={[2.3, 0.01, 4.4]} />
          <meshStandardMaterial color="#080c12" metalness={0.3} roughness={0.7} wireframe />
        </mesh>
        {/* Pita Penarik Filter Karet (Filter Pull Tab) */}
        <mesh position={[0, 0.06, 2.25]}>
          <boxGeometry args={[0.3, 0.02, 0.12]} />
          <meshStandardMaterial color="#38bdf8" roughness={0.5} />
        </mesh>
      </group>

      {/* -------------------------------------------------------- */}
      {/* 8. Panel Belakang / Rear I/O (Exploding Backward -Z)     */}
      {/* -------------------------------------------------------- */}
      <group ref={rearPanelRef} position={[0, 2.45, -2.78]}>
        {/* Pelat Belakang Logam */}
        <RoundedBox args={[2.8, 4.76, 0.08]} radius={0.03} smoothness={2} castShadow>
          <meshStandardMaterial color="#151d28" metalness={0.82} roughness={0.3} />
        </RoundedBox>

        {/* 1x Kipas Exhaust Belakang 120mm */}
        <PcCaseFan
          position={[-0.45, 1.1, 0.06]}
          rotation={[0, Math.PI, 0]}
          isSpinning={true}
          isSurging={isExploding}
          rgbColor={fanColor}
          scale={0.95}
        />

        {/* Cutout & Pelindung I/O Belakang Motherboard (I/O Shield) */}
        <group position={[0.7, 1.05, 0.05]}>
          <mesh>
            <boxGeometry args={[0.55, 1.35, 0.03]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.15} />
          </mesh>
          {/* Port-port I/O (USB, LAN RJ45, HDMI/DP, Audio) */}
          {[-0.45, -0.2, 0.05, 0.3, 0.5].map((pY, pIdx) => (
            <mesh key={`rear-port-${pIdx}`} position={[0, pY, 0.02]}>
              <boxGeometry args={[0.38, 0.12, 0.02]} />
              <meshStandardMaterial color="#020617" roughness={0.4} />
            </mesh>
          ))}
          {/* Jack Audio 7.1 Berwarna-Warni */}
          {[-0.15, 0, 0.15].map((aX, aIdx) => (
            <mesh key={`rear-audio-${aIdx}`} position={[aX, -0.52, 0.02]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.03, 0.03, 0.02, 12]} />
              <meshStandardMaterial
                color={aIdx === 0 ? '#22c55e' : aIdx === 1 ? '#06b6d4' : '#ec4899'}
                metalness={0.8}
              />
            </mesh>
          ))}
        </group>

        {/* 7x Braket Slot Ekspansi PCIe Berlubang */}
        <group position={[0, -0.4, 0.05]}>
          {[0, 1, 2, 3, 4, 5, 6].map((slotIdx) => (
            <group key={`pcie-slot-${slotIdx}`} position={[0, slotIdx * 0.18, 0]}>
              <mesh>
                <boxGeometry args={[1.7, 0.12, 0.02]} />
                <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.25} />
              </mesh>
              {/* Lubang Ventilasi Kisi Slot */}
              <mesh position={[0, 0, 0.012]}>
                <boxGeometry args={[1.4, 0.06, 0.005]} />
                <meshStandardMaterial color="#020617" roughness={0.8} wireframe />
              </mesh>
            </group>
          ))}
        </group>

        {/* Cutout Input Daya PSU Belakang (Soket AC C14 & Saklar I/O Rocker) */}
        <group position={[0.4, -1.75, 0.05]}>
          <mesh>
            <boxGeometry args={[1.1, 0.65, 0.03]} />
            <meshStandardMaterial color="#1a2332" metalness={0.85} roughness={0.25} />
          </mesh>
          {/* Soket Listrik AC C14 3-Pin */}
          <mesh position={[-0.25, 0, 0.02]}>
            <boxGeometry args={[0.32, 0.24, 0.02]} />
            <meshStandardMaterial color="#020617" roughness={0.6} />
          </mesh>
          {/* Saklar Mekanikal Rocker On/Off (I / O) */}
          <mesh position={[0.25, 0, 0.02]}>
            <boxGeometry args={[0.18, 0.26, 0.03]} />
            <meshStandardMaterial color="#ef4444" roughness={0.4} />
          </mesh>
        </group>
      </group>

      {/* -------------------------------------------------------- */}
      {/* 9. Header Teks Judul Hologram 3D                         */}
      {/* -------------------------------------------------------- */}
      <Text
        position={[0, 5.65, 0]}
        fontSize={0.34}
        color="#f8fafc"
        fontStyle="bold"
        anchorX="center"
      >
        ATX HIGH-END GAMING TOWER
      </Text>
      <Text
        position={[0, 5.25, 0]}
        fontSize={0.16}
        color={isExploding ? '#34d399' : '#38bdf8'}
        anchorX="center"
        onClick={handlePowerClick}
      >
        {isExploding
          ? 'MEMBUKA PANEL CASING // MEMPERSIAPKAN EKSPEDISI MOTHERBOARD'
          : 'TEKAN TOMBOL POWER PADA FRONT PANEL UNTUK MENYALAKAN KOMPUTER'}
      </Text>
    </group>
  );
}
