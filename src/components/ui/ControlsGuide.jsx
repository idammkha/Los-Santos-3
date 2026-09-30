import React from 'react';
import { Navigation, MousePointer, Info } from 'lucide-react';

export default function ControlsGuide({ isInsideCpu }) {
  return (
    <div className="absolute bottom-20 left-4 z-30 pointer-events-none hidden sm:flex flex-col gap-1.5 bg-slate-900/80 backdrop-blur-sm border border-slate-700/60 rounded-xl p-3 text-[11px] text-slate-300 max-w-xs shadow-lg select-none">
      <div className="flex items-center gap-1.5 text-cyan-400 font-bold uppercase tracking-wider text-[10px]">
        <Info className="w-3.5 h-3.5" />
        Petunjuk Kontrol 3D:
      </div>
      <div className="flex items-center gap-2">
        <span className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-cyan-300 font-bold">
          W A S D / Panah
        </span>
        <span>: Jalankan Karakter Volt</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-cyan-300 font-bold">
          Klik Kiri + Geser
        </span>
        <span>: Putar Sudut Kamera</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-cyan-300 font-bold">
          Scroll Mouse
        </span>
        <span>: Zoom In / Out</span>
      </div>
      <div className="text-[10px] text-slate-400 mt-0.5">
        *Klik objek 3D untuk membuka dossier edukasi akademis.
      </div>
    </div>
  );
}
