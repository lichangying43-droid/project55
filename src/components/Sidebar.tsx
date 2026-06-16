import React from "react";
import { Utensils, CalendarDays, ClipboardList, MapPin, Phone, Clock, AlertTriangle, Sparkles, X } from "lucide-react";
import { User as UserType, ViewState } from "../types";

interface SidebarProps {
  currentUser: UserType | null;
  currentView: ViewState;
  setView: (view: ViewState) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({
  currentUser,
  currentView,
  setView,
  isOpen,
  onClose,
}: SidebarProps) {
  const announcements = [
    { id: 1, title: "端午與端陽割烹限定", content: "6/20 - 6/25 開放預預約「香魚割烹特餐」，名額有限。" },
    { id: 2, title: "主廚貼心叮嚀", content: "本特約席次僅保留 10 分鐘，榻榻米座位建議著舒適襪裝。" }
  ];

  return (
    <>
      {/* Dimmed Background Overlay on mobile */}
      {isOpen && (
        <div
          id="sidebar-overlay"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-amber-950/40 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Sidebar Panel container */}
      <aside
        id="app-sidebar"
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-brand-border bg-brand-sidebar p-6 shadow-lg transition-transform duration-300 md:sticky md:top-20 md:z-10 md:h-[calc(100vh-5rem)] md:transform-none md:shadow-none ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Mobile close button inside sidebar header */}
        <div className="flex items-center justify-between md:hidden mb-6">
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 bg-brand-accent animate-pulse" />
            <span className="font-serif font-bold text-brand-dark">店鋪資訊與公告</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-brand-dark hover:bg-brand-border transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Sidebar Sections */}
        <div className="flex flex-col space-y-6 overflow-y-auto no-scrollbar flex-1">
          
          {/* Quick Menu for Mobile Navigation inside Sidebar */}
          <div className="md:hidden flex flex-col space-y-2 pb-5 border-b border-brand-border">
            <h3 className="text-[10px] uppercase tracking-widest text-brand-muted font-bold">網站選單</h3>
            <button
              onClick={() => { setView("home"); onClose(); }}
              className={`flex items-center space-x-3 px-4 py-2 text-xs uppercase tracking-widest transition-all ${
                currentView === "home" ? "bg-brand-border text-brand-dark font-bold" : "text-brand-text hover:bg-brand-sidebar/50"
              }`}
            >
              <Utensils className="h-4 w-4 text-brand-accent" />
              <span>首頁介紹</span>
            </button>
            <button
              onClick={() => { setView(currentUser ? "book" : "login"); onClose(); }}
              className={`flex items-center space-x-3 px-4 py-2 text-xs uppercase tracking-widest transition-all ${
                currentView === "book" ? "bg-brand-border text-brand-dark font-bold" : "text-brand-text hover:bg-brand-sidebar/50"
              }`}
            >
              <CalendarDays className="h-4 w-4 text-brand-accent" />
              <span>立即預約</span>
            </button>
            {currentUser && (
              <button
                onClick={() => { setView("my-reservations"); onClose(); }}
                className={`flex items-center space-x-3 px-4 py-2 text-xs uppercase tracking-widest transition-all ${
                  currentView === "my-reservations" ? "bg-brand-border text-brand-dark font-bold" : "text-brand-text hover:bg-brand-sidebar/50"
                }`}
              >
                <ClipboardList className="h-4 w-4 text-brand-accent" />
                <span>我的訂位紀錄</span>
              </button>
            )}
          </div>

          {/* Philosophy Section */}
          <div className="border border-brand-border bg-[#FCF9F0] p-4">
            <div className="flex items-center space-x-1.5 mb-2 text-brand-accent">
              <Sparkles className="h-3.5 w-3.5" />
              <h3 className="text-[10px] font-bold uppercase tracking-widest">主廚的心意</h3>
            </div>
            <p className="font-serif text-xs leading-relaxed text-brand-text italic">
              「一期一會。用最純粹的當季食材與細緻刀工，款待每一位珍貴的顧客，這是雅庵的堅持。」
            </p>
            <div className="mt-2 text-right">
              <span className="text-[10px] font-bold text-brand-accent">— 料理長 齊藤昭二</span>
            </div>
          </div>

          {/* Business Announcements */}
          <div className="flex flex-col space-y-3">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#8C6B3D] border-b border-[#E8E2D0] pb-1 w-fit">店鋪最新公告</h3>
            <div className="space-y-3">
              {announcements.map((item) => (
                <div key={item.id} className="bg-white border border-brand-border p-3.5">
                  <h4 className="text-xs font-bold text-brand-dark mb-1">{item.title}</h4>
                  <p className="text-xs text-brand-text leading-relaxed font-light">{item.content}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact & Map Detail */}
          <div className="flex flex-col space-y-3 pt-2">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#8C6B3D] border-b border-[#E8E2D0] pb-1 w-fit">營業與交通資訊</h3>
            <div className="space-y-3 text-xs text-brand-text">
              <div className="flex items-start space-x-2.5">
                <Clock className="h-4 w-4 text-brand-accent shrink-0 mt-0.5" />
                <div className="flex flex-col space-y-0.5">
                  <span className="font-medium">午餐：11:30 - 14:30</span>
                  <span className="font-medium">晚餐：17:30 - 21:30</span>
                  <span className="text-[10px] text-brand-accent">(每週二店休)</span>
                </div>
              </div>
              
              <div className="flex items-start space-x-2.5">
                <MapPin className="h-4 w-4 text-brand-accent shrink-0 mt-0.5" />
                <span className="leading-relaxed">台北市大安區青田街 88 號<br />(近捷運東門站 5 號出口)</span>
              </div>

              <div className="flex items-start space-x-2.5">
                <Phone className="h-4 w-4 text-brand-accent shrink-0 mt-0.5" />
                <span className="hover:text-brand-dark transition-colors cursor-pointer font-bold">02-2396-8888</span>
              </div>
            </div>
          </div>

          {/* Notice Warning Card */}
          <div className="border border-brand-border bg-white p-3.5 flex items-start space-x-2 text-brand-dark">
            <AlertTriangle className="h-4 w-4 text-brand-accent shrink-0 mt-0.5" />
            <div className="flex flex-col space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider">訂位須知</span>
              <span className="text-[11px] leading-relaxed text-brand-text">為了提供一流的用餐體驗，6 位（含）以上預約請致電客服預約並預付訂金。</span>
            </div>
          </div>

        </div>

        {/* Footer info brand */}
        <div className="pt-4 border-t border-brand-border text-center">
          <p className="text-[9px] text-brand-muted font-light tracking-[0.2em]">
            © 2026 MIYABI RESTAURANT
          </p>
        </div>
      </aside>
    </>
  );
}
