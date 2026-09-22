import React, { useState } from "react";
import { 
  X, 
  Flame, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Terminal, 
  Award, 
  HelpCircle, 
  Lightbulb, 
  Send, 
  RotateCcw,
  ArrowRight
} from "lucide-react";
import { DailyChallenge, UserProgress } from "../types";

interface DailyChallengeModalProps {
  challenge: DailyChallenge;
  isOpen: boolean;
  onClose: () => void;
  onCompleteChallenge: (challengeId: string, xpEarned: number) => void;
  isCompleted: boolean;
  progress: UserProgress;
}

export const DailyChallengeModal: React.FC<DailyChallengeModalProps> = ({
  challenge,
  isOpen,
  onClose,
  onCompleteChallenge,
  isCompleted,
  progress,
}) => {
  if (!isOpen) return null;

  // Multiple choice state
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  // Code fix state
  const [userCode, setUserCode] = useState<string>(challenge.starterCode || "");
  const [feedback, setFeedback] = useState<{ passed: boolean; message: string } | null>(
    isCompleted ? { passed: true, message: "你今天已经完成该挑战，成功领取了 100 XP！" } : null
  );
  const [showHint, setShowHint] = useState<boolean>(false);
  const [hasCelebrated, setHasCelebrated] = useState<boolean>(isCompleted);

  // Handle Option selection
  const handleSelectOption = (optId: string) => {
    setSelectedOptionId(optId);
    const opt = challenge.options?.find((o) => o.id === optId);
    if (!opt) return;

    if (opt.isCorrect) {
      setFeedback({ passed: true, message: `🎉 回答正确！${opt.explanation}` });
      if (!isCompleted) {
        onCompleteChallenge(challenge.id, challenge.xpReward);
        setHasCelebrated(true);
      }
    } else {
      setFeedback({ passed: false, message: `❌ 隐患判断有误：${opt.explanation}` });
    }
  };

  // Handle Code Fix Validation
  const handleValidateCode = () => {
    if (!challenge.validator) return;
    const res = challenge.validator(userCode);
    setFeedback({ passed: res.passed, message: res.feedback });
    if (res.passed && !isCompleted) {
      onCompleteChallenge(challenge.id, challenge.xpReward);
      setHasCelebrated(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl border border-amber-500/40 bg-slate-900 p-6 sm:p-8 shadow-2xl space-y-6 text-slate-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 text-xs font-semibold text-amber-400">
                <Flame className="h-3.5 w-3.5 fill-current" />
                <span>每日代码挑战</span>
              </span>
              <span className="rounded bg-slate-800 px-2 py-0.5 text-[11px] font-mono text-slate-400">
                {challenge.dateStr}
              </span>
              <span className="rounded bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 text-[11px] font-semibold text-purple-400">
                {challenge.categoryLabel}
              </span>
              <span className="rounded bg-slate-800 px-2 py-0.5 text-[11px] text-slate-400">
                难度：{challenge.difficulty}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white pt-1">
              {challenge.title}
            </h2>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="rounded-xl bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 text-xs font-bold text-amber-300 flex items-center gap-1.5 shadow-sm">
              <Sparkles className="h-4 w-4" />
              <span>奖励 +{challenge.xpReward} XP</span>
            </span>
          </div>
        </div>

        {/* Success Celebration Banner */}
        {hasCelebrated && (
          <div className="rounded-2xl border border-emerald-500/40 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-950 p-4 flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div className="text-xs">
                <div className="font-bold text-sm text-emerald-300">
                  🎉 今日挑战达成！连续打卡天数 +1
                </div>
                <div className="text-slate-400 mt-0.5">
                  已累计连续练习 <strong className="text-amber-400 font-mono">{progress.currentStreakDays} 天</strong>，额外获得 +{challenge.xpReward} XP！
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Question & Instructions */}
        <div className="space-y-4">
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
            {challenge.question}
          </p>

          {/* Context Code block */}
          {challenge.contextCode && (
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs text-slate-200 whitespace-pre-wrap leading-6 overflow-x-auto">
              {challenge.contextCode}
            </div>
          )}

          {/* Type 1: Multiple Choice Options */}
          {challenge.type === "multiple_choice" && challenge.options && (
            <div className="space-y-2.5 pt-1">
              <div className="text-xs font-bold text-slate-400 mb-1">
                请选择你的判定结论：
              </div>
              {challenge.options.map((opt) => {
                const isSelected = selectedOptionId === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => handleSelectOption(opt.id)}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? opt.isCorrect
                          ? "border-emerald-500 bg-emerald-950/30 text-white shadow-sm ring-1 ring-emerald-500/50"
                          : "border-rose-500 bg-rose-950/30 text-white shadow-sm ring-1 ring-rose-500/50"
                        : "border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700 hover:bg-slate-950"
                    }`}
                  >
                    <div
                      className={`mt-0.5 h-4 w-4 rounded-full border flex items-center justify-center shrink-0 ${
                        isSelected
                          ? opt.isCorrect
                            ? "border-emerald-400 bg-emerald-500"
                            : "border-rose-400 bg-rose-500"
                          : "border-slate-600"
                      }`}
                    >
                      {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                    </div>
                    <span className="text-xs sm:text-sm leading-relaxed">{opt.text}</span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Type 2: Code Fix Challenge */}
          {challenge.type === "code_fix" && (
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5 text-amber-300 font-mono">
                  <Terminal className="h-4 w-4" />
                  <span>在下方修复并补全算法逻辑：</span>
                </span>
                <button
                  onClick={() => setUserCode(challenge.starterCode || "")}
                  className="hover:text-white flex items-center gap-1"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>重置代码</span>
                </button>
              </div>

              <textarea
                value={userCode}
                onChange={(e) => setUserCode(e.target.value)}
                rows={10}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs sm:text-sm text-slate-100 leading-6 focus:outline-none focus:border-amber-500"
              />

              <div className="flex justify-end">
                <button
                  onClick={handleValidateCode}
                  className="inline-flex items-center gap-2 rounded-xl bg-amber-600 hover:bg-amber-500 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-md shadow-amber-950 transition-all active:scale-95"
                >
                  <Send className="h-4 w-4" />
                  <span>运行测试 & 提交挑战</span>
                </button>
              </div>
            </div>
          )}

          {/* Feedback Banner */}
          {feedback && (
            <div
              className={`rounded-xl border p-4 text-xs space-y-1.5 animate-fadeIn ${
                feedback.passed
                  ? "border-emerald-500/50 bg-emerald-950/30 text-emerald-200"
                  : "border-rose-500/50 bg-rose-950/30 text-rose-200"
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-sm">
                {feedback.passed ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-rose-400" />
                )}
                <span>{feedback.passed ? "判定准确 / 算法通过！" : "尚未通过"}</span>
              </div>
              <p className="leading-relaxed">{feedback.message}</p>
            </div>
          )}

          {/* Architectural Takeaway Box (shown when passed or user clicks hint) */}
          {(feedback?.passed || showHint) && (
            <div className="rounded-xl border border-indigo-500/30 bg-indigo-950/20 p-4 text-xs text-indigo-200 space-y-1.5 animate-fadeIn">
              <div className="flex items-center gap-1.5 font-bold text-indigo-300">
                <Lightbulb className="h-4 w-4 text-amber-400" />
                <span>架构师精读心法 (Key Takeaway)</span>
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px] font-sans">
                {challenge.takeaway}
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-slate-800 pt-4">
          <button
            onClick={() => setShowHint(!showHint)}
            className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1"
          >
            <HelpCircle className="h-3.5 w-3.5" />
            <span>{showHint ? "收起思路提示" : "查看思路提示"}</span>
          </button>

          <button
            onClick={onClose}
            className="rounded-xl bg-slate-800 hover:bg-slate-700 px-5 py-2 text-xs font-semibold text-slate-200 transition-colors"
          >
            完成打卡并关闭
          </button>
        </div>
      </div>
    </div>
  );
};
