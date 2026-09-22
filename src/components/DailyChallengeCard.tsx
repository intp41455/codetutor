import React from "react";
import { 
  Flame, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Code2, 
  Zap,
  CalendarCheck
} from "lucide-react";
import { DailyChallenge, UserProgress } from "../types";

interface DailyChallengeCardProps {
  challenge: DailyChallenge;
  progress: UserProgress;
  onOpenChallenge: () => void;
}

export const DailyChallengeCard: React.FC<DailyChallengeCardProps> = ({
  challenge,
  progress,
  onOpenChallenge,
}) => {
  const isCompletedToday = Boolean(
    progress.completedDailyChallengeIds?.includes(challenge.id)
  );

  return (
    <div
      onClick={onOpenChallenge}
      className={`group relative overflow-hidden rounded-2xl border p-5 sm:p-6 transition-all duration-300 cursor-pointer ${
        isCompletedToday
          ? "border-emerald-500/30 bg-gradient-to-br from-emerald-950/20 via-slate-900 to-slate-950 hover:border-emerald-500/60 shadow-lg shadow-emerald-950/20"
          : "border-amber-500/40 bg-gradient-to-br from-amber-950/25 via-slate-900 to-slate-950 hover:border-amber-500/80 shadow-xl shadow-amber-950/20 hover:scale-[1.01]"
      }`}
    >
      {/* Background ambient lighting */}
      <div 
        className={`absolute -right-16 -top-16 h-48 w-48 rounded-full blur-3xl pointer-events-none transition-opacity ${
          isCompletedToday ? "bg-emerald-500/10 group-hover:opacity-60" : "bg-amber-500/15 group-hover:opacity-75"
        }`} 
      />

      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left Side: Meta & Challenge Details */}
        <div className="space-y-2.5 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1 rounded-full bg-amber-500/15 border border-amber-500/40 px-2.5 py-0.5 text-xs font-semibold text-amber-300">
              <Flame className="h-3.5 w-3.5 fill-current animate-pulse text-amber-400" />
              <span>每日代码挑战</span>
            </span>

            <span className="flex items-center gap-1 rounded-md bg-slate-800/80 px-2 py-0.5 text-[11px] font-mono text-slate-300">
              <CalendarCheck className="h-3 w-3 text-slate-400" />
              <span>{challenge.dateStr}</span>
            </span>

            <span className="rounded-md bg-purple-500/15 border border-purple-500/30 px-2 py-0.5 text-[11px] font-medium text-purple-300">
              {challenge.categoryLabel}
            </span>

            <span className="rounded-md bg-slate-800/80 px-2 py-0.5 text-[11px] text-slate-400">
              难度：{challenge.difficulty}
            </span>

            <span className="rounded-md bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 text-[11px] font-bold text-amber-400 flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              <span>+{challenge.xpReward} XP</span>
            </span>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-amber-300 transition-colors flex items-center gap-2">
              <span>{challenge.title}</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 mt-1">
              {challenge.question}
            </p>
          </div>
        </div>

        {/* Right Side: Streak & Call to action */}
        <div className="flex items-center justify-between md:flex-col md:items-end gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800/80">
          <div className="flex items-center gap-2 text-xs">
            <div className="flex items-center gap-1 rounded-full bg-slate-800/90 px-3 py-1 font-mono text-slate-200 border border-slate-700/60 shadow-sm">
              <Flame className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
              <span>连续打卡 <strong className="text-amber-400 font-bold">{progress.currentStreakDays || 0}</strong> 天</span>
            </div>
          </div>

          <div>
            {isCompletedToday ? (
              <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 px-4 py-2 text-xs font-semibold text-emerald-300 shadow-sm">
                <CheckCircle2 className="h-4 w-4" />
                <span>今日已通关 · 重温挑战</span>
              </span>
            ) : (
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 px-5 py-2 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-amber-950/60 transition-all active:scale-95"
              >
                <Zap className="h-4 w-4" />
                <span>立即挑战 (+{challenge.xpReward} XP)</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
