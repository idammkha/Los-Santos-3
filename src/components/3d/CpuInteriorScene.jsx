import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float, Cylinder, Box } from '@react-three/drei';
import * as THREE from 'three';
import { CPU_COMPONENTS } from '../../data/aokData';

// Panggung Megastruktur 3D di dalam Silicon Die CPU
// Memvisualisasikan arsitektur internal: CU, ALU, Register Bank, Cache, dan Internal Bus
export default function CpuInteriorScene({
  activeComponent,
  onSelectComponent,
  currentCycleStep = 0,
  isExecuting = false,
}) {
  return (
    <group position={[0, 0, 0]}>
      {/* Lantai Silikon Wafer Nanometer (Die Grid) */}
      <mesh receiveShadow position={[0, -0.2, 0]}>
        <cylinderGeometry args={[18, 18, 0.4, 48]} />
        <meshStandardMaterial
          color="#080d14"
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>

      {/* Grid Bus Silikon Nanometer */}
      <gridHelper
        args={[32, 32, '#ff007f', '#00e5ff']}
        position={[0, 0.02, 0]}
      />

      {/* Dinding Pelindung Silikon / Die Perimeter */}
      <mesh position={[0, 2, 0]}>
        <cylinderGeometry args={[18.2, 18.2, 4.4, 48, 1, true]} />
        <meshStandardMaterial
          color="#03080f"
          side={THREE.BackSide}
          wireframe
        />
      </mesh>

      {/* Internal System Bus (Address Bus, Data Bus, Control Bus) */}
      <InternalSystemBuses isExecuting={isExecuting} />

      {/* Modul 1: Control Unit (CU) */}
      <ControlUnitMonolith
        isActive={activeComponent === 'cu' || currentCycleStep === 2}
        onClick={() => onSelectComponent(CPU_COMPONENTS.find((c) => c.id === 'cu'))}
      />

      {/* Modul 2: Arithmetic Logic Unit (ALU) */}
      <AluReactor
        isActive={activeComponent === 'alu' || currentCycleStep === 3}
        isExecuting={isExecuting}
        onClick={() => onSelectComponent(CPU_COMPONENTS.find((c) => c.id === 'alu'))}
      />

      {/* Modul 3: Register Bank (PC, IR, MAR, MDR, ACC) */}
      <RegisterBankPlatform
        isActive={activeComponent === 'registers' || currentCycleStep === 1 || currentCycleStep === 4}
        onClick={() => onSelectComponent(CPU_COMPONENTS.find((c) => c.id === 'registers'))}
      />

      {/* Modul 4: Cache Memory Sanctuary (L1 / L2 / L3) */}
      <CacheSanctuary
        isActive={activeComponent === 'cache'}
        onClick={() => onSelectComponent(CPU_COMPONENTS.find((c) => c.id === 'cache'))}
      />

      {/* Modul 5: Bus Interface Unit (BIU) */}
      <BusInterfaceGateway
        isActive={activeComponent === 'biu'}
        onClick={() => onSelectComponent(CPU_COMPONENTS.find((c) => c.id === 'biu'))}
      />
    </group>
  );
}

// Jalur Bus Data, Bus Alamat, dan Bus Kontrol Internal
function InternalSystemBuses({ isExecuting }) {
  const busMatRef = useRef();

  useFrame(({ clock }) => {
    if (busMatRef.current) {
      busMatRef.current.color.setHSL((clock.getElapsedTime() * 0.1) % 1, 0.9, 0.5);
    }
  });

  return (
    <group position={[0, 0.04, 0]}>
      {/* Bus Kontrol (Control Bus - Pink/Magenta) */}
      <mesh position={[0, 0, -2]}>
        <boxGeometry args={[14, 0.04, 0.2]} />
        <meshStandardMaterial color="#ff007f" emissive="#ff007f" emissiveIntensity={1.5} />
      </mesh>
      <Text position={[0, 0.1, -1.7]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.22} color="#ff70a6">
        CONTROL BUS
      </Text>

      {/* Bus Data (Data Bus - Cyan/Blue) */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[14, 0.04, 0.25]} />
        <meshStandardMaterial color="#00e5ff" emissive="#00e5ff" emissiveIntensity={1.8} />
      </mesh>
      <Text position={[0, 0.1, 0.3]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.24} color="#80f3ff">
        DATA BUS (64-BIT)
      </Text>

      {/* Bus Alamat (Address Bus - Emas/Kuning) */}
      <mesh position={[0, 0, 2]}>
        <boxGeometry args={[14, 0.04, 0.2]} />
        <meshStandardMaterial color="#ffd166" emissive="#ffd166" emissiveIntensity={1.5} />
      </mesh>
      <Text position={[0, 0.1, 2.3]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.22} color="#ffe299">
        ADDRESS BUS (48-BIT PHYSICAL)
      </Text>
    </group>
  );
}

