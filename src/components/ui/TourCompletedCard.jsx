import React from 'react';
import { Award, Compass, RotateCcw, CheckCircle } from 'lucide-react';
import { sound } from '../../audio/SoundEffects';

// Kartu Pencapaian Selesai Ekspedisi Seluruh Komponen Realistis
export default function TourCompletedCard({
  onStartCycleSim,
  onOpenQuiz,
  onRestartTour,
  onClose,
}) {
  return (
    <aside
      aria-label="Pencapaian Ekspedisi Selesai"
      className="relative z-40 w-full max-w-xl max-h-[calc(100svh-2rem)] overflow-y-auto pointer-events-auto animate-in slide-in-from-bottom-5 fade-in duration-300 select-none"
    >
      <div className="relative bg-slate-900/95 backdrop-blur-xl border border-emerald-500/50 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.8),0_0_35px_rgba(16,185,129,0.25)] p-5 text-white overflow-hidden">
        {/* Garis Aksen Hijau Emerald */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-emerald-500 via-teal-400 to-cyan-500" />

        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-semibold uppercase tracking-wider flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            Ekspedisi Selesai 100%
          </span>
        </div>

        <h3 className="text-lg md:text-xl font-extrabold text-white tracking-tight mb-1.5 flex items-center gap-2">
          <span>Arsitektur Komputer Tuntas Ditelusuri!</span>
        </h3>

        <p className="text-slate-300 text-xs leading-relaxed mb-4">
          Hebat! Anda telah mengamati seluruh aliran sinyal dari penekanan saklar daya front panel,
          regulasi tegangan VRM, generator clock kristal kuarsa, hingga ke gerbang mikroskopis
          silikon CPU (BIU, Cache SRAM, Control Unit, Register Bank, dan ALU).
        </p>

        {/* Menu Aksi Akademis Lanjutan */}
        <div className="space-y-2">
          <button
            onClick={() => {
              sound.playInteractionChime();
              onStartCycleSim();
            }}
            className="w-full flex items-center justify-between p-2.5 rounded-xl bg-linear-to-r from-purple-600/40 to-pink-600/40 hover:from-purple-600/60 hover:to-pink-600/60 border border-purple-500/50 text-white text-xs font-bold transition-all shadow-md group"
          >
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-pink-400 group-hover:rotate-45 transition-transform" />
              <span>Simulasi Siklus Mesin (Fetch-Decode-Execute)</span>
            </div>
            <span className="text-slate-300">→</span>
          </button>

          <button
            onClick={() => {
              sound.playInteractionChime();
              onOpenQuiz();
            }}
            className="w-full flex items-center justify-between p-2.5 rounded-xl bg-linear-to-r from-emerald-600/40 to-teal-600/40 hover:from-emerald-600/60 hover:to-teal-600/60 border border-emerald-500/50 text-white text-xs font-bold transition-all shadow-md group"
          >
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-300 group-hover:scale-110 transition-transform" />
              <span>Uji Pemahaman Akademis (Kuis AOK)</span>
            </div>
            <span className="text-slate-300">→</span>
          </button>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => {
                sound.playPowerSurge();
                onRestartTour();
              }}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Ulangi Tur Dari Awal</span>
            </button>

            <button
              onClick={onClose}
              className="py-2 px-3 rounded-lg bg-slate-800/60 hover:bg-slate-700 text-slate-400 text-xs border border-slate-700 transition-all"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
