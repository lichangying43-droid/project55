import React, { useState } from "react";
import { User as UserType, Reservation } from "../types";
import { Calendar, User, Phone, Mail, Clock, Users, FileText, CheckCircle2, ChevronRight, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ReservationFormProps {
  currentUser: UserType | null;
  onSubmit: (data: Omit<Reservation, "id" | "userId" | "tableNum" | "status" | "createdAt">, onSuccess: () => void) => void;
  isLoading: boolean;
}

export default function ReservationForm({ currentUser, onSubmit, isLoading }: ReservationFormProps) {
  // Local states
  const [name, setName] = useState(currentUser?.name || "");
  const [phone, setPhone] = useState(currentUser?.phone || "");
  const [email, setEmail] = useState(currentUser?.email || "");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [guests, setGuests] = useState(2);
  const [notes, setNotes] = useState("");
  const [seatingType, setSeatingType] = useState<"bar" | "tatami" | "booth">("tatami");
  const [formError, setFormError] = useState("");
  const [showThankYou, setShowThankYou] = useState(false);
  const [bookedDetails, setBookedDetails] = useState<Reservation | null>(null);

  // Time Slots
  const lunchSlots = ["11:30", "12:00", "12:30", "13:00"];
  const dinnerSlots = ["17:30", "18:00", "18:30", "19:00", "19:30", "20:00"];

  // Handle Seating Choice Clicking
  const selectSeating = (type: "bar" | "tatami" | "booth") => {
    setSeatingType(type);
    let autoNote = "";
    if (type === "bar") autoNote = "偏好安排：檜木吧檯席位（可近距離觀看主廚刀工）";
    if (type === "tatami") autoNote = "偏好安排：榻榻米景觀窗位";
    if (type === "booth") autoNote = "偏好安排：暖簾獨立隔間沙發位";
    
    // Auto-fill or append notes
    setNotes(autoNote);
  };

  // Get current date string for min date (local time is 2026-06-15)
  const todayStr = "2026-06-15";

  // Form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !email || !date || !time || !guests) {
      setFormError("請確認已填寫：姓名、聯絡電話、電子信箱、用餐日期、用餐時間。");
      return;
    }
    setFormError("");

    const dataObj = {
      name,
      phone,
      email,
      date,
      time,
      guests,
      notes: notes.trim(),
    };

    onSubmit(dataObj, () => {
      // Simulate booking animation
      setShowThankYou(true);
      // Reset form variables
      setDate("");
      setTime("");
      setNotes("");
    });
  };

  return (
    <div id="booking-form-deck" className="bg-white border border-brand-border p-6 sm:p-10">
      <AnimatePresence mode="wait">
        {!showThankYou ? (
          <motion.div
            key="booking-form-step"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-8"
          >
            {/* Header Form Title */}
            <div className="border-b border-brand-border pb-5">
              <h2 className="font-serif text-3xl font-normal text-brand-dark tracking-widest">線上預約雅室</h2>
              <p className="text-xs text-brand-muted mt-1 font-normal tracking-wider">請填寫預訂資訊，我們將立即為您指派傳統檜席桌號。</p>
            </div>

            {formError && (
              <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-4 text-xs font-bold text-rose-800 flex items-start gap-2.5 shadow-2xs">
                <AlertCircle className="h-4.5 w-4.5 text-rose-600 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: Form Details (8 cols) */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* 1. Basic details (Name, Phone, Email) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5 flex flex-col">
                    <label className="text-xs font-medium text-brand-dark uppercase tracking-widest flex items-center gap-1">
                      貴賓姓名 <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="請輸入您的真實姓名"
                      className="border border-brand-border bg-brand-bg px-3.5 py-3 text-sm text-brand-dark placeholder-brand-muted/50 focus:border-brand-accent focus:bg-white focus:outline-hidden transition-colors"
                      required
                    />
                  </div>

                  <div className="space-y-1.5 flex flex-col">
                    <label className="text-xs font-medium text-brand-dark uppercase tracking-widest flex items-center gap-1">
                      聯絡電話 <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="範例：0912-345-678"
                      className="border border-brand-border bg-brand-bg px-3.5 py-3 text-sm text-brand-dark placeholder-brand-muted/50 focus:border-brand-accent focus:bg-white focus:outline-hidden transition-colors"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5 flex flex-col">
                  <label className="text-xs font-medium text-brand-dark uppercase tracking-widest flex items-center gap-1">
                    電子信箱 <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="用於寄送行程確認信件"
                    className="border border-brand-border bg-brand-bg px-3.5 py-3 text-sm text-brand-dark placeholder-brand-muted/50 focus:border-brand-accent focus:bg-white focus:outline-hidden transition-colors w-full"
                    required
                  />
                </div>

                {/* 2. Date and Guest count selector */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5 flex flex-col">
                    <label className="text-xs font-medium text-brand-dark uppercase tracking-widest flex items-center gap-1">
                      預定日期 <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={date}
                      min={todayStr}
                      onChange={(e) => setDate(e.target.value)}
                      className="border border-brand-border bg-brand-bg px-3.5 py-3 text-sm text-brand-dark focus:border-brand-accent focus:bg-white focus:outline-hidden transition-colors"
                      required
                    />
                  </div>

                  <div className="space-y-1.5 flex flex-col">
                    <label className="text-xs font-medium text-brand-dark uppercase tracking-widest flex items-center gap-1">
                      用餐人數 <span className="text-rose-500">*</span>
                    </label>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => setGuests(prev => Math.max(1, prev - 1))}
                        className="flex h-11 w-11 items-center justify-center border border-brand-border bg-brand-bg text-brand-dark hover:bg-brand-border font-bold transition-colors cursor-pointer"
                      >
                        -
                      </button>
                      <div className="flex-1 text-center font-bold text-brand-dark border border-brand-border py-3 bg-[#FCF9F0] text-sm">
                        {guests} 人
                      </div>
                      <button
                        type="button"
                        onClick={() => setGuests(prev => Math.min(20, prev + 1))}
                        className="flex h-11 w-11 items-center justify-center border border-brand-border bg-brand-bg text-brand-dark hover:bg-brand-border font-bold transition-colors cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {guests >= 6 && (
                  <div className="border border-brand-border bg-brand-sidebar p-3.5 text-[11px] text-brand-text flex items-start gap-1.5 leading-relaxed">
                    <Users className="h-4 w-4 text-brand-accent shrink-0 mt-0.5" />
                    <span>
                      ※ 提醒您：六人（含）以上大型預約，主廚建議提早來電 （02-2396-8888）洽詢包廂配膳，讓我們能特別為您精心佈置塌塌米空間。
                    </span>
                  </div>
                )}

                {/* 3. Slot Selector for Time */}
                 <div className="space-y-2 flex flex-col">
                  <label className="text-xs font-medium text-brand-dark uppercase tracking-widest flex items-center gap-1">
                    用餐席段 <span className="text-rose-500">*</span> {time ? `(您已選擇 ${time})` : ""}
                  </label>
                  
                  <div className="space-y-4 bg-brand-sidebar p-4 border border-brand-border">
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold uppercase text-brand-accent tracking-widest">午午間割烹檔位</span>
                      <div className="grid grid-cols-4 gap-2">
                        {lunchSlots.map((slot) => (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setTime(slot)}
                            className={`py-2 text-xs font-bold transition-colors cursor-pointer border ${
                              time === slot
                                ? "bg-brand-accent text-white border-brand-accent"
                                : "bg-white border-brand-border text-brand-text hover:bg-[#FCF9F0]"
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold uppercase text-brand-accent tracking-widest">晚晚間割烹檔位</span>
                      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                        {dinnerSlots.map((slot) => (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setTime(slot)}
                            className={`py-2 text-xs font-bold transition-colors cursor-pointer border ${
                              time === slot
                                ? "bg-brand-accent text-white border-brand-accent"
                                : "bg-white border-brand-border text-brand-text hover:bg-[#FCF9F0]"
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. Notes textarea */}
                <div className="space-y-1.5 flex flex-col">
                  <label className="text-xs font-medium text-brand-dark uppercase tracking-widest flex items-center gap-1">
                    特殊備註
                  </label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="例如：慶祝結婚週年、不食生牛肉、需要嬰兒桌椅、希望特殊素食配置等..."
                    className="border border-brand-border bg-brand-bg px-3.5 py-3 text-sm text-brand-dark placeholder-brand-muted/50 focus:border-brand-accent focus:bg-white focus:outline-hidden transition-colors w-full resize-none"
                  />
                </div>

              </div>

              {/* Right Column: Visual Seating Map & Submit Button (5 cols) */}
              <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
                
                {/* Visual Layout map */}
                <div className="border border-brand-border bg-brand-sidebar p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-brand-dark uppercase tracking-widest border-l border-brand-accent pl-2">
                      雅堂席席座預覽
                    </h3>
                    <span className="text-[10px] text-brand-muted font-normal">請點擊選擇偏好席位</span>
                  </div>

                  {/* Visual 2D Seating Layout Map */}
                  <div className="border border-brand-border bg-white p-4 space-y-4 relative overflow-hidden">
                    
                    {/* Visual representation of Tokonoma/Japan garden border */}
                    <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-emerald-600 to-emerald-800" title="庭園景觀" />
                    
                    {/* The Seating Map items */}
                    <div className="grid grid-cols-1 gap-2 pt-2">
                      {/* 1. Bar counters seating */}
                      <div
                        onClick={() => selectSeating("bar")}
                        className={`flex flex-col text-left p-3 border cursor-pointer transition-colors ${
                          seatingType === "bar"
                            ? "bg-[#FAF7ED] border-brand-accent text-brand-dark font-bold"
                            : "bg-[#FCF9F0]/40 border-transparent text-brand-text hover:bg-[#FCF9F0] hover:border-brand-border"
                        }`}
                      >
                        <span className="text-xs font-bold">【檜木吧檯特別座】 (1-2人)</span>
                        <span className="text-[10px] text-brand-muted mt-1 leading-relaxed">近距離觀賞主廚生魚切法與江戶前奉茶。</span>
                      </div>

                      {/* 2. Window seat tatami */}
                      <div
                        onClick={() => selectSeating("tatami")}
                        className={`flex flex-col text-left p-3 border cursor-pointer transition-colors ${
                          seatingType === "tatami"
                            ? "bg-[#FAF7ED] border-brand-accent text-brand-dark font-bold"
                            : "bg-[#FCF9F0]/40 border-transparent text-brand-text hover:bg-[#FCF9F0] hover:border-brand-border"
                        }`}
                      >
                        <span className="text-xs font-bold">【塌塌米傳統窓位】 (2-6人)</span>
                        <span className="text-[10px] text-brand-muted mt-1 leading-relaxed">臨窗禪風竹林流景，體驗傳統純日式尊榮。</span>
                      </div>

                      {/* 3. Noren booth sofa seating */}
                      <div
                        onClick={() => selectSeating("booth")}
                        className={`flex flex-col text-left p-3 border cursor-pointer transition-colors ${
                          seatingType === "booth"
                            ? "bg-[#FAF7ED] border-brand-accent text-brand-dark font-bold"
                            : "bg-[#FCF9F0]/40 border-transparent text-brand-text hover:bg-[#FCF9F0] hover:border-brand-border"
                        }`}
                      >
                        <span className="text-xs font-bold">【暖簾獨立隔間】 (2-8人)</span>
                        <span className="text-[10px] text-brand-muted mt-1 leading-relaxed">日系垂吊暖簾阻隔，適合商談或安心聚餐。</span>
                      </div>

                    </div>
                  </div>
                  
                  {/* Miniature map legend */}
                  <p className="text-[10px] text-brand-muted leading-relaxed">
                    ※ 席位分配依當日廚房安排為主。如有特殊長輩坐椅、行動不便人士陪同，請於「特殊備註」欄註記，我們將優先為您保留一樓無障礙窗位。
                  </p>
                </div>

                {/* Complete submit block */}
                <div className="space-y-3">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex w-full items-center justify-center space-x-2 bg-brand-dark py-4 text-xs font-bold uppercase tracking-widest text-[#FCF9F0] hover:bg-brand-accent transition-colors duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>{isLoading ? "送出預約中..." : "確認送出雅座預約"}</span>
                    <ChevronRight className="h-4.5 w-4.5" />
                  </button>

                  <p className="text-[10px] text-center text-brand-muted leading-relaxed">
                    預訂完成後，我們將立即為您寄出預約通知信，並可在「我的訂位」中查閱和管理。開席前 1 天我們會為您致電。
                  </p>
                </div>

              </div>

            </form>
          </motion.div>
        ) : (
          <motion.div
            key="thank-you-step"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center text-center py-12 max-w-xl mx-auto space-y-6"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-xs">
              <CheckCircle2 className="h-10 w-10" />
            </div>

            <div className="space-y-2">
              <h3 className="font-serif text-2xl font-normal text-brand-dark tracking-wider">訂位成功！閣下預約已受理</h3>
              <p className="text-sm text-brand-text font-normal">
                雅庵感謝您的支持。本筆預約已記錄於系統，您可以隨時在「我的訂位」網頁切換取消。
              </p>
            </div>

            {/* Quick summary card */}
            <div className="w-full border border-brand-border bg-brand-sidebar p-6 text-left text-xs text-brand-dark space-y-3.5">
              <div className="flex justify-between border-b border-brand-border pb-2">
                <span className="text-brand-muted font-normal">預訂大名：</span>
                <span className="font-bold">{name} 閣下</span>
              </div>
              <div className="flex justify-between border-b border-brand-border pb-2">
                <span className="text-brand-muted font-normal">用餐人數：</span>
                <span className="font-bold">{guests} 貴賓</span>
              </div>
              <div className="flex justify-between border-b border-brand-border pb-2">
                <span className="text-brand-muted font-normal">用餐日期 / 時間：</span>
                <span className="font-bold">{date} — {time}</span>
              </div>
              {notes && (
                <div className="flex flex-col gap-1 border-b border-brand-border pb-2">
                  <span className="text-brand-muted font-normal">特別需求：</span>
                  <span className="text-brand-text bg-white p-3 border border-brand-border text-[11px] leading-relaxed italic">{notes}</span>
                </div>
              )}
              <div className="flex justify-between text-[11px] font-bold text-brand-accent">
                <span>自動指派：廚房 A 組席座</span>
                <span>狀態：已自動確認 (Confirmed)</span>
              </div>
            </div>

            <button
              onClick={() => setShowThankYou(false)}
              className="bg-brand-dark px-6 py-3 text-xs uppercase tracking-widest font-bold text-[#FCF9F0] hover:bg-brand-accent transition-colors cursor-pointer"
            >
              建立新預約 / 返回表單
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
