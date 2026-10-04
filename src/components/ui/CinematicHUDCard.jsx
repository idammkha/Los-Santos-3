import React, { useEffect, useState } from 'react';
import {
  Play,
  Pause,
  FastForward,
  Zap,
  ChevronRight,
  Clock,
} from 'lucide-react';
import { sound } from '../../audio/SoundEffects';

// Floating HUD Card Non-Tengah (Pojok Kanan Bawah)
// Mengambang bebas tanpa perlu tombol close: otomatis tertutup saat keluar dari area komponen
export default function CinematicHUDCard({
  component,
  currentStepIndex = 0,
  totalSteps = 5,
  isInsideCpu = false,
  isAutoCruising = true,
  dwellDuration = 3, // 3 detik berhenti jika mode tur otomatis
  isPaused = false,
  onTogglePause,
  onSkip,
  onAutoAdvance,
  onResumeAutoCruise,
  nextComponentName,
}) {
  const [timeLeft, setTimeLeft] = useState(() => dwellDuration);
  const componentId = component?.id;

  useEffect(() => {
    if (!componentId) return;
    sound.playInteractionChime();
  }, [componentId]);

  // Hitung mundur 3 detik hanya jika mode tur otomatis aktif & tidak dijeda
  useEffect(() => {
    if (!componentId || !isAutoCruising || isPaused) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0.1) {
          return 0;
        }
        return Math.max(0, prev - 0.1);
      });
    }, 100);

    return () => clearInterval(interval);
  }, [componentId, isAutoCruising, isPaused]);

  // Picu auto-advance saat timer habis (terpisah dari updater state)
  useEffect(() => {
    if (!componentId || !isAutoCruising || isPaused || timeLeft > 0) return;
    onAutoAdvance?.();
  }, [componentId, timeLeft, isAutoCruising, isPaused, onAutoAdvance]);

  if (!component) return null;

  const progressPercent = Math.max(0, Math.min(100, ((dwellDuration - timeLeft) / dwellDuration) * 100));

  return (
    <aside
      aria-label="Panel Mengambang Penjelasan Komponen AOK"
      className="cinematic-hud-panel fixed bottom-20 left-2 right-2 z-40 overflow-y-auto overscroll-contain pointer-events-auto select-none transition-all duration-300 ease-out sm:bottom-6 sm:left-auto sm:right-6"
    >
      <div className="relative min-h-full overflow-hidden rounded-2xl border border-cyan-500/40 bg-slate-900/95 p-3 text-white shadow-[0_12px_40px_rgba(0,0,0,0.7),0_0_30px_rgba(6,182,212,0.25)] backdrop-blur-xl sm:min-h-0 sm:p-5">
        {/* Garis Aksen Gradien Atas */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-cyan-500 via-sky-400 to-indigo-500" />

        {/* 1. Header & Badge Status Mengambang */}
        <div className="mb-2.5 flex flex-wrap items-start justify-between gap-2">
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
            <span className="flex min-w-0 items-center gap-1 whitespace-normal wrap-break-word rounded-full border border-cyan-500/50 bg-cyan-950/80 px-2.5 py-1 text-[10px] font-semibold uppercase leading-tight text-cyan-300 sm:text-xs">
              <Zap className="w-3 h-3 text-cyan-400" />
              {component.category || (isInsideCpu ? 'Inti Mikroarsitektur' : 'Sirkuit Motherboard')}
            </span>
            {isAutoCruising && (
              <span className="text-[10px] font-mono text-slate-400 sm:text-[11px]">
                {currentStepIndex + 1}/{totalSteps}
              </span>
            )}
          </div>

          {/* Kontrol Waktu Tur Otomatis ATAU Status Eksplorasi Bebas */}
          {isAutoCruising ? (
            <div className="flex shrink-0 items-center gap-1.5">
              <button
                onClick={onTogglePause}
                title={isPaused ? "Lanjutkan hitung mundur otomatis" : "Jeda hitung mundur untuk membaca"}
                className={`p-1.5 rounded-lg border text-xs font-medium flex items-center gap-1 transition-all ${
                  isPaused
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 hover:bg-amber-500/30'
                    : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                <span className="text-[10px] hidden sm:inline">{isPaused ? 'Lanjut' : 'Jeda'}</span>
              </button>

              <button
                onClick={onSkip}
                title="Lewati sisa waktu dan langsung meluncur ke komponen berikutnya"
                className="px-2 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-medium flex items-center gap-1 transition-all"
              >
                <span className="text-[10px]">Lewati</span>
                <FastForward className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onResumeAutoCruise}
              title="Mulai tur otomatis dari komponen ini"
              className="px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-[11px] font-medium flex items-center gap-1 transition-all"
            >
              <Play className="w-3 h-3 fill-cyan-300" />
              <span>Tur Otomatis ▶</span>
            </button>
          )}
        </div>

        {/* 2. Indikator Status: Hitung Mundur 3 Detik ATAU Indikator Area Mengambang */}
        {isAutoCruising ? (
          <div className="mb-3.5 rounded-xl border border-slate-800/80 bg-slate-950/60 p-2">
            <div className="mb-1.5 flex flex-wrap items-center justify-between gap-1 text-xs">
              <div className="flex min-w-0 items-center gap-1.5 font-medium text-cyan-300">
                <Clock className={`w-3.5 h-3.5 ${!isPaused && timeLeft > 0 ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }} />
                <span className="wrap-break-word">{isPaused ? 'Hitung Mundur Dijeda' : 'Waktu telaah komponen'}</span>
              </div>
              <span className="font-mono font-bold text-sky-400">
                {timeLeft.toFixed(1)}s
              </span>
            </div>

            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden relative">
              <div
                className={`h-full transition-all duration-100 rounded-full ${
                  isPaused
                    ? 'bg-amber-400'
                    : 'bg-linear-to-r from-cyan-500 to-sky-400'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        ) : null}

        {/* 3. Nama Komponen Nyata */}
        <h3 className="mb-1.5 min-w-0 wrap-break-word text-base font-extrabold leading-tight text-white sm:text-lg md:text-xl">
          {component.name}
        </h3>

        {/* 4. Ringkasan Singkat */}
        <p className="mb-3 wrap-break-word text-xs font-medium leading-relaxed text-cyan-200/90 sm:text-sm">
          {component.summary}
        </p>

        {/* 5. Penjelasan Mendalam (Scrollable bila panjang) */}
        <div className="mb-3 max-h-24 overflow-y-auto wrap-break-word rounded-xl border border-slate-800/60 bg-slate-950/40 p-2.5 text-xs leading-relaxed text-slate-300 scrollbar-thin scrollbar-thumb-cyan-500/30 sm:max-h-36">
          {component.description}
        </div>

        {/* 6. Parameter Akademis Kunci AOK */}
        {component.academicDetails && component.academicDetails.length > 0 && (
          <div className="mb-3">
            <div className="grid grid-cols-1 gap-1.5">
              {component.academicDetails.map((detail, idx) => (
                <div
                  key={idx}
                  className="grid min-w-0 grid-cols-1 gap-0.5 rounded-lg border border-slate-700/40 bg-slate-800/50 px-2.5 py-1.5 text-[11px] sm:grid-cols-[minmax(7rem,0.85fr)_minmax(0,1.15fr)] sm:items-center sm:gap-2"
                >
                  <span className="min-w-0 wrap-break-word font-semibold leading-snug text-cyan-300">{detail.label}:</span>
                  <span className="min-w-0 wrap-break-word text-left font-mono leading-snug text-slate-200 sm:text-right">{detail.val}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. Footer: Pratinjau Komponen Selanjutnya ATAU Petunjuk Otomatis Tutup */}
        {isAutoCruising && nextComponentName ? (
          <div className="flex flex-wrap items-center justify-between gap-1 border-t border-slate-800 pt-2 text-[11px] text-slate-400">
            <span className="flex items-center gap-1 text-slate-400">
              <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />
              Menuju:
            </span>
            <span className="font-medium text-cyan-300 truncate max-w-60">
              {nextComponentName}
            </span>
          </div>
        ) : null}
      </div>
    </aside>
  );
}
