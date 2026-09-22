import React from "react";
import { 
  BookOpen, 
  GitBranch, 
  ShieldAlert, 
  Award, 
  Sparkles, 
  Bot, 
  Flame, 
  Terminal
} from "lucide-react";
import { NavTab, UserProgress } from "../types";

interface HeaderProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  progress: UserProgress;
  onOpenAITutor: () => void;
  onOpenCapstone: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  progress,
  onOpenAITutor,
  onOpenCapstone,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div 
            onClick={() => setActiveTab("curriculum")}
            className="flex cursor-pointer items-center gap-2.5 group"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              <Terminal className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-white font-['Plus_Jakarta_Sans']">
                  CodeMaster
                </span>
                <span className="rounded-full bg-indigo-500/10 px-2 py-0.5 text-[10px] font-semibold text-indigo-400 border border-indigo-500/20">
                  码道·全栈与AI
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                从零基础到开源架构师 & Vibe Coding 掌控力
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            id="nav-tab-curriculum"
            onClick={() => setActiveTab("curriculum")}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
              activeTab === "curriculum"
                ? "bg-slate-800 text-white shadow-sm border border-slate-700"
                : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
            }`}
          >
            <BookOpen className="h-4 w-4 text-indigo-400" />
            <span>9大体系课程</span>
          </button>

          <button
            id="nav-tab-github-lab"
            onClick={() => setActiveTab("github-lab")}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
              activeTab === "github-lab"
                ? "bg-slate-800 text-white shadow-sm border border-slate-700"
                : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
            }`}
          >
            <GitBranch className="h-4 w-4 text-emerald-400" />
            <span className="flex items-center gap-1.5">
              <span>GitHub 陌生项目拆解舱</span>
              <span className="hidden md:inline-block rounded bg-emerald-500/20 px-1.5 py-0.2 text-[10px] text-emerald-300 font-mono">
                5步法
              </span>
            </span>
          </button>

          <button
            id="nav-tab-vibe-coding"
            onClick={() => setActiveTab("vibe-coding")}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
              activeTab === "vibe-coding"
                ? "bg-slate-800 text-white shadow-sm border border-slate-700"
                : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
            }`}
          >
            <ShieldAlert className="h-4 w-4 text-amber-400" />
            <span className="flex items-center gap-1.5">
              <span>Vibe Coding 掌控力</span>
              <span className="hidden md:inline-block rounded bg-amber-500/20 px-1.5 py-0.2 text-[10px] text-amber-300 font-mono">
                代码审查
              </span>
            </span>
          </button>

          <button
            id="nav-tab-capstone"
            onClick={onOpenCapstone}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-purple-300 hover:bg-purple-950/40 hover:text-purple-200 border border-purple-500/30 transition-all"
          >
            <Award className="h-4 w-4 text-purple-400" />
            <span className="hidden sm:inline">毕业综合考核</span>
            <span className="sm:hidden">考核</span>
          </button>
        </nav>

        {/* Right Tools: Streak, XP & AI Tutor Button */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* XP Badge */}
          <div className="hidden lg:flex items-center gap-1.5 rounded-full bg-slate-900 border border-slate-800 px-3 py-1 text-xs font-medium text-slate-300">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>{progress.xp} XP</span>
          </div>

          {/* Streak */}
          <div className="hidden lg:flex items-center gap-1.5 rounded-full bg-slate-900 border border-slate-800 px-3 py-1 text-xs font-medium text-slate-300">
            <Flame className="h-3.5 w-3.5 text-rose-500" />
            <span>{progress.currentStreakDays} 天连续</span>
          </div>

          {/* AI Tutor Assistant Trigger */}
          <button
            id="open-ai-tutor-btn"
            onClick={onOpenAITutor}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 px-3.5 py-1.5 text-sm font-semibold text-white shadow-md shadow-indigo-600/25 transition-all active:scale-95"
          >
            <Bot className="h-4 w-4 animate-pulse text-indigo-200" />
            <span className="hidden sm:inline">AI 伴读导师</span>
            <span className="sm:hidden">导师</span>
          </button>
        </div>
      </div>
    </header>
  );
};
