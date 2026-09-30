import React, { useState } from 'react';
import { Power, Zap, Cpu, ArrowRight } from 'lucide-react';
import { sound } from '../../audio/SoundEffects';

// Layar Awal: Casing PC & Tombol Power Interaktif
export default function PowerButtonOverlay({ onPowerOn }) {
  const [isPressing, setIsPressing] = useState(false);

  const handlePress = () => {
    setIsPressing(true);
    sound.playPowerClick();

    setTimeout(() => {
      sound.playPowerSurge();
      sound.startAmbientHum();
      onPowerOn();
    }, 400);
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md text-white select-none">
      <div className="relative max-w-lg w-full mx-4 p-8 rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 border border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.15)] text-center">
        {/* Badge Akademis */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 text-xs font-semibold tracking-wider uppercase mb-5">
          <Cpu className="w-3.5 h-3.5" />
          Simulasi Akademis AOK: Arsitektur & Organisasi Komputer
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight text-white mb-3">
          Ekspedisi Arsitektur CPU
        </h1>
        <p className="text-slate-400 text-sm leading-relaxed mb-8">
          Jelajahi perjalanan sinyal listrik dari saat tombol power ditekan, mengalir menyusuri
          motherboard bersama karakter elektron <strong>VOLT</strong>, hingga menembus masuk ke dalam
          jantung mikroarsitektur <strong>Processor / CPU</strong>.
        </p>

        {/* Tombol Power Interaktif Casing */}
        <div className="flex flex-col items-center justify-center gap-4 my-6">
          <button
            onClick={handlePress}
            disabled={isPressing}
            className={`group relative flex items-center justify-center w-28 h-28 rounded-full transition-all duration-300 ${
              isPressing
                ? 'scale-90 bg-cyan-500 shadow-[0_0_60px_#06b6d4]'
                : 'bg-gradient-to-b from-slate-800 to-slate-900 border-2 border-slate-700 hover:border-cyan-400 hover:scale-105 shadow-[0_10px_30px_rgba(0,0,0,0.5)]'
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
          <span className="text-xs font-medium text-cyan-400/80 tracking-widest uppercase">
            {isPressing ? 'MENGALIRKAN DAYA...' : 'KLIK UNTUK MENYALAKAN KOMPUTER'}
          </span>
        </div>

        {/* Catatan Sinyal AOK */}
        <div className="mt-8 pt-5 border-t border-slate-800 text-left text-xs text-slate-400 flex items-start gap-3">
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
