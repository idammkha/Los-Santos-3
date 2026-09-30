# ⚡ Ekspedisi Arsitektur CPU (AOK 3D Simulator)

Aplikasi game simulasi edukasi interaktif 3D untuk mata kuliah **Arsitektur dan Organisasi Komputer (AOK)**. Mensimulasikan secara visual dan interaktif perjalanan sinyal daya listrik dari saat tombol power ditekan pada casing, mengalir menyusuri motherboard bersama karakter elektron **Volt**, hingga menembus masuk ke dalam mikroskopis mikroarsitektur **Processor / CPU**.

---

## 🎯 Tujuan Pembelajaran Akademis (Curriculum Alignment)
Simulasi ini dirancang mengacu pada standar literatur Hennessy & Patterson (*Computer Organization and Design*) serta William Stallings (*Computer Organization and Architecture*):
1. **Urutan Inisialisasi Daya (Power-On & Reset Sequence):**
   - Penekanan pin `PWR_SW` (Front Panel) memicu sinyal logika rendah `PS_ON#` (Active Low) ke PSU.
   - Pembangkitan rel daya +12V, +5V, +3.3V dan sinyal verifikasi stabilitas `PWR_OK` (Power Good).
   - Regulasi Buck Converter multi-fase pada **VRM** menurunkan 12V menjadi **VCore (~1.2V)** yang aman bagi transistor skala nanometer CPU.
   - Pembangkitan frekuensi detak dasar 100 MHz oleh **Crystal Oscillator** (Clock Generator) yang dilipatgandakan oleh sirkuit PLL (Phase-Locked Loop).
   - Transmisi daya dan sinyal melalui ribuan pin emas soket **LGA (Land Grid Array)** menuju CPU.

2. **Mikroarsitektur Internal CPU (Von Neumann Architecture):**
   - **Control Unit (CU):** Dekoder opcode biner dan orkestrator pulsa sinyal kendali bus.
   - **Arithmetic Logic Unit (ALU):** Inti komputasi aritmatika biner (Adder) dan operasi logika boolean (AND, OR, XOR).
   - **Register Bank:** Area penyimpanan ultra-cepat berkecepatan 1 siklus clock (`PC`, `IR`, `MAR`, `MDR`, `ACC / R1`).
   - **Hirarki Memori Cache:** Hirarki SRAM L1 (Inst/Data ~1ns latency), L2, dan L3 Shared Cache.
   - **Bus Interface Unit (BIU):** Gerbang komunikasi Address Bus, Data Bus, dan Control Bus dengan sistem eksternal.

3. **Simulasi Siklus Instruksi (Fetch - Decode - Execute - Writeback):**
   - Langkah demi langkah eksekusi instruksi assembly `ADD R1, #5` dengan visualisasi paket data 3D yang berpindah antar modul CPU dan pembaruan nilai register secara real-time.

4. **Evaluasi Akademis Interaktif:**
   - Fitur kuis 5 pertanyaan berbobot akademis dengan verifikasi jawaban langsung dan ulasan teoritis.
   - Diktat komprehensif 4 bab yang dapat dibuka sewaktu-waktu.

---

## 🎮 Kontrol & Interaksi
- **Tombol Power Casing:** Klik tombol merah untuk menyalakan komputer dan memicu aliran elektron.
- **Gerakan Karakter (Volt):** Tombol `W`, `A`, `S`, `D` atau tombol `Panah Keyboard`.
- **Kamera 3D:**
  - Klik Kiri + Geser Mouse: Memutar sudut orbit kamera (360° pan & tilt).
  - Scroll Mouse: Zoom in / zoom out.
  - Klik Kanan + Geser Mouse: Pan pergeseran posisi kamera.
- **Interaksi Objek:** Klik komponen 3D (VRM, Crystal, Socket, CU, ALU, Cache, Register) untuk membuka lembar data teknis akademis.
- **Mode Auto-Perjalanan:** Aktifkan/nonaktifkan dari bilah navigasi bawah untuk membiarkan karakter melaju otomatis menyusuri jalur daya motherboard.
- **Tombol Pindah Scene:** Beralih instan antara Motherboard PCB dan Silicon Die Inti CPU.
- **Simulasi Siklus Instruksi:** Tombol di bagian bawah scene CPU untuk menjalankan eksekusi instruksi `ADD R1, #5`.
- **Diktat Materi & Kuis Evaluasi:** Tombol di header atas layar.

---

## 🛠️ Teknologi yang Digunakan
- **Frontend Framework:** React 19 + Vite 8
- **3D Graphics & Shaders:** Three.js + React Three Fiber (`@react-three/fiber`) + Drei (`@react-three/drei`)
- **Audio Engine:** Web Audio API Procedural Synthesizer (menghasilkan suara klik saklar, dengung listrik, tick clock, dan kalkulasi ALU secara murni tanpa file audio eksternal)
- **Styling:** Tailwind CSS v4 + Lucide React Icons
- **Efek Partikel & Visual:** Three.js Point Cloud Stars, Confetti canvas, Bloom glowing materials

---

## 🚀 Cara Menjalankan Proyek Secara Lokal

1. **Pastikan Node.js terinstal** (v18 ke atas disarankan).
2. **Buka terminal di folder proyek:**
   ```bash
   cd "Los Santos 3"
   ```
3. **Instal dependensi (jika belum):**
   ```bash
   npm install
   ```
4. **Jalankan Server Development:**
   ```bash
   npm run dev
   ```
5. **Buka browser:**
   Akses `http://localhost:5173/` di browser pilihan Anda (Google Chrome / Microsoft Edge / Firefox).
