import React from 'react';
import {
  Cpu,
  Volume2,
  VolumeX,
  BookOpen,
  Play,
  RotateCcw,
  Award,
  Compass,
} from 'lucide-react';
import { HARDWARE_STAGES, MOTHERBOARD_CHECKPOINTS, CPU_COMPONENTS } from '../../data/aokData';

export default function HUD({
  stage,
  isPowered,
  isMuted,
  onToggleMute,
  isAutoCruising,
  onToggleAutoCruise,
  onSwitchScene,
  onOpenGuide,
  onOpenQuiz,
  onStartCycleSim,
  onResetPower,
  onSelectCheckpointIndex,
  currentCheckpointIndex,
  currentCpuIndex = 0,
  onSelectCpuIndex,
}) {
  const isInsideCpu =
    stage === HARDWARE_STAGES.INSIDE_CPU ||
    stage === HARDWARE_STAGES.CYCLE_SIMULATION ||
    stage === HARDWARE_STAGES.QUIZ;

  const currentObjective = isInsideCpu
    ? CPU_COMPONENTS[currentCpuIndex]?.name || 'Modul CPU'
    : MOTHERBOARD_CHECKPOINTS[currentCheckpointIndex]?.name || 'Motherboard';
  const currentStep = isInsideCpu ? currentCpuIndex : currentCheckpointIndex;
  const stepCount = isInsideCpu ? CPU_COMPONENTS.length : MOTHERBOARD_CHECKPOINTS.length;
  const steps = isInsideCpu ? CPU_COMPONENTS : MOTHERBOARD_CHECKPOINTS;

  return (
    <div className="hud-safe-frame fixed inset-0 z-30 flex flex-col justify-between gap-3 select-none pointer-events-none">
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-2">
        <div className="pointer-events-auto flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-700/50 bg-slate-950/65 px-3 py-2 backdrop-blur-md sm:px-4">
          {/* Logo & Judul */}
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
              <Cpu className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <h2 className="truncate text-[10px] font-bold text-white sm:text-xs">
                AOK · EKSPEDISI CPU
              </h2>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                <span className={`h-1.5 w-1.5 rounded-full ${isPowered ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                {isPowered ? (isInsideCpu ? 'Inti silikon' : 'Motherboard') : 'Standby'}
              </div>
            </div>
          </div>

          {/* Tombol Aksi Cepat HUD */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={onToggleMute}
              title={isMuted ? 'Nyalakan Efek Suara' : 'Matikan Suara'}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
            >
              {isMuted ? <VolumeX className="h-4 w-4 text-rose-400" /> : <Volume2 className="h-4 w-4 text-cyan-400" />}
            </button>

            <button
              onClick={onOpenGuide}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
            >
              <BookOpen className="h-3.5 w-3.5" />
            </button>

            <button
              onClick={onOpenQuiz}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
            >
              <Award className="h-3.5 w-3.5" />
            </button>

            <button
              onClick={onResetPower}
              title="Matikan & Ulangi dari Tombol Power Casing"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-rose-500/10 hover:text-rose-300"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="pointer-events-auto flex max-w-[min(34rem,calc(100vw-3rem))] items-center gap-3 self-start rounded-lg bg-slate-950/55 px-3 py-2 backdrop-blur-sm">
        <div className="min-w-0">
          <div className="text-[9px] font-semibold uppercase text-slate-400">
            {isInsideCpu ? 'INTI SILIKON' : 'MOTHERBOARD'} · {currentStep + 1}/{stepCount}
          </div>
          <div className="truncate text-xs font-semibold text-white">{currentObjective}</div>
        </div>
        <div className="flex shrink-0 items-center gap-1" aria-label="Progres ekspedisi">
          {steps.map((step, index) => (
            <button
              key={step.id}
              title={step.name}
              aria-label={`Langkah ${index + 1}: ${step.name}`}
              aria-current={currentStep === index ? 'step' : undefined}
              onClick={() => isInsideCpu ? onSelectCpuIndex?.(index) : onSelectCheckpointIndex(index)}
              className={`h-5 w-5 rounded-full text-[9px] font-semibold transition-colors ${
                currentStep === index
                  ? 'bg-cyan-400 text-slate-950'
                  : currentStep > index
                    ? 'bg-cyan-900/80 text-cyan-200'
                    : 'bg-slate-800/80 text-slate-500 hover:text-slate-200'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>

      <div className="pointer-events-auto flex max-w-xl flex-wrap items-center gap-2">
        <button
          onClick={onToggleAutoCruise}
          className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-[11px] font-semibold transition-all sm:text-xs ${
            isAutoCruising
              ? 'border-cyan-300/70 bg-slate-950/75 text-cyan-200'
                : 'border-slate-600/70 bg-slate-950/70 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <Play className={`h-3.5 w-3.5 ${isAutoCruising ? 'fill-slate-950' : ''}`} />
          {isAutoCruising ? 'Tur Otomatis: AKTIF' : 'Mode Manual WASD'}
        </button>

        <button
          onClick={onSwitchScene}
          className="flex items-center gap-1.5 rounded-lg border border-slate-600/70 bg-slate-950/75 px-3 py-1.5 text-[11px] font-semibold text-slate-200 transition-colors hover:border-cyan-400/60 hover:text-white sm:text-xs"
        >
          <Cpu className="h-3.5 w-3.5" />
          {isInsideCpu ? 'Ke Motherboard' : 'Ke Inti Silikon CPU →'}
        </button>

        {isInsideCpu && (
          <button
            onClick={onStartCycleSim}
            className="flex items-center gap-1.5 rounded-lg border border-slate-600/70 bg-slate-950/75 px-3 py-1.5 text-[11px] font-semibold text-slate-200 transition-colors hover:border-purple-400/60 hover:text-white sm:text-xs"
          >
            <Compass className="h-3.5 w-3.5" />
            Siklus Fetch-Decode-Execute
          </button>
        )}
      </div>
    </div>
  );
}
