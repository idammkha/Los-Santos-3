import React from 'react';
import { Cpu, Power, Zap } from 'lucide-react';

export default function BootStatusOverlay({ isExploding, bootProgress }) {
  const bootStatus = bootProgress < 32
    ? 'MENUNGGU TOMBOL POWER FISIK DI CASING'
    : bootProgress < 68
      ? 'MEMBUKA PANEL CASING & MENGALIRKAN PSU'
      : 'MEMFOKUSKAN KAMERA KE MOTHERBOARD';

  return (
    <div className="pointer-events-none absolute inset-0 z-50 flex items-end justify-center p-4 text-white sm:p-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_34%,rgba(34,211,238,0.16),rgba(2,6,23,0.82)_66%)]" />
      <div className="relative mb-3 w-full max-w-3xl overflow-hidden rounded-3xl border border-cyan-400/25 bg-slate-950/58 p-4 shadow-[0_28px_90px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl sm:p-5">
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-cyan-300 to-transparent" />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-cyan-200">
              <Cpu className="h-3.5 w-3.5" />
              Start dari model komputer nyata
            </div>
            <h1 className="text-xl font-black leading-tight text-white sm:text-2xl">
              Tekan tombol power pada casing 3D
            </h1>
            <p className="mt-1 max-w-2xl text-xs leading-relaxed text-slate-300 sm:text-sm">
              Setelah tombol ditekan, panel casing akan explode untuk memperlihatkan PSU, kabel, kipas, dan motherboard sebelum tur AOK dimulai.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
            <Power className={`h-5 w-5 ${isExploding ? 'text-emerald-300' : 'text-cyan-300'}`} />
            <div>
              <div className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Status</div>
              <div className="text-xs font-bold text-cyan-100">{isExploding ? bootStatus : 'Cari tombol POWER di front panel'}</div>
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
          <div>
            <div className="mb-1 flex justify-between font-mono text-[10px] text-cyan-300">
              <span>{bootStatus}</span>
              <span>{bootProgress}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
              <div className="h-full rounded-full bg-linear-to-r from-cyan-500 via-emerald-300 to-amber-300 transition-[width] duration-500" style={{ width: `${bootProgress}%` }} />
            </div>
          </div>
          <div className="flex items-start gap-2 text-[11px] leading-relaxed text-slate-400 sm:max-w-xs">
            <Zap className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
            <span>Front panel switch menghubungkan pin PWR_SW, PSU aktif, lalu motherboard menjadi fokus utama.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
