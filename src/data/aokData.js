// Modul Data Edukasi Arsitektur & Organisasi Komputer (AOK)
// Standard Kurikulum: Hennessy & Patterson / William Stallings

export const HARDWARE_STAGES = {
  POWER_OFF: 'POWER_OFF',
  POWER_TRIGGERED: 'POWER_TRIGGERED',
  PCB_JOURNEY: 'PCB_JOURNEY',
  CPU_ENTRY: 'CPU_ENTRY',
  INSIDE_CPU: 'INSIDE_CPU',
  CYCLE_SIMULATION: 'CYCLE_SIMULATION',
  QUIZ: 'QUIZ',
};

export const MOTHERBOARD_CHECKPOINTS = [
  {
    id: 'front_panel',
    name: 'Front Panel Power Switch (PWR_SW)',
    category: 'Sinyal Daya Awal',
    position: [0, 0.4, 18],
    icon: 'Zap',
    summary: 'Saklar momentary yang memicu motherboard untuk menyalakan Power Supply (PSU).',
    description: `Ketika tombol power ditekan, dua pin PWR_SW dihubungkan singkat (short). Hal ini memberi sinyal ke chip Super I/O dan PSU melalui pin PS_ON# pada kabel 24-Pin ATX. PSU segera menyuplai tegangan +3.3V, +5V, dan +12V ke motherboard.`,
    academicDetails: [
      { label: 'Sinyal Kunci', val: 'PS_ON# (Active Low) & PWR_OK (+5V)' },
      { label: 'Fungsi AOK', val: 'Menginisialisasi urutan Power-On Self-Test (POST)' },
      { label: 'Tegangan Asal', val: '+5VSB (Standby) & +12V Main Rail' },
    ],
  },
  {
    id: 'vrm',
    name: 'VRM (Voltage Regulator Module)',
    category: 'Regulasi Daya CPU',
    position: [0, 0.4, 11],
    icon: 'Activity',
    summary: 'Menurunkan tegangan +12V dari PSU menjadi ~1.2V VCore yang sangat presisi untuk CPU.',
    description: `CPU silikon modern tidak bisa menerima 12V langsung karena transistor nanometer akan langsung terbakar. VRM menggunakan rangkaian Buck Converter multi-fase (MOSFET, Choke/Induktor, dan Solid Capacitors) yang dikendalikan PWM Controller untuk menghasilkan tegangan riak sangat rendah (VCore ~0.8V - 1.35V) dengan arus puluhan hingga ratusan Ampere.`,
    academicDetails: [
      { label: 'Tegangan Input', val: '+12V DC (EPS 8-pin)' },
      { label: 'Tegangan Output', val: 'VCore (0.8V - 1.35V DC presisi tinggi)' },
      { label: 'Komponen Kunci', val: 'High/Low-Side MOSFET, Ferrite Choke, Solid Capacitor' },
    ],
  },
  {
    id: 'crystal',
    name: 'Crystal Oscillator (Clock Generator)',
    category: 'Sinkronisasi Waktu',
    position: [0, 0.4, 5],
    icon: 'Clock',
    summary: 'Jantung detak komputer yang memicu perpindahan status biner di setiap siklus.',
    description: `Kristal kuarsa bergetar secara piezoelektrik menghasilkan gelombang frekuensi dasar (misal 33.33 MHz atau 100 MHz Base Clock). Frekuensi ini kemudian dilipatgandakan oleh sirkuit PLL (Phase-Locked Loop) di dalam prosesor menjadi clock berkecepatan Gigahertz (misal 3.2 GHz - 5.0 GHz). Satu siklus clock (T-State) menjadi satuan waktu eksekusi instruksi terkecil pada CPU.`,
    academicDetails: [
      { label: 'BCLK (Base Clock)', val: '100.0 MHz standar' },
      { label: 'Pengali (Multiplier)', val: 'Contoh: 36x -> 3.6 GHz Clock CPU' },
      { label: 'Fungsi AOK', val: 'Sinkronisasi perpindahan register (Flip-Flop latching)' },
    ],
  },
  {
    id: 'socket',
    name: 'CPU Socket (LGA / Land Grid Array)',
    category: 'Gerbang Masuk CPU',
    position: [0, 0.4, -1],
    icon: 'Cpu',
    summary: 'Ribuan pin emas penghubung fisik antara motherboard dan chip silikon prosesor.',
    description: `Pada soket tipe LGA (Land Grid Array), pin fleksibel bersepuh emas berada di motherboard, menyentuh titik kontak (pad) pada PCB prosesor. Soket ini mentransmisikan jalur daya (VCore, VTT), ground, dan bus komunikasi kecepatan tinggi (DDR Memory Channel, PCIe Lanes, DMI Bus). Melewati gerbang ini membawa kita langsung ke dalam mikroskopis Silicon Die!`,
    academicDetails: [
      { label: 'Tipe Soket', val: 'LGA (Land Grid Array) / PGA (Pin Grid Array)' },
      { label: 'Jumlah Pin', val: '1200 - 1700+ pin emas mikroskopis' },
      { label: 'Peran AOK', val: 'Bus Address, Bus Data, dan Bus Control eksternal' },
    ],
  },
];

