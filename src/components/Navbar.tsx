import React from "react";
import { Menu, LogOut, Utensils, CalendarDays, Key, ClipboardList, HelpCircle, User } from "lucide-react";
import { motion } from "motion/react";
import { User as UserType, ViewState } from "../types";

interface NavbarProps {
  currentUser: UserType | null;
  currentView: ViewState;
  setView: (view: ViewState) => void;
  onLogout: () => void;
  toggleSidebar: () => void;
}

export default function Navbar({
  currentUser,
  currentView,
  setView,
  onLogout,
  toggleSidebar,
}: NavbarProps) {
  return (
    <header id="app-header" className="sticky top-0 z-40 w-full border-b border-brand-border bg-brand-bg/95 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left Section: Brand Logo */}
        <div className="flex items-center space-x-3">
          <button
            id="mobile-sidebar-toggle"
            onClick={toggleSidebar}
            className="rounded-md p-2 text-brand-dark hover:bg-brand-sidebar md:hidden transition-colors"
            aria-label="Toggle Sidebar"
          >
            <Menu className="h-6 w-6" id="burger-icon" />
          </button>
          
          <div
            id="brand-logo-container"
            onClick={() => setView("home")}
            className="flex cursor-pointer items-center space-x-3"
          >
            {/* Visual Logo emblem imitating traditional red seal */}
            <div className="flex h-10 w-10 items-center justify-center bg-brand-accent text-brand-bg font-bold shadow-xs">
              <span className="font-serif text-xl tracking-tighter">雅</span>
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-lg font-bold tracking-widest text-brand-accent">雅庵 MIYABI</span>
              <span className="text-[9px] font-light tracking-[0.2em] text-brand-muted uppercase">月見 TSUKIMI DINING</span>
            </div>
          </div>
        </div>

        {/* Middle Section: Desktop Navigation */}
        <nav id="desktop-nav" className="hidden md:flex items-center space-x-6">
          <button
            id="nav-home"
            onClick={() => setView("home")}
            className={`text-xs uppercase tracking-[0.2em] font-medium transition-all pb-1 border-b ${
              currentView === "home"
                ? "border-brand-accent text-brand-accent font-bold"
                : "border-transparent text-brand-dark/70 hover:text-brand-dark"
            }`}
          >
            首頁介紹
          </button>
          
          <button
            id="nav-book"
            onClick={() => setView(currentUser ? "book" : "login")}
            className={`text-xs uppercase tracking-[0.2em] font-medium transition-all pb-1 border-b ${
              currentView === "book"
                ? "border-brand-accent text-brand-accent font-bold"
                : "border-transparent text-brand-dark/70 hover:text-brand-dark"
            }`}
          >
            立即訂位
          </button>

          {currentUser && (
            <button
              id="nav-reservations"
              onClick={() => setView("my-reservations")}
              className={`text-xs uppercase tracking-[0.2em] font-medium transition-all pb-1 border-b ${
                currentView === "my-reservations"
                  ? "border-brand-accent text-brand-accent font-bold"
                  : "border-transparent text-brand-dark/70 hover:text-brand-dark"
              }`}
            >
              我的訂位
            </button>
          )}
        </nav>

        {/* Right Section: Member login state */}
        <div id="nav-auth-status" className="flex items-center space-x-3">
          {currentUser ? (
            <div className="flex items-center space-x-4">
              <div className="hidden lg:flex flex-col text-right">
                <span className="text-[10px] uppercase tracking-widest text-brand-muted">Standard Member</span>
                <span className="text-xs font-bold text-brand-dark flex items-center justify-end gap-1">
                  {currentUser.name} 閣下
                </span>
              </div>
              <div className="h-6 w-px bg-brand-border hidden lg:block" />
              <button
                id="btn-logout"
                onClick={onLogout}
                className="text-xs uppercase tracking-widest border border-brand-dark px-4 py-2 hover:bg-brand-dark hover:text-white transition-colors cursor-pointer"
              >
                登出
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <button
                id="btn-nav-login"
                onClick={() => setView("login")}
                className="text-xs uppercase tracking-widest text-brand-dark/80 hover:text-brand-dark transition-colors"
              >
                登入
              </button>
              <button
                id="btn-nav-register"
                onClick={() => setView("register")}
                className="text-xs uppercase tracking-widest bg-brand-dark text-[#FCF9F0] px-4 py-2 hover:bg-brand-accent hover:text-white transition-colors cursor-pointer"
              >
                加入會員
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
