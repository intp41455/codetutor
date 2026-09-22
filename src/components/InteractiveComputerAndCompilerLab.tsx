import React, { useState, useEffect } from "react";
import {
  Cpu,
  Layers,
  HardDrive,
  FileCode,
  ArrowRight,
  Play,
  RotateCcw,
  Sparkles,
  Zap,
  CheckCircle2,
  Terminal,
  Binary,
  GitBranch,
  Repeat
} from "lucide-react";

export const InteractiveComputerAndCompilerLab: React.FC = () => {
  // Mode toggle: 'anatomy' (CPU, RAM, Storage flow) vs 'execution_model' (Interpreted vs Compiled)
  const [activeView, setActiveView] = useState<"anatomy" | "execution_model">("anatomy");

  // --- Computer Anatomy & Data Flow State ---
  const [activeComponent, setActiveComponent] = useState<"storage" | "ram" | "cpu">("storage");
  const [hardwareStep, setHardwareStep] = useState<number>(0);
  const [isAutoPlayingHardware, setIsAutoPlayingHardware] = useState<boolean>(false);

  // --- Compilation vs Interpretation Animation State ---
  const [languageMode, setLanguageMode] = useState<"python_interpreted" | "c_compiled">("python_interpreted");
  const [transStep, setTransStep] = useState<number>(0);
  const [isTranslating, setIsTranslating] = useState<boolean>(false);

  // Auto-play timer for hardware pipeline
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isAutoPlayingHardware) {
      timer = setInterval(() => {
        setHardwareStep((prev) => {
          if (prev >= 3) {
            setIsAutoPlayingHardware(false);
            return 3;
          }
          const next = prev + 1;
          if (next === 1) setActiveComponent("storage");
          if (next === 2) setActiveComponent("ram");
          if (next === 3) setActiveComponent("cpu");
          return next;
        });
      }, 1600);
    }
    return () => clearInterval(timer);
  }, [isAutoPlayingHardware]);

  // Auto-play for compile/interpret flow
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isTranslating) {
      timer = setInterval(() => {
        setTransStep((prev) => {
          if (prev >= 3) {
            setIsTranslating(false);
            return 3;
          }
          return prev + 1;
        });
      }, 1500);
    }
    return () => clearInterval(timer);
  }, [isTranslating]);

  const handleStartHardwareSim = () => {
    setHardwareStep(1);
    setActiveComponent("storage");
    setIsAutoPlayingHardware(true);
  };

  const handleResetHardware = () => {
    setHardwareStep(0);
    setActiveComponent("storage");
    setIsAutoPlayingHardware(false);
  };

  const handleStartTranslation = () => {
    setTransStep(1);
    setIsTranslating(true);
  };

  const handleResetTranslation = () => {
    setTransStep(0);
    setIsTranslating(false);
  };

  return (
    <div className="rounded-xl border border-indigo-500/30 bg-slate-900/95 p-4 space-y-4 shadow-xl shadow-indigo-950/20">
      {/* Top Navigation Bar: Component Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
              <Sparkles className="h-4 w-4" />
            </div>
            <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
              <span>电脑身体结构与代码翻译动态图解</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono">
                生活化动图
              </span>
            </h3>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            用柴米油盐的生活比喻，亲眼看懂【CPU、内存、硬盘】如何协作，以及【解释型与编译型语言】的区别
          </p>
        </div>

        {/* View Switch Buttons */}
        <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 shrink-0">
          <button
            onClick={() => setActiveView("anatomy")}
            className={`px-2.5 py-1 text-xs rounded-md font-medium transition-all ${
              activeView === "anatomy"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            1. 硬件三剑客 (CPU/内存/硬盘)
          </button>
          <button
            onClick={() => setActiveView("execution_model")}
            className={`px-2.5 py-1 text-xs rounded-md font-medium transition-all ${
              activeView === "execution_model"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            2. 代码如何被翻译执行？
          </button>
        </div>
      </div>

      {/* VIEW 1: Computer Anatomy (CPU, RAM, Storage) */}
      {activeView === "anatomy" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Controls */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-300 font-medium">
              💡 核心比喻：<strong>大厨、料理台与地下冷库</strong>
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleResetHardware}
                className="text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded bg-slate-800 flex items-center gap-1"
              >
                <RotateCcw className="h-3 w-3" />
                <span>重置</span>
              </button>
              <button
                onClick={handleStartHardwareSim}
                disabled={isAutoPlayingHardware || hardwareStep === 3}
                className="text-xs font-semibold px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white flex items-center gap-1.5 shadow"
              >
                <Play className="h-3 w-3" />
                <span>{hardwareStep === 0 ? "开始动态流转演示" : hardwareStep === 3 ? "流转已完成" : "流转中..."}</span>
              </button>
            </div>
          </div>

          {/* Animated Hardware Pipeline Diagram */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 relative">
            {/* 1. Storage (Hard Drive / SSD) */}
            <div
              onClick={() => setActiveComponent("storage")}
              className={`cursor-pointer rounded-xl border p-3.5 transition-all relative overflow-hidden flex flex-col justify-between ${
                activeComponent === "storage"
                  ? "border-purple-500 bg-purple-950/30 ring-1 ring-purple-500 shadow-lg shadow-purple-950/50"
                  : "border-slate-800 bg-slate-950/70 hover:border-slate-700"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-purple-400 font-bold text-xs">
                    <HardDrive className="h-4 w-4" />
                    <span>硬盘 Storage / SSD</span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300">
                    断电不丢数据
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                  <strong>【地下冷库】：</strong>你写好的代码（如 <code className="text-amber-300 font-mono">app.py</code>）和平时拍的照片，都静静锁在地下仓库里。
                </p>
              </div>

              {/* Visual File Block */}
              <div className="mt-3 p-2 rounded-lg bg-slate-900 border border-purple-500/30 flex items-center justify-between text-[11px] font-mono text-purple-300">
                <span className="flex items-center gap-1.5">
                  <FileCode className="h-3.5 w-3.5 text-purple-400" />
                  <span>app.py (指令待命)</span>
                </span>
                {hardwareStep >= 1 && (
                  <span className="text-[10px] text-emerald-400 flex items-center gap-0.5 animate-pulse">
                    <span>已读取</span>
                    <ArrowRight className="h-3 w-3" />
                  </span>
                )}
              </div>

              {hardwareStep === 1 && (
                <div className="absolute inset-0 border-2 border-purple-400/80 rounded-xl pointer-events-none animate-pulse" />
              )}
            </div>

            {/* 2. RAM (Memory) */}
            <div
              onClick={() => setActiveComponent("ram")}
              className={`cursor-pointer rounded-xl border p-3.5 transition-all relative overflow-hidden flex flex-col justify-between ${
                activeComponent === "ram"
                  ? "border-emerald-500 bg-emerald-950/30 ring-1 ring-emerald-500 shadow-lg shadow-emerald-950/50"
                  : "border-slate-800 bg-slate-950/70 hover:border-slate-700"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                    <Layers className="h-4 w-4" />
                    <span>内存 RAM</span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                    极速但关机即空
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                  <strong>【中央料理操作台】：</strong>程序双击启动后，立刻被搬到料理台上！所有变量收纳盒全放在这里，伸手就能取。
                </p>
              </div>

              {/* Visual Active Memory Box */}
              <div className="mt-3 p-2 rounded-lg bg-slate-900 border border-emerald-500/30 flex items-center justify-between text-[11px] font-mono text-emerald-300">
                <span>📦 变量盒子: score=100</span>
                {hardwareStep >= 2 && (
                  <span className="text-[10px] text-emerald-400 flex items-center gap-0.5 animate-pulse">
                    <span>就绪传输</span>
                    <ArrowRight className="h-3 w-3" />
                  </span>
                )}
              </div>

              {hardwareStep === 2 && (
                <div className="absolute inset-0 border-2 border-emerald-400/80 rounded-xl pointer-events-none animate-pulse" />
              )}
            </div>

            {/* 3. CPU (Processor) */}
            <div
              onClick={() => setActiveComponent("cpu")}
              className={`cursor-pointer rounded-xl border p-3.5 transition-all relative overflow-hidden flex flex-col justify-between ${
                activeComponent === "cpu"
                  ? "border-amber-500 bg-amber-950/30 ring-1 ring-amber-500 shadow-lg shadow-amber-950/50"
                  : "border-slate-800 bg-slate-950/70 hover:border-slate-700"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                    <Cpu className="h-4 w-4" />
                    <span>CPU 算力核心</span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
                    一秒算 30 亿次
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                  <strong>【特级主厨 / 超级神算手】：</strong>手速快如闪电，从内存料理台抓取指令并飞速心算，将最终结果吐给屏幕！
                </p>
              </div>

              {/* Visual ALU result */}
              <div className="mt-3 p-2 rounded-lg bg-slate-900 border border-amber-500/30 flex items-center justify-between text-[11px] font-mono text-amber-300">
                <span>⚡ ALU 计算: 100 + 50 = 150</span>
                {hardwareStep === 3 && (
                  <span className="text-[10px] text-emerald-400 font-sans font-bold flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    执行成功
                  </span>
                )}
              </div>

              {hardwareStep === 3 && (
                <div className="absolute inset-0 border-2 border-amber-400/80 rounded-xl pointer-events-none animate-pulse" />
              )}
            </div>
          </div>

          {/* Deep Insight Details Box based on Selected Part */}
          <div className="rounded-lg bg-slate-950 p-3 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-amber-400" />
                <span>
                  当前选中观察：
                  {activeComponent === "storage" && "硬盘 (Storage/SSD) —— 永久代码藏宝库"}
                  {activeComponent === "ram" && "内存 (RAM) —— 临时亚克力收纳盒大货架"}
                  {activeComponent === "cpu" && "CPU (中央处理器) —— 脑子一根筋的手速之王"}
                </span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                {activeComponent === "storage" && "访问速度: ~微秒/毫秒 (最慢)"}
                {activeComponent === "ram" && "访问速度: ~50纳秒 (快 1000 倍)"}
                {activeComponent === "cpu" && "访问速度: ~0.3纳秒 (光速计算)"}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {activeComponent === "storage" &&
                "为什么我们双击软件时需要等一会儿？因为硬盘虽然容量大且断电不丢数据，但机械读写速度相对于 CPU 来说就像乌龟爬。电脑必须先花一点时间把代码从冷库（硬盘）搬运到料理台（内存）上，之后才能飞速执行！"}
              {activeComponent === "ram" &&
                "很多新手常问：‘为什么不把所有东西直接存内存里？’因为内存只要一关机拔电源，所有存的东西瞬间蒸发！所以你在写代码时按的【Ctrl + S 保存】，本质上就是把内存里新写的内容，稳妥抄录并锁进硬盘永久保险柜里。"}
              {activeComponent === "cpu" &&
                "CPU 虽然算力天下第一，但它完全没有自主意识，更不是外星神童。你给它写错一行指令（比如漏了冒号或除以零），它就会立刻愣住抛出异常报错。程序员的工作，就是给这位绝不偷懒但不知变通的主厨编写无懈可击的操作说明书！"}
            </p>
          </div>
        </div>
      )}

      {/* VIEW 2: How Code is Interpreted / Compiled */}
      {activeView === "execution_model" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Mode Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">选择对比模式：</span>
              <button
                onClick={() => {
                  setLanguageMode("python_interpreted");
                  setTransStep(0);
                  setIsTranslating(false);
                }}
                className={`text-xs px-2.5 py-1 rounded font-medium transition-all ${
                  languageMode === "python_interpreted"
                    ? "bg-amber-600 text-white font-bold"
                    : "bg-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                🐍 解释型语言 (如 Python / JS) —— 同声传译员模式
              </button>
              <button
                onClick={() => {
                  setLanguageMode("c_compiled");
                  setTransStep(0);
                  setIsTranslating(false);
                }}
                className={`text-xs px-2.5 py-1 rounded font-medium transition-all ${
                  languageMode === "c_compiled"
                    ? "bg-indigo-600 text-white font-bold"
                    : "bg-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                ⚡ 编译型语言 (如 C / C++ / Go) —— 出版社整书翻译模式
              </button>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                onClick={handleResetTranslation}
                className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800 flex items-center gap-1"
              >
                <RotateCcw className="h-3 w-3" />
                <span>重置</span>
              </button>
              <button
                onClick={handleStartTranslation}
                disabled={isTranslating || transStep === 3}
                className="text-xs font-semibold px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white flex items-center gap-1 shadow"
              >
                <Play className="h-3 w-3" />
                <span>{transStep === 0 ? "开始翻译执行演示" : transStep === 3 ? "翻译执行完毕" : "正在翻译..."}</span>
              </button>
            </div>
          </div>

          {/* Animated 3-Stage Diagram */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Stage 1: Source Code */}
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <FileCode className="h-4 w-4 text-indigo-400" />
                  <span>阶段 1：人类编写的代码</span>
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono">
                  人类易懂
                </span>
              </div>
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800 font-mono text-xs text-slate-300">
                <p className="text-amber-400">print("Hello World!")</p>
                <p className="text-slate-400">total = 10 + 20</p>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                这是我们敲出来的英文和字符。但是<strong>电脑 CPU 一个英文字母都看不懂</strong>！它只认 0 和 1（高低电平）！
              </p>
            </div>

            {/* Stage 2: Translator (Interpreter or Compiler) */}
            <div
              className={`rounded-xl border p-3.5 space-y-2 transition-all ${
                transStep >= 1
                  ? languageMode === "python_interpreted"
                    ? "border-amber-500 bg-amber-950/20 shadow-md"
                    : "border-indigo-500 bg-indigo-950/20 shadow-md"
                  : "border-slate-800 bg-slate-950"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Repeat className="h-4 w-4 text-emerald-400" />
                  <span>
                    阶段 2：
                    {languageMode === "python_interpreted" ? "解释器 (同声传译员)" : "编译器 (整书翻译社)"}
                  </span>
                </span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                    languageMode === "python_interpreted"
                      ? "bg-amber-500/20 text-amber-300"
                      : "bg-indigo-500/20 text-indigo-300"
                  }`}
                >
                  {languageMode === "python_interpreted" ? "一边读一边翻" : "一次性打包"}
                </span>
              </div>

              <div className="p-2.5 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
                {languageMode === "python_interpreted" ? (
                  <div className="space-y-1">
                    <p className="text-amber-300 font-medium">🎧 Python 解释器：</p>
                    <p className="text-slate-400">“我看到第 1 行 print 了，我马上把它翻给 CPU，CPU 马上执行；接着我再去读第 2 行！”</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <p className="text-indigo-300 font-medium">📚 C/C++ 编译器 (gcc)：</p>
                    <p className="text-slate-400">“别着急，我先把整份 1000 页代码全部翻成机器码，打包生成 <code className="text-white">app.exe</code>！下次直接跑极速可执行文件！”</p>
                  </div>
                )}
              </div>

              {transStep >= 1 && (
                <div className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>翻译工作就绪</span>
                </div>
              )}
            </div>

            {/* Stage 3: Machine Code & CPU Execution */}
            <div
              className={`rounded-xl border p-3.5 space-y-2 transition-all ${
                transStep >= 2
                  ? "border-emerald-500 bg-emerald-950/20 shadow-md"
                  : "border-slate-800 bg-slate-950"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Binary className="h-4 w-4 text-emerald-400" />
                  <span>阶段 3：0与1的机器指令</span>
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                  CPU 直读
                </span>
              </div>

              <div className="p-2.5 rounded bg-slate-900 border border-slate-800 font-mono text-[11px] text-emerald-400 tracking-wider">
                <p>10110000 01100001</p>
                <p>00000100 00100000</p>
              </div>

              <div className="text-[11px] text-slate-300 flex items-center justify-between">
                <span>CPU 真正执行结果：</span>
                {transStep >= 3 ? (
                  <span className="text-emerald-300 font-bold font-mono">Hello World!</span>
                ) : (
                  <span className="text-slate-500 text-[10px]">等待翻译流...</span>
                )}
              </div>
            </div>
          </div>

          {/* Practical takeaway summary */}
          <div className="rounded-lg bg-slate-950 p-3 border border-slate-800 text-xs text-slate-300 space-y-1.5">
            <span className="font-bold text-amber-400 flex items-center gap-1">
              <span>💡 小白避坑总结：哪个更好？</span>
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px]">
              <div className="p-2 rounded bg-slate-900 border border-slate-800/80">
                <strong className="text-amber-300">🐍 Python 解释型（灵活方便）：</strong>
                <p className="text-slate-400 mt-0.5">
                  写完就能跑，不需要先“打包”，学习体验极佳，AI与数据分析首选。缺点是每次跑都要现翻，速度相对稍慢。
                </p>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800/80">
                <strong className="text-indigo-300">⚡ C/Go 编译型（极致性能）：</strong>
                <p className="text-slate-400 mt-0.5">
                  必须先“编译”成 .exe 文件。虽然编译要花几十秒，但跑起来是纯正机器码，如同超跑，游戏引擎与操作系统最爱。
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