export const CPU_COMPONENTS = [
  {
    id: 'biu',
    name: 'Bus Interface Unit (BIU) & System Agent',
    category: 'Komunikasi Eksternal',
    roomPosition: [-7, 0.8, -4],
    color: '#00e5ff',
    icon: 'Radio',
    summary: 'Gerbang komunikasi antara inti internal CPU dengan memori utama (RAM) dan perangkat I/O.',
    description: `BIU bertanggung jawab mengambil data dan instruksi dari luar chip CPU. BIU mengelola sinyal pada Bus Data, Bus Alamat, dan Bus Kontrol, serta mencakup Integrated Memory Controller (IMC) dan antarmuka interkoneksi berkecepatan tinggi (seperti Intel QPI/Ultra Path atau AMD Infinity Fabric).`,
    academicDetails: [
      { label: 'Fungsi Utama', val: 'Mengatur lalu lintas data antara Core dan RAM' },
      { label: 'Arsitektur', val: 'Terhubung ke System Bus (Address, Data, Control Bus)' },
      { label: 'Karakteristik', val: 'Menerima alamat dari MAR dan mengembalikan data ke MDR' },
    ],
  },
  {
    id: 'cache',
    name: 'Cache Hierarchy (L1, L2, L3 Cache)',
    category: 'Memori Cepat Internal',
    roomPosition: [-7, 0.8, 4],
    color: '#39ff14',
    icon: 'Database',
    summary: 'Memori SRAM super cepat di dalam silikon untuk menjembatani jurang kecepatan antara CPU dan RAM.',
    description: `Dibuat dari Static RAM (SRAM 6-Transistor) yang tidak butuh refresh periodik.
• L1 Cache: Paling cepat (latensi ~1 ns / ~4 siklus clock), terbagi menjadi L1 Instruction (L1i) dan L1 Data (L1d).
• L2 Cache: Ukuran menengah (~512KB - 2MB per core), latensi ~12 siklus.
• L3 Cache: Kapasitas terbesar (belasan hingga puluhan MB), dibagikan bersama (shared) ke seluruh core prosesor.`,
    academicDetails: [
      { label: 'Tipe Memori', val: 'SRAM (Static Random Access Memory)' },
      { label: 'Prinsip AOK', val: 'Locality of Reference (Temporal & Spatial Locality)' },
      { label: 'Tingkatan', val: 'L1 (Fastest, Smallest) -> L2 -> L3 (Shared Pool)' },
    ],
  },
  {
    id: 'cu',
    name: 'Control Unit (CU / Unit Kendali)',
    category: 'Pengarah & Dekoder Eksekusi',
    roomPosition: [0, 0.8, -6],
    color: '#ff007f',
    icon: 'Compass',
    summary: 'Otak orkestrasi di dalam CPU: mengarahkan alur kerja, mendekode instruksi biner, dan membangkitkan sinyal kontrol.',
    description: `Control Unit tidak melakukan kalkulasi angka, melainkan bertindak seperti komandan orkestra:
1. Mengambil instruksi dari Instruction Register (IR).
2. Mendekode opcode menggunakan Instruction Decoder atau Microcode ROM.
3. Membangkitkan pulsa kendali timing ke bus internal, menginstruksikan ALU kapan harus menghitung, dan menentukan register mana yang harus dibaca atau ditulis.`,
    academicDetails: [
      { label: 'Tipe Implementasi', val: 'Hardwired Control Unit atau Microprogrammed Control' },
      { label: 'Siklus Terlibat', val: 'Fase Fetch, Decode, dan pembangkit sinyal Execute' },
      { label: 'Output Sinyal', val: 'Read/Write Enable, ALU Select, Multiplexer Selector' },
    ],
  },
  {
    id: 'alu',
    name: 'Arithmetic Logic Unit (ALU)',
    category: 'Pusat Perhitungan & Logika',
    roomPosition: [7, 0.8, -4],
    color: '#ff9100',
    icon: 'Cpu',
    summary: 'Tempat terjadinya seluruh kalkulasi matematika biner (+, -, *, /) dan perbandingan logika (AND, OR, NOT, XOR, CMP).',
    description: `ALU dibangun dari gerbang logika digital (NAND, NOR, XOR), rangkaian Half/Full Adder, dan Shifter:
• Operasi Aritmatika: Penjumlahan biner, pengurangan (menggunakan Two's Complement), perkalian, dan pergeseran bit (shift/rotate).
• Operasi Logika: Evaluasi boolean (AND, OR, XOR, NOT) dan pembandingan (CMP).
• Status Flags: Menghasilkan output flag seperti Zero Flag (Z), Sign/Negative (S), Carry (C), dan Overflow (V) ke Registers Flags.`,
    academicDetails: [
      { label: 'Operasi Dasar', val: 'ADD, SUB, AND, OR, XOR, SHL, SHR, CMP' },
      { label: 'Sirkuit Utama', val: 'Full Adders (Carry Lookahead Adder), Logic Gate Matrix' },
      { label: 'Pencatat Kondisi', val: 'Status Register / Flags (Zero, Carry, Sign, Overflow)' },
    ],
  },
  {
    id: 'registers',
    name: 'Register Bank (PC, IR, MAR, MDR, ACC)',
    category: 'Memori Register Tercepat',
    roomPosition: [7, 0.8, 4],
    color: '#b026ff',
    icon: 'Layers',
    summary: 'Lokasi penyimpanan data sementara tercepat di piramida memori, bekerja pada kecepatan clock penuh 1 siklus.',
    description: `Register adalah memori internal ukuran kecil (32-bit atau 64-bit) yang berada tepat di jalur data inti:
• Program Counter (PC): Menyimpan alamat memori instruksi berikutnya yang akan dieksekusi.
• Instruction Register (IR): Menampung instruksi biner yang sedang aktif didekode oleh CU.
• Memory Address Register (MAR): Menyimpan alamat fisik RAM yang sedang dibaca/ditulis.
• Memory Data Register (MDR/MBR): Menyimpan data yang baru dibaca dari atau siap dikirim ke RAM.
• Accumulator (ACC) / GPR: Menyimpan operand dan hasil kalkulasi sementara dari ALU.`,
    academicDetails: [
      { label: 'Register Khusus', val: 'PC (Program Counter), IR (Instruction Register)' },
      { label: 'Register Memori', val: 'MAR (Address), MDR (Data Buffer)' },
      { label: 'Kecepatan Akses', val: '< 0.3 ns (Satu siklus clock prosesor)' },
    ],
  },
];

