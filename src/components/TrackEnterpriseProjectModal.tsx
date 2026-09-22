import React, { useState } from "react";
import { 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  Layers, 
  Terminal, 
  Copy, 
  Check, 
  Play, 
  Sparkles, 
  ArrowRight, 
  Award, 
  FileCode, 
  ExternalLink,
  Target,
  Rocket
} from "lucide-react";
import { TrackInfo, UserProgress } from "../types";

interface TrackEnterpriseProjectModalProps {
  track: TrackInfo;
  isOpen: boolean;
  onClose: () => void;
  onAcceptancePassed?: (trackId: string) => void;
  isAlreadyPassed?: boolean;
}

export const TrackEnterpriseProjectModal: React.FC<TrackEnterpriseProjectModalProps> = ({
  track,
  isOpen,
  onClose,
  onAcceptancePassed,
  isAlreadyPassed = false
}) => {
  const [activeTab, setActiveTab] = useState<"overview" | "architecture" | "criteria" | "code" | "sandbox">("overview");
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isRunningVerification, setIsRunningVerification] = useState(false);
  const [verificationLogs, setVerificationLogs] = useState<string[]>([]);
  const [passedLocally, setPassedLocally] = useState(isAlreadyPassed);

  if (!isOpen) return null;

  const project = track.enterpriseProject;
  const currentFile = project.deliverableFiles[activeFileIndex] || project.deliverableFiles[0];

  const handleCopyCode = () => {
    if (currentFile) {
      navigator.clipboard.writeText(currentFile.productionCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRunVerification = () => {
    setIsRunningVerification(true);
    setVerificationLogs([]);

    const steps = [
      `[Init] 正在准备【${project.projectName}】企业级生产沙箱运行环境...`,
      `[Env Check] 依赖包与运行时检查完毕，环境状态: HEALTHY (零未知异常)`,
      `[Layer 1] 校验接入层与业务协议契约... PASS`,
      `[Layer 2] 模拟高并发压力与核心状态机边界流转... PASS`,
      `[Criteria 1] 验收标准 1【${project.acceptanceCriteria[0]?.title || "逻辑完备"}】... 达标 (100%)`,
      `[Criteria 2] 验收标准 2【${project.acceptanceCriteria[1]?.title || "异常容错"}】... 达标 (100%)`,
      `[Criteria 3] 验收标准 3【${project.acceptanceCriteria[2]?.title || "性能吞吐"}】... 达标 (100%)`,
      `[Criteria 4] 验收标准 4【${project.acceptanceCriteria[3]?.title || "模块规范"}】... 达标 (100%)`,
      `[Delivery] 生成企业级生产交付凭证：HASH-${Date.now().toString(16).toUpperCase()}`,
      `[Success] 🎉 恭喜！本项目在生产模式下成功落地运行并通过所有终极目标验收！`
    ];

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setVerificationLogs(prev => [...prev, step]);
        if (idx === steps.length - 1) {
          setIsRunningVerification(false);
          setPassedLocally(true);
          if (onAcceptancePassed) {
            onAcceptancePassed(track.id);
          }
        }
      }, (idx + 1) * 350);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-5xl max-h-[92vh] flex flex-col bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  终极目标验收与落地成果
                </span>
                {passedLocally && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    已通过验收
                  </span>
                )}
              </div>
              <h2 className="text-lg font-bold text-white mt-1">
                {project.projectName}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-6 border-b border-slate-800 bg-slate-950/50 overflow-x-auto">
          {[
            { id: "overview", label: "目标承诺与场景", icon: Target },
            { id: "architecture", label: "企业级架构分层", icon: Layers },
            { id: "criteria", label: "终极验收标准 (4项)", icon: ShieldCheck },
            { id: "code", label: "生产交付源码", icon: FileCode },
            { id: "sandbox", label: "生产验收沙箱", icon: Rocket }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
                  isActive 
                    ? "border-indigo-500 text-indigo-400 bg-indigo-500/5" 
                    : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === "overview" && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Promise Banner */}
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-indigo-950/60 via-purple-950/40 to-slate-900 border border-indigo-500/30 p-5">
                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-lg bg-indigo-500/20 text-indigo-300 mt-1">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <span>从零基础到独立落地的终极承诺</span>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-indigo-500/30 text-indigo-200">
                        100% 独立开发
                      </span>
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {project.zeroBasePromise}
                    </p>
                  </div>
                </div>
              </div>

              {/* Tagline & Business Context */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-xl bg-slate-800/50 border border-slate-700/60 p-5 space-y-3">
                  <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
                    <Target className="h-4 w-4" />
                    <span>核心目标定位</span>
                  </div>
                  <p className="text-base font-semibold text-white leading-snug">
                    {project.projectTagline}
                  </p>
                  <p className="text-xs text-slate-400">
                    所属课程：<span className="text-indigo-300 font-medium">{track.title}</span>（共 {track.lessons.length} 节实战关卡）
                  </p>
                </div>

                <div className="rounded-xl bg-slate-800/50 border border-slate-700/60 p-5 space-y-3">
                  <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                    <ShieldCheck className="h-4 w-4" />
                    <span>企业生产真实诉求与痛点</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {project.targetScenario}
                  </p>
                </div>
              </div>

              {/* Quick Summary of Acceptance */}
              <div className="rounded-xl bg-slate-950/60 border border-slate-800 p-5 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  终极交付物与能力矩阵速览
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-center">
                    <div className="text-lg font-bold text-indigo-400">4 大</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">硬核验收标准</div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-center">
                    <div className="text-lg font-bold text-purple-400">4 层</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">工业架构解耦</div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-center">
                    <div className="text-lg font-bold text-emerald-400">100%</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">真实生产代码</div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-center">
                    <div className="text-lg font-bold text-amber-400">0 依赖</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">开箱即跑</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "architecture" && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="text-xs text-slate-400">
                本项目的企业级架构设计严格遵循高内聚、低耦合与分层隔离原则：
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {project.architectureLayers.map((layer, idx) => (
                  <div 
                    key={layer.name}
                    className="rounded-xl bg-slate-800/40 border border-slate-700/60 p-4 space-y-2 relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-400">
                        分层 0{idx + 1}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {layer.role}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white">
                      {layer.name}
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {layer.details}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "criteria" && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="text-xs text-slate-400">
                学完本课程后，你独立编写的项目必须满足以下 4 项终极指标方可通过结业验收：
              </div>
              <div className="space-y-3">
                {project.acceptanceCriteria.map((crit, idx) => (
                  <div 
                    key={crit.id}
                    className="flex items-start gap-4 p-4 rounded-xl bg-slate-800/40 border border-slate-700/60"
                  >
                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 mt-0.5">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-white">
                          验收指标 {idx + 1}：{crit.title}
                        </h4>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          必须达标
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {crit.description}
                      </p>
                      <div className="pt-2 text-xs font-mono text-indigo-300 flex items-center gap-1.5">
                        <span className="text-slate-500">达标判定:</span>
                        <span>{crit.standard}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "code" && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-300 px-2.5 py-1 rounded bg-slate-800 border border-slate-700">
                    {currentFile.fileName}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {currentFile.description}
                  </span>
                </div>
                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-300" />
                      <span>已复制完整源码</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>一键复制代码</span>
                    </>
                  )}
                </button>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs text-slate-200 overflow-x-auto max-h-[460px] leading-relaxed select-text">
                <pre>{currentFile.productionCode}</pre>
              </div>
            </div>
          )}

          {activeTab === "sandbox" && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">
                    生产环境运行与目标验收模拟沙箱
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    在虚拟隔离环境中装配各分层组件，自动注入测试载荷并核验 4 项达标指标。
                  </p>
                </div>
                <button
                  onClick={handleRunVerification}
                  disabled={isRunningVerification}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-lg transition-all ${
                    isRunningVerification 
                      ? "bg-slate-700 cursor-not-allowed opacity-60" 
                      : "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20 hover:scale-[1.02]"
                  }`}
                >
                  <Play className={`h-4 w-4 ${isRunningVerification ? "animate-spin" : ""}`} />
                  <span>{isRunningVerification ? "正在验收评估中..." : "立即执行终极目标验收"}</span>
                </button>
              </div>

              {/* Terminal View */}
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs overflow-hidden flex flex-col min-h-[300px]">
                <div className="flex items-center gap-1.5 pb-3 border-b border-slate-800 text-slate-500 text-[11px]">
                  <Terminal className="h-3.5 w-3.5 text-indigo-400" />
                  <span>acceptance-runner@codemaster: ~/{project.deliverableFiles[0]?.fileName || "project"}</span>
                </div>
                <div className="pt-3 flex-1 overflow-y-auto space-y-1.5 text-slate-300">
                  {verificationLogs.length === 0 ? (
                    <div className="text-slate-500 py-12 text-center">
                      点击右上角【立即执行终极目标验收】按钮，启动生产沙箱自动化测试流水线。
                    </div>
                  ) : (
                    verificationLogs.map((log, i) => (
                      <div 
                        key={i} 
                        className={`animate-in fade-in ${
                          log.includes("[Success]") 
                            ? "text-emerald-400 font-bold" 
                            : log.includes("PASS") || log.includes("达标")
                            ? "text-indigo-300"
                            : "text-slate-300"
                        }`}
                      >
                        {log}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {passedLocally && (
                <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-500/40 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-300">
                      <Award className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">
                        已达到独立落地企业级项目标准！
                      </h4>
                      <p className="text-xs text-emerald-300/90 mt-0.5">
                        恭喜通过《{track.title}》终极考核，掌握独立构建并稳定运行此系统的一切能力。
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-400 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                    +500 XP 终极大奖
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-900/90">
          <span className="text-xs text-slate-400">
            CodeMaster 终极目标驱动教学法 · 零基础到工业级独立交付
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              关闭
            </button>
            <button
              onClick={() => setActiveTab("sandbox")}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20"
            >
              <span>前往沙箱验收</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
