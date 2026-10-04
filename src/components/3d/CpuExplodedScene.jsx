import React, { useMemo, useRef } from 'react';
import { Text, Float, RoundedBox } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CPU_COMPONENTS } from '../../data/aokData';

const COMPONENT_META = {
  biu: { size: [4.6, 0.62, 3.4], color: '#00e5ff', title: 'TOP I/O LAYER', subtitle: 'DDR5 IMC / PCIe PHY / System Agent' },
  cache: { size: [5.2, 0.62, 4.2], color: '#39ff14', title: 'CACHE SRAM SLAB', subtitle: 'L1 + L2 + shared L3 macro arrays' },
  cu: { size: [4.5, 0.62, 3.5], color: '#ff007f', title: 'CONTROL DECODE FLOOR', subtitle: 'Instruction decoder + microcode ROM' },
  alu: { size: [4.6, 0.62, 3.6], color: '#ff9100', title: 'EXECUTION ENGINE FLOOR', subtitle: 'ALU / shifter / flag logic' },
  registers: { size: [5.0, 0.62, 3.8], color: '#b026ff', title: 'REGISTER FOUNDATION', subtitle: 'PC / IR / MAR / MDR / ACC' },
};

function useActivePulse(isActive, speed = 4) {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const pulse = isActive ? 1 + Math.sin(clock.elapsedTime * speed) * 0.04 : 1;
    ref.current.scale.set(pulse, 1, pulse);
  });
  return ref;
}

