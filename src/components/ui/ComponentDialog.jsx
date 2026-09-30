import React, { useEffect } from 'react';
import { X, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';
import { sound } from '../../audio/SoundEffects';

// Dialog Penjelasan Akademis saat Karakter Berada di Komponen Terkait
export default function ComponentDialog({
  component,
  onClose,
  onNext,
  hasNext = false,
  nextLabel = "Lanjut ke Titik Berikutnya",
}) {
  useEffect(() => {
    if (component) {
      sound.playInteractionChime();
    }
  }, [component]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!component) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
      className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm select-none"
    >
      <div className="relative max-w-xl w-full bg-slate-900/95 border border-cyan-500/40 rounded-2xl shadow-[0_0_40px_rgba(6,182,212,0.25)] p-6 text-white animate-in fade-in zoom-in duration-200">
        {/* Tombol Tutup Silang */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Kategori */}
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
            {component.category || 'Komponen Arsitektur'}
          </span>
        </div>

        {/* Nama Komponen */}
        <h3 className="text-2xl font-extrabold text-white tracking-tight mb-2">
          {component.name}
        </h3>

        {/* Ringkasan Singkat */}
        <p className="text-cyan-200/90 text-sm font-medium mb-4 pb-3 border-b border-slate-800">
          {component.summary}
        </p>

        {/* Penjelasan Mendalam */}
        <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-line mb-6 bg-slate-950/50 p-4 rounded-xl border border-slate-800/80">
          {component.description}
        </div>

        {/* Tabel Parameter Teknis / Nilai Akademis AOK */}
        {component.academicDetails && component.academicDetails.length > 0 && (
          <div className="mb-6">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Parameter &amp; Konsep AOK Kunci:
            </h4>
            <div className="grid grid-cols-1 gap-2">
              {component.academicDetails.map((detail, idx) => (
                <div
                  key={idx}
                  className="flex items-start justify-between gap-3 text-xs bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/50"
                >
                  <span className="text-slate-400 font-medium">{detail.label}:</span>
                  <span className="text-cyan-300 font-semibold text-right">{detail.val}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tombol Aksi */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
          >
            Tutup
          </button>
          {hasNext && (
            <button
              onClick={onNext}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all cursor-pointer"
            >
              <span>{nextLabel}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
