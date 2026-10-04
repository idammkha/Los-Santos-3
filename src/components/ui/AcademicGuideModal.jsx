import React, { useState } from 'react';
import { X, BookOpen, Cpu, Zap, Layers, Activity } from 'lucide-react';

export default function AcademicGuideModal({ onClose }) {
  const [activeTab, setActiveTab] = useState('power_flow');

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md select-none">
      <div className="relative max-w-3xl w-full max-h-[85vh] flex flex-col bg-slate-900 border border-indigo-500/40 rounded-2xl shadow-[0_0_50px_rgba(99,102,241,0.25)] text-white overflow-hidden animate-in fade-in duration-200">
        {/* Header Modal */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-wide">
                Diktat Akademis: Arsitektur &amp; Organisasi Komputer (AOK)
              </h3>
              <p className="text-xs text-slate-400">
                Referensi Teori: Aliran Daya, Mikroarsitektur Processor &amp; Siklus Instruksi
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigasi */}
        <div className="flex border-b border-slate-800 bg-slate-950/30 px-5 gap-4 overflow-x-auto text-xs">
          {[
            { id: 'power_flow', label: '1. Urutan Power-On & POST', icon: Zap },
            { id: 'cpu_structure', label: '2. Anatomi Internal CPU', icon: Cpu },
            { id: 'cycle', label: '3. Siklus Instruksi (Von Neumann)', icon: Activity },
            { id: 'hierarchy', label: '4. Hirarki Memori & Cache', icon: Layers },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-3 border-b-2 font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? 'border-indigo-500 text-indigo-400 font-bold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Konten Tab Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 text-xs sm:text-sm text-slate-300 space-y-4 leading-relaxed">
          {activeTab === 'power_flow' && (
            <div className="space-y-4">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                Urutan Sinyal Daya Motherboard Menuju CPU
              </h4>
              <p>
                Ketika tombol daya pada casing ditekan, komputer tidak langsung mengeksekusi sistem operasi.
                Terjadi rangkaian penstabilan sinyal listrik berkecepatan mikrodetik:
              </p>
              <div className="space-y-3 pl-2">
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <strong className="text-cyan-400 block mb-1">1. Tombol Power (PWR_SW) &amp; PS_ON#</strong>
                  Menghubungkan pin saklar mengirim sinyal logika rendah (active low) ke chip Super I/O,
                  yang kemudian menarik pin <code>PS_ON#</code> pada kabel 24-Pin ATX ke Ground, memerintahkan
                  Power Supply (PSU) untuk mulai menyuplai daya utama.
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <strong className="text-cyan-400 block mb-1">2. Sinyal PWR_OK (Power Good)</strong>
                  Setelah seluruh rel tegangan (+12V, +5V, +3.3V) stabil di atas 95% toleransi, PSU mengirimkan sinyal
                  <code>PWR_OK</code> (+5V) ke motherboard. Ini tanda bahwa motherboard aman untuk diaktifkan.
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <strong className="text-cyan-400 block mb-1">3. VRM (Voltage Regulator Module) &amp; Buck Converter</strong>
                  CPU modern tidak dapat menerima tegangan 12V karena transistor skala nanometer akan hancur.
                  VRM menurunkan 12V menjadi <strong>VCore (~0.8V - 1.35V)</strong> dengan efisiensi tinggi
                  menggunakan MOSFET switching berfrekuensi ratusan kHz, Choke Ferrite, dan Solid Capacitors.
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <strong className="text-cyan-400 block mb-1">4. Clock Generator (Crystal Oscillator)</strong>
                  Kristal kuarsa membangkitkan detak frekuensi dasar (Base Clock 100 MHz). Sirkuit PLL di dalam
                  CPU melipatgandakan frekuensi ini hingga mencapai GHz, mensinkronkan miliaran transistor latching.
                </div>
              </div>
            </div>
          )}

          {activeTab === 'cpu_structure' && (
            <div className="space-y-4">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-400" />
                Mikroarsitektur Inti Prosesor (CPU Die)
              </h4>
              <p>
                Prosesor modern adalah perwujudan canggih dari model Arsitektur Von Neumann, terdiri dari:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <strong className="text-pink-400 block mb-1">Control Unit (CU)</strong>
                  Unit kendali yang mendekode instruksi biner, mengatur pembukaan gerbang bus data internal,
                  dan memicu pulsa eksekusi ke ALU.
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <strong className="text-amber-400 block mb-1">Arithmetic Logic Unit (ALU)</strong>
                  Unit eksekutor yang melakukan operasi matematis (penjumlahan, pengurangan, pergeseran bit)
                  dan evaluasi logika boolean (AND, OR, NOT, XOR, perbandingan).
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <strong className="text-purple-400 block mb-1">Register Bank (PC, IR, MAR, MDR, ACC)</strong>
                  Memori tercepat pada komputer, beroperasi pada 1 siklus clock prosesor. Menampung alamat,
                  instruksi aktif, dan operand kalkulasi.
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <strong className="text-emerald-400 block mb-1">Cache Memory (L1, L2, L3)</strong>
                  SRAM berkecepatan tinggi yang menyimpan salinan instruksi dan data dari RAM untuk mengurangi
                  waktu tunggu (CPU Stall / Memory Wall).
                </div>
              </div>
            </div>
          )}

          {activeTab === 'cycle' && (
            <div className="space-y-4">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-purple-400" />
                Siklus Instruksi Komputer (Instruction Cycle)
              </h4>
              <p>
                Setiap perintah dalam program komputer dipecah menjadi 4 fase berulang:
              </p>
              <div className="space-y-2.5">
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="font-bold text-cyan-400">1. FETCH (Ambil): </span>
                  Alamat instruksi dari <code>PC</code> dialirkan ke <code>MAR</code>.
                  Memori merespons dan meletakkan instruksi biner ke <code>MDR</code>.
                  Data dipindahkan ke <code>IR</code>, lalu <code>PC = PC + 1</code>.
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="font-bold text-pink-400">2. DECODE (Terjemahkan): </span>
                  Control Unit (CU) memeriksa kode operasi (Opcode) di dalam <code>IR</code>.
                  CU menentukan operasi apa yang diminta (misal ADD) dan register/alamat mana yang menjadi sumber operand.
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="font-bold text-amber-400">3. EXECUTE (Jalankan): </span>
                  CU mengalirkan operand ke jalur input ALU. Rangkaian Full Adder dan Logic Gates
                  melakukan kalkulasi matematis. Status bendera (Flags: Zero, Carry, Overflow) dicatat.
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="font-bold text-purple-400">4. WRITEBACK (Simpan Kembali): </span>
                  Hasil output dari ALU dialirkan melalui internal data bus dan disimpan kembali
                  ke register tujuan (misal Accumulator atau Register Umum R1).
                </div>
              </div>
            </div>
          )}

          {activeTab === 'hierarchy' && (
            <div className="space-y-4">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                Piramida Hirarki Memori Komputer
              </h4>
              <p>
                Hukum mendasar memori: <em>Semakin cepat memori, semakin mahal harganya per byte, dan semakin kecil kapasitas fisiknya.</em>
              </p>
              <div className="space-y-2">
                <div className="p-2.5 rounded bg-purple-950/60 border border-purple-800 text-xs">
                  <strong>Tingkat 1: Registers (&lt; 1 KB)</strong> — Latensi &lt; 0.3 ns (1 siklus CPU).
                </div>
                <div className="p-2.5 rounded bg-emerald-950/60 border border-emerald-800 text-xs">
                  <strong>Tingkat 2: L1 Cache (32KB - 64KB per core)</strong> — Latensi ~1 ns (SRAM).
                </div>
                <div className="p-2.5 rounded bg-emerald-950/40 border border-emerald-800/60 text-xs">
                  <strong>Tingkat 3: L2 Cache (512KB - 2MB per core)</strong> — Latensi ~3 - 5 ns.
                </div>
                <div className="p-2.5 rounded bg-emerald-950/20 border border-emerald-800/40 text-xs">
                  <strong>Tingkat 4: L3 Cache (16MB - 64MB+ shared)</strong> — Latensi ~10 - 15 ns.
                </div>
                <div className="p-2.5 rounded bg-blue-950/60 border border-blue-800 text-xs">
                  <strong>Tingkat 5: Main Memory / RAM (16GB - 64GB DDR5)</strong> — Latensi ~60 - 80 ns (DRAM).
                </div>
                <div className="p-2.5 rounded bg-slate-800 border border-slate-700 text-xs">
                  <strong>Tingkat 6: Secondary Storage (NVMe SSD / HDD)</strong> — Latensi ribuan hingga jutaan ns.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Modal */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors shadow-md"
          >
            Tutup Buku Panduan
          </button>
        </div>
      </div>
    </div>
  );
}