function ExplodedLayer({ component, index, isActive, isCycleActive, isExecuting, onSelect }) {
  const meta = COMPONENT_META[component.id];
  const [x, y, z] = component.roomPosition;
  const [width, height, depth] = meta.size;
  const pulseRef = useActivePulse(isActive || isCycleActive || isExecuting, component.id === 'alu' ? 8 : 4);
  const labelColor = isActive || isCycleActive ? meta.color : '#94a3b8';

  return (
    <group position={[x, y, z]} onClick={onSelect}>
      <Float speed={1.2 + index * 0.15} floatIntensity={0.04} rotationIntensity={0.015}>
        <group ref={pulseRef}>
          <RoundedBox args={[width, height, depth]} radius={0.16} smoothness={4} castShadow receiveShadow>
            <meshPhysicalMaterial
              color="#141b25"
              metalness={0.58}
              roughness={0.3}
              clearcoat={0.7}
              emissive={meta.color}
              emissiveIntensity={isActive || isCycleActive ? 0.26 : 0.06}
            />
          </RoundedBox>
          <RoundedBox args={[width - 0.36, 0.08, depth - 0.36]} radius={0.1} smoothness={3} position={[0, height / 2 + 0.08, 0]}>
            <meshStandardMaterial color={meta.color} metalness={0.46} roughness={0.32} emissive={meta.color} emissiveIntensity={isActive || isCycleActive ? 0.9 : 0.22} />
          </RoundedBox>
          <LayerDetails componentId={component.id} isActive={isActive || isCycleActive || isExecuting} color={meta.color} />
        </group>
      </Float>

      <mesh position={[0, -0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[Math.max(width, depth) * 0.46, Math.max(width, depth) * 0.54, 48]} />
        <meshBasicMaterial color={meta.color} transparent opacity={isActive ? 0.5 : 0.18} />
      </mesh>

      <Text position={[0, 1.05, depth / 2 + 0.38]} fontSize={0.24} maxWidth={width + 0.4} color={labelColor} fontStyle="bold" anchorX="center" textAlign="center">
        {meta.title}
      </Text>
      <Text position={[0, 0.72, depth / 2 + 0.38]} fontSize={0.13} maxWidth={width} color="#cbd5e1" anchorX="center" textAlign="center">
        {meta.subtitle}
      </Text>
    </group>
  );
}

function LayerDetails({ componentId, isActive, color }) {
  if (componentId === 'cache') {
    return (
      <group position={[0, 0.58, 0]}>
        {[-1.5, -0.5, 0.5, 1.5].flatMap((x, col) => [-0.9, 0, 0.9].map((z, row) => (
          <mesh key={`${col}-${row}`} position={[x, 0.1, z]}>
            <boxGeometry args={[0.7, 0.12, 0.54]} />
            <meshStandardMaterial color="#064e3b" emissive={color} emissiveIntensity={isActive ? 0.9 : 0.24} />
          </mesh>
        )))}
      </group>
    );
  }

  if (componentId === 'registers') {
    return (
      <group position={[0, 0.62, 0]}>
        {['PC', 'IR', 'MAR', 'MDR', 'ACC'].map((name, i) => (
          <group key={name} position={[-1.8 + i * 0.9, 0.05, 0]}>
            <mesh>
              <boxGeometry args={[0.58, 0.22, 1.15]} />
              <meshStandardMaterial color="#3b0764" emissive={color} emissiveIntensity={isActive ? 1.0 : 0.28} />
            </mesh>
            <Text position={[0, 0.18, 0]} fontSize={0.16} color="#f3e8ff" fontStyle="bold">
              {name}
            </Text>
          </group>
        ))}
      </group>
    );
  }

  if (componentId === 'alu') {
    return (
      <group position={[0, 0.68, 0]}>
        <mesh>
          <torusGeometry args={[1.25, 0.04, 8, 42]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={isActive ? 1.2 : 0.35} />
        </mesh>
        {[-0.72, -0.24, 0.24, 0.72].map((x) => (
          <mesh key={x} position={[x, 0.05, 0]}>
            <boxGeometry args={[0.3, 0.16, 1.9]} />
            <meshStandardMaterial color="#f97316" emissive={color} emissiveIntensity={isActive ? 1.0 : 0.25} />
          </mesh>
        ))}
      </group>
    );
  }

  if (componentId === 'cu') {
    return (
      <group position={[0, 0.66, 0]}>
        <RoundedBox args={[2.5, 0.22, 1.8]} radius={0.06} smoothness={3}>
          <meshStandardMaterial color="#53172b" emissive={color} emissiveIntensity={isActive ? 1.0 : 0.28} />
        </RoundedBox>
        <Text position={[0, 0.2, 0]} fontSize={0.16} color="#ffe4e6" fontStyle="bold">
          OPCODE DECODER
        </Text>
      </group>
    );
  }

  return (
    <group position={[0, 0.66, 0]}>
      {[-1.2, -0.4, 0.4, 1.2].map((x) => (
        <mesh key={x} position={[x, 0.05, 0]}>
          <boxGeometry args={[0.55, 0.18, 1.6]} />
          <meshStandardMaterial color="#0284c7" emissive={color} emissiveIntensity={isActive ? 1.1 : 0.32} />
        </mesh>
      ))}
    </group>
  );
}

function VerticalSignalSpine({ isExecuting }) {
  const packetRef = useRef();
  const curve = useMemo(() => {
    const points = CPU_COMPONENTS.map((component) => new THREE.Vector3(...component.roomPosition));
    return new THREE.CatmullRomCurve3(points);
  }, []);
  const tubeGeometry = useMemo(() => new THREE.TubeGeometry(curve, 96, 0.05, 8, false), [curve]);

  useFrame(({ clock }) => {
    if (!packetRef.current) return;
    const point = curve.getPointAt((clock.elapsedTime * 0.12) % 1);
    packetRef.current.position.copy(point);
  });

  return (
    <group>
      <mesh geometry={tubeGeometry}>
        <meshStandardMaterial color="#38bdf8" emissive={isExecuting ? '#fb7185' : '#0284c7'} emissiveIntensity={isExecuting ? 0.85 : 0.48} metalness={0.78} roughness={0.2} />
      </mesh>
      <group ref={packetRef}>
        <mesh>
          <sphereGeometry args={[0.16, 16, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <pointLight color="#38bdf8" intensity={2.2} distance={3} />
      </group>
    </group>
  );
}

function ExplodedDieFrame() {
  return (
    <group position={[0, -0.25, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <cylinderGeometry args={[8.8, 8.8, 0.28, 96]} />
        <meshPhysicalMaterial color="#050b12" metalness={0.86} roughness={0.22} clearcoat={0.5} />
      </mesh>
      {[2.8, 5.6, 8.4].map((radius) => (
        <mesh key={radius} position={[0, 0.18, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[radius - 0.035, radius + 0.035, 96]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.18} />
        </mesh>
      ))}
      <Text position={[0, 0.22, 7.2]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.35} color="#38bdf8" fontStyle="bold">
        EXPLODED SILICON DIE STACK - VIEW FROM ABOVE TO BELOW
      </Text>
    </group>
  );
}

function CpuMarker({ component, isActive, onSelect }) {
  const [x, y, z] = component.roomPosition;
  return (
    <group position={[x, y + 0.02, z]} onClick={onSelect}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.82, 1.02, 32]} />
        <meshBasicMaterial color={isActive ? '#f43f5e' : component.color} transparent opacity={isActive ? 0.72 : 0.26} />
      </mesh>
      {isActive && <pointLight color={component.color} intensity={4.2} distance={4.8} position={[0, 0.8, 0]} />}
    </group>
  );
}

export default function CpuExplodedScene({ activeComponent, onSelectComponent, currentCycleStep = 0, isExecuting = false }) {
  const cycleHighlights = {
    1: 'registers',
    2: 'cu',
    3: 'alu',
    4: 'registers',
  };

  return (
    <group>
      <ExplodedDieFrame />
      <VerticalSignalSpine isExecuting={isExecuting} />
      {CPU_COMPONENTS.map((component, index) => (
        <ExplodedLayer
          key={component.id}
          component={component}
          index={index}
          isActive={activeComponent === component.id}
          isCycleActive={cycleHighlights[currentCycleStep] === component.id}
          isExecuting={isExecuting && component.id === 'alu'}
          onSelect={() => onSelectComponent(component)}
        />
      ))}
      {CPU_COMPONENTS.map((component) => (
        <CpuMarker
          key={`marker-${component.id}`}
          component={component}
          isActive={activeComponent === component.id}
          onSelect={() => onSelectComponent(component)}
        />
      ))}
    </group>
  );
}
