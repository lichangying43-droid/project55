/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import HeroHome from "./components/HeroHome";
import ReservationForm from "./components/ReservationForm";
import MyReservations from "./components/MyReservations";
import AuthInterface from "./components/AuthInterface";
import { User, Reservation, ViewState } from "./types";
import { motion, AnimatePresence } from "motion/react";
import { AlertCircle, CalendarRange } from "lucide-react";

export default function App() {
  // Member authorization state
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  
  // App views state
  const [currentView, setView] = useState<ViewState>("home");
  
  // Mobile drawer state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Reservation datasets
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loadingReservations, setLoadingReservations] = useState(false);
  const [formIsLoading, setFormIsLoading] = useState(false);
  const [globalError, setGlobalError] = useState("");

  // 1. Initial mounting: Check localStorage token for session restoration
  useEffect(() => {
    const savedToken = localStorage.getItem("miyabi_token");
    const savedUserStr = localStorage.getItem("miyabi_user");

    if (savedToken && savedUserStr) {
      try {
        const u = JSON.parse(savedUserStr);
        setToken(savedToken);
        setCurrentUser(u);
        // Promptly fetch their existing reservations
        fetchReservations(savedToken);
      } catch (err) {
        console.error("Failed to parse saved user credentials:", err);
        localStorage.removeItem("miyabi_token");
        localStorage.removeItem("miyabi_user");
      }
    }
  }, []);

  // 2. Fetch reservations with current active token
  const fetchReservations = async (bearerToken: string) => {
    setLoadingReservations(true);
    setGlobalError("");
    try {
      const response = await fetch("/api/reservations", {
        headers: {
          Authorization: `Bearer ${bearerToken}`
        }
      });
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "無法調閱您的訂位明細");
      }
      const data = await response.json();
      setReservations(data);
    } catch (err: any) {
      console.error(err);
      setGlobalError(err.message || "取得預約列表發生錯誤，請確認網路連線。");
    } finally {
      setLoadingReservations(false);
    }
  };

  // 3. User Authentication success
  const handleAuthSuccess = (newToken: string, user: User) => {
    setToken(newToken);
    setCurrentUser(user);
    localStorage.setItem("miyabi_token", newToken);
    localStorage.setItem("miyabi_user", JSON.stringify(user));
    setGlobalError("");
    
    // Smoothly load user's reservation list on authentication success
    fetchReservations(newToken);
  };

  // 4. Logout user
  const handleLogout = () => {
    setToken(null);
    setCurrentUser(null);
    setReservations([]);
    localStorage.removeItem("miyabi_token");
    localStorage.removeItem("miyabi_user");
    setView("home");
  };

  // 5. Submit reservation booking
  const handleBookingSubmit = async (
    bookingData: Omit<Reservation, "id" | "userId" | "tableNum" | "status" | "createdAt">,
    onSuccess: () => void
  ) => {
    if (!token) {
      setGlobalError("預期已逾期，請先完成會員登入");
      setView("login");
      return;
    }

    setFormIsLoading(true);
    setGlobalError("");

    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(bookingData)
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "預約失敗，請確認欄位配置");
      }

      // Re-fetch list to include newly created row
      await fetchReservations(token);
      onSuccess();
    } catch (err: any) {
      setGlobalError(err.message || "與伺服器連接錯誤，請稍後重試");
    } finally {
      setFormIsLoading(false);
    }
  };

  // 6. Cancel booking
  const handleCancelReservation = async (reservationId: string) => {
    if (!token) return;
    setLoadingReservations(true);
    setGlobalError("");

    try {
      const response = await fetch(`/api/reservations/${reservationId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "取消訂位服務發生錯誤");
      }

      // Re-fetch updated list
      await fetchReservations(token);
    } catch (err: any) {
      setGlobalError(err.message || "連線逾期，取消程序未正常執行");
    } finally {
      setLoadingReservations(false);
    }
  };

  // 7. Protected View Access Controller
  const executeViewChange = (targetView: ViewState) => {
    // If user attempts to go book or my-reservations without being logged in, forward to login
    if ((targetView === "book" || targetView === "my-reservations") && !currentUser) {
      setView("login");
    } else {
      setView(targetView);
    }
    // Close mobile side drawer on navigations
    setIsSidebarOpen(false);
  };

  // 8. Render primary view panel
  const renderMainContent = () => {
    switch (currentView) {
      case "home":
        return <HeroHome currentUser={currentUser} setView={executeViewChange} />;
      case "book":
        return (
          <ReservationForm
            currentUser={currentUser}
            onSubmit={handleBookingSubmit}
            isLoading={formIsLoading}
          />
        );
      case "my-reservations":
        return (
          <MyReservations
            reservations={reservations}
            onCancel={handleCancelReservation}
            isLoading={loadingReservations}
            setView={executeViewChange}
          />
        );
      case "login":
        return (
          <AuthInterface
            initialType="login"
            onAuthSuccess={handleAuthSuccess}
            setView={executeViewChange}
          />
        );
      case "register":
        return (
          <AuthInterface
            initialType="register"
            onAuthSuccess={handleAuthSuccess}
            setView={executeViewChange}
          />
        );
      default:
        return <HeroHome currentUser={currentUser} setView={executeViewChange} />;
    }
  };

  return (
    <div id="miyabi-root-layout" className="min-h-screen flex flex-col bg-[#FAF6EB]">
      
      {/* Navbar segment */}
      <Navbar
        currentUser={currentUser}
        currentView={currentView}
        setView={executeViewChange}
        onLogout={handleLogout}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Global Alerts inside top container */}
      {globalError && (
        <div className="bg-rose-50 border-b border-rose-200 py-3.5 px-4 text-xs font-bold text-rose-800 text-center flex items-center justify-center gap-2">
          <AlertCircle className="h-4.5 w-4.5 text-rose-600 shrink-0" />
          <span>{globalError}</span>
        </div>
      )}

      {/* Main Dual-Panel Structure (Sidebar + Dynamic Viewport) */}
      <div className="flex-1 w-full max-w-7xl mx-auto flex flex-col md:flex-row relative">
        
        {/* Left Sidepanel (Info cards, announcements, maps) */}
        <Sidebar
          currentUser={currentUser}
          currentView={currentView}
          setView={executeViewChange}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Right Active Viewport content panel */}
        <main id="app-view-deck" className="flex-1 p-4 sm:p-6 lg:p-8 overflow-hidden min-w-0">
          
          {/* Quick Member welcome banner on top of standard viewports (except login pages) */}
          {currentUser && currentView !== "login" && currentView !== "register" && (
            <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50/40 p-4 flex items-center justify-between gap-4 shadow-2xs">
              <div className="flex items-center space-x-3 text-amber-950 font-semibold truncate text-xs sm:text-sm">
                <div className="bg-amber-100 flex h-8 w-8 items-center justify-center rounded-full shrink-0">
                  <span className="font-serif font-black text-amber-700">席</span>
                </div>
                <span className="truncate">尊客 {currentUser.name} 閣下，雅庵餐位已為您準備就緒。</span>
              </div>
              
              {currentView !== "my-reservations" && (
                <button
                  onClick={() => setView("my-reservations")}
                  className="shrink-0 text-xs text-amber-700 hover:text-amber-900 border-b border-amber-200 font-bold transition-all"
                >
                  細看我的席位 ({reservations.length})
                </button>
              )}
            </div>
          )}

          {/* Animate Page View Transitions */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.16, ease: "easeOut" }}
              className="h-full"
            >
              {renderMainContent()}
            </motion.div>
          </AnimatePresence>

        </main>

      </div>

    </div>
  );
}