export const INSTRUCTION_CYCLE_STEPS = [
  {
    step: 1,
    phase: 'FETCH (Pengambilan Instruksi)',
    title: 'PC -> MAR -> Cache/RAM -> MDR -> IR',
    description: 'Prosesor mengambil instruksi biner dari memori cache ke dalam Instruction Register.',
    details: 'Alamat pada Program Counter (PC) dikirim ke MAR. Bus alamat memanggil memori. Data instruksi "ADD R1, #5" masuk ke MDR, lalu dimuat ke Instruction Register (IR). Nilai PC bertambah 1 (PC = PC + 1) untuk menunjuk instruksi selanjutnya.',
    componentHighlight: 'registers',
    targetPosition: [7, 0.8, 4],
  },
  {
    step: 2,
    phase: 'DECODE (Penerjemahan Opcode)',
    title: 'IR -> Control Unit (CU) Decoder',
    description: 'Control Unit menganalisis biner instruksi untuk mengetahui operasi dan operand.',
    details: 'Control Unit membedah instruksi menjadi Opcode (operasi penambahan: ADD) dan Operand (Register R1 dan nilai langsung 5). CU mempersiapkan jalur data dan sinyal enable menuju ALU.',
    componentHighlight: 'cu',
    targetPosition: [0, 0.8, -6],
  },
  {
    step: 3,
    phase: 'EXECUTE (Eksekusi Kalkulasi)',
    title: 'ALU Menghitung: R1 + 5',
    description: 'Arithmetic Logic Unit melakukan perhitungan biner sesuai komando Control Unit.',
    details: 'Nilai dari Register R1 (misal bernilai 10) dialirkan ke input ALU A, dan konstanta 5 ke input ALU B. Sirkuit Adder menjumlahkan 10 + 5 = 15. Status flag diperbarui jika terjadi overflow.',
    componentHighlight: 'alu',
    targetPosition: [7, 0.8, -4],
  },
  {
    step: 4,
    phase: 'WRITEBACK (Penyimpanan Hasil)',
    title: 'Hasil ALU -> Register R1 / Accumulator',
    description: 'Hasil komputasi 15 disimpan kembali ke register tujuan agar siap digunakan instruksi berikutnya.',
    details: 'Sinyal tulis diaktifkan oleh CU. Nilai 15 dimasukkan ke Register R1. Siklus instruksi ini selesai, dan CPU segera memulai siklus FETCH berikutnya tanpa henti miliaran kali per detik!',
    componentHighlight: 'registers',
    targetPosition: [7, 0.8, 4],
  },
];

