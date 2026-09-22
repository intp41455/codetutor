import React, { useState } from "react";
import { 
  FileCode, 
  Coffee, 
  Network, 
  Database, 
  Zap, 
  Layers, 
  Cpu, 
  Bot, 
  Users, 
  ChevronRight, 
  CheckCircle2, 
  Sparkles,
  BookOpen,
  ArrowRight,
  Flame,
  Terminal,
  Code2
} from "lucide-react";
import { TrackInfo, LearningTrackId, UserProgress, DailyChallenge } from "../types";
import { DailyChallengeCard } from "./DailyChallengeCard";

interface TrackSelectorProps {
  tracks: TrackInfo[];
  currentTrackId: LearningTrackId;
  onSelectTrack: (trackId: LearningTrackId) => void;
  onSelectLesson: (trackId: LearningTrackId, lessonId: string) => void;
  progress: UserProgress;
  onJumpToGitHubLab: () => void;
  onJumpToVibeCoding: () => void;
  todayChallenge: DailyChallenge;
  onOpenDailyChallenge: () => void;
}

const ICON_MAP: Record<string, any> = {
  FileCode,
  Coffee,
  Network,
  Database,
  Zap,
  Layers,
  Cpu,
  Bot,
  Users,
  Terminal,
  Code2
};

export const TrackSelector: React.FC<TrackSelectorProps> = ({
  tracks,
  currentTrackId,
  onSelectTrack,
  onSelectLesson,
  progress,
  onJumpToGitHubLab,
  onJumpToVibeCoding,
  todayChallenge,
  onOpenDailyChallenge,
}) => {
  const [filter, setFilter] = useState<"all" | "foundation" | "framework" | "agent">("all");

  const filteredTracks = tracks.filter((track) => {
    if (filter === "foundation") return ["track-python", "track-java", "track-linux", "track-typescript", "track-ds", "track-sql"].includes(track.id);
    if (filter === "framework") return ["track-fastapi", "track-spring-boot"].includes(track.id);
    if (filter === "agent") return ["track-spring-ai", "track-agent", "track-multi-agent", "track-agent-systems"].includes(track.id);
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Hero Banner for Zero-Base Learners */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-indigo-950/30 to-slate-900 p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-300">
            <Sparkles className="h-3.5 w-3.5" />
            <span>零基础小白专享 · 现代全栈与AI时代架构师成长阶梯</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white font-['Plus_Jakarta_Sans']">
            学穿底层代码与技术架构，
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400">
              彻底驾驭开源与 AI 时代
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            在这里，我们用<strong>生活化比喻消除一切枯燥术语</strong>，通过
            <strong> Codecademy 式交互实战</strong>，带你一步步精通 Python、Java、数据结构、SQL、FastAPI、Spring Boot、Spring AI 到多智能体。无论代码是自己写的还是 AI（Vibe Coding）生成的，你都能<strong>看得懂、跑得起、理得清、改得动</strong>！
          </p>

          {/* Quick Action Highlights */}
          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={onJumpToGitHubLab}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600/90 hover:bg-emerald-600 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-md shadow-emerald-950 transition-all hover:translate-y-[-1px]"
            >
              <span>🚀 体验 GitHub 陌生项目 5 步穿透法</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              onClick={onJumpToVibeCoding}
              className="inline-flex items-center gap-2 rounded-xl bg-amber-600/90 hover:bg-amber-600 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-md shadow-amber-950 transition-all hover:translate-y-[-1px]"
            >
              <span>🛡️ 练就 Vibe Coding 避坑与代码掌控力</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute right-0 top-0 -mt-12 -mr-12 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="absolute right-40 bottom-0 h-48 w-48 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />
      </div>

      {/* Daily Code Challenge Highlight */}
      <DailyChallengeCard
        challenge={todayChallenge}
        progress={progress}
        onOpenChallenge={onOpenDailyChallenge}
      />

      {/* Filter Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-indigo-400" />
          <h2 className="text-lg font-bold text-white">{tracks.length} 大进阶技术体系</h2>
        </div>

        <div className="flex items-center gap-1 rounded-lg bg-slate-900 p-1 border border-slate-800 text-xs font-medium">
          <button
            onClick={() => setFilter("all")}
            className={`rounded-md px-3 py-1.5 transition-all ${
              filter === "all" ? "bg-indigo-600 text-white shadow" : "text-slate-400 hover:text-white"
            }`}
          >
            全部 ({tracks.length})
          </button>
          <button
            onClick={() => setFilter("foundation")}
            className={`rounded-md px-3 py-1.5 transition-all ${
              filter === "foundation" ? "bg-indigo-600 text-white shadow" : "text-slate-400 hover:text-white"
            }`}
          >
            工程基石 (4)
          </button>
          <button
            onClick={() => setFilter("framework")}
            className={`rounded-md px-3 py-1.5 transition-all ${
              filter === "framework" ? "bg-indigo-600 text-white shadow" : "text-slate-400 hover:text-white"
            }`}
          >
            微服务框架 (2)
          </button>
          <button
            onClick={() => setFilter("agent")}
            className={`rounded-md px-3 py-1.5 transition-all ${
              filter === "agent" ? "bg-indigo-600 text-white shadow" : "text-slate-400 hover:text-white"
            }`}
          >
            AI与智能体 (3)
          </button>
        </div>
      </div>

      {/* Tracks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTracks.map((track) => {
          const IconComponent = ICON_MAP[track.icon] || FileCode;
          const isSelected = track.id === currentTrackId;

          // Calculate completed lessons in this track
          const completedCount = track.lessons.filter((l) =>
            progress.completedLessonIds.includes(l.id)
          ).length;
          const totalLessons = track.lessons.length;
          const progressPercent = Math.round((completedCount / (totalLessons || 1)) * 100);

          return (
            <div
              key={track.id}
              onClick={() => onSelectTrack(track.id)}
              className={`group relative flex flex-col justify-between rounded-xl border p-5 transition-all cursor-pointer ${
                isSelected
                  ? "border-indigo-500/80 bg-slate-900/90 shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500/50"
                  : "border-slate-800 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-900/80 hover:shadow-md"
              }`}
            >
              <div className="space-y-3">
                {/* Track Icon & Badges */}
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-800 border border-slate-700 text-indigo-400 group-hover:scale-105 transition-transform">
                    <IconComponent className="h-6 w-6" />
                  </div>

                  <div className="flex items-center gap-1.5">
                    {progressPercent === 100 && (
                      <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[11px] font-semibold text-emerald-400">
                        <CheckCircle2 className="h-3 w-3" />
                        已通关
                      </span>
                    )}
                    <span className="rounded-full bg-slate-800/80 px-2.5 py-0.5 text-[11px] font-medium text-slate-400 border border-slate-700/60">
                      {totalLessons} 关实战
                    </span>
                  </div>
                </div>

                {/* Title & Tagline */}
                <div>
                  <h3 className="font-bold text-base text-white group-hover:text-indigo-300 transition-colors">
                    {track.title}
                  </h3>
                  <p className="text-xs text-indigo-400 font-medium mt-0.5">
                    {track.tagline}
                  </p>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {track.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {track.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-slate-300 border border-slate-700/50"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Progress Bar & Actions */}
              <div className="pt-4 border-t border-slate-800/80 mt-4 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>学习进度</span>
                  <span className="font-mono text-slate-300">{progressPercent}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                {/* Lesson Quick Entry */}
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    第一关：{track.lessons[0]?.title.slice(0, 14)}...
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectLesson(track.id, track.lessons[0].id);
                    }}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 group-hover:translate-x-0.5 transition-all"
                  >
                    <span>进入实践</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
