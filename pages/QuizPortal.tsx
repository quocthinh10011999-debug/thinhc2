
import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { api } from '../services/api';
import { QuizQuestion, QuizSet } from '../types';
import { 
  BookOpen, Clock, Play, ChevronRight, 
  CheckCircle2, AlertCircle, User, Award, 
  RefreshCw, Trophy, Medal, Timer
} from 'lucide-react';

const QuizPortal = () => {
  const { quizSets, quizScores, refreshData } = useData();
  const [selectedSet, setSelectedSet] = useState<QuizSet | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentStep, setCurrentStep] = useState<'selection' | 'info' | 'testing' | 'result'>('selection');
  
  const [userName, setUserName] = useState('');
  const [userUnit, setUserUnit] = useState('');
  const [answers, setAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  useEffect(() => {
    let timer: any;
    if (currentStep === 'testing' && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && currentStep === 'testing') {
      finishQuiz();
    }
    return () => clearInterval(timer);
  }, [currentStep, timeLeft]);

  const startQuiz = async (set: QuizSet) => {
    const qList = await api.getQuestions(set.id);
    if (qList.length === 0) {
      alert("Bộ đề này hiện chưa có câu hỏi. Vui lòng chọn bộ đề khác.");
      return;
    }
    setQuestions(qList as any);
    setSelectedSet(set);
    setCurrentStep('info');
  };

  const beginTest = () => {
    if (!userName.trim()) return alert("Vui lòng nhập họ tên.");
    setAnswers(new Array(questions.length).fill(-1));
    setTimeLeft(selectedSet!.timeMinutes * 60);
    setCurrentStep('testing');
  };

  const finishQuiz = async () => {
    let correct = 0;
    questions.forEach((q, idx) => {
      if (answers[idx] === q.correctIndex) correct++;
    });
    
    setScore({ correct, total: questions.length });
    setCurrentStep('result');

    await api.submitScore({
      userName,
      unit: userUnit,
      score: correct,
      total: questions.length,
      setId: selectedSet!.id
    });
    refreshData();
  };

  if (currentStep === 'testing') {
    return (
      <div className="min-h-screen bg-slate-900 text-white p-6 md:p-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex justify-between items-center bg-[#800000] p-6 rounded-xl border-b-4 border-[#d4af37] sticky top-4 z-10">
            <div>
              <h2 className="text-xl font-black uppercase tracking-tight">{selectedSet?.title}</h2>
              <p className="text-[10px] font-bold text-[#d4af37] uppercase tracking-widest mt-1">Đang thực hiện bài thi</p>
            </div>
            <div className={`flex items-center space-x-3 px-6 py-2 rounded-full border-2 ${timeLeft < 60 ? 'bg-red-500/20 border-red-500 animate-pulse' : 'bg-black/20 border-[#d4af37]'}`}>
              <Timer className="w-5 h-5 text-[#d4af37]" />
              <span className="text-2xl font-black font-mono">
                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
              </span>
            </div>
          </div>

          <div className="space-y-12 pb-24">
            {questions.map((q, qIdx) => (
              <div key={q.id} className="bg-white/5 border border-white/10 p-8 rounded-2xl space-y-6">
                <div className="flex items-start space-x-4">
                  <span className="bg-[#800000] text-[#d4af37] w-8 h-8 rounded flex items-center justify-center font-black shrink-0">{qIdx + 1}</span>
                  <p className="text-lg font-bold leading-relaxed">{q.questionText}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-12">
                  {q.options.map((opt, oIdx) => (
                    <button 
                      key={oIdx}
                      onClick={() => {
                        const newAns = [...answers];
                        newAns[qIdx] = oIdx;
                        setAnswers(newAns);
                      }}
                      className={`p-4 text-left text-sm font-bold border-2 transition-all rounded-xl ${
                        answers[qIdx] === oIdx 
                        ? 'bg-[#800000] border-[#d4af37] text-white' 
                        : 'bg-white/5 border-white/10 hover:border-white/30'
                      }`}
                    >
                      <span className="mr-3 opacity-40">{String.fromCharCode(65 + oIdx)}.</span> {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="fixed bottom-8 left-0 right-0 px-6">
            <div className="max-w-4xl mx-auto flex justify-between items-center bg-black/60 backdrop-blur-xl p-4 rounded-2xl border border-white/10">
               <p className="text-xs font-bold text-white/40 uppercase tracking-widest ml-4">
                  Hoàn thành: {answers.filter(a => a !== -1).length}/{questions.length} câu
               </p>
               <button 
                onClick={finishQuiz}
                className="bg-[#d4af37] text-[#800000] px-12 py-3 font-black text-sm uppercase tracking-widest hover:bg-white transition-all shadow-xl"
               >
                 Nộp bài ngay
               </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'result') {
    return (
      <div className="min-h-screen bg-[#fffcf5] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white border-4 border-[#800000] p-12 shadow-heavy text-center space-y-10 animate-subtle">
           <div className="relative">
              <Trophy className="w-20 h-20 text-[#d4af37] mx-auto" />
              <div className="absolute inset-0 animate-ping rounded-full border-4 border-[#d4af37] opacity-20"></div>
           </div>
           <div className="space-y-2">
              <h2 className="text-2xl font-black text-[#800000] uppercase tracking-tight">Kết quả bài thi</h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Đồng bộ lên bảng vàng đơn vị</p>
           </div>
           <div className="bg-slate-50 p-8 border-y-2 border-slate-100">
              <span className="text-6xl font-black text-[#800000]">{score.correct}</span>
              <span className="text-2xl font-black text-slate-300"> / {score.total}</span>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-4">Điểm số đạt được</p>
           </div>
           <button 
            onClick={() => setCurrentStep('selection')}
            className="w-full bg-[#800000] text-[#d4af37] py-4 font-black text-xs uppercase tracking-widest hover:bg-black transition-all"
           >
             Quay lại Cổng thi
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="bg-[#800000] text-white pt-20 pb-24 relative overflow-hidden">
        <div className="absolute inset-0 mil-grid opacity-10"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center space-y-6">
           <Award className="w-12 h-12 text-[#d4af37] mx-auto animate-bounce" />
           <h1 className="text-5xl font-black uppercase tracking-tighter">Hệ thống <span className="text-[#d4af37]">Thi Nhận thức</span></h1>
           <p className="text-white/60 text-sm font-bold uppercase tracking-widest max-w-2xl mx-auto">Nâng cao bản lĩnh chính trị, nắm vững pháp luật và truyền thống đơn vị anh hùng.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-12 relative z-20 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {quizSets.map(set => (
                <div key={set.id} className="bg-white p-8 border-b-8 border-[#800000] shadow-tactical group hover:-translate-y-1 transition-all">
                   <div className="flex justify-between items-start mb-6">
                      <div className="p-3 bg-slate-100 text-[#800000] rounded group-hover:bg-[#800000] group-hover:text-[#d4af37] transition-colors">
                        <BookOpen className="w-6 h-6" />
                      </div>
                      <div className="flex items-center space-x-2 text-[10px] font-black text-slate-400 uppercase">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{set.timeMinutes} Phút</span>
                      </div>
                   </div>
                   <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-2">{set.title}</h3>
                   <p className="text-xs text-slate-500 font-medium leading-relaxed mb-8">{set.description}</p>
                   <button 
                    onClick={() => startQuiz(set)}
                    className="w-full flex items-center justify-center space-x-3 bg-slate-900 text-white py-4 font-black text-[11px] uppercase tracking-widest group-hover:bg-[#800000] group-hover:text-[#d4af37] transition-all"
                   >
                     <span>Bắt đầu thi</span>
                     <Play className="w-3 h-3 fill-current" />
                   </button>
                </div>
              ))}
           </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
           <div className="bg-white border-2 border-[#800000] shadow-xl overflow-hidden">
              <div className="bg-[#800000] p-6 text-[#d4af37] flex items-center justify-between">
                 <div className="flex items-center space-x-3">
                    <Trophy className="w-5 h-5" />
                    <h3 className="text-[11px] font-black uppercase tracking-widest">Bảng Vàng Danh Dự</h3>
                 </div>
                 <RefreshCw className="w-4 h-4 opacity-50 cursor-pointer hover:rotate-180 transition-all" onClick={() => refreshData()} />
              </div>
              <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
                 {quizScores.map((s, idx) => (
                   <div key={s.id} className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                      <div className="flex items-center space-x-4">
                         <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black ${idx < 3 ? 'bg-[#d4af37] text-[#800000]' : 'bg-slate-100 text-slate-400'}`}>
                            {idx + 1}
                         </div>
                         <div>
                            <p className="text-[11px] font-black text-slate-900 uppercase">{s.userName}</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase">{s.unit || 'D15 SPG-9'}</p>
                         </div>
                      </div>
                      <div className="text-right">
                         <span className="text-lg font-black text-[#800000]">{s.score}</span>
                         <span className="text-[10px] font-bold text-slate-300">/{s.total}</span>
                         <p className="text-[8px] font-black text-[#d4af37] uppercase">{s.setTitle?.split(' ')[0]}</p>
                      </div>
                   </div>
                 ))}
                 {quizScores.length === 0 && (
                   <div className="p-12 text-center opacity-30">
                      <Medal className="w-12 h-12 mx-auto mb-4" />
                      <p className="text-[10px] font-black uppercase tracking-widest">Chưa có dữ liệu thi</p>
                   </div>
                 )}
              </div>
           </div>
        </div>
      </div>

      {currentStep === 'info' && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-lg shadow-2xl animate-subtle border-t-[12px] border-[#800000] p-10 space-y-8">
             <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-[#800000] text-[#d4af37] flex items-center justify-center mx-auto rounded-xl shadow-lg mb-6">
                   <User className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Xác nhận thông tin</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Bộ đề: {selectedSet?.title}</p>
             </div>
             <div className="space-y-4">
                <input 
                  type="text" 
                  placeholder="HỌ VÀ TÊN THÍ SINH" 
                  className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-200 focus:border-[#800000] outline-none text-sm font-black transition-all uppercase"
                  value={userName}
                  onChange={e => setUserName(e.target.value)}
                />
                <input 
                  type="text" 
                  placeholder="ĐƠN VỊ (C1, C2...)" 
                  className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-200 focus:border-[#800000] outline-none text-sm font-black transition-all uppercase"
                  value={userUnit}
                  onChange={e => setUserUnit(e.target.value)}
                />
             </div>
             <div className="bg-amber-50 p-6 border-l-4 border-amber-400 space-y-2">
                <p className="text-[10px] font-black text-amber-700 uppercase tracking-widest flex items-center">
                   <AlertCircle className="w-4 h-4 mr-2" /> Lưu ý quy chế thi:
                </p>
                <ul className="text-[10px] font-bold text-amber-600 space-y-1 list-disc ml-4">
                   <li>Thời gian làm bài: {selectedSet?.timeMinutes} phút.</li>
                   <li>Hệ thống sẽ tự động nộp bài khi hết giờ.</li>
                   <li>Kết quả được lưu trực tiếp vào cơ sở dữ liệu đơn vị.</li>
                </ul>
             </div>
             <div className="flex space-x-4">
                <button onClick={() => setCurrentStep('selection')} className="flex-1 py-4 font-black text-[11px] uppercase tracking-widest border-2 border-slate-200 text-slate-400 hover:bg-slate-50">Hủy</button>
                <button onClick={beginTest} className="flex-[2] py-4 font-black text-[11px] uppercase tracking-widest bg-[#800000] text-[#d4af37] shadow-xl hover:bg-black transition-all">Bắt đầu ngay</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizPortal;
