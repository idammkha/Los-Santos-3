import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { HARDWARE_STAGES, MOTHERBOARD_CHECKPOINTS, CPU_COMPONENTS } from '../../data/aokData';

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

export default function MovementController({
  stage,
  isPowered,
  isTransitioningRef,
  keysPressed,
  cameraMoveRef,
  characterPosRef,
  movementVelocityRef,
  isAutoCruising,
  isDwelling,
  showQuiz,
  showGuide,
  currentCpIndex,
  currentCpuIndex,
  activeCheckpoint,
  activeComponent,
  updateCharacterPosition,
  setCharacterRotation,
  setIsMoving,
  setIsDwelling,
  setDwellingComponent,
  setActiveCheckpoint,
  setActiveComponent,
  setCurrentCpIndex,
  setCurrentCpuIndex,
}) {
  useFrame((_, delta) => {
    if (!isPowered || isTransitioningRef.current || (isDwelling && isAutoCruising)) return;

    const isInsideCpu = stage === HARDWARE_STAGES.INSIDE_CPU;
    const keys = keysPressed.current;
    const manualInput =
      keys.w || keys.s || keys.a || keys.d ||
      keys.arrowup || keys.arrowdown || keys.arrowleft || keys.arrowright;

    const velocity = movementVelocityRef.current;
    let targetVx = 0;
    let targetVz = 0;
    let moveSource = 'idle';

    if (manualInput && !showQuiz && !showGuide) {
      const forwardAmount = Number(Boolean(keys.w || keys.arrowup)) - Number(Boolean(keys.s || keys.arrowdown));
      const rightAmount = Number(Boolean(keys.d || keys.arrowright)) - Number(Boolean(keys.a || keys.arrowleft));
      const inputLength = Math.hypot(forwardAmount, rightAmount) || 1;
      const { forward, right } = cameraMoveRef.current;
      const speed = isInsideCpu ? 4.2 : 5.0;
      targetVx = ((forward[0] * forwardAmount + right[0] * rightAmount) / inputLength) * speed;
      targetVz = ((forward[1] * forwardAmount + right[1] * rightAmount) / inputLength) * speed;
      moveSource = 'manual';
    } else if (isAutoCruising) {
      const target = isInsideCpu ? CPU_COMPONENTS[currentCpuIndex]?.roomPosition : MOTHERBOARD_CHECKPOINTS[currentCpIndex]?.position;
      if (target) {
        const [cx, cy = 0.4, cz] = characterPosRef.current;
        const dx = target[0] - cx;
        const dy = (target[1] || 0.4) - cy;
        const dz = target[2] - cz;
        const dist = isInsideCpu ? Math.hypot(dx, dy, dz) : Math.hypot(dx, dz);
        const arriveDistance = isInsideCpu ? 0.26 : 0.18;

        if (dist <= arriveDistance) {
          updateCharacterPosition([target[0], target[1] || 0.4, target[2]]);
          velocity[0] = 0;
          velocity[1] = 0;
          setIsMoving(false);
          setIsDwelling(true);
          if (isInsideCpu) {
            const targetComp = CPU_COMPONENTS[currentCpuIndex];
            setDwellingComponent(targetComp);
            setActiveComponent(targetComp);
          } else {
            const targetCp = MOTHERBOARD_CHECKPOINTS[currentCpIndex];
            setDwellingComponent(targetCp);
            setActiveCheckpoint(targetCp.id);
          }
          return;
        }

        const speed = isInsideCpu ? 4.8 : 4.5;
        targetVx = (dx / dist) * speed;
        targetVz = (dz / dist) * speed;
        moveSource = 'auto';
      }
    }

    const damping = moveSource === 'idle' ? 10 : 8;
    const lerp = 1 - Math.exp(-damping * delta);
    velocity[0] += (targetVx - velocity[0]) * lerp;
    velocity[1] += (targetVz - velocity[1]) * lerp;

    const speedNow = Math.hypot(velocity[0], velocity[1]);
    if (speedNow < 0.08) {
      velocity[0] = 0;
      velocity[1] = 0;
      setIsMoving(false);
      return;
    }

    const [currentX, currentY = 0.4, currentZ] = characterPosRef.current;
    let nx = currentX + velocity[0] * delta;
    let ny = currentY;
    let nz = currentZ + velocity[1] * delta;

    if (isInsideCpu) {
      const target = CPU_COMPONENTS[currentCpuIndex]?.roomPosition;
      if (moveSource === 'auto' && target) {
        ny = THREE.MathUtils.lerp(currentY, target[1] || 0.75, 1 - Math.exp(-5.4 * delta));
      }
      const radius = Math.hypot(nx, nz);
      if (radius > 9.6) {
        nx = (nx / radius) * 9.6;
        nz = (nz / radius) * 9.6;
        velocity[0] *= 0.25;
        velocity[1] *= 0.25;
      }
    } else {
      nx = clamp(nx, -8.2, 8.2);
      nz = clamp(nz, -4.4, 20.2);
      ny = 0.4;
    }

    updateCharacterPosition([nx, ny, nz]);
    setIsMoving(true);
    setCharacterRotation([0, Math.atan2(velocity[0], velocity[1]), 0]);

    if (moveSource !== 'manual') return;

    if (isInsideCpu) {
      let nearComp = null;
      let nearIdx = -1;
      CPU_COMPONENTS.forEach((comp, idx) => {
        const dist = Math.hypot(nx - comp.roomPosition[0], nz - comp.roomPosition[2]);
        if (dist < 1.65) { nearComp = comp; nearIdx = idx; }
      });
      if (nearComp && activeComponent?.id !== nearComp.id) {
        setActiveComponent(nearComp);
        setCurrentCpuIndex(nearIdx);
        setDwellingComponent(nearComp);
        setIsDwelling(true);
      } else if (!nearComp) {
        setIsDwelling(false);
        setDwellingComponent(null);
      }
    } else {
      let nearCp = null;
      let nearIdx = -1;
      MOTHERBOARD_CHECKPOINTS.forEach((cp, idx) => {
        const dist = Math.hypot(nx - cp.position[0], nz - cp.position[2]);
        if (dist < 1.8) { nearCp = cp; nearIdx = idx; }
      });
      if (nearCp && activeCheckpoint !== nearCp.id) {
        setActiveCheckpoint(nearCp.id);
        setCurrentCpIndex(nearIdx);
        setDwellingComponent(nearCp);
        setIsDwelling(true);
      } else if (!nearCp) {
        setIsDwelling(false);
        setDwellingComponent(null);
      }
    }
  });

  return null;
}
