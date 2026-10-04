import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { CPU_COMPONENTS } from '../../data/aokData';

const DIE_TRACE_SEGMENTS = [
  [-6.2, -5.2, 4.2, 0.2],
  [-4.4, 6.2, 5.4, -0.45],
  [-1.4, -7.2, 6.6, 0.65],
  [2.8, -5.8, 4.8, -0.3],
  [5.6, 5.3, 4.2, 0.45],
  [7.2, -0.8, 3.8, 1.1],
  [-7.8, 0.4, 3.4, -1.05],
  [0.8, 6.9, 5.8, 0.05],
];

// Panggung Megastruktur 3D Silicon Die CPU Realistis
// Memvisualisasikan arsitektur internal silikon wafer 300mm fotolitografi nanometer:
// System Agent & BIU, Matriks SRAM Cache (L1, L2, L3), Monolit Dekoder Control Unit,
// Podium Register Bank 64-bit, dan Mesin Kalkulasi ALU / FPU.
export default function CpuInteriorScene({
  activeComponent,
  onSelectComponent,
  currentCycleStep = 0,
  isExecuting = false,
}) {
  return (
    <group position={[0, 0, 0]}>
      {/* 1. Wafer Silikon Fotolitografi Realistis (Substrat Mirror 300mm) */}
      <SiliconWaferSubstrate isExecuting={isExecuting} />

      {/* 2. Bus Interkoneksi Berkecepatan Tinggi (Ring Bus / Mesh Highway) */}
      <InterconnectMeshHighway isExecuting={isExecuting} />

      {/* 3. Modul 1: Bus Interface Unit (BIU) & System Agent (IMC) */}
      <BusInterfaceGateway
        isActive={activeComponent === 'biu'}
        onClick={() => onSelectComponent(CPU_COMPONENTS.find((c) => c.id === 'biu'))}
      />

      {/* 4. Modul 2: Hirarki Cache SRAM (L1, L2, L3 Cache Array) */}
      <CacheSanctuary
        isActive={activeComponent === 'cache'}
        onClick={() => onSelectComponent(CPU_COMPONENTS.find((c) => c.id === 'cache'))}
      />

      {/* 5. Modul 3: Control Unit (CU / Instruction Decoder & Microcode ROM) */}
      <ControlUnitMonolith
        isActive={activeComponent === 'cu' || currentCycleStep === 2}
        onClick={() => onSelectComponent(CPU_COMPONENTS.find((c) => c.id === 'cu'))}
      />

      {/* 6. Modul 4: Register Bank 64-bit (PC, IR, MAR, MDR, ACC/GPR) */}
      <RegisterBankPlatform
        isActive={activeComponent === 'registers' || currentCycleStep === 1 || currentCycleStep === 4}
        onClick={() => onSelectComponent(CPU_COMPONENTS.find((c) => c.id === 'registers'))}
      />

      {/* 7. Modul 5: Arithmetic Logic Unit (ALU & 64-bit Adder / Vector Engine) */}
      <ArithmeticLogicEngine
        isActive={activeComponent === 'alu' || currentCycleStep === 3}
        isExecuting={isExecuting}
        onClick={() => onSelectComponent(CPU_COMPONENTS.find((c) => c.id === 'alu'))}
      />

      {/* 8. Penanda Holografik Checkpoint Komponen CPU */}
      {CPU_COMPONENTS.map((comp) => (
        <CpuCheckpointMarker
          key={comp.id}
          component={comp}
          isActive={activeComponent === comp.id}
          onSelect={() => onSelectComponent(comp)}
        />
      ))}
    </group>
  );
}