// 1. Control Unit Monolith (Pengarah & Dekoder Opcode)
function ControlUnitMonolith({ isActive, onClick }) {
  const ringRef = useRef();
  const holoRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ringRef.current) {
      ringRef.current.rotation.y = t * 1.2;
    }
    if (holoRef.current) {
      holoRef.current.position.y = 2.4 + Math.sin(t * 2) * 0.1;
    }
  });

  return (
    <group position={[0, 0, -6]} onClick={onClick}>
      {/* Pilar Monolith Utama */}
      <mesh position={[0, 1.2, 0]} castShadow>
        <boxGeometry args={[2.2, 2.4, 2.2]} />
        <meshStandardMaterial
          color="#1e1026"
          metalness={0.9}
          roughness={0.2}
          emissive={isActive ? '#ff007f' : '#3d0a29'}
          emissiveIntensity={isActive ? 0.8 : 0.2}
        />
      </mesh>

      {/* Cincin Dekoder Opcode Melayang */}
      <mesh ref={ringRef} position={[0, 1.6, 0]}>
        <torusGeometry args={[1.5, 0.05, 8, 32]} />
        <meshBasicMaterial color="#ff007f" wireframe />
      </mesh>

      {/* Hologram Floating Display */}
      <group ref={holoRef}>
        <pointLight color="#ff007f" intensity={isActive ? 4 : 1.5} distance={5} />
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.3}>
          <Text fontSize={0.34} color="#ff70a6" anchorX="center" anchorY="middle">
            CONTROL UNIT (CU)
          </Text>
          <Text position={[0, -0.32, 0]} fontSize={0.18} color="#ffffff" anchorX="center">
            {isActive ? 'STATUS: DECODING OPCODE' : 'DECODER & TIMING SEQUENCER'}
          </Text>
        </Float>
      </group>
    </group>
  );
}

// 2. ALU Reactor (Pusat Perhitungan & Logika)
function AluReactor({ isActive, isExecuting, onClick }) {
  const laserRef = useRef();

  useFrame(({ clock }) => {
    if (laserRef.current) {
      const t = clock.getElapsedTime();
      laserRef.current.rotation.y = t * 3;
      if (isExecuting) {
        laserRef.current.scale.set(1.5, 1.5, 1.5);
      } else {
        laserRef.current.scale.set(1, 1, 1);
      }
    }
  });

  return (
    <group position={[7, 0, -4]} onClick={onClick}>
      {/* Alas Reaktor ALU */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[2.0, 2.4, 0.8, 16]} />
        <meshStandardMaterial color="#221508" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Dua Corong Input Operand (A & B) */}
      <group position={[-0.8, 1.1, 0]}>
        <cylinderGeometry args={[0.3, 0.5, 0.8, 12]} />
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.3, 0.5, 0.8, 12]} />
          <meshStandardMaterial color="#ff9100" metalness={0.7} />
        </mesh>
        <Text position={[0, 0.6, 0]} fontSize={0.18} color="#ffaa33">
          OP A
        </Text>
      </group>

      <group position={[0.8, 1.1, 0]}>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.3, 0.5, 0.8, 12]} />
          <meshStandardMaterial color="#ff9100" metalness={0.7} />
        </mesh>
        <Text position={[0, 0.6, 0]} fontSize={0.18} color="#ffaa33">
          OP B
        </Text>
      </group>

      {/* Inti Full-Adder & Laser Komputasi Logika */}
      <group ref={laserRef} position={[0, 1.2, 0]}>
        <mesh>
          <octahedronGeometry args={[0.7, 0]} />
          <meshStandardMaterial
            color="#ff9100"
            emissive="#ff6d00"
            emissiveIntensity={isActive ? 3.0 : 1.2}
            wireframe
          />
        </mesh>
        <pointLight color="#ff9100" intensity={isActive ? 5 : 2} distance={6} />
      </group>

      {/* Label ALU */}
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
        <Text position={[0, 2.5, 0]} fontSize={0.34} color="#ffa940" anchorX="center">
          ALU (ARITHMETIC & LOGIC)
        </Text>
        <Text position={[0, 2.15, 0]} fontSize={0.18} color="#ffe8cc" anchorX="center">
          {isExecuting ? 'COMPUTING: [10 + 5 = 15]' : 'ADD, SUB, AND, OR, SHIFT, CMP'}
        </Text>
      </Float>
    </group>
  );
}

