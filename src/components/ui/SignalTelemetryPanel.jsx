import React, { useMemo } from 'react';
import { Activity, Binary, Cpu, Gauge, RadioTower, Zap } from 'lucide-react';
import { CPU_COMPONENTS, HARDWARE_STAGES, MOTHERBOARD_CHECKPOINTS } from '../../data/aokData';

const STAGE_COPY = {
  [HARDWARE_STAGES.PCB_JOURNEY]: 'Power path sedang ditelusuri di motherboard.',
  [HARDWARE_STAGES.INSIDE_CPU]: 'Sinyal telah masuk ke die silikon CPU.',
  [HARDWARE_STAGES.CYCLE_SIMULATION]: 'Siklus instruksi sedang divisualkan.',
  [HARDWARE_STAGES.QUIZ]: 'Mode evaluasi pemahaman aktif.',
};

function MetricPill({ icon: Icon, label, value, tone = 'cyan' }) {
  const toneClass = tone === 'amber'
    ? 'border-amber-400/25 bg-amber-400/10 text-amber-200'
    : tone === 'emerald'
      ? 'border-emerald-400/25 bg-emerald-400/10 text-emerald-200'
      : 'border-cyan-400/25 bg-cyan-400/10 text-cyan-200';

  return (
    <div className={`rounded-xl border px-3 py-2 ${toneClass}`}>
      <div className="mb-1 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] opacity-80">
        <Icon className="h-3 w-3" />
        {label}
      </div>
      <div className="font-mono text-sm font-black text-white">{value}</div>
    </div>
  );
}

export default function SignalTelemetryPanel({ stage, currentCheckpointIndex, currentCpuIndex, isAutoCruising }) {
  const isInsideCpu =
    stage === HARDWARE_STAGES.INSIDE_CPU ||
    stage === HARDWARE_STAGES.CYCLE_SIMULATION ||
    stage === HARDWARE_STAGES.QUIZ;

  const currentNode = isInsideCpu
    ? CPU_COMPONENTS[currentCpuIndex] || CPU_COMPONENTS[0]
    : MOTHERBOARD_CHECKPOINTS[currentCheckpointIndex] || MOTHERBOARD_CHECKPOINTS[0];

  const progress = useMemo(() => {
    const list = isInsideCpu ? CPU_COMPONENTS : MOTHERBOARD_CHECKPOINTS;
    const index = isInsideCpu ? currentCpuIndex : currentCheckpointIndex;
    return Math.round(((index + 1) / list.length) * 100);
  }, [currentCheckpointIndex, currentCpuIndex, isInsideCpu]);

  const signalBits = useMemo(() => {
    const seed = `${currentNode?.id || 'boot'}-${stage}`;
    return Array.from({ length: 16 }, (_, index) => (seed.charCodeAt(index % seed.length) + index) % 2).join('');
  }, [currentNode, stage]);

  const activeDetails = currentNode?.academicDetails?.slice(0, 2) || [];

  return (
    <section
      aria-label="Panel Telemetri Sinyal AOK"
      className="pointer-events-none fixed right-4 top-24 z-30 hidden w-88 select-none overflow-hidden rounded-3xl border border-white/10 bg-slate-950/58 p-4 text-white shadow-[0_24px_90px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl xl:block"
    >
      <div className="absolute -right-14 -top-16 h-36 w-36 rounded-full bg-cyan-400/20 blur-3xl" />
      <div className="absolute -bottom-20 left-6 h-40 w-40 rounded-full bg-emerald-400/10 blur-3xl" />

      <div className="relative mb-4 flex items-start justify-between gap-3">
        <div>
          <div className="mb-1 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-cyan-300">
            <RadioTower className="h-3.5 w-3.5" />
            Live Signal Lab
          </div>
          <h3 className="text-lg font-black leading-tight text-white">Telemetri Ekspedisi</h3>
          <p className="mt-1 text-xs leading-relaxed text-slate-300">
            {STAGE_COPY[stage] || 'Sistem menunggu inisialisasi daya.'}
          </p>
        </div>
        <div className="rounded-2xl border border-cyan-300/25 bg-cyan-300/10 p-2 text-cyan-200">
          <Activity className="h-5 w-5" />
        </div>
      </div>

      <div className="relative mb-4 grid grid-cols-3 gap-2">
        <MetricPill icon={Gauge} label="Progress" value={`${progress}%`} />
        <MetricPill icon={Cpu} label="Zona" value={isInsideCpu ? 'CPU' : 'PCB'} tone="emerald" />
        <MetricPill icon={Zap} label="Mode" value={isAutoCruising ? 'AUTO' : 'WASD'} tone="amber" />
      </div>

      <div className="relative rounded-2xl border border-slate-700/70 bg-slate-950/70 p-3">
        <div className="mb-2 flex items-center justify-between gap-3">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Node aktif</span>
          <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-2 py-0.5 text-[10px] font-bold text-cyan-200">
            {currentNode?.category || 'Sirkuit'}
          </span>
        </div>
        <div className="mb-3 text-sm font-black leading-snug text-white">{currentNode?.name}</div>
        <div className="mb-3 flex items-center gap-2 rounded-xl bg-black/35 px-2 py-2 font-mono text-xs text-emerald-300">
          <Binary className="h-4 w-4 text-emerald-400" />
          <span className="tracking-[0.18em]">{signalBits}</span>
        </div>
        <div className="space-y-2">
          {activeDetails.map((detail) => (
            <div key={detail.label} className="rounded-xl border border-white/5 bg-white/4 p-2">
              <div className="text-[10px] font-bold uppercase text-cyan-300">{detail.label}</div>
              <div className="mt-0.5 text-[11px] leading-snug text-slate-200">{detail.val}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