function SiliconModuleBase({ width, depth, color }) {
  const contactCount = Math.max(10, Math.floor(width * 4));
  const contacts = useMemo(
    () => Array.from({ length: contactCount }, (_, index) => {
      const x = -width / 2 + 0.12 + (index * (width - 0.24)) / (contactCount - 1);
      return (
        <React.Fragment key={`contact-${index}`}>
          {[-1, 1].map((side) => (
            <RoundedBox
              key={`contact-${index}-${side}`}
              args={[0.07, 0.035, 0.18]}
              radius={0.012}
              smoothness={2}
              position={[x, 0.16, side * (depth / 2 + 0.015)]}
            >
              <meshStandardMaterial color="#d9a441" metalness={0.78} roughness={0.28} />
            </RoundedBox>
          ))}
        </React.Fragment>
      );
    }),
    [contactCount, depth, width]
  );

  return (
    <group>
      <RoundedBox
        args={[width, 0.62, depth]}
        radius={0.12}
        smoothness={4}
        position={[0, 0.31, 0]}
        castShadow
        receiveShadow
      >
        <meshPhysicalMaterial
          color="#18212b"
          metalness={0.55}
          roughness={0.32}
          clearcoat={0.62}
          clearcoatRoughness={0.25}
        />
      </RoundedBox>
      <RoundedBox
        args={[width - 0.2, 0.07, depth - 0.2]}
        radius={0.08}
        smoothness={3}
        position={[0, 0.64, 0]}
      >
        <meshStandardMaterial color={color} metalness={0.42} roughness={0.38} />
      </RoundedBox>
      {contacts}
      {[-1, 1].flatMap((xSide) => [-1, 1].map((zSide) => (
        <mesh
          key={`mount-${xSide}-${zSide}`}
          position={[xSide * (width / 2 - 0.18), 0.645, zSide * (depth / 2 - 0.18)]}
          castShadow
        >
          <cylinderGeometry args={[0.055, 0.055, 0.025, 12]} />
          <meshStandardMaterial color="#8b96a3" metalness={0.85} roughness={0.24} />
        </mesh>
      )))}
      {[-0.24, 0, 0.24].map((offset) => (
        <mesh key={`trace-${offset}`} position={[0, 0.68, offset * depth]}>
          <boxGeometry args={[width * 0.42, 0.012, 0.018]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.18}
            metalness={0.48}
            roughness={0.32}
          />
        </mesh>
      ))}
    </group>
  );
}

