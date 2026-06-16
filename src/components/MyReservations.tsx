import React from "react";
import { Reservation } from "../types";
import { Calendar, Clock, Users, Coffee, HelpCircle, XCircle, AlertTriangle, Trash2, CheckCircle, Ban } from "lucide-react";
import { motion } from "motion/react";

interface MyReservationsProps {
  reservations: Reservation[];
  onCancel: (id: string) => void;
  isLoading: boolean;
  setView: (view: any) => void;
}

export default function MyReservations({
  reservations,
  onCancel,
  isLoading,
  setView,
}: MyReservationsProps) {
  
  if (isLoading) {
    return (
      <div id="loading-reservations-shimmer" className="flex flex-col items-center justify-center py-16 space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-border border-t-brand-accent" />
        <p className="text-xs text-brand-muted tracking-wide">正在準備您的和席預約紀錄...</p>
      </div>
    );
  }

  // Helper for status styling
  const getStatusBadge = (status: Reservation["status"]) => {
    switch (status) {
      case "confirmed":
        return (
          <span className="inline-flex items-center gap-1 border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
            <span>已受理確認</span>
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 animate-pulse">
            <span>安排中</span>
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center gap-1 border border-zinc-200 bg-zinc-100 px-2 py-0.5 text-[10px] font-bold text-zinc-650">
            <span>已圓滿消費</span>
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1 border border-rose-200 bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-700">
            <span>已取消預約</span>
          </span>
        );
      default:
        return null;
    }
  };

  // Split reservations into active and inactive
  const activeBookings = reservations.filter(r => r.status === "confirmed" || r.status === "pending");
  const pastOrCreateCancelled = reservations.filter(r => r.status === "completed" || r.status === "cancelled");

  return (
    <div id="reservations-deck" className="space-y-8">
      
      {/* Title */}
      <div className="border-b border-brand-border pb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-serif text-3xl font-normal text-brand-dark tracking-widest">我的雅堂預約</h2>
          <p className="text-xs text-brand-muted mt-1 font-normal tracking-wider">您可在本面板中隨時查閱、補齊通知，或申請延遲及取消。</p>
        </div>
        <button
          onClick={() => setView("book")}
          className="bg-brand-dark px-5 py-3 text-xs uppercase tracking-widest font-bold text-[#FCF9F0] hover:bg-brand-accent transition-colors cursor-pointer"
        >
          預訂新席座
        </button>
      </div>

      {/* Main reservation layouts */}
      {reservations.length === 0 ? (
        <div className="border border-dashed border-brand-border bg-white p-12 text-center max-w-xl mx-auto space-y-6">
          <div className="flex h-12 w-12 items-center justify-center border border-brand-border text-brand-accent mx-auto">
            <Calendar className="h-5 w-5" />
          </div>
          <div className="space-y-2">
            <h3 className="font-serif text-lg font-normal text-brand-dark tracking-wider">尚無預約和席紀錄</h3>
            <p className="text-xs text-brand-muted max-w-sm mx-auto leading-relaxed">
              雅庵全體廚組與料理長皆誠摯等候貴客大駕。現在可點擊下方按鈕，僅需 1 分鐘即可完成席次預定。
            </p>
          </div>
          <button
            onClick={() => setView("book")}
            className="bg-brand-dark px-6 py-3 text-xs uppercase tracking-widest font-bold text-[#FCF9F0] hover:bg-brand-accent transition-colors cursor-pointer"
          >
            立即預約新座位
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          
          {/* Active Reservations (Cards layout) */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-brand-dark border-l border-brand-accent pl-2">
              近期安排用餐 ({activeBookings.length})
            </h3>

            {activeBookings.length === 0 ? (
              <p className="text-xs text-brand-muted italic pl-1">近期無安排中的餐會預約。</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeBookings.map((res) => (
                  <div
                    key={res.id}
                    className="border border-brand-border bg-white p-5 flex flex-col justify-between space-y-4 relative overflow-hidden transition-colors"
                  >
                    {/* Visual tatami wooden floor top line indicator */}
                    <div className="absolute top-0 right-0 left-0 h-1 bg-brand-accent" />

                    {/* Card Header information */}
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold tracking-widest text-brand-accent bg-[#FCF9F0] px-2 py-0.5 border border-brand-border uppercase">
                          傳統席座 第 {res.tableNum} 桌
                        </span>
                        <h4 className="font-serif text-base font-normal text-brand-dark mt-2">{res.name} 貴賓辦席</h4>
                      </div>
                      {getStatusBadge(res.status)}
                    </div>

                    <div className="h-[1px] bg-brand-border" />

                    {/* Dining Details Grid */}
                    <div className="grid grid-cols-3 gap-2 text-xs font-medium text-brand-dark leading-relaxed">
                      <div className="flex flex-col space-y-0.5">
                        <span className="text-[10px] text-brand-muted font-normal">用餐日期</span>
                        <span className="text-brand-dark flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-brand-accent" />
                          {res.date}
                        </span>
                      </div>
                      <div className="flex flex-col space-y-0.5">
                        <span className="text-[10px] text-brand-muted font-normal">用餐時間</span>
                        <span className="text-brand-dark flex items-center gap-1">
                          <Clock className="h-3 w-3 text-brand-accent" />
                          {res.time}
                        </span>
                      </div>
                      <div className="flex flex-col space-y-0.5">
                        <span className="text-[10px] text-brand-muted font-normal">用餐人數</span>
                        <span className="text-brand-dark flex items-center gap-1">
                          <Users className="h-3 w-3 text-brand-accent" />
                          {res.guests} 人席位
                        </span>
                      </div>
                    </div>

                    {res.notes && (
                      <div className="bg-[#FCF9F0] border border-brand-border p-3 text-[11px] leading-relaxed text-brand-text border-l-2 border-l-brand-accent font-normal">
                        <span className="font-bold text-brand-dark block text-[10px] uppercase tracking-widest mb-1">貴賓特別備註：</span>
                        {res.notes}
                      </div>
                    )}

                    <div className="pt-2 border-t border-brand-border flex items-center justify-between">
                      <div className="text-[10px] text-brand-muted font-normal">
                        訂單代碼：{res.id} <br />
                        預訂於：{new Date(res.createdAt).toLocaleDateString()}
                      </div>
                      
                      <button
                        onClick={() => {
                          if (window.confirm("您確定要取消本次在雅庵的訂位嗎？這動作完成後將通知廚師撤回預訂。")) {
                            onCancel(res.id);
                          }
                        }}
                        className="flex items-center space-x-1 border border-rose-200 bg-rose-50 px-3 py-1.5 text-[11px] font-bold text-rose-700 hover:bg-[#FFF5F5] transition-colors cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>取消訂位</span>
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Past / Canceled Reservations */}
          <div className="space-y-4 pt-4 border-t border-brand-border">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#8C6B3D]">
              歷史紀錄與其他 ({pastOrCreateCancelled.length})
            </h3>
            
            {pastOrCreateCancelled.length === 0 ? (
              <p className="text-xs text-brand-muted pl-1 italic">尚無歷史取消或完成紀錄。</p>
            ) : (
              <div className="space-y-3">
                {pastOrCreateCancelled.map((res) => (
                  <div
                    key={res.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between border border-brand-border bg-[#FCF9F0]/30 p-4 text-xs gap-4 transition-colors hover:bg-brand-sidebar"
                  >
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                      <div className="font-serif font-normal text-brand-dark min-w-[120px]">
                        {res.name} 貴賓 ({res.guests}人席)
                      </div>
                      
                      <div className="text-brand-text font-medium flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-brand-accent" />
                        <span>{res.date}</span>
                        <Clock className="h-3.5 w-3.5 text-brand-accent ml-1.5" />
                        <span>{res.time}</span>
                      </div>

                      {res.notes && (
                        <div className="text-[11px] text-brand-muted truncate max-w-xs" title={res.notes}>
                          ※ 備註: {res.notes}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-3 justify-end shrink-0">
                      <span className="text-[10px] text-brand-muted font-mono">
                        代碼：{res.id}
                      </span>
                      {getStatusBadge(res.status)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* Helpful FAQ Notice style */}
      <div className="border border-brand-border bg-brand-sidebar p-5 mt-4 space-y-3.5 text-brand-text">
        <h4 className="text-xs font-bold uppercase tracking-widest text-brand-dark border-b border-brand-border pb-2">
          訂位管理小問答
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs leading-relaxed">
          <div className="space-y-1">
            <h5 className="font-bold text-brand-accent">Q. 可以修改預期時間與人數嗎？</h5>
            <p className="font-normal text-brand-text text-[11px]">
              目前系統仅支持於本面板取消重訂。如需直接微調（如多增 1 位同行、往後順延 30 分鐘），建議撥打客服電話 (02-2396-8888)，我們客服人員將親自為您在後台改動安排。
            </p>
          </div>
          <div className="space-y-1">
            <h5 className="font-bold text-brand-accent">Q. 如果遇颱風或不可抗抗拒之天然災害？</h5>
            <p className="font-normal text-brand-text text-[11px]">
              雅庵將配合政府公佈之停班停課政策自動停業，並自動致電通知所有受影響的貴賓。本訂位系統不收手續費，請您安心。
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
