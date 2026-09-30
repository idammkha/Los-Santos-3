import React, { useState } from 'react';
import { X, Award, CheckCircle2, AlertCircle, RotateCcw, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { AOK_QUIZ } from '../../data/aokData';
import { sound } from '../../audio/SoundEffects';

export default function QuizModal({ onClose }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const question = AOK_QUIZ[currentQuestionIndex];

  const handleSelectOption = (index) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);

    const isCorrect = question.options[index].correct;
    if (isCorrect) {
      setScore((prev) => prev + 1);
      sound.playClockTick();
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex + 1 < AOK_QUIZ.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
      sound.playSuccessFanfare();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsFinished(false);
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md select-none">
      <div className="relative max-w-xl w-full bg-slate-900 border border-emerald-500/40 rounded-2xl shadow-[0_0_50px_rgba(16,185,129,0.2)] p-6 text-white animate-in fade-in duration-200">
        {/* Tombol Tutup */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Kuis */}
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Evaluasi Akademis AOK: CPU &amp; Power Flow</h3>
            <span className="text-xs text-slate-400">
              {!isFinished ? `Pertanyaan ${currentQuestionIndex + 1} dari ${AOK_QUIZ.length}` : 'Hasil Evaluasi'}
            </span>
          </div>
        </div>

        {!isFinished ? (
          <div>
            {/* Teks Pertanyaan */}
            <div className="my-5 p-4 rounded-xl bg-slate-950 border border-slate-800">
              <p className="text-sm font-semibold text-slate-100 leading-relaxed">
                {question.question}
              </p>
            </div>

            {/* Pilihan Jawaban */}
            <div className="space-y-2.5 mb-5">
              {question.options.map((opt, idx) => {
                let btnStyle = 'bg-slate-800/80 border-slate-700 hover:bg-slate-700 text-slate-200';

                if (isAnswered) {
                  if (opt.correct) {
                    btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-semibold';
                  } else if (selectedOption === idx) {
                    btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-200 line-through';
                  } else {
                    btnStyle = 'bg-slate-900/50 border-slate-800 text-slate-500 opacity-60';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    disabled={isAnswered}
                    className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition-all flex items-start gap-3 ${btnStyle}`}
                  >
                    <span className="font-mono font-bold text-slate-400 shrink-0">
                      {String.fromCharCode(65 + idx)}.
                    </span>
                    <span className="flex-1">{opt.text}</span>
                    {isAnswered && opt.correct && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    )}
                    {isAnswered && selectedOption === idx && !opt.correct && (
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Penjelasan Jawaban (Muncul setelah dijawab) */}
            {isAnswered && (
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 leading-relaxed mb-5">
                <strong className="text-cyan-300 block mb-1">Penjelasan Akademis:</strong>
                {question.explanation}
              </div>
            )}

            {/* Tombol Lanjut */}
            <div className="flex justify-end pt-3 border-t border-slate-800">
              <button
                onClick={handleNextQuestion}
                disabled={!isAnswered}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-bold transition-all ${
                  isAnswered
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <span>{currentQuestionIndex + 1 === AOK_QUIZ.length ? 'Lihat Hasil Akhir' : 'Pertanyaan Berikutnya'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Layar Skor & Ringkasan */
          <div className="py-6 text-center">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-400 mx-auto flex items-center justify-center text-3xl font-extrabold text-emerald-400 mb-4 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
              {score}/{AOK_QUIZ.length}
            </div>

            <h4 className="text-xl font-bold text-white mb-2">
              {score >= 4 ? 'Luar Biasa! Pemahaman Sangat Baik' : 'Bagus! Terus Tingkatkan Pemahaman'}
            </h4>
            <p className="text-slate-400 text-xs max-w-sm mx-auto mb-6">
              Anda telah menguasai konsep dasar aliran tegangan motherboard, peran VRM, Clock
              Generator, mikroarsitektur CPU (CU, ALU, Registers), dan Siklus Instruksi Von Neumann.
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={handleRestart}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                <RotateCcw className="w-4 h-4" />
                Ulangi Kuis
              </button>
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-md"
              >
                Kembali ke Simulasi 3D
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