export const AOK_QUIZ = [
  {
    id: 1,
    question: 'Sebelum daya 12V dari PSU masuk ke inti silikon CPU, komponen manakah di motherboard yang bertugas menurunkannya menjadi ~1.2V VCore yang aman?',
    options: [
      { text: 'VRM (Voltage Regulator Module) & Buck Converter', correct: true },
      { text: 'Crystal Oscillator', correct: false },
      { text: 'Southbridge / Chipset PCH', correct: false },
      { text: 'CMOS Battery CR2032', correct: false },
    ],
    explanation: 'VRM menggunakan MOSFET, Choke, dan Kapasitor solid untuk menurunkan tegangan 12V menjadi VCore (~0.8V - 1.35V) dengan arus tinggi dan riak gelombang sangat stabil.',
  },
  {
    id: 2,
    question: 'Komponen internal CPU yang bertindak sebagai "komandan orkestra" untuk menerjemahkan opcode dan membangkitkan sinyal kontrol adalah...',
    options: [
      { text: 'Arithmetic Logic Unit (ALU)', correct: false },
      { text: 'Control Unit (CU)', correct: true },
      { text: 'Level 3 (L3) Cache', correct: false },
      { text: 'Memory Data Register (MDR)', correct: false },
    ],
    explanation: 'Control Unit (CU) mendekode instruksi biner dari Instruction Register (IR) dan mengatur timing seluruh bus serta aktivasi unit eksekusi seperti ALU.',
  },
  {
    id: 3,
    question: 'Pada siklus Fetch, register manakah yang bertugas menyimpan alamat memori dari instruksi berikutnya yang akan dieksekusi?',
    options: [
      { text: 'IR (Instruction Register)', correct: false },
      { text: 'ACC (Accumulator)', correct: false },
      { text: 'PC (Program Counter)', correct: true },
      { text: 'MDR (Memory Data Register)', correct: false },
    ],
    explanation: 'Program Counter (PC) selalu menunjuk pada alamat memori instruksi berikutnya. Nilainya akan di-increment otomatis (PC = PC + 1) setiap kali instruksi diambil.',
  },
  {
    id: 4,
    question: 'Manakah urutan tahapan yang benar dalam Siklus Instruksi (Instruction Cycle) dasar arsitektur Von Neumann?',
    options: [
      { text: 'Fetch -> Execute -> Decode -> Writeback', correct: false },
      { text: 'Fetch -> Decode -> Execute -> Writeback', correct: true },
      { text: 'Decode -> Fetch -> Writeback -> Execute', correct: false },
      { text: 'Writeback -> Execute -> Decode -> Fetch', correct: false },
    ],
    explanation: 'Urutan siklus klasik CPU adalah: Fetch (ambil instruksi), Decode (artikan kode biner), Execute (jalankan kalkulasi di ALU), dan Writeback (simpan hasil kembali ke register).',
  },
  {
    id: 5,
    question: 'Mengapa Cache L1, L2, dan L3 dibuat menggunakan teknologi SRAM (Static RAM) dan bukan DRAM seperti RAM utama komputer?',
    options: [
      { text: 'SRAM jauh lebih murah daripada DRAM', correct: false },
      { text: 'SRAM menggunakan sirkuit Flip-Flop tanpa perlu siklus refresh, sehingga jauh lebih cepat dan latensi sangat rendah', correct: true },
      { text: 'SRAM bersifat non-volatile sehingga data tetap tersimpan saat mati lampu', correct: false },
      { text: 'SRAM hanya dapat menyimpan instruksi, bukan data angka', correct: false },
    ],
    explanation: 'SRAM menggunakan rangkaian 6-transistor latching yang tidak memerlukan refresh kapasitif periodik, menjadikannya berkali-kali lipat lebih cepat daripada DRAM meskipun memakan lebih banyak area silikon.',
  },
];
