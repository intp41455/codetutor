import React, { useState } from "react";
import { 
  X, 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Sparkles, 
  Send, 
  Terminal, 
  RotateCcw,
  Star
} from "lucide-react";
import { GRADUATION_PROJECT } from "../data/graduationProjectData";

interface GraduationCapstoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGraduationPass: () => void;
  isGraduated: boolean;
}

export const GraduationCapstoneModal: React.FC<GraduationCapstoneModalProps> = ({
  isOpen,
  onClose,
  onGraduationPass,
  isGraduated,
}) => {
  if (!isOpen) return null;

  const [currentStageIdx, setCurrentStageIdx] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [codeAnswer, setCodeAnswer] = useState<string>(
    GRADUATION_PROJECT.stages[3].codeChallenge?.starter || ""
  );
  const [stageError, setStageError] = useState<string | null>(null);
  const [showCertificate, setShowCertificate] = useState<boolean>(isGraduated);

  const stage = GRADUATION_PROJECT.stages[currentStageIdx];
  const isLastStage = currentStageIdx === GRADUATION_PROJECT.stages.length - 1;

  // Handle Option selection
  const handleSelectOption = (optId: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [stage.id]: optId }));
    setStageError(null);
  };

  // Next or Submit Stage
  const handleProceed = () => {
    // Validate current stage
    if (stage.options) {
      const selectedId = selectedAnswers[stage.id];
      if (!selectedId) {
        setStageError("请先选择一个你认为最合理的答案选项！");
        return;
      }
      const option = stage.options.find((o) => o.id === selectedId);
      if (!option?.isCorrect) {
        setStageError(`❌ 回答有误：${option?.explanation}`);
        return;
      }
    } else if (stage.codeChallenge) {
      const res = stage.codeChallenge.validator(codeAnswer);
      if (!res.passed) {
        setStageError(res.message);
        return;
      }
    }

    // Passed current stage!
    setStageError(null);
    if (!isLastStage) {
      setCurrentStageIdx((prev) => prev + 1);
    } else {
      // Completed all stages!
      setShowCertificate(true);
      onGraduationPass();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl border border-purple-500/40 bg-slate-900 p-6 sm:p-8 shadow-2xl space-y-6 text-slate-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Certificate View (If passed) */}
        {showCertificate ? (
          <div className="space-y-6 text-center py-4">
            <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-xl shadow-purple-500/30">
              <Award className="h-10 w-10 animate-bounce" />
              <div className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-amber-400 flex items-center justify-center text-slate-950 font-bold text-xs">
                ★
              </div>
            </div>

            <div className="space-y-2">
              <span className="rounded-full bg-purple-500/10 border border-purple-500/30 px-3 py-1 text-xs font-semibold text-purple-300">
                CodeMaster 官方最高级认证
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-['Plus_Jakarta_Sans']">
                全栈与 AI 时代开源架构师通关证书
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
                兹证明学员已完成 Python、Java、数据结构、SQL、FastAPI、Spring Boot、Spring AI 到多智能体的全链路学习，并成功通关 GitHub 陌生项目 5 步穿透法与 Vibe Coding 代码掌控力考核！
              </p>
            </div>

            {/* Radar / Skills Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto pt-2 text-left">
              <div className="rounded-xl bg-slate-950 p-3.5 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 font-mono">开源项目穿透力</span>
                <div className="text-sm font-bold text-emerald-400">MASTER (S级)</div>
                <div className="h-1 w-full bg-emerald-500/20 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400 w-full" />
                </div>
              </div>
              <div className="rounded-xl bg-slate-950 p-3.5 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 font-mono">Vibe Coding 掌控力</span>
                <div className="text-sm font-bold text-amber-400">EXPERT (S级)</div>
                <div className="h-1 w-full bg-amber-500/20 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 w-full" />
                </div>
              </div>
              <div className="rounded-xl bg-slate-950 p-3.5 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 font-mono">链路时序反推力</span>
                <div className="text-sm font-bold text-indigo-400">100% 精确</div>
                <div className="h-1 w-full bg-indigo-500/20 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-400 w-full" />
                </div>
              </div>
              <div className="rounded-xl bg-slate-950 p-3.5 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 font-mono">防御性重构补丁</span>
                <div className="text-sm font-bold text-purple-400">PASS (已验证)</div>
                <div className="h-1 w-full bg-purple-500/20 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-400 w-full" />
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-center gap-3">
              <button
                onClick={() => {
                  setShowCertificate(false);
                  setCurrentStageIdx(0);
                }}
                className="rounded-xl bg-slate-800 hover:bg-slate-700 px-5 py-2.5 text-xs font-semibold text-slate-200 transition-colors"
              >
                重温考核过程
              </button>

              <button
                onClick={onClose}
                className="rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 px-6 py-2.5 text-xs font-semibold text-white shadow-lg shadow-purple-600/30 transition-all"
              >
                收下证书并返回学院
              </button>
            </div>
          </div>
        ) : (
          /* Assessment Flow View */
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                  阶段 {currentStageIdx + 1} / {GRADUATION_PROJECT.stages.length}
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-white mt-0.5">
                  {stage.stageName}
                </h2>
              </div>

              {/* Progress dots */}
              <div className="flex items-center gap-1.5">
                {GRADUATION_PROJECT.stages.map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 rounded-full transition-all ${
                      i === currentStageIdx
                        ? "w-6 bg-purple-500"
                        : i < currentStageIdx
                        ? "w-2 bg-emerald-400"
                        : "w-2 bg-slate-800"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Question Card */}
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-base font-bold text-slate-100">{stage.title}</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {stage.description}
                </p>
              </div>

              {/* Context Code (if any) */}
              {stage.contextCode && (
                <div className="rounded-xl bg-slate-950 p-4 border border-slate-800 font-mono text-xs text-rose-300/90 whitespace-pre-wrap leading-6">
                  {stage.contextCode}
                </div>
              )}

              {/* Multiple Choice Options */}
              {stage.options && (
                <div className="space-y-2.5 pt-2">
                  {stage.options.map((opt) => {
                    const isSelected = selectedAnswers[stage.id] === opt.id;
                    return (
                      <div
                        key={opt.id}
                        onClick={() => handleSelectOption(opt.id)}
                        className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? "border-purple-500 bg-purple-950/30 text-white shadow-sm ring-1 ring-purple-500/50"
                            : "border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700 hover:bg-slate-950"
                        }`}
                      >
                        <div
                          className={`mt-0.5 h-4 w-4 rounded-full border flex items-center justify-center shrink-0 ${
                            isSelected
                              ? "border-purple-400 bg-purple-600"
                              : "border-slate-600"
                          }`}
                        >
                          {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                        </div>
                        <span className="text-xs sm:text-sm leading-relaxed">{opt.label}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Code Challenge Workspace (for Stage 4) */}
              {stage.codeChallenge && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1.5 text-purple-300 font-mono">
                      <Terminal className="h-4 w-4" />
                      <span>请直接在下方编辑并补全埋点逻辑：</span>
                    </span>
                    <button
                      onClick={() => setCodeAnswer(stage.codeChallenge!.starter)}
                      className="hover:text-white flex items-center gap-1"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      <span>重置代码</span>
                    </button>
                  </div>
                  <textarea
                    value={codeAnswer}
                    onChange={(e) => setCodeAnswer(e.target.value)}
                    rows={8}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs sm:text-sm text-slate-100 leading-6 focus:outline-none focus:border-purple-500"
                  />
                </div>
              )}

              {/* Error feedback */}
              {stageError && (
                <div className="rounded-xl border border-rose-500/40 bg-rose-950/20 p-3.5 text-xs text-rose-300 flex items-start gap-2 animate-fadeIn">
                  <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{stageError}</span>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between border-t border-slate-800 pt-4">
              <button
                onClick={() => {
                  if (currentStageIdx > 0) setCurrentStageIdx((prev) => prev - 1);
                }}
                disabled={currentStageIdx === 0}
                className="text-xs text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none"
              >
                返回上一步
              </button>

              <button
                onClick={handleProceed}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 px-6 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-purple-600/30 transition-all active:scale-95"
              >
                <span>{isLastStage ? "提交终审 & 获取证书" : "验证并通过该阶段"}</span>
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
