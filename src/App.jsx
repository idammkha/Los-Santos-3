import React, { useState, useEffect, useRef, useCallback } from 'react';
import GameCanvas from './components/3d/GameCanvas';
import BootStatusOverlay from './components/ui/BootStatusOverlay';
import HUD from './components/ui/HUD';
import CinematicHUDCard from './components/ui/CinematicHUDCard';
import TourCompletedCard from './components/ui/TourCompletedCard';
import InstructionCycleUI from './components/ui/InstructionCycleUI';
import QuizModal from './components/ui/QuizModal';
import AcademicGuideModal from './components/ui/AcademicGuideModal';
import SignalTelemetryPanel from './components/ui/SignalTelemetryPanel';
import {
  HARDWARE_STAGES,
  MOTHERBOARD_CHECKPOINTS,
  CPU_COMPONENTS,
} from './data/aokData';
import { sound } from './audio/SoundEffects';

export default function App() {
  // 1. Status Utama Sistem & Aliran Listrik
  const [stage, setStage] = useState(HARDWARE_STAGES.POWER_OFF);
  const [isPowered, setIsPowered] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isCaseExploding, setIsCaseExploding] = useState(false);
  const [bootProgress, setBootProgress] = useState(0);

  // 2. Status Karakter Elektron (VOLT)
  const [characterPos, setCharacterPos] = useState([0, 0.4, 18]);
  const characterPosRef = useRef(characterPos);
  const [characterRotation, setCharacterRotation] = useState([0, Math.PI, 0]);
  const [isMoving, setIsMoving] = useState(false);
  const [isAutoCruising, setIsAutoCruising] = useState(true);

  // 3. Status Tur Otomatis & Diam 3 Detik (3-Second Dwell)
  const [isDwelling, setIsDwelling] = useState(false);
  const [dwellingComponent, setDwellingComponent] = useState(null);
  const [isDwellPaused, setIsDwellPaused] = useState(false);
  const [screenPulse, setScreenPulse] = useState(0);
  const [screenShake, setScreenShake] = useState(0);

  // Indeks Perjalanan Komponen
  const [currentCpIndex, setCurrentCpIndex] = useState(0); // 0..4 di Motherboard
  const [currentCpuIndex, setCurrentCpuIndex] = useState(0); // 0..4 di Inti CPU
  const [activeCheckpoint, setActiveCheckpoint] = useState('front_panel');
  const [activeComponent, setActiveComponent] = useState(null);

  // 4. Modal & Fitur Akademis Tambahan
  const [showTourCompleted, setShowTourCompleted] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [showCycleSim, setShowCycleSim] = useState(false);
  const [currentCycleStep, setCurrentCycleStep] = useState(1);
  const [isExecuting, setIsExecuting] = useState(false);

  // Ref untuk Pelacak Tombol Keyboard & Transisi
  const keysPressed = useRef({});
  const isTransitioningRef = useRef(false);
  const movementVelocityRef = useRef([0, 0]);
  const cameraMoveRef = useRef({ forward: [0, -1], right: [1, 0] });

  const updateCharacterPosition = useCallback((nextPosition) => {
    characterPosRef.current = nextPosition;
    setCharacterPos(nextPosition);
  }, []);

  const triggerScenePulse = useCallback(() => {
    setScreenPulse((prev) => prev + 1);
    setScreenShake((prev) => prev + 1);
  }, []);

  useEffect(() => {
    if (!screenPulse && !screenShake) return undefined;
    const timeout = window.setTimeout(() => {
      setScreenPulse(0);
      setScreenShake(0);
    }, 520);
    return () => window.clearTimeout(timeout);
  }, [screenPulse, screenShake]);

  // Handler 1: Tombol Power Fisik Ditekan
  const handleComputerPowerButton = () => {
    if (isPowered || isCaseExploding) return;
    sound.playPowerClick();
    setBootProgress(18);
    setIsCaseExploding(true);

    window.setTimeout(() => setBootProgress(42), 280);
    window.setTimeout(() => setBootProgress(76), 780);
  };

  const handlePowerOn = () => {
    triggerScenePulse();
    setBootProgress(100);
    setIsPowered(true);
    setStage(HARDWARE_STAGES.PCB_JOURNEY);
    setIsAutoCruising(true);
    setCurrentCpIndex(0);
    setCurrentCpuIndex(0);
    updateCharacterPosition([0, 0.4, 18]);
    setCharacterRotation([0, Math.PI, 0]);
    setActiveCheckpoint('front_panel');
    setActiveComponent(null);
    setShowTourCompleted(false);

    // Langsung diam 3 detik di Front Panel untuk menjelaskan pemicu daya awal
    setTimeout(() => {
      setIsDwelling(true);
      setDwellingComponent(MOTHERBOARD_CHECKPOINTS[0]);
    }, 600);
  };

  const handleCaseExplodeComplete = () => {
    if (isPowered) return;
    sound.playPowerSurge();
    sound.startAmbientHum();
    setIsCaseExploding(false);
    handlePowerOn();
  };

  // Handler 2: Reset / Matikan Komputer
  const handleResetPower = () => {
    sound.stopAmbientHum();
    movementVelocityRef.current = [0, 0];
    setIsPowered(false);
    setIsCaseExploding(false);
    setBootProgress(0);
    setStage(HARDWARE_STAGES.POWER_OFF);
    updateCharacterPosition([0, 0.4, 18]);
    setCharacterRotation([0, Math.PI, 0]);
    setIsMoving(false);
    setIsAutoCruising(true);
    setIsDwelling(false);
    setDwellingComponent(null);
    setCurrentCpIndex(0);
    setCurrentCpuIndex(0);
    setActiveCheckpoint('front_panel');
    setActiveComponent(null);
    setShowTourCompleted(false);
    setShowCycleSim(false);
    setShowQuiz(false);
    setShowGuide(false);
    isTransitioningRef.current = false;
  };

  // Handler 3: Toggle Audio Mute
  const handleToggleMute = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  // Handler 4: Transisi Manual Antar Panggung (Motherboard <-> Inti CPU)
  const handleSwitchScene = () => {
    sound.playPowerSurge();
    movementVelocityRef.current = [0, 0];
    triggerScenePulse();
    setIsAutoCruising(false);
    setIsDwelling(false);
    setDwellingComponent(null);
    setIsMoving(false);

    if (stage === HARDWARE_STAGES.INSIDE_CPU || stage === HARDWARE_STAGES.CYCLE_SIMULATION) {
      // Kembali ke Motherboard
      setStage(HARDWARE_STAGES.PCB_JOURNEY);
      updateCharacterPosition([0, 0.4, -1]);
      setActiveCheckpoint('socket');
      setActiveComponent(null);
      setCurrentCpIndex(4);
    } else {
      // Masuk ke Inti Silikon CPU
      setStage(HARDWARE_STAGES.INSIDE_CPU);
      const firstCpuComp = CPU_COMPONENTS[0];
      updateCharacterPosition([firstCpuComp.roomPosition[0], firstCpuComp.roomPosition[1], firstCpuComp.roomPosition[2]]);
      setActiveComponent(firstCpuComp);
      setCurrentCpuIndex(0);
      setIsDwelling(true);
      setDwellingComponent(firstCpuComp);
    }
  };

  // Handler 5: Selesai Diam 3 Detik -> Otomatis Lanjut ke Komponen Berikutnya
  const handleAutoAdvance = useCallback(() => {
    triggerScenePulse();
    setIsDwelling(false);
    setDwellingComponent(null);

    const isInsideCpu = stage === HARDWARE_STAGES.INSIDE_CPU;

    if (!isInsideCpu) {
      // Di Motherboard: Lanjut ke checkpoint berikutnya
      if (currentCpIndex + 1 < MOTHERBOARD_CHECKPOINTS.length) {
        setCurrentCpIndex((prev) => prev + 1);
        setIsAutoCruising(true);
      } else {
        // Sudah melewati Socket CPU (Checkpoint terakhir di motherboard)
        // -> OTOMATIS WARP / TRANSISI MASUK KE DALAM INTI SILIKON CPU!
        isTransitioningRef.current = true;
        sound.playPowerSurge();

        setTimeout(() => {
          setStage(HARDWARE_STAGES.INSIDE_CPU);
          setCurrentCpuIndex(0);
          const firstCpuComp = CPU_COMPONENTS[0];
          updateCharacterPosition([firstCpuComp.roomPosition[0], firstCpuComp.roomPosition[1], firstCpuComp.roomPosition[2]]);
          setActiveComponent(firstCpuComp);
          isTransitioningRef.current = false;
          setIsAutoCruising(true);

          // Diam 3 detik di komponen pertama CPU (BIU)
          setTimeout(() => {
            setIsDwelling(true);
            setDwellingComponent(firstCpuComp);
          }, 350);
        }, 800);
      }
    } else {
      // Di Dalam Silikon CPU: Lanjut ke modul CPU berikutnya
      if (currentCpuIndex + 1 < CPU_COMPONENTS.length) {
        setCurrentCpuIndex((prev) => prev + 1);
        setIsAutoCruising(true);
      } else {
        // Semua modul CPU selesai dijelajahi!
        sound.playInteractionChime();
        setIsAutoCruising(false);
        setIsDwelling(false);
        setDwellingComponent(null);
        setShowTourCompleted(true);
      }
    }
  }, [stage, currentCpIndex, currentCpuIndex, triggerScenePulse, updateCharacterPosition]);

  // Handler 6: Loncat Langsung ke Checkpoint Motherboard Tertentu
  const handleSelectCheckpointIndex = (index) => {
    if (index >= 0 && index < MOTHERBOARD_CHECKPOINTS.length) {
      setCurrentCpIndex(index);
      const cp = MOTHERBOARD_CHECKPOINTS[index];
      setActiveCheckpoint(cp.id);
      updateCharacterPosition([cp.position[0], 0.4, cp.position[2]]);
      setIsDwelling(true);
      setDwellingComponent(cp);
      setIsMoving(false);
    }
  };

  // Handler 7: Loncat Langsung ke Modul CPU Tertentu
  const handleSelectCpuIndex = (index) => {
    if (index >= 0 && index < CPU_COMPONENTS.length) {
      setCurrentCpuIndex(index);
      const comp = CPU_COMPONENTS[index];
      setActiveComponent(comp);
      updateCharacterPosition([comp.roomPosition[0], comp.roomPosition[1], comp.roomPosition[2]]);
      setIsDwelling(true);
      setDwellingComponent(comp);
      setIsMoving(false);
    }
  };

  // 6. Kontrol Keyboard Manual (WASD / Panah)
  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) {
        keysPressed.current[key] = true;
        setIsAutoCruising(false); // Ambil alih kendali manual
        setIsDwelling(false); // Batalkan diam jika pengguna mulai berjalan bebas
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

  const movementControllerProps = {
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
  };

  // Nama komponen berikutnya untuk pratinjau kartu HUD
  const isInsideCpu = stage === HARDWARE_STAGES.INSIDE_CPU;
  let nextComponentName = null;
  if (!isInsideCpu) {
    if (currentCpIndex + 1 < MOTHERBOARD_CHECKPOINTS.length) {
      nextComponentName = MOTHERBOARD_CHECKPOINTS[currentCpIndex + 1].name;
    } else {
      nextComponentName = 'Masuk ke Inti Silikon CPU (BIU)';
    }
  } else {
    if (currentCpuIndex + 1 < CPU_COMPONENTS.length) {
      nextComponentName = CPU_COMPONENTS[currentCpuIndex + 1].name;
    } else {
      nextComponentName = 'Selesai Tur Silikon';
    }
  }

  return (
    <main className="fixed inset-0 w-screen h-screen overflow-hidden bg-slate-950 font-sans select-none">
      {screenPulse > 0 && (
        <div
          key={`flash-${screenPulse}`}
          className="scene-flash pointer-events-none absolute inset-0 z-40 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.28),rgba(14,165,233,0.12)_18%,transparent_58%)]"
        />
      )}

      {screenShake > 0 && (
        <div key={`shake-${screenShake}`} className="screen-shake pointer-events-none absolute inset-0 z-30" />
      )}

      {isPowered && <div className="game-scanlines pointer-events-none absolute inset-0 z-20" />}

      {/* 1. Kanvas Grafis 3D Full Screen (100vw x 100vh) */}
      <GameCanvas
        stage={stage}
        isPowered={isPowered}
        characterPos={characterPos}
        characterRotation={characterRotation}
        isMoving={isMoving}
        activeCheckpoint={activeCheckpoint}
        activeComponent={activeComponent}
        onSelectCheckpoint={(cp) => {
          const idx = MOTHERBOARD_CHECKPOINTS.findIndex((c) => c.id === cp.id);
          if (idx !== -1) handleSelectCheckpointIndex(idx);
        }}
        onSelectComponent={(comp) => {
          const idx = CPU_COMPONENTS.findIndex((c) => c.id === comp.id);
          if (idx !== -1) handleSelectCpuIndex(idx);
        }}
        currentCycleStep={currentCycleStep}
        isExecuting={isExecuting}
        isExploding={isCaseExploding}
        onPowerButtonPressed={handleComputerPowerButton}
        onExplodeComplete={handleCaseExplodeComplete}
        cameraMoveRef={cameraMoveRef}
        movementControllerProps={movementControllerProps}
      />

      {/* 2. Layar Awal: Casing Komputer & Tombol Power Nyata */}
      {!isPowered && <BootStatusOverlay isExploding={isCaseExploding} bootProgress={bootProgress} />}

      {/* 3. HUD Telemetri & Kontrol Navigasi Utama */}
      {isPowered && (
        <>
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
            onStartCycleSim={() => {
              setStage(HARDWARE_STAGES.CYCLE_SIMULATION);
              setShowCycleSim(true);
            }}
            onResetPower={handleResetPower}
            onSelectCheckpointIndex={handleSelectCheckpointIndex}
            currentCheckpointIndex={currentCpIndex}
            currentCpuIndex={currentCpuIndex}
            onSelectCpuIndex={handleSelectCpuIndex}
          />
          <SignalTelemetryPanel
            stage={stage}
            currentCheckpointIndex={currentCpIndex}
            currentCpuIndex={currentCpuIndex}
            isAutoCruising={isAutoCruising}
          />
        </>
      )}

      {/* 5. POP UP PENJELASAN NON-TENGAH (Hanya Muncul di Pojok Kanan Bawah Ketika Karakter Diam 3 Detik) */}
      {isDwelling && dwellingComponent && (
        <CinematicHUDCard
          key={dwellingComponent.id}
          component={dwellingComponent}
          currentStepIndex={isInsideCpu ? currentCpuIndex : currentCpIndex}
          totalSteps={isInsideCpu ? CPU_COMPONENTS.length : MOTHERBOARD_CHECKPOINTS.length}
          isInsideCpu={isInsideCpu}
          dwellDuration={3.0} // Diam selama 3 detik di setiap komponen
          isPaused={isDwellPaused}
          onTogglePause={() => setIsDwellPaused((prev) => !prev)}
          onSkip={handleAutoAdvance} // Lewati langsung ke komponen berikutnya
          onAutoAdvance={handleAutoAdvance} // Timer 3 detik habis -> otomatis lanjut
          nextComponentName={nextComponentName}
          isAutoCruising={isAutoCruising}
          onResumeAutoCruise={() => setIsAutoCruising(true)}
        />
      )}

      {/* 6. Kartu Selesai Tur Seluruh Komputer */}
      {showTourCompleted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/55 p-4 backdrop-blur-sm">
          <TourCompletedCard
            onStartCycleSim={() => {
              setShowTourCompleted(false);
              setStage(HARDWARE_STAGES.CYCLE_SIMULATION);
              setShowCycleSim(true);
            }}
            onOpenQuiz={() => {
              setShowTourCompleted(false);
              setShowQuiz(true);
            }}
            onRestartTour={() => {
              setShowTourCompleted(false);
              handlePowerOn();
            }}
            onClose={() => setShowTourCompleted(false)}
          />
        </div>
      )}

      {/* 7. Simulasi Interaktif Siklus Instruksi (Fetch - Decode - Execute - Writeback) */}
      {showCycleSim && (
        <InstructionCycleUI
          currentStep={currentCycleStep}
          onStepChange={setCurrentCycleStep}
          onClose={() => {
            setShowCycleSim(false);
            setStage(HARDWARE_STAGES.INSIDE_CPU);
          }}
          onExecuteBurst={setIsExecuting}
        />
      )}

      {/* 8. Modal Kuis Evaluasi Pemahaman Akademis AOK */}
      {showQuiz && <QuizModal onClose={() => setShowQuiz(false)} />}

      {/* 9. Modal Diktat Referensi Akademis AOK */}
      {showGuide && <AcademicGuideModal onClose={() => setShowGuide(false)} />}
    </main>
  );
}
