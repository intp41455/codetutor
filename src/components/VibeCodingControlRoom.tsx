import React, { useState } from "react";
import { 
  ShieldAlert, 
  Bot, 
  CheckCircle2, 
  AlertTriangle, 
  Flame, 
  Bug, 
  Play, 
  Search, 
  ShieldCheck, 
  Sparkles, 
  RotateCcw,
  ArrowRight
} from "lucide-react";
import { VIBE_CODING_CASES } from "../data/vibeCodingLabData";
import { VibeCodingCase } from "../types";
import { generateIntelligentReview } from "../utils/aiFallbackEngine";

interface VibeCodingControlRoomProps {
  onCompleteCase: (caseId: string) => void;
  completedCaseIds: string[];
}

export const VibeCodingControlRoom: React.FC<VibeCodingControlRoomProps> = ({
  onCompleteCase,
  completedCaseIds,
}) => {
  const [activeCaseIndex, setActiveCaseIndex] = useState<number>(0);
  const currentCase: VibeCodingCase = VIBE_CODING_CASES[activeCaseIndex];

  const [userCode, setUserCode] = useState<string>(currentCase.starterFixCode);
  const [validationResult, setValidationResult] = useState<{ passed: boolean; message: string } | null>(null);
  const [aiReviewOutput, setAiReviewOutput] = useState<string>("");
  const [isReviewing, setIsReviewing] = useState<boolean>(false);

  // Switch case
  const handleSwitchCase = (idx: number) => {
    setActiveCaseIndex(idx);
    setUserCode(VIBE_CODING_CASES[idx].starterFixCode);
    setValidationResult(null);
    setAiReviewOutput("");
  };

  // Run Test Verification
  const handleVerify = () => {
    const res = currentCase.testCheck(userCode);
    setValidationResult(res);
    if (res.passed) {
      onCompleteCase(currentCase.id);
    }
  };

  // Trigger Gemini Deep Audit
  const handleRequestGeminiAudit = async () => {
    setIsReviewing(true);
    try {
      const res = await fetch("/api/gemini/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: userCode,
          language: currentCase.language,
          intent: currentCase.aiPromptUsed,
        }),
      });
      const data = await res.json();
      if (data && data.review) {
        setAiReviewOutput(data.review);
      } else {
        const local = generateIntelligentReview(userCode, currentCase.language, currentCase.aiPromptUsed);
        setAiReviewOutput(local.review);
      }
    } catch (e: any) {
      const local = generateIntelligentReview(userCode, currentCase.language, currentCase.aiPromptUsed);
      setAiReviewOutput(local.review);
    } finally {
      setIsReviewing(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Banner: Vibe Coding Mastery */}
      <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-950 p-6 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 border border-amber-500/20 px-3 py-0.5 text-xs font-semibold text-amber-400">
              <ShieldAlert className="h-3.5 w-3.5" />
              <span>专项能力二：AI 时代 Vibe Coding 掌控力与代码防线</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white font-['Plus_Jakarta_Sans']">
              代码主要由 AI 写，如何确保每一行都在你的掌控之中？
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl">
              拒绝成为“无知的代码搬运工”！学习架构师<strong>“4 步掌控法则”</strong>：逻辑逆推 ➔ 漏洞猎杀 ➔ 埋点可观察 ➔ 反例测试击穿。学会识别 AI 写的死循环、并发竞争与阻塞大坑！
            </p>
          </div>

          {/* Case Selector */}
          <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-xl border border-slate-800">
            {VIBE_CODING_CASES.map((c, idx) => (
              <button
                key={c.id}
                onClick={() => handleSwitchCase(idx)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  activeCaseIndex === idx
                    ? "bg-amber-600 text-white shadow"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                案例 {idx + 1}
              </button>
            ))}
          </div>
        </div>

        {/* 4-Step Methodology Guide Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-6 mt-4 border-t border-slate-800/80 text-xs">
          <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-3 space-y-1">
            <div className="font-bold text-amber-400">① 逻辑单步逆推</div>
            <p className="text-slate-400 text-[11px]">还原输入、中间状态跳转和最终返回，讲清楚它做了什么。</p>
          </div>
          <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-3 space-y-1">
            <div className="font-bold text-rose-400">② 隐患死角猎杀</div>
            <p className="text-slate-400 text-[11px]">排查死循环、并发竞态、未捕获异常、Token雪崩与单线程卡死。</p>
          </div>
          <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-3 space-y-1">
            <div className="font-bold text-purple-400">③ 植入可观察性</div>
            <p className="text-slate-400 text-[11px]">亲手补充结构化日志、耗时追踪与熔断计数器，让黑盒变透明。</p>
          </div>
          <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-3 space-y-1">
            <div className="font-bold text-emerald-400">④ 编写反例测试</div>
            <p className="text-slate-400 text-[11px]">用极端边界值和网络故障反例敲打代码，直到测试完全通过。</p>
          </div>
        </div>
      </div>

      {/* Main Case Audit Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: AI Illusion & Hidden Disasters (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Prompt & What AI Generated */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Bot className="h-4 w-4 text-purple-400" />
              <span className="text-xs font-bold text-slate-200">
                当时给 AI 的 Prompt 提示词：
              </span>
            </div>
            <div className="rounded-lg bg-slate-950 p-3 text-xs text-indigo-300 font-mono italic border border-slate-800">
              "{currentCase.aiPromptUsed}"
            </div>

            {/* Generated Code Display */}
            <div className="space-y-1.5 pt-2">
              <span className="text-xs font-semibold text-slate-400">
                AI 生成的代码（表面看似正常）：
              </span>
              <pre className="rounded-lg bg-slate-950 p-3 font-mono text-xs text-rose-300/90 whitespace-pre-wrap leading-5 border border-rose-900/30 overflow-x-auto">
                {currentCase.generatedCode}
              </pre>
            </div>

            {/* The Illusion */}
            <div className="rounded-lg bg-amber-950/20 border border-amber-900/40 p-3 text-xs text-amber-200 space-y-1">
              <strong>🎭 为什么容易骗过初学者？</strong>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                {currentCase.vibeIllusion}
              </p>
            </div>
          </div>

          {/* Hidden Disasters Deep Dive */}
          <div className="rounded-2xl border border-rose-500/30 bg-slate-900/60 p-5 space-y-4">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
              <Bug className="h-4 w-4" />
              <span>潜藏的致命生产事故隐患 (Bug Hunt)</span>
            </div>

            <div className="space-y-3">
              {currentCase.hiddenDisasters.map((dis, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-rose-300">{dis.type}</span>
                    <span className="rounded bg-rose-500/10 border border-rose-500/30 px-2 py-0.5 text-[10px] font-mono text-rose-400">
                      {dis.severity}
                    </span>
                  </div>

                  <div className="text-slate-400 text-[11px]">
                    <strong>发生位置：</strong>
                    <span className="font-mono text-slate-300 ml-1">{dis.lineLocation}</span>
                  </div>

                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    <strong>炸崩机制：</strong>
                    {dis.mechanism}
                  </p>

                  <div className="rounded bg-rose-950/30 p-2 text-[11px] text-rose-200 border border-rose-900/40">
                    <strong>💣 事故后果：</strong>
                    {dis.consequence}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Refactoring & Testing Workshop (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="space-y-0.5">
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <span>硬化重构工作台 (Refactor & Fix)</span>
                </h3>
                <p className="text-xs text-slate-400">
                  请独立修改并修正 AI 的缺陷代码，加上熔断保护与健全边界！
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleRequestGeminiAudit}
                  disabled={isReviewing}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-purple-600/80 hover:bg-purple-600 px-3 py-1.5 text-xs font-semibold text-white transition-all"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>{isReviewing ? "AI 审计中..." : "Gemini 深度审查"}</span>
                </button>

                <button
                  onClick={() => setUserCode(currentCase.starterFixCode)}
                  className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
                  title="重置代码"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Code Editor */}
            <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden">
              <textarea
                value={userCode}
                onChange={(e) => setUserCode(e.target.value)}
                rows={14}
                className="w-full bg-transparent p-4 font-mono text-xs sm:text-sm text-slate-100 leading-6 focus:outline-none selection:bg-amber-500/30"
              />
            </div>

            {/* Actions Bar */}
            <div className="flex items-center justify-between pt-1">
              <div className="text-xs text-slate-400">
                验证策略：{currentCase.verificationStrategy.step4_cleanRefactor}
              </div>

              <button
                onClick={handleVerify}
                className="inline-flex items-center gap-2 rounded-xl bg-amber-600 hover:bg-amber-500 px-5 py-2 text-xs sm:text-sm font-semibold text-white shadow-md shadow-amber-950 transition-all active:scale-95"
              >
                <Play className="h-4 w-4 fill-current" />
                <span>运行反例测试 & 验证掌控力</span>
              </button>
            </div>

            {/* Validation Feedback */}
            {validationResult && (
              <div
                className={`rounded-xl border p-4 text-xs space-y-1.5 animate-fadeIn ${
                  validationResult.passed
                    ? "border-emerald-500/50 bg-emerald-950/30 text-emerald-200"
                    : "border-rose-500/50 bg-rose-950/30 text-rose-200"
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-sm">
                  {validationResult.passed ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-rose-400" />
                  )}
                  <span>
                    {validationResult.passed ? "恭喜！成功驯服 AI 代码！" : "测试未通过"}
                  </span>
                </div>
                <p className="leading-relaxed">{validationResult.message}</p>
              </div>
            )}

            {/* Gemini Live AI Audit Report */}
            {aiReviewOutput && (
              <div className="rounded-xl border border-purple-500/40 bg-purple-950/20 p-4 text-xs space-y-2 animate-fadeIn">
                <div className="flex items-center gap-2 text-purple-300 font-bold text-xs uppercase tracking-wide">
                  <Bot className="h-4 w-4" />
                  <span>Gemini 架构师代码质询报告</span>
                </div>
                <pre className="font-mono text-xs text-slate-200 whitespace-pre-wrap leading-5 bg-slate-950/80 p-3 rounded-lg border border-purple-900/40 max-h-60 overflow-y-auto">
                  {aiReviewOutput}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
