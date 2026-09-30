import React from 'react';
import {
  Zap,
  Cpu,
  Clock,
  Volume2,
  VolumeX,
  BookOpen,
  HelpCircle,
  Play,
  RotateCcw,
  Layers,
  Award,
  Compass,
} from 'lucide-react';
import { HARDWARE_STAGES, MOTHERBOARD_CHECKPOINTS } from '../../data/aokData';

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
}) {
  const isInsideCpu =
    stage === HARDWARE_STAGES.INSIDE_CPU ||
    stage === HARDWARE_STAGES.CYCLE_SIMULATION ||
    stage === HARDWARE_STAGES.QUIZ;

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 z-40 select-none">
      {/* Top Bar HUD */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/85 backdrop-blur-md border border-slate-700/60 rounded-xl px-4 py-2.5 shadow-lg pointer-events-auto">
        {/* Logo & Judul */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Cpu className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide">
              AOK 3D SIMULATOR: CPU &amp; POWER FLOW
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-ping" />
                STATUS: {isPowered ? 'SYSTEM LIVE' : 'STANDBY'}
              </span>
              <span>•</span>
              <span className="text-cyan-400 font-mono">
                {isInsideCpu ? 'LOKASI: SILICON DIE (INTI CPU)' : 'LOKASI: MOTHERBOARD PCB'}
              </span>
            </div>
          </div>
        </div>

        {/* Telemetri Perangkat Keras AOK */}
        <div className="hidden md:flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800/80 border border-slate-700 text-slate-300">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>VCORE: <strong>1.22 V</strong></span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800/80 border border-slate-700 text-slate-300">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>CLOCK: <strong>3.60 GHz</strong></span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800/80 border border-slate-700 text-slate-300">
            <Layers className="w-3.5 h-3.5 text-purple-400" />
            <span>FABRIKASI: <strong>4 nm FinFET</strong></span>
          </div>
        </div>

        {/* Tombol Aksi Cepat HUD */}
        <div className="flex items-center gap-2">
          {/* Mute/Unmute */}
          <button
            onClick={onToggleMute}
            title={isMuted ? 'Nyalakan Suara' : 'Matikan Suara'}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          </button>

          {/* Buku Panduan Akademis */}
          <button
            onClick={onOpenGuide}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/40 text-xs font-medium transition-all"
          >
            <BookOpen className="w-4 h-4" />
            <span className="hidden sm:inline">Diktat Materi AOK</span>
          </button>

          {/* Kuis Evaluasi */}
          <button
            onClick={onOpenQuiz}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 text-xs font-medium transition-all"
          >
            <Award className="w-4 h-4" />
            <span className="hidden sm:inline">Uji Pemahaman</span>
          </button>

          {/* Reset / Matikan */}
          <button
            onClick={onResetPower}
            title="Matikan & Ulangi dari Tombol Power"
            className="p-2 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-800/50 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Checkpoint Timeline Bar (Hanya di Motherboard) */}
      {!isInsideCpu && (
        <div className="self-center bg-slate-900/90 backdrop-blur-md border border-slate-700/70 rounded-full px-4 py-2 shadow-xl flex items-center gap-2 pointer-events-auto text-xs">
          <span className="text-slate-400 font-semibold px-2">Jalur Arus:</span>
          {MOTHERBOARD_CHECKPOINTS.map((cp, idx) => {
            const isPassed = currentCheckpointIndex >= idx;
            const isCurrent = currentCheckpointIndex === idx;
            return (
              <button
                key={cp.id}
                onClick={() => onSelectCheckpointIndex(idx)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all ${
                  isCurrent
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_12px_#06b6d4]'
                    : isPassed
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-700/50'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>{idx + 1}.</span>
                <span>{cp.name.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Bottom Bar: Kontrol Navigasi & Misi */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/85 backdrop-blur-md border border-slate-700/60 rounded-xl p-3 shadow-lg pointer-events-auto">
        {/* Toggle Mode Cruise vs Manual */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleAutoCruise}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
              isAutoCruising
                ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <Play className={`w-3.5 h-3.5 ${isAutoCruising ? 'fill-slate-950' : ''}`} />
            {isAutoCruising ? 'Mode Auto-Perjalanan: AKTIF' : 'Mode Manual WASD (Klik untuk Auto)'}
          </button>

          <span className="hidden lg:inline text-xs text-slate-400">
            {isAutoCruising
              ? 'Karakter otomatis bergerak mengikuti arus daya ke CPU.'
              : 'Gunakan tombol [W, A, S, D] atau [Panah] untuk berjalan bebas.'}
          </span>
        </div>

        {/* Tombol Berpindah Lokasi: Motherboard <-> CPU */}
        <div className="flex items-center gap-2">
          <button
            onClick={onSwitchScene}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-md transition-all border border-cyan-400/40"
          >
            <Cpu className="w-4 h-4" />
            {isInsideCpu ? 'Kembali ke Motherboard' : 'Masuk ke Inti Silikon CPU ->'}
          </button>

          {isInsideCpu && (
            <button
              onClick={onStartCycleSim}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-xs shadow-md transition-all border border-purple-400/40"
            >
              <Compass className="w-4 h-4" />
              Simulasi Fetch-Decode-Execute
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
