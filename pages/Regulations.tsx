
import React from 'react';
import { ShieldCheck, Info, FileText, ChevronRight, Scale, Clock, UserCheck, AlertCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const RegulationCard = ({ icon: Icon, title, items, index }: any) => (
  <div className="bg-white p-12 shadow-tactical border-l-8 border-[#800000] hover:border-[#d4af37] transition-all group">
    <div className="flex items-center justify-between mb-10">
        <div className="p-4 bg-[#800000] text-[#d4af37] shadow-lg">
            <Icon className="w-6 h-6" />
        </div>
        <span className="text-5xl font-black text-slate-100 group-hover:text-[#d4af37]/20 transition-colors">0{index}</span>
    </div>
    <h3 className="text-xl font-black text-slate-950 uppercase tracking-tight mb-8 leading-tight border-b border-slate-100 pb-4">{title}</h3>
    <ul className="space-y-6">
      {items.map((item: string, idx: number) => (
        <li key={idx} className="flex items-start text-[14px] text-slate-700 leading-relaxed font-semibold group/item">
          <div className="w-2 h-2 bg-[#d4af37] mt-2 mr-4 shrink-0 group-hover/item:scale-150 transition-transform"></div>
          {item}
        </li>
      ))}
    </ul>
  </div>
);

const Regulations = () => {
  return (
    <div className="min-h-screen pb-32">
      {/* Header with Fixed Military Background */}
      <div className="bg-[#800000] text-white pt-32 pb-40 relative overflow-hidden bg-fixed-military" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1579913741617-3844a30a213a?auto=format&fit=crop&q=80&w=2000')" }}>
        <div className="absolute inset-0 bg-[#800000]/90"></div>
        <div className="absolute inset-0 mil-grid opacity-20"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex items-center space-x-3 text-[11px] font-black text-[#d4af37] uppercase tracking-[0.4em] mb-12">
            <Link to="/" className="hover:text-white transition-colors">Trang chủ</Link>
            <ChevronRight className="w-4 h-4" />
            <span>Nội quy an ninh</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[1] mb-12">
            Kỷ luật <br/> <span className="text-[#d4af37]">Sức mạnh</span> <br/> Quân đội
          </h1>
          <div className="w-32 h-2 bg-[#d4af37] mb-12"></div>
          <p className="text-white/80 text-xl max-w-2xl font-bold italic border-l-8 border-[#d4af37] pl-10 leading-relaxed">
            "Tuyệt đối chấp hành các quy định an ninh là nghĩa vụ và trách nhiệm của mọi công dân khi ra vào khu vực quân sự."
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-24 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <RegulationCard 
            index={1}
            icon={UserCheck}
            title="Thủ tục vào cổng"
            items={[
              "Bắt buộc mang theo CCCD/Hộ chiếu bản gốc để đối soát tại cổng gác.",
              "Đã hoàn thành đăng ký hồ sơ trên cổng điện tử trước ít nhất 24h.",
              "Trình diện đúng giờ hẹn và tuân thủ kiểm tra an ninh từ vệ binh."
            ]}
          />
          <RegulationCard 
            index={2}
            icon={Scale}
            title="Tác phong văn hóa"
            items={[
              "Trang phục lịch sự, kín đáo (không mặc đồ ngắn, đồ phản cảm).",
              "Tuyệt đối không mang chất cấm, vũ khí, vật liệu dễ cháy nổ.",
              "Lời nói, hành vi đúng mực, tuân thủ nghiêm ngặt mọi hướng dẫn."
            ]}
          />
          <RegulationCard 
            index={3}
            icon={Clock}
            title="Thời gian tiếp dân"
            items={[
              "Ngày thăm: Thứ 7 và Chủ Nhật hàng tuần theo quy định của đơn vị.",
              "Sáng: 07:30 - 11:00 (Ngưng tiếp nhận mới sau 10:30).",
              "Chiều: 13:30 - 16:30 (Ngưng tiếp nhận mới sau 16:00)."
            ]}
          />
        </div>

        <div className="mt-20 bg-white p-12 border-2 border-[#d4af37] shadow-heavy flex flex-col lg:flex-row items-center justify-between gap-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#d4af37]/5 rounded-bl-full"></div>
            <div className="flex items-center space-x-10 relative z-10">
                <div className="bg-[#800000] p-6 shadow-xl">
                    <AlertCircle className="w-10 h-10 text-[#d4af37]" />
                </div>
                <div className="space-y-3">
                    <h4 className="text-2xl font-black uppercase text-slate-950 tracking-tight">Cảnh báo bảo mật tối cao</h4>
                    <p className="text-sm text-slate-500 font-bold uppercase tracking-widest leading-loose">
                        Nghiêm cấm ghi hình, chụp ảnh hoặc sử dụng các thiết bị bay (Flycam) trong toàn bộ khuôn viên quân sự. Vi phạm sẽ bị xử lý theo pháp luật.
                    </p>
                </div>
            </div>
            <Link to="/dang-ky" className="bg-[#800000] text-[#d4af37] px-16 py-6 font-black text-[13px] uppercase tracking-widest hover:bg-black transition-all shadow-2xl shrink-0">
                Đã hiểu & Đăng ký thăm
            </Link>
        </div>
      </div>
    </div>
  );
};

export default Regulations;
