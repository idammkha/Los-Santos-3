import React, { useEffect, useRef, useState } from 'react';
import { Power, Zap, Cpu } from 'lucide-react';
import { sound } from '../../audio/SoundEffects';

// Layar Awal: Casing PC & Tombol Power Interaktif
export default function PowerButtonOverlay({ onPowerOn }) {
  const [isPressing, setIsPressing] = useState(false);
  const [bootProgress, setBootProgress] = useState(0);
  const timersRef = useRef([]);

  useEffect(() => () => timersRef.current.forEach(window.clearTimeout), []);

  const handlePress = () => {
    setIsPressing(true);
    setBootProgress(8);
    sound.playPowerClick();

    timersRef.current.push(window.setTimeout(() => setBootProgress(32), 550));
    timersRef.current.push(window.setTimeout(() => {
      sound.playPowerSurge();
      sound.startAmbientHum();
      setBootProgress(68);
    }, 1200));
    timersRef.current.push(window.setTimeout(() => {
      setBootProgress(100);
      onPowerOn();
    }, 2050));
  };

  const bootStatus = bootProgress < 32
    ? 'INITIALIZING POWER RAILS'
    : bootProgress < 68
      ? 'SYNCHRONIZING CLOCK & BUS'
      : 'MAPPING CPU SILICON';

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/90 p-4 text-white backdrop-blur-md select-none sm:p-6">
      <div className="boot-scan pointer-events-none absolute inset-0 opacity-70" />
      <div className="relative my-auto w-full max-w-xl overflow-hidden rounded-2xl border border-cyan-500/30 bg-linear-to-b from-slate-900/95 via-slate-900/95 to-slate-950/95 p-5 text-center shadow-[0_0_70px_rgba(6,182,212,0.18)] sm:p-8">
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-cyan-300 to-transparent" />
        {/* Badge Akademis */}
        <div className="mb-5 inline-flex max-w-full items-center gap-2 rounded-full border border-cyan-500/40 bg-cyan-950/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-cyan-400 sm:text-xs">
          <Cpu className="w-3.5 h-3.5" />
          Simulasi Akademis AOK: Arsitektur & Organisasi Komputer
        </div>

        <h1 className="mb-3 text-2xl font-extrabold text-white drop-shadow-[0_0_18px_rgba(34,211,238,0.35)] sm:text-3xl">
          Ekspedisi Arsitektur CPU
        </h1>
        <p className="mb-6 text-sm leading-relaxed text-slate-400 sm:mb-8">
          Jelajahi perjalanan sinyal listrik dari saat tombol power ditekan, mengalir menyusuri
          motherboard bersama karakter elektron <strong className="text-cyan-300">VOLT</strong>, hingga menembus masuk ke dalam
          jantung mikroarsitektur <strong className="text-violet-300">Processor / CPU</strong>.
        </p>

        {/* Tombol Power Interaktif Casing */}
        <div className="my-6 flex flex-col items-center justify-center gap-4">
          <button
            onClick={handlePress}
            disabled={isPressing}
            className={`group relative flex h-24 w-24 items-center justify-center rounded-full transition-all duration-300 sm:h-28 sm:w-28 ${
              isPressing
                ? 'scale-90 bg-cyan-500 shadow-[0_0_60px_#06b6d4]'
                : 'bg-linear-to-b from-slate-800 to-slate-900 border-2 border-slate-700 hover:border-cyan-400 hover:scale-105 shadow-[0_10px_30px_rgba(0,0,0,0.5)]'
            }`}
          >
            <div className="absolute inset-0 rounded-full bg-cyan-400/10 group-hover:bg-cyan-400/20 transition-colors animate-pulse" />
            <Power
              className={`w-12 h-12 transition-all duration-300 ${
                isPressing
                  ? 'text-slate-950 rotate-90 scale-110'
                  : 'text-cyan-400 group-hover:text-cyan-300 group-hover:scale-110'
              }`}
            />
          </button>
          <span className="text-center text-[10px] font-medium uppercase tracking-widest text-cyan-400/80 sm:text-xs">
            {isPressing ? bootStatus : 'KLIK UNTUK MENYALAKAN KOMPUTER'}
          </span>
          {isPressing && (
            <div className="w-full max-w-xs" aria-live="polite">
              <div className="mb-1 flex justify-between font-mono text-[10px] text-cyan-300">
                <span>{bootStatus}</span><span>{bootProgress}%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
                <div className="h-full rounded-full bg-linear-to-r from-cyan-500 to-sky-300 transition-[width] duration-500" style={{ width: `${bootProgress}%` }} />
              </div>
            </div>
          )}
        </div>

        {/* Catatan Sinyal AOK */}
        <div className="mt-7 flex items-start gap-3 border-t border-slate-800 pt-5 text-left text-xs text-slate-400 sm:mt-8">
          <Zap className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-slate-200">Tahap Pertama (Front Panel):</strong>
            <p className="mt-0.5">
              Menghubungkan pin <code className="text-cyan-300">PWR_SW</code> memicu sinyal{' '}
              <code className="text-cyan-300">PS_ON#</code> ke Power Supply untuk mengalirkan 12V ke
              motherboard dan membangkitkan karakter elektron.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
