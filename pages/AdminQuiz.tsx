
import React, { useState, useRef } from 'react';
import { useData } from '../context/DataContext';
import { api } from '../services/api';
import { QuizSet, QuizQuestion } from '../types';
import { 
  Plus, Trash2, ListChecks, HelpCircle, 
  Settings, Save, X, BookOpen, Clock, 
  ChevronRight, LayoutGrid, CheckCircle2,
  AlertTriangle, Loader2, ArrowLeft, FileSpreadsheet, Download
} from 'lucide-react';

const AdminQuiz = () => {
  const { quizSets, refreshData } = useData();
  const [activeSet, setActiveSet] = useState<QuizSet | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [showAddSet, setShowAddSet] = useState(false);
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [newSet, setNewSet] = useState({ title: '', description: '', timeMinutes: 15 });
  const [newQ, setNewQ] = useState({ questionText: '', options: ['', '', '', ''], correctIndex: 0 });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadQuestions = async (set: QuizSet) => {
    setActiveSet(set);
    try {
      const q = await api.getQuestions(set.id);
      setQuestions(q as any);
    } catch (e) {
      console.error("Lỗi tải câu hỏi:", e);
    }
  };

  const handleAddSet = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      await api.createQuizSet(newSet);
      await refreshData();
      setShowAddSet(false);
      setNewSet({ title: '', description: '', timeMinutes: 15 });
    } catch (e) {
      alert("Lỗi khi tạo bộ đề.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteSet = async (id: string) => {
    if (window.confirm("Xác nhận xóa bộ đề này và tất cả câu hỏi liên quan? Dữ liệu không thể khôi phục.")) {
      setIsProcessing(true);
      try {
        await api.deleteQuizSet(id);
        await refreshData();
        if (activeSet?.id === id) setActiveSet(null);
      } catch (e) {
        alert("Lỗi khi xóa bộ đề. Có thể do ràng buộc dữ liệu.");
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSet) return;
    setIsProcessing(true);
    try {
      await api.createQuestion({ ...newQ, setId: activeSet.id });
      await loadQuestions(activeSet);
      setShowAddQuestion(false);
      setNewQ({ questionText: '', options: ['', '', '', ''], correctIndex: 0 });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteQuestion = async (id: string) => {
    if (window.confirm("Xóa câu hỏi này?")) {
      try {
        await api.deleteQuestion(id);
        if (activeSet) await loadQuestions(activeSet);
      } catch (e) {
        alert("Lỗi khi xóa câu hỏi.");
      }
    }
  };

  const handleCsvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeSet) return;

    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        // Tách dòng, loại bỏ dòng trống
        const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
        
        // Bỏ qua dòng tiêu đề
        const questionsToImport = [];

        for (let i = 1; i < lines.length; i++) {
          // Xử lý tách dấu phẩy thông minh (cho phép nội dung có dấu phẩy nếu nằm trong ngoặc kép)
          const parts = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(p => p.trim().replace(/^"|"$/g, ''));
          
          if (parts.length >= 6) {
            questionsToImport.push({
              questionText: parts[0],
              options: [parts[1], parts[2], parts[3], parts[4]],
              correctIndex: parseInt(parts[5])
            });
          }
        }

        if (questionsToImport.length > 0) {
          await api.createQuestionsBatch(activeSet.id, questionsToImport);
          await loadQuestions(activeSet);
          setShowBulkImport(false);
          alert(`Đã nhập thành công ${questionsToImport.length} câu hỏi vào bộ đề.`);
        } else {
          alert("Không tìm thấy dữ liệu hợp lệ. Vui lòng kiểm tra lại cấu trúc file mẫu.");
        }
      } catch (e) {
        console.error(e);
        alert("Lỗi định dạng file. Hãy đảm bảo bạn sử dụng đúng file mẫu CSV.");
      } finally {
        setIsProcessing(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsText(file, 'UTF-8');
  };

  const downloadSampleCsv = () => {
    // Thêm BOM để Excel nhận diện đúng mã UTF-8 (không lỗi tiếng Việt)
    const BOM = "\uFEFF";
    const headers = "Nội dung câu hỏi,Phương án A,Phương án B,Phương án C,Phương án D,Đáp án đúng (Điền số từ 0 đến 3)\n";
    const example = "Ngày thành lập Quân đội nhân dân Việt Nam là ngày nào?,22/12/1944,22/12/1945,19/05/1890,30/04/1975,0";
    
    const blob = new Blob([BOM + headers + example], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "mau_nhap_cau_hoi_vms.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 pb-32">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b-2 border-slate-200 pb-8 gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Quản lý Ngân hàng Câu hỏi</h1>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-widest mt-1">Cấu trúc bộ đề và dữ liệu thi nhận thức</p>
        </div>
        {!activeSet && (
          <div className="flex space-x-4">
             <button 
                onClick={downloadSampleCsv}
                className="bg-white text-[#800000] border-2 border-[#800000] px-6 py-4 font-black text-[11px] uppercase tracking-widest hover:bg-slate-50 transition-all shadow-lg flex items-center space-x-3"
              >
                <Download className="w-4 h-4" />
                <span>Tải file Excel mẫu</span>
              </button>
              <button 
                onClick={() => setShowAddSet(true)}
                className="bg-[#800000] text-[#d4af37] px-8 py-4 font-black text-[11px] uppercase tracking-widest hover:bg-black transition-all shadow-xl flex items-center space-x-3"
              >
                <Plus className="w-4 h-4" />
                <span>Tạo bộ đề mới</span>
              </button>
          </div>
        )}
      </div>

      {isProcessing && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-[200] flex items-center justify-center">
            <div className="bg-white p-6 rounded-xl shadow-2xl flex items-center space-x-4">
                <Loader2 className="w-6 h-6 animate-spin text-[#800000]" />
                <span className="text-sm font-black uppercase text-slate-900">Đang thực hiện lệnh...</span>
            </div>
        </div>
      )}

      {!activeSet ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {quizSets.map(set => (
            <div key={set.id} className="bg-white border-2 border-slate-100 p-8 shadow-sm hover:border-[#800000] transition-all group relative">
              <button 
                onClick={() => handleDeleteSet(set.id)}
                className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors"
                title="Xóa bộ đề"
              >
                <Trash2 className="w-5 h-5" />
              </button>
              <BookOpen className="w-10 h-10 text-[#800000] mb-6" />
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-2">{set.title}</h3>
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest flex items-center mb-6">
                <Clock className="w-3.5 h-3.5 mr-2" /> {set.timeMinutes} Phút làm bài
              </p>
              <button 
                onClick={() => loadQuestions(set)}
                className="w-full bg-slate-50 text-slate-400 py-3 font-black text-[10px] uppercase tracking-widest group-hover:bg-[#800000] group-hover:text-[#d4af37] transition-all flex items-center justify-center"
              >
                Quản lý câu hỏi <ChevronRight className="w-3 h-3 ml-2" />
              </button>
            </div>
          ))}
          {quizSets.length === 0 && (
            <div className="col-span-full py-20 bg-white border-4 border-dashed border-slate-100 rounded-[2rem] text-center">
              <HelpCircle className="w-12 h-12 text-slate-200 mx-auto mb-4" />
              <p className="text-xs font-black text-slate-300 uppercase tracking-widest">Chưa có dữ liệu bộ đề</p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-8 animate-subtle">
          <button 
            onClick={() => setActiveSet(null)}
            className="flex items-center space-x-2 text-[10px] font-black uppercase text-slate-400 hover:text-[#800000] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại danh sách bộ đề</span>
          </button>

          <div className="bg-white p-10 border-2 border-[#800000] shadow-xl flex flex-col lg:flex-row justify-between items-center gap-8">
             <div className="space-y-2">
                <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">{activeSet.title}</h2>
                <div className="flex items-center space-x-6">
                   <span className="px-3 py-1 bg-slate-100 text-[10px] font-black text-slate-500 uppercase rounded">TỔNG: {questions.length} CÂU HỎI</span>
                   <span className="flex items-center text-[10px] font-black text-[#800000] uppercase tracking-widest">
                      <Clock className="w-4 h-4 mr-2" /> {activeSet.timeMinutes} PHÚT
                   </span>
                </div>
             </div>
             <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => setShowBulkImport(true)}
                  className="bg-[#d4af37] text-[#800000] px-6 py-4 font-black text-[11px] uppercase tracking-widest shadow-lg hover:bg-black hover:text-white transition-all flex items-center space-x-3"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Nhập hàng loạt (CSV)</span>
                </button>
                <button 
                  onClick={() => setShowAddQuestion(true)}
                  className="bg-[#800000] text-[#d4af37] px-6 py-4 font-black text-[11px] uppercase tracking-widest shadow-lg hover:bg-black transition-all flex items-center space-x-3"
                >
                  <Plus className="w-4 h-4" />
                  <span>Thêm câu hỏi lẻ</span>
                </button>
             </div>
          </div>

          <div className="space-y-6">
            {questions.map((q, idx) => (
              <div key={q.id} className="bg-white p-8 border border-slate-100 shadow-sm relative group hover:border-[#800000] transition-all">
                <button 
                  onClick={() => handleDeleteQuestion(q.id)}
                  className="absolute top-8 right-8 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                <div className="flex items-start space-x-6">
                   <span className="bg-[#800000] text-[#d4af37] w-10 h-10 rounded flex items-center justify-center font-black shrink-0 text-sm">{idx + 1}</span>
                   <div className="space-y-6 flex-grow">
                      <p className="text-lg font-black text-slate-900 leading-tight">{q.questionText}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {q.options.map((opt, oIdx) => (
                          <div key={oIdx} className={`p-4 border-2 rounded-xl text-sm font-bold flex items-center space-x-4 ${oIdx === q.correctIndex ? 'bg-green-50 border-green-200 text-green-700' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                             <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${oIdx === q.correctIndex ? 'bg-green-600 text-white' : 'bg-slate-200 text-slate-400'}`}>
                                {String.fromCharCode(65 + oIdx)}
                             </div>
                             <span>{opt}</span>
                             {oIdx === q.correctIndex && <CheckCircle2 className="w-4 h-4 ml-auto" />}
                          </div>
                        ))}
                      </div>
                   </div>
                </div>
              </div>
            ))}
            {questions.length === 0 && (
              <div className="py-20 text-center opacity-30">
                <HelpCircle className="w-12 h-12 mx-auto mb-4" />
                <p className="text-xs font-black uppercase tracking-widest">Bộ đề này chưa có nội dung</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL NHẬP HÀNG LOẠT */}
      {showBulkImport && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-6">
            <div className="bg-white w-full max-w-xl shadow-2xl animate-subtle border-t-[12px] border-[#d4af37]">
                <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="font-black text-[#800000] uppercase text-sm tracking-tight flex items-center">
                        <FileSpreadsheet className="w-5 h-5 mr-3" /> Nhập ngân hàng đề từ File
                    </h3>
                    <button onClick={() => setShowBulkImport(false)} className="text-slate-400 hover:text-black"><X /></button>
                </div>
                <div className="p-8 space-y-6">
                    <div className="bg-amber-50 p-6 border-l-4 border-[#d4af37] space-y-4">
                        <h4 className="text-[10px] font-black text-[#800000] uppercase tracking-widest flex items-center">
                            <AlertTriangle className="w-4 h-4 mr-2" /> Quy định định dạng
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                            Vui lòng chuẩn bị file CSV theo đúng thứ tự cột trong file mẫu để hệ thống nhận diện chính xác nội dung và đáp án.
                        </p>
                        <button 
                            onClick={downloadSampleCsv}
                            className="bg-[#800000] text-[#d4af37] px-6 py-3 font-black text-[10px] uppercase tracking-widest flex items-center hover:bg-black transition-all rounded shadow-md"
                        >
                            <Download className="w-3.5 h-3.5 mr-2" /> Tải file mẫu cho Excel
                        </button>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Chọn file đã chuẩn bị</label>
                        <div 
                            onClick={() => fileInputRef.current?.click()}
                            className="border-4 border-dashed border-slate-200 rounded-2xl p-10 text-center cursor-pointer hover:border-[#d4af37] hover:bg-slate-50 transition-all"
                        >
                            <FileSpreadsheet className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                            <p className="text-xs font-bold text-slate-400 uppercase">Click để chọn file CSV từ máy tính</p>
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                onChange={handleCsvUpload} 
                                className="hidden" 
                                accept=".csv" 
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* MODAL THÊM BỘ ĐỀ */}
      {showAddSet && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-6">
           <div className="bg-white w-full max-w-lg shadow-2xl animate-subtle border-t-[12px] border-[#800000]">
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                 <h3 className="font-black text-[#800000] uppercase text-sm tracking-tight">Thiết lập Bộ đề mới</h3>
                 <button onClick={() => setShowAddSet(false)} className="text-slate-400 hover:text-black"><X /></button>
              </div>
              <form onSubmit={handleAddSet} className="p-8 space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Tên bộ đề</label>
                    <input required value={newSet.title} onChange={e => setNewSet({...newSet, title: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-200 focus:border-[#800000] outline-none text-sm font-black transition-all" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Mô tả mục tiêu</label>
                    <textarea value={newSet.description} onChange={e => setNewSet({...newSet, description: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-200 focus:border-[#800000] outline-none text-sm font-medium h-24" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Thời gian làm bài (Phút)</label>
                    <input type="number" required value={newSet.timeMinutes} onChange={e => setNewSet({...newSet, timeMinutes: parseInt(e.target.value)})} className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-200 focus:border-[#800000] outline-none text-sm font-black transition-all" />
                 </div>
                 <button type="submit" disabled={isProcessing} className="w-full bg-[#800000] text-[#d4af37] py-5 font-black text-[11px] uppercase tracking-widest flex items-center justify-center space-x-4 shadow-2xl hover:bg-black transition-all">
                    <span>XÁC NHẬN KHỞI TẠO</span>
                 </button>
              </form>
           </div>
        </div>
      )}

      {/* MODAL THÊM CÂU HỎI LẺ */}
      {showAddQuestion && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-6">
           <div className="bg-white w-full max-w-3xl shadow-2xl animate-subtle border-t-[12px] border-[#800000] max-h-[90vh] overflow-y-auto">
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50 sticky top-0 z-10">
                 <h3 className="font-black text-[#800000] uppercase text-sm tracking-tight">Soạn thảo Câu hỏi</h3>
                 <button onClick={() => setShowAddQuestion(false)} className="text-slate-400 hover:text-black"><X /></button>
              </div>
              <form onSubmit={handleAddQuestion} className="p-8 space-y-8">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Nội dung câu hỏi</label>
                    <textarea required value={newQ.questionText} onChange={e => setNewQ({...newQ, questionText: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-200 focus:border-[#800000] outline-none text-sm font-black transition-all h-32" />
                 </div>
                 
                 <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Các phương án trả lời</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       {newQ.options.map((opt, i) => (
                          <div key={i} className={`p-4 border-2 rounded-2xl flex items-center space-x-4 transition-all ${newQ.correctIndex === i ? 'border-[#800000] bg-red-50' : 'border-slate-100'}`}>
                             <span className="text-sm font-black text-slate-400">{String.fromCharCode(65 + i)}</span>
                             <input 
                              required value={opt} 
                              onChange={e => {
                                const o = [...newQ.options];
                                o[i] = e.target.value;
                                setNewQ({...newQ, options: o});
                              }}
                              className="flex-grow bg-transparent border-none outline-none text-sm font-bold"
                             />
                             <button 
                              type="button"
                              onClick={() => setNewQ({...newQ, correctIndex: i})}
                              className={`p-2 rounded-full ${newQ.correctIndex === i ? 'bg-[#800000] text-white' : 'bg-slate-200 text-slate-400'}`}
                             >
                                <CheckCircle2 className="w-4 h-4" />
                             </button>
                          </div>
                       ))}
                    </div>
                 </div>

                 <div className="flex space-x-4">
                    <button type="button" onClick={() => setShowAddQuestion(false)} className="flex-1 py-4 font-black text-[11px] uppercase tracking-widest border-2 border-slate-200 text-slate-400">Hủy</button>
                    <button type="submit" disabled={isProcessing} className="flex-[2] bg-[#800000] text-[#d4af37] py-4 font-black text-[11px] uppercase tracking-widest shadow-xl flex items-center justify-center space-x-3">
                       <Save className="w-4 h-4" />
                       <span>Lưu câu hỏi</span>
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminQuiz;