// 1. Substrat Wafer Silikon Fotolitografi
function SiliconWaferSubstrate({ isExecuting }) {
  return (
    <group position={[0, -0.3, 0]}>
      {/* Piringan Wafer Silikon 300mm dengan Refleksi Logam Halus */}
      <mesh receiveShadow>
        <cylinderGeometry args={[18, 18, 0.5, 64]} />
        <meshStandardMaterial
          color="#060c14"
          metalness={0.92}
          roughness={0.18}
        />
      </mesh>

      {/* Bezel Luar Wafer dengan Skala Sudut Aligning Notch */}
      <mesh position={[0, 0.26, 0]}>
        <ringGeometry args={[17.4, 18, 64]} />
        <meshStandardMaterial color="#38bdf8" metalness={0.9} roughness={0.1} />
      </mesh>

      <mesh position={[0, 0.272, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.2, 16.4, 96]} />
        <meshStandardMaterial
          color="#07111c"
          emissive={isExecuting ? '#7f1d35' : '#0f3c52'}
          emissiveIntensity={isExecuting ? 0.34 : 0.16}
          metalness={0.72}
          roughness={0.38}
          transparent
          opacity={0.86}
        />
      </mesh>

      {[5.4, 9.2, 13.6].map((radius, index) => (
        <mesh key={`die-ring-${radius}`} position={[0, 0.285 + index * 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[radius - 0.035, radius + 0.035, 96]} />
          <meshBasicMaterial color={isExecuting ? '#fb7185' : '#38bdf8'} transparent opacity={isExecuting ? 0.42 : 0.2} />
        </mesh>
      ))}

      {DIE_TRACE_SEGMENTS.map(([x, z, length, angle], index) => (
        <mesh key={`die-trace-${index}`} position={[x, 0.3, z]} rotation={[0, angle, 0]}>
          <boxGeometry args={[length, 0.008, 0.028]} />
          <meshBasicMaterial color={isExecuting ? '#fb7185' : '#38bdf8'} transparent opacity={isExecuting ? 0.46 : 0.24} />
        </mesh>
      ))}

      {/* Dinding Perimeter Die tipis sebagai batas fisik wafer */}
      <mesh position={[0, 0.34, 0]}>
        <cylinderGeometry args={[17.95, 17.95, 0.16, 96, 1, true]} />
        <meshStandardMaterial
          color="#172032"
          side={THREE.DoubleSide}
          metalness={0.7}
          roughness={0.28}
        />
      </mesh>

      {/* Label Substrat Silikon */}
      <Text
        position={[0, 0.28, 14.5]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.45}
        color="#38bdf8"
        fontStyle="bold"
      >
        AOK-X86_64 SILICON DIE (3nm GAAFET ARCHITECTURE)
      </Text>
    </group>
  );
}

// 2. Ring Bus / Mesh Interconnect Highway
function InterconnectMeshHighway({ isExecuting }) {
  const packetRef = useRef();

  useFrame(({ clock }) => {
    if (packetRef.current) {
      const t = clock.getElapsedTime() * 0.8;
      packetRef.current.rotation.y = t;
    }
  });

  return (
    <group position={[0, 0.05, 0]}>
      {/* Cincin Ring Bus Utama Berkecepatan Cahaya */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[7.8, 8.4, 64]} />
        <meshStandardMaterial
          color={isExecuting ? '#f43f5e' : '#00e5ff'}
          emissive={isExecuting ? '#e11d48' : '#0284c7'}
          emissiveIntensity={0.85}
          metalness={0.9}
        />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[4.8, 5.2, 48]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#0369a1"
          emissiveIntensity={0.4}
          wireframe
        />
      </mesh>

      {/* Data Highway Crossbars */}
      {[-8, 0, 8].map((x, i) => (
        <mesh key={`cross-x-${i}`} position={[x, 0, 0]}>
          <boxGeometry args={[0.25, 0.04, 16]} />
          <meshStandardMaterial
            color="#0ea5e9"
            emissive="#0284c7"
            emissiveIntensity={0.35}
          />
        </mesh>
      ))}

      {[-6, 0, 6].map((z, i) => (
        <mesh key={`cross-z-${i}`} position={[0, 0, z]}>
          <boxGeometry args={[18, 0.04, 0.25]} />
          <meshStandardMaterial
            color="#0ea5e9"
            emissive="#0284c7"
            emissiveIntensity={0.8}
          />
        </mesh>
      ))}

      {/* Paket Data Orbit Bergerak Mengitari Ring Bus */}
      <group ref={packetRef}>
        {[0, Math.PI].map((angle, i) => (
          <group key={`data-packet-${i}`} position={[Math.cos(angle) * 8.1, 0.35, Math.sin(angle) * 8.1]}>
            <mesh>
              <boxGeometry args={[0.45, 0.25, 0.7]} />
              <meshStandardMaterial
                color="#ffffff"
                emissive="#38bdf8"
                emissiveIntensity={1.25}
              />
            </mesh>
            <pointLight color="#38bdf8" intensity={1.4} distance={2} />
          </group>
        ))}
      </group>
    </group>
  );
}

// 3. Modul 1: Bus Interface Unit (BIU) & System Agent
function BusInterfaceGateway({ isActive, onClick }) {
  return (
    <group position={[-7, 0, -4]} onClick={onClick}>
      <SiliconModuleBase width={4.4} depth={3.4} color="#174158" />

      {/* Antarmuka PHY Memory Controller & PCIe Lanes */}
      {[-1.5, -0.5, 0.5, 1.5].map((x, i) => (
        <group key={`memory-lane-${i}`} position={[x, 0.8, -1.2]}>
          <mesh>
            <boxGeometry args={[0.6, 0.25, 0.6]} />
            <meshStandardMaterial
              color="#0284c7"
              emissive="#00e5ff"
              emissiveIntensity={isActive ? 2.0 : 0.6}
            />
          </mesh>
        </group>
      ))}

      {/* Gerbang Portal Komunikasi (Interconnect Ring) */}
      <mesh position={[0, 1.8, 0]}>
        <torusGeometry args={[1.5, 0.12, 16, 32]} />
        <meshStandardMaterial
          color="#00e5ff"
          emissive="#00e5ff"
          emissiveIntensity={isActive ? 2.8 : 1.2}
        />
      </mesh>

      <Text position={[0, 0.8, 0.8]} fontSize={0.22} color="#bae6fd" fontStyle="bold">
        DDR5 IMC &amp; PCIe 5.0 PHY
      </Text>

      {isActive && (
        <Float speed={2} rotationIntensity={0.05} floatIntensity={0.15}>
          <Text position={[0, 3.4, 0]} fontSize={0.24} maxWidth={4.6} lineHeight={1.1} color="#38bdf8" fontStyle="bold" anchorX="center" textAlign="center">
            BUS INTERFACE UNIT (BIU)
          </Text>
        </Float>
      )}
    </group>
  );
}

// 4. Modul 2: Hirarki Cache SRAM (L1, L2, L3 Matrix Array)
function CacheSanctuary({ isActive, onClick }) {
  return (
    <group position={[-7, 0, 4]} onClick={onClick}>
      <SiliconModuleBase width={4.8} depth={4.4} color="#14543d" />

      {/* L3 Cache: 6 Blok SRAM Macro-Cell Matriks */}
      {[-1.2, 0, 1.2].map((x, c) =>
        [-0.8, 0.8].map((z, r) => (
          <group key={`${c}-${r}`} position={[x, 0.8, z]}>
            <mesh>
              <boxGeometry args={[0.9, 0.5, 1.2]} />
              <meshStandardMaterial
                color="#064e3b"
                emissive="#10b981"
                emissiveIntensity={isActive ? 1.6 : 0.4}
              />
            </mesh>
            <Text position={[0, 0.3, 0]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.14} color="#d1fae5">
              SRAM 4MB
            </Text>
          </group>
        ))
      )}

      {/* L2 & L1 Cache Fast Tower */}
      <group position={[0, 1.3, 0]}>
        <mesh>
          <boxGeometry args={[1.2, 0.5, 1.2]} />
          <meshStandardMaterial
            color="#047857"
            emissive="#34d399"
            emissiveIntensity={isActive ? 2.2 : 0.8}
          />
        </mesh>
        <Text position={[0, 0.35, 0]} fontSize={0.18} color="#a7f3d0" fontStyle="bold">
          L1i / L1d (1ns)
        </Text>
      </group>

      {isActive && (
        <Float speed={2} rotationIntensity={0.05} floatIntensity={0.15}>
          <Text position={[0, 3.4, 0]} fontSize={0.24} maxWidth={4.8} lineHeight={1.1} color="#4ade80" fontStyle="bold" anchorX="center" textAlign="center">
            CACHE HIERARCHY (SRAM)
          </Text>
        </Float>
      )}
    </group>
  );
}

// 5. Modul 3: Control Unit (CU / Instruction Decoder & Microcode ROM)
function ControlUnitMonolith({ isActive, onClick }) {
  const pulseRef = useRef();

  useFrame(({ clock }) => {
    if (pulseRef.current && isActive) {
      const pulse = 1 + Math.sin(clock.getElapsedTime() * 6) * 0.08;
      pulseRef.current.scale.set(pulse, 1, pulse);
    }
  });

  return (
    <group position={[0, 0, -6]} onClick={onClick}>
      <SiliconModuleBase width={4.8} depth={3.8} color="#5a1830" />

      {/* Menara Dekoder Instruksi (Instruction Decoder Monolith) */}
      <group ref={pulseRef} position={[0, 1.8, 0]}>
        <RoundedBox args={[2.9, 0.48, 2.5]} radius={0.09} smoothness={4} position={[0, 0.28, 0]} castShadow>
          <meshPhysicalMaterial
            color="#202733"
            metalness={0.72}
            roughness={0.28}
            clearcoat={0.7}
            emissive="#7f1d3d"
            emissiveIntensity={isActive ? 0.7 : 0.14}
          />
        </RoundedBox>
        <RoundedBox args={[2.2, 0.24, 1.85]} radius={0.06} smoothness={3} position={[0, 0.64, 0]}>
          <meshStandardMaterial color="#53172b" metalness={0.48} roughness={0.35} />
        </RoundedBox>
        {[-0.72, -0.24, 0.24, 0.72].flatMap((x, col) => [-0.54, 0, 0.54].map((z, row) => (
          <mesh key={`decoder-cell-${col}-${row}`} position={[x, 0.79, z]}>
            <boxGeometry args={[0.32, 0.08, 0.34]} />
            <meshStandardMaterial
              color="#be365e"
              emissive="#f43f5e"
              emissiveIntensity={isActive ? 1.15 : 0.35}
              metalness={0.42}
              roughness={0.3}
            />
          </mesh>
        )))}
        <Text position={[0, 0.82, 0]} fontSize={0.14} maxWidth={2.1} color="#fff1f2" fontStyle="bold" anchorX="center">
          INSTRUCTION
        </Text>
        <Text position={[0, 0.82, 0.28]} fontSize={0.12} maxWidth={1.8} color="#fecdd3" fontStyle="bold" anchorX="center">
          DECODER
        </Text>
      </group>

      {/* Microcode ROM Array di Samping */}
      {[-1.8, 1.8].map((x, i) => (
        <group key={`register-module-${i}`} position={[x, 0.9, 0]}>
          <mesh>
            <boxGeometry args={[0.9, 0.7, 2.4]} />
            <meshStandardMaterial
              color="#4c0519"
              emissive="#fb7185"
              emissiveIntensity={isActive ? 1.4 : 0.3}
            />
          </mesh>
          <Text position={[0, 0.4, 0]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.16} color="#ffe4e6">
            MICROCODE ROM
          </Text>
        </group>
      ))}

      {isActive && (
        <Float speed={2} rotationIntensity={0.05} floatIntensity={0.15}>
          <Text position={[0, 3.8, 0]} fontSize={0.26} maxWidth={4.8} lineHeight={1.1} color="#fb7185" fontStyle="bold" anchorX="center" textAlign="center">
            CONTROL UNIT (CU)
          </Text>
        </Float>
      )}
    </group>
  );
}

// 6. Modul 4: Register Bank 64-bit Platform
function RegisterBankPlatform({ isActive, onClick }) {
  const registers = [
    { name: 'PC', desc: 'Prog. Counter', val: '0x0040' },
    { name: 'IR', desc: 'Instr. Reg', val: 'ADD R1, #5' },
    { name: 'MAR', desc: 'Mem Address', val: '0x1000' },
    { name: 'MDR', desc: 'Mem Data', val: '0x0005' },
    { name: 'RAX', desc: 'Accumulator', val: '0x000F' },
  ];

  return (
    <group position={[7, 0, 4]} onClick={onClick}>
      <SiliconModuleBase width={5.2} depth={4.4} color="#482261" />

      {/* 5 Pod Register Berjajar dengan Nilai Biner/Heksadesimal Aktif */}
      {registers.map((reg, i) => {
        const xOffset = -2.0 + i * 1.0;
        return (
          <group key={reg.name} position={[xOffset, 0.9, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.82, 0.85, 1.4]} />
              <meshStandardMaterial
                color="#3b0764"
                emissive={isActive ? '#c084fc' : '#581c87'}
                emissiveIntensity={isActive ? 1.8 : 0.4}
              />
            </mesh>
            <Text position={[0, 0.55, 0]} fontSize={0.2} color="#f3e8ff" fontStyle="bold">
              {reg.name}
            </Text>
            <Text position={[0, 0.15, 0.72]} fontSize={0.13} color="#ffffff">
              {reg.val}
            </Text>
            <Text position={[0, -0.15, 0.72]} fontSize={0.1} color="#d8b4fe">
              {reg.desc}
            </Text>
          </group>
        );
      })}

      {isActive && (
        <Float speed={2} rotationIntensity={0.05} floatIntensity={0.15}>
          <Text position={[0, 3.4, 0]} fontSize={0.24} maxWidth={5} lineHeight={1.1} color="#c084fc" fontStyle="bold" anchorX="center" textAlign="center">
            REGISTER BANK (64-BIT)
          </Text>
        </Float>
      )}
    </group>
  );
}

// 7. Modul 5: Arithmetic Logic Unit (ALU & FPU Execution Engine)
function ArithmeticLogicEngine({ isActive, isExecuting, onClick }) {
  const rotorRef = useRef();

  useFrame(({ clock }) => {
    if (rotorRef.current && (isActive || isExecuting)) {
      rotorRef.current.rotation.z = clock.getElapsedTime() * 3.5;
    }
  });

  return (
    <group position={[7, 0, -4]} onClick={onClick}>
      <SiliconModuleBase width={4.8} depth={3.8} color="#66330f" />

      {/* Paket ALU dan array unit aritmatika / logika */}
      <group position={[0, 1.6, 0]}>
        <RoundedBox args={[3.7, 0.54, 2.9]} radius={0.1} smoothness={4} position={[0, 0.34, 0]} castShadow>
          <meshPhysicalMaterial color="#34271f" metalness={0.72} roughness={0.28} clearcoat={0.6} />
        </RoundedBox>
        <RoundedBox args={[2.65, 0.24, 2.05]} radius={0.07} smoothness={3} position={[0, 0.72, 0]}>
          <meshStandardMaterial
            color="#6c3517"
            emissive={isActive ? '#ea580c' : '#7c2d12'}
            emissiveIntensity={isActive || isExecuting ? 1.05 : 0.22}
            metalness={0.52}
            roughness={0.31}
          />
        </RoundedBox>
        {[-0.78, -0.26, 0.26, 0.78].flatMap((x, lane) => [-0.62, 0, 0.62].map((z, cell) => (
          <mesh key={`alu-cell-${lane}-${cell}`} position={[x, 0.88, z]}>
            <boxGeometry args={[0.34, 0.12, 0.38]} />
            <meshStandardMaterial
              color="#f97316"
              emissive="#fb923c"
              emissiveIntensity={isActive || isExecuting ? 1.4 : 0.42}
              metalness={0.45}
              roughness={0.3}
            />
          </mesh>
        )))}

        {/* Jalur bus data yang mengelilingi die */}
        <mesh ref={rotorRef} position={[0, 0, 0]}>
          <torusGeometry args={[1.72, 0.035, 6, 48]} />
          <meshStandardMaterial color="#fb923c" emissive="#f97316" emissiveIntensity={0.7} />
        </mesh>

        <Text position={[0, 1.02, 0]} fontSize={0.17} maxWidth={2.5} color="#fff7ed" fontStyle="bold" anchorX="center">
          64-BIT CLA ADDER
        </Text>
        <Text position={[0, 1.02, 0.28]} fontSize={0.1} maxWidth={2.2} color="#fed7aa" anchorX="center">
          AND / OR / XOR / SHL / CMP
        </Text>
      </group>

      {isActive && (
        <Float speed={2} rotationIntensity={0.05} floatIntensity={0.15}>
          <Text position={[0, 3.6, 0]} fontSize={0.22} maxWidth={4.8} lineHeight={1.1} color="#fb923c" fontStyle="bold" anchorX="center" textAlign="center">
            ARITHMETIC LOGIC UNIT (ALU)
          </Text>
        </Float>
      )}
    </group>
  );
}

// 8. Marker Checkpoint Holografik Komponen CPU
function CpuCheckpointMarker({ component, isActive, onSelect }) {
  const ringRef = useRef();

  useFrame(({ clock }) => {
    if (ringRef.current && isActive) {
      ringRef.current.rotation.y = clock.getElapsedTime() * 1.6;
    }
  });

  const [x, , z] = component.roomPosition;

  return (
    <group position={[x, 0.1, z]} onClick={onSelect}>
      <mesh ref={ringRef} position={[0, 0.4, 0]}>
        <torusGeometry args={[1.15, 0.028, 6, 24]} />
        <meshBasicMaterial
          color={isActive ? '#f43f5e' : component.color || '#38bdf8'}
          wireframe
          transparent
          opacity={isActive ? 0.72 : 0.18}
        />
      </mesh>

      {isActive && (
        <pointLight
          color={component.color || '#38bdf8'}
          intensity={4.5}
          distance={4}
          position={[0, 1.2, 0]}
        />
      )}
    </group>
  );
}