// 3. Register Bank Platform (PC, IR, MAR, MDR, ACC)
function RegisterBankPlatform({ isActive, onClick }) {
  const registers = [
    { name: 'PC', desc: 'Prog. Counter', val: '0x0040' },
    { name: 'IR', desc: 'Instr. Reg', val: 'ADD R1, #5' },
    { name: 'MAR', desc: 'Mem Address', val: '0x1000' },
    { name: 'MDR', desc: 'Mem Data', val: '0x0005' },
    { name: 'ACC', desc: 'Accumulator', val: '15' },
  ];

  return (
    <group position={[7, 0, 4]} onClick={onClick}>
      {/* Panggung Podium Register */}
      <mesh position={[0, 0.25, 0]}>
        <boxGeometry args={[4.8, 0.5, 4.2]} />
        <meshStandardMaterial color="#1a0b2e" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* 5 Pod Register Berjajar */}
      {registers.map((reg, i) => {
        const xOffset = -1.8 + i * 0.9;
        return (
          <group key={reg.name} position={[xOffset, 0.7, 0]}>
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[0.75, 0.6, 1.2]} />
              <meshStandardMaterial
                color="#2a0845"
                emissive={isActive ? '#b026ff' : '#4a0e4e'}
                emissiveIntensity={isActive ? 1.2 : 0.2}
              />
            </mesh>
            <Text position={[0, 0.45, 0]} fontSize={0.18} color="#e0aaff" anchorX="center">
              {reg.name}
            </Text>
            <Text position={[0, 0.1, 0.62]} fontSize={0.12} color="#ffffff" anchorX="center">
              {reg.val}
            </Text>
          </group>
        );
      })}

      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
        <Text position={[0, 2.4, 0]} fontSize={0.34} color="#d896ff" anchorX="center">
          REGISTER BANK
        </Text>
        <Text position={[0, 2.05, 0]} fontSize={0.18} color="#f3e8ff" anchorX="center">
          Ultra-Fast Internal Storage (1-Cycle Latency)
        </Text>
      </Float>
    </group>
  );
}

// 4. Cache Sanctuary (L1, L2, L3 SRAM Blocks)
function CacheSanctuary({ isActive, onClick }) {
  return (
    <group position={[-7, 0, 4]} onClick={onClick}>
      {/* Blok Menara L3 Cache */}
      <mesh position={[-1.2, 0.9, 0]}>
        <boxGeometry args={[1.5, 1.8, 2.2]} />
        <meshStandardMaterial color="#052e16" emissive="#10b981" emissiveIntensity={0.3} />
      </mesh>
      <Text position={[-1.2, 2.0, 0]} fontSize={0.2} color="#6ee7b7">
        L3 CACHE (Shared 32MB)
      </Text>

      {/* Blok Menara L2 Cache */}
      <mesh position={[0.6, 0.7, -0.6]}>
        <boxGeometry args={[1.2, 1.4, 1.4]} />
        <meshStandardMaterial color="#064e3b" emissive="#34d178" emissiveIntensity={0.5} />
      </mesh>
      <Text position={[0.6, 1.6, -0.6]} fontSize={0.18} color="#a7f3d0">
        L2 CACHE (1MB)
      </Text>

      {/* Blok Menara L1 Cache (Instruction & Data) */}
      <mesh position={[0.6, 0.5, 0.8]}>
        <boxGeometry args={[0.9, 1.0, 1.0]} />
        <meshStandardMaterial
          color="#047857"
          emissive="#39ff14"
          emissiveIntensity={isActive ? 1.5 : 0.8}
        />
      </mesh>
      <Text position={[0.6, 1.2, 0.8]} fontSize={0.18} color="#39ff14">
        L1i / L1d (Fastest 1ns)
      </Text>

      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
        <Text position={[0, 2.6, 0]} fontSize={0.34} color="#6ee7b7" anchorX="center">
          CACHE HIERARCHY (SRAM)
        </Text>
      </Float>
    </group>
  );
}

// 5. Bus Interface Unit (BIU) Gateway
function BusInterfaceGateway({ isActive, onClick }) {
  return (
    <group position={[-7, 0, -4]} onClick={onClick}>
      {/* Gerbang Portal Komunikasi */}
      <mesh position={[0, 1.4, 0]}>
        <torusGeometry args={[1.6, 0.1, 12, 32]} />
        <meshStandardMaterial
          color="#00e5ff"
          emissive="#00e5ff"
          emissiveIntensity={isActive ? 2.5 : 1.0}
        />
      </mesh>

      <Text position={[0, 0.2, 0]} fontSize={0.2} color="#38bdf8">
        TO RAM (DDR5) &amp; PCIe LANES
      </Text>

      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
        <Text position={[0, 2.6, 0]} fontSize={0.34} color="#38bdf8" anchorX="center">
          BUS INTERFACE UNIT (BIU)
        </Text>
      </Float>
    </group>
  );
}
