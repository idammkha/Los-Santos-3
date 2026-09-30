import React, { useState, useEffect, useRef } from 'react';
import GameCanvas from './components/3d/GameCanvas';
import PowerButtonOverlay from './components/ui/PowerButtonOverlay';
import HUD from './components/ui/HUD';
import ComponentDialog from './components/ui/ComponentDialog';
import InstructionCycleUI from './components/ui/InstructionCycleUI';
import QuizModal from './components/ui/QuizModal';
import AcademicGuideModal from './components/ui/AcademicGuideModal';
import ControlsGuide from './components/ui/ControlsGuide';
import {
  HARDWARE_STAGES,
  MOTHERBOARD_CHECKPOINTS,
  CPU_COMPONENTS,
} from './data/aokData';
import { sound } from './audio/SoundEffects';

export default function App() {
  // Status Game & Aliran Daya
  const [stage, setStage] = useState(HARDWARE_STAGES.POWER_OFF);
  const [isPowered, setIsPowered] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Status Karakter Elektron (VOLT)
  const [characterPos, setCharacterPos] = useState([0, 0.4, 18]);
  const [characterRotation, setCharacterRotation] = useState([0, Math.PI, 0]);
  const [isMoving, setIsMoving] = useState(false);
  const [isAutoCruising, setIsAutoCruising] = useState(true);

  // Checkpoints & Komponen Aktif
  const [currentCpIndex, setCurrentCpIndex] = useState(0);
  const [activeCheckpoint, setActiveCheckpoint] = useState('front_panel');
  const [activeComponent, setActiveComponent] = useState(null);
  const [selectedDialogComponent, setSelectedDialogComponent] = useState(null);

  // Modals & Simulasi
  const [showQuiz, setShowQuiz] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [showCycleSim, setShowCycleSim] = useState(false);
  const [currentCycleStep, setCurrentCycleStep] = useState(1);
  const [isExecuting, setIsExecuting] = useState(false);

  // Keyboard Keys Tracker
  const keysPressed = useRef({});
  const hasShownDialogForCp = useRef(-1);

  // 1. Handler Tombol Power ON (Memulai Aliran Arus)
  const handlePowerOn = () => {
    setIsPowered(true);
    setStage(HARDWARE_STAGES.PCB_JOURNEY);
    setIsAutoCruising(true);
    setCurrentCpIndex(0);
    setCharacterPos([0, 0.4, 18]);
    setActiveCheckpoint('front_panel');
    hasShownDialogForCp.current = 0;

    // Buka dialog penjelasan titik awal (Front Panel)
    setTimeout(() => {
      setSelectedDialogComponent(MOTHERBOARD_CHECKPOINTS[0]);
    }, 900);
  };

  // 2. Reset Sistem ke Kondisi Mati
  const handleResetPower = () => {
    sound.stopAmbientHum();
    setIsPowered(false);
    setStage(HARDWARE_STAGES.POWER_OFF);
    setCharacterPos([0, 0.4, 18]);
    setCharacterRotation([0, Math.PI, 0]);
    setCurrentCpIndex(0);
    setActiveCheckpoint('front_panel');
    setActiveComponent(null);
    setSelectedDialogComponent(null);
    setShowCycleSim(false);
    setShowQuiz(false);
    setShowGuide(false);
    hasShownDialogForCp.current = -1;
  };

  // 3. Toggle Mute
  const handleToggleMute = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  // 4. Berpindah Scene (Motherboard <-> Inti CPU)
  const handleSwitchScene = () => {
    sound.playPowerSurge();
    if (stage === HARDWARE_STAGES.INSIDE_CPU || stage === HARDWARE_STAGES.CYCLE_SIMULATION) {
      // Kembali ke Motherboard
      setStage(HARDWARE_STAGES.PCB_JOURNEY);
      setCharacterPos([0, 0.4, -1]);
      setActiveCheckpoint('socket');
      setActiveComponent(null);
      setShowCycleSim(false);
    } else {
      // Masuk ke Inti Silikon CPU
      setStage(HARDWARE_STAGES.INSIDE_CPU);
      setCharacterPos([0, 0.4, 0]);
      setActiveComponent(CPU_COMPONENTS.find((c) => c.id === 'cu'));
      setSelectedDialogComponent(CPU_COMPONENTS.find((c) => c.id === 'cu'));
    }
  };

  // 5. Navigasi Antar Checkpoint di Motherboard
  const handleSelectCheckpointIndex = (index) => {
    if (index >= 0 && index < MOTHERBOARD_CHECKPOINTS.length) {
      setCurrentCpIndex(index);
      const cp = MOTHERBOARD_CHECKPOINTS[index];
      setActiveCheckpoint(cp.id);
      setCharacterPos([cp.position[0], 0.4, cp.position[2]]);
      hasShownDialogForCp.current = index;
      setSelectedDialogComponent(cp);
    }
  };

  const handleNextCheckpoint = () => {
    if (currentCpIndex + 1 < MOTHERBOARD_CHECKPOINTS.length) {
      handleSelectCheckpointIndex(currentCpIndex + 1);
    } else {
      // Sampai di CPU Socket -> Langsung masuk ke dalam CPU
      setSelectedDialogComponent(null);
      handleSwitchScene();
    }
  };

  // 6. Kontrol Keyboard Manual (WASD / Panah)
  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) {
        keysPressed.current[key] = true;
        setIsAutoCruising(false); // Ambil alih kendali manual
      }
    };

    const handleKeyUp = (e) => {
      const key = e.key.toLowerCase();
      delete keysPressed.current[key];
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // 7. Loop Gerakan Karakter (Manual WASD & Auto-Cruise)
  useEffect(() => {
    if (!isPowered) return;

    const interval = setInterval(() => {
      const isInsideCpu =
        stage === HARDWARE_STAGES.INSIDE_CPU ||
        stage === HARDWARE_STAGES.CYCLE_SIMULATION;

      const keys = keysPressed.current;
      const isManualMoving =
        keys['w'] ||
        keys['s'] ||
        keys['a'] ||
        keys['d'] ||
        keys['arrowup'] ||
        keys['arrowdown'] ||
        keys['arrowleft'] ||
        keys['arrowright'];

      if (isManualMoving && !selectedDialogComponent && !showQuiz && !showGuide) {
        setIsMoving(true);
        const speed = 0.18;
        let dx = 0;
        let dz = 0;

        if (keys['w'] || keys['arrowup']) dz -= speed;
        if (keys['s'] || keys['arrowdown']) dz += speed;
        if (keys['a'] || keys['arrowleft']) dx -= speed;
        if (keys['d'] || keys['arrowright']) dx += speed;

        setCharacterPos((prev) => {
          let nx = prev[0] + dx;
          let nz = prev[2] + dz;

          // Batasi area gerak karakter
          if (isInsideCpu) {
            nx = Math.max(-12, Math.min(12, nx));
            nz = Math.max(-10, Math.min(10, nz));
          } else {
            nx = Math.max(-4, Math.min(4, nx));
            nz = Math.max(-2, Math.min(19, nz));
          }

          // Cek proximity ke komponen di dalam CPU
          if (isInsideCpu) {
            CPU_COMPONENTS.forEach((comp) => {
              const dist = Math.hypot(nx - comp.roomPosition[0], nz - comp.roomPosition[2]);
              if (dist < 2.0 && activeComponent?.id !== comp.id) {
                setActiveComponent(comp);
              }
            });
          }

          return [nx, 0.4, nz];
        });

        // Hitung sudut rotasi menghadap arah gerak
        if (dx !== 0 || dz !== 0) {
          const angle = Math.atan2(dx, dz);
          setCharacterRotation([0, angle, 0]);
        }
      } else if (isAutoCruising && !isInsideCpu && !selectedDialogComponent) {
        // Mode Perjalanan Otomatis Mengikuti Jalur Arus Motherboard
        const targetCp = MOTHERBOARD_CHECKPOINTS[currentCpIndex];
        if (targetCp) {
          const targetZ = targetCp.position[2];
          setCharacterPos((prev) => {
            const currentZ = prev[2];
            const dist = Math.abs(currentZ - targetZ);

            if (dist < 0.15) {
              // Tiba di checkpoint!
              setIsMoving(false);
              if (hasShownDialogForCp.current !== currentCpIndex) {
                hasShownDialogForCp.current = currentCpIndex;
                setSelectedDialogComponent(targetCp);
              }
              return [0, 0.4, targetZ];
            } else {
              setIsMoving(true);
              const dir = targetZ < currentZ ? -1 : 1;
              const newZ = currentZ + dir * 0.12;
              setCharacterRotation([0, dir < 0 ? Math.PI : 0, 0]);
              return [0, 0.4, newZ];
            }
          });
        }
      } else {
        setIsMoving(false);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [
    isPowered,
    isAutoCruising,
    currentCpIndex,
    stage,
    selectedDialogComponent,
    showQuiz,
    showGuide,
    activeComponent,
  ]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 font-sans select-none">
      {/* Kanvas Grafis 3D Interaktif */}
      <GameCanvas
        stage={stage}
        isPowered={isPowered}
        characterPos={characterPos}
        characterRotation={characterRotation}
        isMoving={isMoving}
        activeCheckpoint={activeCheckpoint}
        activeComponent={activeComponent}
        onSelectCheckpoint={(cp) => {
          setSelectedDialogComponent(cp);
          setActiveCheckpoint(cp.id);
        }}
        onSelectComponent={(comp) => {
          setSelectedDialogComponent(comp);
          setActiveComponent(comp);
        }}
        currentCycleStep={currentCycleStep}
        isExecuting={isExecuting}
      />

      {/* Layar Awal: Tombol Power Fisik Casing PC */}
      {!isPowered && <PowerButtonOverlay onPowerOn={handlePowerOn} />}

      {/* HUD Telemetri & Kontrol Navigasi Utama */}
      {isPowered && (
        <HUD
          stage={stage}
          isPowered={isPowered}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          isAutoCruising={isAutoCruising}
          onToggleAutoCruise={() => setIsAutoCruising((prev) => !prev)}
          onSwitchScene={handleSwitchScene}
          onOpenGuide={() => setShowGuide(true)}
          onOpenQuiz={() => setShowQuiz(true)}
          onStartCycleSim={() => setShowCycleSim(true)}
          onResetPower={handleResetPower}
          onSelectCheckpointIndex={handleSelectCheckpointIndex}
          currentCheckpointIndex={currentCpIndex}
        />
      )}

      {/* Panduan Tombol Kontrol Keyboard */}
      {isPowered && <ControlsGuide isInsideCpu={stage === HARDWARE_STAGES.INSIDE_CPU} />}

      {/* Dialog Penjelasan Akademis Komponen AOK */}
      {selectedDialogComponent && (
        <ComponentDialog
          component={selectedDialogComponent}
          onClose={() => setSelectedDialogComponent(null)}
          onNext={handleNextCheckpoint}
          hasNext={
            stage !== HARDWARE_STAGES.INSIDE_CPU &&
            currentCpIndex < MOTHERBOARD_CHECKPOINTS.length
          }
          nextLabel={
            currentCpIndex === MOTHERBOARD_CHECKPOINTS.length - 1
              ? "Masuk ke Inti Silikon CPU →"
              : "Lanjut ke Titik Berikutnya"
          }
        />
      )}

      {/* Simulasi Interaktif Siklus Instruksi (Fetch - Decode - Execute - Writeback) */}
      {showCycleSim && (
        <InstructionCycleUI
          currentStep={currentCycleStep}
          onStepChange={setCurrentCycleStep}
          onClose={() => setShowCycleSim(false)}
          onExecuteBurst={setIsExecuting}
        />
      )}

      {/* Modal Kuis Evaluasi Pemahaman AOK */}
      {showQuiz && <QuizModal onClose={() => setShowQuiz(false)} />}

      {/* Modal Diktat Referensi Akademis AOK */}
      {showGuide && <AcademicGuideModal onClose={() => setShowGuide(false)} />}
    </div>
  );
}
