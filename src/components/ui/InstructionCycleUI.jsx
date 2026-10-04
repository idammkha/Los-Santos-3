import React from 'react';
import { X, ArrowRight, RotateCcw, Cpu, Layers } from 'lucide-react';
import { INSTRUCTION_CYCLE_STEPS } from '../../data/aokData';
import { sound } from '../../audio/SoundEffects';

export default function InstructionCycleUI({
  currentStep,
  onStepChange,
  onClose,
  onExecuteBurst,
}) {
  const stepInfo = INSTRUCTION_CYCLE_STEPS[currentStep - 1] || INSTRUCTION_CYCLE_STEPS[0];

  const handleNextStep = () => {
    sound.playClockTick();
    if (currentStep === 2) {
      // Menjelang eksekusi ALU
      onExecuteBurst(true);
      sound.playAluCompute();
      setTimeout(() => onExecuteBurst(false), 800);
    }

    if (currentStep < 4) {
      onStepChange(currentStep + 1);
    } else {
      onStepChange(1); // Ulangi ke fetch
    }
  };

  const handleReset = () => {
    sound.playClockTick();
    onStepChange(1);
  };

  // Status simulasi nilai register dinamis
  const getRegisterValues = () => {
    switch (currentStep) {
      case 1: // Fetch
        return {
          pc: '0x0040 -> 0x0041',
          ir: 'Memuat opcode...',
          mar: '0x0040 (Alamat)',
          mdr: '0x2B05 (Biner)',
          acc: '10 (Nilai awal R1)',
        };
      case 2: // Decode
        return {
          pc: '0x0041',
          ir: 'ADD R1, #5',
          mar: '0x0040',
          mdr: '0x2B05',
          acc: '10',
        };
      case 3: // Execute
        return {
          pc: '0x0041',
          ir: 'ADD R1, #5',
          mar: '0x0040',
          mdr: '0x2B05',
          acc: 'Menghitung: 10 + 5...',
        };
      case 4: // Writeback
        return {
          pc: '0x0041',
          ir: 'ADD R1, #5',
          mar: '0x0040',
          mdr: '0x000F (15)',
          acc: '15 (Hasil tersimpan!)',
        };
      default:
        return { pc: '0x0040', ir: 'IDLE', mar: '0x0000', mdr: '0x0000', acc: '10' };
    }
  };

  const reg = getRegisterValues();

  return (
    <div className="absolute top-16 right-4 z-40 max-w-md w-full bg-slate-900/95 backdrop-blur-md border border-purple-500/40 rounded-2xl shadow-[0_0_30px_rgba(168,85,247,0.25)] p-5 text-white select-none">
      {/* Header Modal */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-300">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">
              SIMULASI SIKLUS INSTRUKSI (AOK)
            </h3>
            <span className="text-[11px] text-purple-300">
              Instruksi Uji: <code className="text-white font-mono font-bold">ADD R1, #5</code>
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* 4 Tahapan Siklus Indikator */}
      <div className="grid grid-cols-4 gap-1.5 mb-4">
        {INSTRUCTION_CYCLE_STEPS.map((s) => {
          const isActive = s.step === currentStep;
          const isDone = s.step < currentStep;
          return (
            <div
              key={s.step}
              className={`p-2 rounded-lg text-center transition-all ${
                isActive
                  ? 'bg-purple-600 text-white font-bold shadow-[0_0_12px_#a855f7]'
                  : isDone
                  ? 'bg-purple-950/60 text-purple-300 border border-purple-800/40'
                  : 'bg-slate-800/60 text-slate-400'
              }`}
            >
              <div className="text-[10px] uppercase font-mono">Step {s.step}</div>
              <div className="text-xs truncate">{s.phase.split(' ')[0]}</div>
            </div>
          );
        })}
      </div>

      {/* Kotak Informasi Tahap Saat Ini */}
      <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 mb-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-bold text-purple-400">{stepInfo.phase}</span>
          <span className="text-[11px] font-mono text-slate-400">{stepInfo.title}</span>
        </div>
        <p className="text-xs text-slate-300 mb-2 leading-relaxed">{stepInfo.description}</p>
        <p className="text-[11px] text-slate-400 bg-slate-900 p-2 rounded border border-slate-800 leading-normal">
          {stepInfo.details}
        </p>
      </div>

      {/* Monitor Register Real-time */}
      <div className="mb-4">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          Status Register CPU:
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <div className="bg-slate-800/80 p-2 rounded border border-slate-700">
            <span className="text-slate-400 block text-[10px]">PC (Program Counter):</span>
            <span className="text-cyan-300 font-bold">{reg.pc}</span>
          </div>
          <div className="bg-slate-800/80 p-2 rounded border border-slate-700">
            <span className="text-slate-400 block text-[10px]">IR (Instruction Reg):</span>
            <span className="text-pink-300 font-bold">{reg.ir}</span>
          </div>
          <div className="bg-slate-800/80 p-2 rounded border border-slate-700">
            <span className="text-slate-400 block text-[10px]">MAR (Mem Address):</span>
            <span className="text-amber-300 font-bold">{reg.mar}</span>
          </div>
          <div className="bg-slate-800/80 p-2 rounded border border-slate-700">
            <span className="text-slate-400 block text-[10px]">MDR (Mem Data):</span>
            <span className="text-emerald-300 font-bold">{reg.mdr}</span>
          </div>
          <div className="col-span-2 bg-purple-950/50 p-2 rounded border border-purple-800/50 flex justify-between items-center">
            <span className="text-slate-300 text-[10px]">ACC / R1 (Accumulator):</span>
            <span className="text-purple-300 font-bold">{reg.acc}</span>
          </div>
        </div>
      </div>

      {/* Tombol Kontrol Tahap */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800">
        <button
          onClick={handleReset}
          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          title="Ulangi dari Fetch"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          onClick={handleNextStep}
          className="flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-xs shadow-md transition-all"
        >
          <span>
            {currentStep < 4
              ? `Lanjut ke Tahap ${currentStep + 1}: ${INSTRUCTION_CYCLE_STEPS[currentStep]?.phase.split(' ')[0]}`
              : 'Selesai & Ulangi Siklus Baru'}
          </span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
