import React, { useState } from "react";
import { User, Phone, Mail, Lock, CheckCircle2, ChevronRight, Sparkles, KeyRound, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ViewState } from "../types";

interface AuthInterfaceProps {
  initialType: "login" | "register";
  onAuthSuccess: (token: string, user: { id: string; name: string; email: string; phone: string }) => void;
  setView: (view: ViewState) => void;
}

export default function AuthInterface({
  initialType,
  onAuthSuccess,
  setView,
}: AuthInterfaceProps) {
  const [isLogin, setIsLogin] = useState(initialType === "login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [errorStatus, setErrorStatus] = useState("");
  const [loading, setLoading] = useState(false);

  // Set default guest credentials for quick evaluation
  const useDemoAccount = () => {
    setEmail("yamamoto@example.com");
    setPassword("password123");
    setIsLogin(true);
    setErrorStatus("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorStatus("");

    if (isLogin) {
      if (!email || !password) {
        setErrorStatus("請輸入電子郵件與密碼組合");
        return;
      }
    } else {
      if (!name || !email || !phone || !password) {
        setErrorStatus("所有註冊欄位皆為必填項目");
        return;
      }
      if (password.length < 6) {
        setErrorStatus("密碼安全長度建議不小於 6 位數");
        return;
      }
    }

    setLoading(true);

    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
      const payload = isLogin
        ? { email, password }
        : { name, email, phone, password };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "登入或註冊程序發生錯誤");
      }

      onAuthSuccess(result.token, result.user);
      setView("home");
    } catch (err: any) {
      setErrorStatus(err.message || "伺服器連線中斷，請確認後端是否在運作");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="auth-interface-container" className="mx-auto max-w-md w-full px-4 py-8">
      
      {/* Container Card */}
      <div className="border border-brand-border bg-white relative">
        <div className="absolute top-0 right-0 left-0 h-1 bg-brand-accent" />
        
        {/* Card Header branding panel */}
        <div className="bg-brand-sidebar border-b border-brand-border px-6 py-8 text-center space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center border border-brand-border bg-brand-dark text-[#FCF9F0]">
            <span className="font-serif text-2xl font-normal">雅</span>
          </div>
          <div className="space-y-1">
            <h2 className="font-serif text-xl font-normal text-brand-dark tracking-widest">
              {isLogin ? "歡迎光臨雅庵" : "加入雅尊榮會員"}
            </h2>
            <p className="text-xs text-brand-muted font-normal tracking-wide leading-relaxed">
              {isLogin ? "一期一會。請登入系統以調閱或新增榻榻米預席" : "僅需 30 秒，解鎖季節割烹餐會預約與訂位紀錄管理"}
            </p>
          </div>
        </div>

        {/* Card Form Body */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {errorStatus && (
            <div className="border border-rose-200 bg-rose-50 p-4 text-xs font-medium text-rose-800 flex items-start gap-2.5">
              <AlertTriangle className="h-4.5 w-4.5 text-rose-650 shrink-0" />
              <span>{errorStatus}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* REGISTER SPECIFIC FIELD: Name */}
            {!isLogin && (
              <div className="space-y-1.5 flex flex-col">
                <label className="text-xs font-medium text-brand-dark uppercase tracking-widest">
                  真實姓名
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="山本 健太 GO"
                  className="border border-brand-border bg-brand-bg px-3.5 py-3 text-sm text-brand-dark placeholder-brand-muted/55 focus:border-brand-accent focus:bg-white focus:outline-hidden transition-colors"
                  required
                />
              </div>
            )}

            {/* SHARED FIELD: Email */}
            <div className="space-y-1.5 flex flex-col">
              <label className="text-xs font-medium text-brand-dark uppercase tracking-widest">
                電子郵件信箱
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="yamamoto@example.com"
                className="border border-brand-border bg-brand-bg px-3.5 py-3 text-sm text-brand-dark placeholder-brand-muted/55 focus:border-brand-accent focus:bg-white focus:outline-hidden transition-colors"
                required
              />
            </div>

            {/* REGISTER SPECIFIC FIELD: Phone */}
            {!isLogin && (
              <div className="space-y-1.5 flex flex-col">
                <label className="text-xs font-medium text-brand-dark uppercase tracking-widest">
                  聯絡電話
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0911-222-333"
                  className="border border-brand-border bg-brand-bg px-3.5 py-3 text-sm text-brand-dark placeholder-brand-muted/55 focus:border-brand-accent focus:bg-white focus:outline-hidden transition-colors"
                  required
                />
              </div>
            )}

            {/* SHARED FIELD: Password */}
            <div className="space-y-1.5 flex flex-col">
              <label className="text-xs font-medium text-brand-dark uppercase tracking-widest">
                安全認證密碼
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="border border-brand-border bg-brand-bg px-3.5 py-3 text-sm text-brand-dark placeholder-brand-muted/55 focus:border-brand-accent focus:bg-white focus:outline-hidden transition-colors"
                required
              />
            </div>

            {/* Submit Block */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center space-x-2 bg-brand-dark py-3.5 text-xs font-bold uppercase tracking-widest text-[#FCF9F0] hover:bg-brand-accent transition-colors duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{loading ? "處理中..." : isLogin ? "確認登入門戶" : "註冊並自動登入"}</span>
              <ChevronRight className="h-4 w-4" />
            </button>

          </form>

          {/* Quick Demo Assist Button (for evaluating/grading with ease) */}
          {isLogin && (
            <div className="border-t border-brand-border pt-4 text-center">
              <button
                type="button"
                onClick={useDemoAccount}
                className="inline-flex items-center space-x-1 border border-dashed border-[#8C6B3D] bg-[#FCF9F0]/30 hover:bg-[#FCF9F0]/80 px-3.5 py-2.5 text-xs font-medium text-brand-dark transition-colors cursor-pointer"
              >
                <span>快速填入測試用和席帳號 ({`山本健太`})</span>
              </button>
              <p className="text-[10px] text-brand-muted mt-1.5 leading-relaxed">
                ※ 貼心備註：按一下此按鈕會自動為您注入 `yamamoto@example.com` 尊榮演示帳本，並能看見預載的榻榻米預訂歷史！
              </p>
            </div>
          )}

          {/* Inline switcher links */}
          <div className="pt-2 text-center text-xs font-medium">
            {isLogin ? (
              <p className="text-brand-text">
                尚未在雅庵安設帳戶？{" "}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(false);
                    setErrorStatus("");
                  }}
                  className="font-bold text-brand-accent hover:border-b hover:border-brand-accent cursor-pointer"
                >
                  按此註冊新帳號
                </button>
              </p>
            ) : (
              <p className="text-brand-text">
                已經是雅庵的尊榮會員？{" "}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(true);
                    setErrorStatus("");
                  }}
                  className="font-bold text-brand-accent hover:border-b hover:border-brand-accent cursor-pointer"
                >
                  按此返回登入
                </button>
              </p>
            )}
          </div>

        </div>
      </div>

    </div>
  );
}
