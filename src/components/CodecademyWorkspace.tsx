import React, { useState, useEffect } from "react";
import { 
  Play, 
  CheckCircle, 
  RotateCcw, 
  HelpCircle, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  Lightbulb, 
  GitBranch, 
  Terminal as TerminalIcon, 
  Copy, 
  Check, 
  AlertCircle,
  Eye,
  Activity,
  Bot
} from "lucide-react";
import { Lesson, TrackInfo } from "../types";

interface CodecademyWorkspaceProps {
  lesson: Lesson;
  track: TrackInfo;
  onPrevLesson?: () => void;
  onNextLesson?: () => void;
  hasPrevLesson: boolean;
  hasNextLesson: boolean;
  onLessonComplete: (lessonId: string) => void;
  isCompleted: boolean;
  onAskAIAboutCode: (code: string, language: string, question?: string) => void;
}

export const CodecademyWorkspace: React.FC<CodecademyWorkspaceProps> = ({
  lesson,
  track,
  onPrevLesson,
  onNextLesson,
  hasPrevLesson,
  hasNextLesson,
  onLessonComplete,
  isCompleted,
  onAskAIAboutCode,
}) => {
  const [code, setCode] = useState<string>(lesson.starterCode);
  const [output, setOutput] = useState<string>("");
  const [activeRightTab, setActiveRightTab] = useState<"terminal" | "trace" | "ai-explain">("terminal");
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [checkpointStatus, setCheckpointStatus] = useState<Record<string, { passed: boolean; message: string }>>({});
  const [showHint, setShowHint] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [showSolution, setShowSolution] = useState<boolean>(false);
  const [aiExplanation, setAiExplanation] = useState<string>("");
  const [isExplaining, setIsExplaining] = useState<boolean>(false);

  // Sync state when lesson changes
  useEffect(() => {
    setCode(lesson.starterCode);
    setOutput("");
    setCheckpointStatus({});
    setShowHint(false);
    setShowSolution(false);
    setAiExplanation("");
    setActiveRightTab("terminal");
  }, [lesson.id]);

  // Run code safely
  const handleRunCode = async () => {
    setIsRunning(true);
    try {
      const response = await fetch("/api/run-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          language: lesson.language,
        }),
      });
      const data = await response.json();
      setOutput(data.output || "执行完成");
      setExecutionTime(data.executionTimeMs || 15);
      setActiveRightTab("terminal");

      // Auto evaluate checkpoints
      evaluateCheckpoints(code, data.output);
    } catch (err: any) {
      setOutput(`Error: ${err.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  // Evaluate each checkpoint
  const evaluateCheckpoints = (currentCode: string, currentOutput: string) => {
    const results: Record<string, { passed: boolean; message: string }> = {};
    let allPassed = true;

    lesson.checkpoints.forEach((chk) => {
      const res = chk.testFunction(currentCode, currentOutput);
      results[chk.id] = res;
      if (!res.passed) {
        allPassed = false;
      }
    });

    setCheckpointStatus(results);

    if (allPassed && lesson.checkpoints.length > 0) {
      onLessonComplete(lesson.id);
    }
  };

  // Ask AI for line-by-line explanation
  const handleRequestAIExplain = async () => {
    setIsExplaining(true);
    setActiveRightTab("ai-explain");
    try {
      const res = await fetch("/api/gemini/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          language: lesson.language,
          question: `请用最通俗直观的话拆解这段关于【${lesson.title}】的代码。`,
        }),
      });
      const data = await res.json();
      setAiExplanation(data.explanation);
    } catch (e: any) {
      setAiExplanation("AI 解析连接超时，请检查网络或配置 API Key。");
    } finally {
      setIsExplaining(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleResetCode = () => {
    if (confirm("确定要重置代码回初始状态吗？")) {
      setCode(lesson.starterCode);
      setCheckpointStatus({});
      setOutput("");
    }
  };

  const allPassed =
    lesson.checkpoints.length > 0 &&
    lesson.checkpoints.every((chk) => checkpointStatus[chk.id]?.passed);

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-4.2rem)] w-full overflow-hidden bg-slate-950 text-slate-100">
      {/* LEFT PANE: Guided Tutorial, Mental Model & Tasks */}
      <div className="w-full lg:w-[38%] border-b lg:border-b-0 lg:border-r border-slate-800 bg-slate-900/30 flex flex-col h-full overflow-y-auto">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between border-b border-slate-800/80 px-4 py-3 bg-slate-950/60 sticky top-0 z-10 backdrop-blur">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-indigo-400">{track.title}</span>
            <span className="text-slate-600">/</span>
            <span className="text-slate-300 font-medium truncate max-w-[180px]">
              {lesson.title}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={onPrevLesson}
              disabled={!hasPrevLesson}
              className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none"
              title="上一关"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={onNextLesson}
              disabled={!hasNextLesson}
              className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none"
              title="下一关"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-6 flex-1">
          {/* Header */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="rounded-full bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 text-[11px] font-semibold text-indigo-400">
                {lesson.level}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                预计耗时 ~{lesson.estimatedMinutes} 分钟
              </span>
              {isCompleted && (
                <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 ml-auto">
                  <CheckCircle className="h-3.5 w-3.5" />
                  已掌握
                </span>
              )}
            </div>
            <h1 className="text-xl font-extrabold text-white tracking-tight leading-snug">
              {lesson.title}
            </h1>
          </div>

          {/* 💡 ZERO-BASE MENTAL MODEL BOX (生活化比喻) */}
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 space-y-2.5">
            <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm">
              <Lightbulb className="h-4 w-4 text-amber-400 shrink-0" />
              <span>零基础直觉模型：{lesson.mentalModel.title}</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong>【日常比喻】：</strong>
              {lesson.mentalModel.metaphor}
            </p>
            <div className="rounded bg-amber-950/40 p-2.5 border border-amber-900/40 text-[11px] text-amber-200">
              <strong>💡 核心心法：</strong>
              {lesson.mentalModel.keyIntuition}
            </div>
          </div>

          {/* Markdown Explanations */}
          <div className="text-xs sm:text-sm text-slate-300 leading-relaxed space-y-3 prose prose-invert max-w-none">
            <div className="whitespace-pre-wrap font-sans text-xs leading-6 text-slate-300">
              {lesson.explanationMarkdown}
            </div>
          </div>

          {/* GitHub Real-world Analogy (工业级映射) */}
          {lesson.githubAnalogy && (
            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3.5 flex items-start gap-2.5">
              <GitBranch className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-semibold text-emerald-300">GitHub 开源项目映射：</span>
                <span className="text-slate-300 ml-1">{lesson.githubAnalogy}</span>
              </div>
            </div>
          )}

          {/* 🎯 INTERACTIVE CHECKPOINTS */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                <span>🎯 本节实战指令与校验点</span>
                <span className="text-xs text-slate-400 font-normal">
                  ({Object.values(checkpointStatus).filter((v) => v.passed).length}/{lesson.checkpoints.length})
                </span>
              </h3>

              <button
                onClick={() => setShowHint(!showHint)}
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                <HelpCircle className="h-3.5 w-3.5" />
                <span>{showHint ? "收起提示" : "查看提示"}</span>
              </button>
            </div>

            {/* Hint Box */}
            {showHint && (
              <div className="rounded-lg bg-indigo-950/40 border border-indigo-800/50 p-3 text-xs text-indigo-200 animate-fadeIn">
                <strong>💡 通关指引：</strong>
                <p className="mt-1 text-slate-300">
                  仔细阅读 starterCode 中的注释提示，按照步骤修改变量或补充对应逻辑后点击【验证答案】。
                </p>
              </div>
            )}

            {/* Checkpoint items */}
            <div className="space-y-2">
              {lesson.checkpoints.map((chk, index) => {
                const status = checkpointStatus[chk.id];
                return (
                  <div
                    key={chk.id}
                    className={`rounded-lg border p-3 transition-all ${
                      status?.passed
                        ? "border-emerald-500/40 bg-emerald-950/20 text-emerald-200"
                        : status && !status.passed
                        ? "border-rose-500/40 bg-rose-950/20 text-rose-200"
                        : "border-slate-800 bg-slate-900/40 text-slate-300"
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5 shrink-0">
                        {status?.passed ? (
                          <CheckCircle className="h-4 w-4 text-emerald-400" />
                        ) : status && !status.passed ? (
                          <AlertCircle className="h-4 w-4 text-rose-400" />
                        ) : (
                          <div className="h-4 w-4 rounded-full border border-slate-600 flex items-center justify-center text-[10px] text-slate-400 font-mono">
                            {index + 1}
                          </div>
                        )}
                      </div>
                      <div className="space-y-1 text-xs">
                        <div className="font-semibold text-slate-100">
                          {chk.title}
                        </div>
                        <div className="text-slate-400">{chk.description}</div>
                        {status && (
                          <div
                            className={`text-[11px] font-mono mt-1 ${
                              status.passed ? "text-emerald-400" : "text-rose-400"
                            }`}
                          >
                            {status.message}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Navigation Bar */}
        <div className="border-t border-slate-800 p-4 bg-slate-950/80 sticky bottom-0 z-10 flex items-center justify-between">
          <button
            onClick={handleRequestAIExplain}
            disabled={isExplaining}
            className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-medium py-1.5 px-2.5 rounded-lg hover:bg-indigo-950/40 transition-colors"
          >
            <Bot className="h-3.5 w-3.5" />
            <span>{isExplaining ? "AI 正在拆解..." : "让 AI 白话逐行拆解代码"}</span>
          </button>

          {allPassed && hasNextLesson ? (
            <button
              onClick={onNextLesson}
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-emerald-950 transition-all animate-bounce"
            >
              <span>通关！进入下一关</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={() => evaluateCheckpoints(code, output)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-950 transition-all"
            >
              <Check className="h-4 w-4" />
              <span>验证检查点</span>
            </button>
          )}
        </div>
      </div>

      {/* MIDDLE & RIGHT PANES: Editor + Output */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Editor Toolbar */}
        <div className="flex items-center justify-between border-b border-slate-800 px-4 py-2 bg-slate-900/60">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 rounded bg-slate-800 px-2.5 py-1 text-xs font-mono font-medium text-slate-200 border border-slate-700">
              <TerminalIcon className="h-3.5 w-3.5 text-indigo-400" />
              <span>{lesson.language === "bash" || lesson.language === "shell" ? "terminal.sh" : `main.${lesson.language === "python" ? "py" : lesson.language === "java" ? "java" : "sql"}`}</span>
            </span>
            <span className="text-[11px] font-mono text-slate-400 uppercase">
              {lesson.language}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSolution(!showSolution)}
              className="text-xs text-slate-400 hover:text-slate-200 px-2 py-1 rounded hover:bg-slate-800 flex items-center gap-1"
            >
              <Eye className="h-3.5 w-3.5" />
              <span>{showSolution ? "隐藏答案" : "参考答案"}</span>
            </button>

            <button
              onClick={handleCopyCode}
              className="text-xs text-slate-400 hover:text-slate-200 px-2 py-1 rounded hover:bg-slate-800 flex items-center gap-1"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? "已复制" : "复制"}</span>
            </button>

            <button
              onClick={handleResetCode}
              className="text-xs text-slate-400 hover:text-slate-200 px-2 py-1 rounded hover:bg-slate-800 flex items-center gap-1"
              title="重置初始代码"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>重置</span>
            </button>

            {/* Run Button */}
            <button
              id="run-code-button"
              onClick={handleRunCode}
              disabled={isRunning}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 px-3.5 py-1.5 text-xs font-semibold text-white shadow-md shadow-emerald-950 transition-all active:scale-95"
            >
              <Play className={`h-3.5 w-3.5 fill-current ${isRunning ? "animate-spin" : ""}`} />
              <span>{isRunning ? "执行中..." : "运行代码 (Run)"}</span>
            </button>
          </div>
        </div>

        {/* Code Editor Area */}
        <div className="relative flex-1 bg-slate-950 overflow-hidden font-mono text-xs sm:text-sm">
          {showSolution && (
            <div className="absolute inset-x-0 top-0 z-20 bg-slate-900/95 border-b border-indigo-500/40 p-4 max-h-[50%] overflow-y-auto shadow-2xl backdrop-blur">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4" />
                  官方标准参考答案
                </span>
                <button
                  onClick={() => setShowSolution(false)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  关闭
                </button>
              </div>
              <pre className="text-xs text-emerald-300 font-mono whitespace-pre-wrap bg-slate-950 p-3 rounded-lg border border-slate-800">
                {lesson.solutionCode}
              </pre>
            </div>
          )}

          <div className="flex h-full">
            {/* Line numbers column */}
            <div className="w-10 bg-slate-950/80 border-r border-slate-800/80 py-3 text-right pr-2 text-slate-600 select-none font-mono text-xs hidden sm:block">
              {code.split("\n").map((_, i) => (
                <div key={i} className="leading-6">
                  {i + 1}
                </div>
              ))}
            </div>

            {/* Code Input */}
            <textarea
              id="code-editor-textarea"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={(e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                  handleRunCode();
                }
              }}
              spellCheck={false}
              className="flex-1 bg-transparent p-3 sm:p-4 text-slate-100 font-mono text-xs sm:text-sm leading-6 resize-none focus:outline-none selection:bg-indigo-500/30"
              placeholder="在此编写你的代码..."
            />
          </div>
        </div>

        {/* BOTTOM OUTPUT PANE */}
        <div className="h-[38%] border-t border-slate-800 bg-slate-900/90 flex flex-col">
          {/* Tab selector */}
          <div className="flex items-center justify-between border-b border-slate-800 px-4 py-1.5 bg-slate-950/40">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveRightTab("terminal")}
                className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
                  activeRightTab === "terminal"
                    ? "bg-slate-800 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <TerminalIcon className="h-3.5 w-3.5 text-emerald-400" />
                <span>控制台输出</span>
                {executionTime !== null && (
                  <span className="text-[10px] text-slate-500 font-mono">({executionTime}ms)</span>
                )}
              </button>

              <button
                onClick={() => setActiveRightTab("trace")}
                className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
                  activeRightTab === "trace"
                    ? "bg-slate-800 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Activity className="h-3.5 w-3.5 text-indigo-400" />
                <span>执行状态追踪器</span>
              </button>

              <button
                onClick={() => {
                  setActiveRightTab("ai-explain");
                  if (!aiExplanation && !isExplaining) {
                    handleRequestAIExplain();
                  }
                }}
                className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
                  activeRightTab === "ai-explain"
                    ? "bg-slate-800 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Bot className="h-3.5 w-3.5 text-purple-400" />
                <span>AI 导师伴读拆解</span>
              </button>
            </div>

            <div className="text-[11px] text-slate-500 hidden sm:block font-mono">
              快捷键: Ctrl/Cmd + Enter 运行
            </div>
          </div>

          {/* Tab Content */}
          <div className="flex-1 p-3 font-mono text-xs overflow-y-auto">
            {activeRightTab === "terminal" && (
              <div className="h-full flex flex-col justify-between">
                <pre className="text-emerald-400/90 whitespace-pre-wrap leading-5">
                  {output || (
                    <span className="text-slate-500 italic font-sans">
                      点击【运行代码】或按 Ctrl+Enter 查看控制台即时执行反馈...
                    </span>
                  )}
                </pre>
                {executionTime !== null && (
                  <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-800/60 font-mono">
                    ➜ Process finished with exit code 0 ({executionTime}ms)
                  </div>
                )}
              </div>
            )}

            {activeRightTab === "trace" && (
              <div className="space-y-3 font-sans">
                <div className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
                  <Activity className="h-3.5 w-3.5 text-indigo-400" />
                  <span>内存与控制流单步快照 (Execution Trace)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="rounded-lg bg-slate-950 p-2.5 border border-slate-800">
                    <span className="text-[11px] text-slate-500 uppercase font-mono">1. 输入捕获</span>
                    <p className="text-xs text-slate-300 mt-1 font-mono">
                      参数压栈 / 寄存器初始化
                    </p>
                  </div>
                  <div className="rounded-lg bg-slate-950 p-2.5 border border-slate-800">
                    <span className="text-[11px] text-slate-500 uppercase font-mono">2. 状态机运算</span>
                    <p className="text-xs text-indigo-300 mt-1 font-mono">
                      {code.includes("def ") ? "函数寻址与局部作用域" : "逐行求值运算"}
                    </p>
                  </div>
                  <div className="rounded-lg bg-slate-950 p-2.5 border border-slate-800">
                    <span className="text-[11px] text-slate-500 uppercase font-mono">3. 标准输出流</span>
                    <p className="text-xs text-emerald-300 mt-1 font-mono truncate">
                      stdout ➔ {output ? output.slice(0, 30) : "等待运行"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeRightTab === "ai-explain" && (
              <div className="space-y-3 font-sans text-xs text-slate-300">
                {isExplaining ? (
                  <div className="flex items-center gap-2 text-indigo-400 p-4">
                    <Bot className="h-5 w-5 animate-spin" />
                    <span>AI 导师正在通俗化拆解你的代码，请稍候...</span>
                  </div>
                ) : aiExplanation ? (
                  <div className="whitespace-pre-wrap leading-6 text-slate-200 bg-slate-950 p-3 rounded-lg border border-slate-800">
                    {aiExplanation}
                  </div>
                ) : (
                  <div className="text-slate-500 p-4">
                    点击左下角【让 AI 白话逐行拆解代码】，获取专业通俗剖析。
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
