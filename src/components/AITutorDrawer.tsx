import React, { useState, useRef, useEffect } from "react";
import { 
  X, 
  Bot, 
  Send, 
  Sparkles, 
  HelpCircle, 
  RotateCcw, 
  User, 
  Lightbulb, 
  Terminal,
  ChevronRight
} from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AITutorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentTrackTitle?: string;
  currentLessonTitle?: string;
  currentCode?: string;
}

const QUICK_QUESTIONS = [
  "我完全零基础，代码本质到底是什么？",
  "面对一个陌生 GitHub 项目，第一步具体看哪个文件？",
  "让 AI 写复杂代码时，怎样才能做到心里有数？",
  "为什么 Agent 必须有最大步数限制（max_turns）？",
  "FastAPI 的 async def 到底比传统同步快在哪里？"
];

export const AITutorDrawer: React.FC<AITutorDrawerProps> = ({
  isOpen,
  onClose,
  currentTrackTitle,
  currentLessonTitle,
  currentCode,
}) => {
  if (!isOpen) return null;

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `你好！我是你的 **CodeMaster 架构师与 AI 伴读导师**。👋
无论你是零基础对某个术语感到困惑，还是在分析 GitHub 项目架构、审查 AI 生成的代码时遇到了疑问，随时都可以向我提问！我会用最生活化、最形象的白话比喻为你拆解底层真相。`,
    },
  ]);
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isLoading) return;

    const newMessages: Message[] = [...messages, { role: "user", content: query }];
    setMessages(newMessages);
    if (!textToSend) setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/gemini/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages,
          currentTopic: currentLessonTitle,
          currentTrack: currentTrackTitle,
          currentCode: currentCode,
        }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply || "收到！正在为你整理技术心法..." },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "网络连接出现微小抖动，请重试或检查配置。" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] border-l border-slate-800 bg-slate-950/95 backdrop-blur-xl shadow-2xl flex flex-col text-slate-100 animate-slideInRight">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4 bg-slate-900/60">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/30">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-white">AI 伴读导师 (Gemini 驱动)</span>
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <p className="text-[11px] text-slate-400">
              当前上下文：{currentLessonTitle || "全栈与AI编程实战"}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-xs sm:text-sm">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-2.5 ${
              m.role === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-lg shrink-0 text-white text-xs ${
                m.role === "user"
                  ? "bg-indigo-600"
                  : "bg-slate-800 border border-slate-700 text-indigo-300"
              }`}
            >
              {m.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
            </div>

            <div
              className={`rounded-2xl p-3.5 max-w-[85%] leading-relaxed ${
                m.role === "user"
                  ? "bg-indigo-600 text-white rounded-tr-none shadow-md shadow-indigo-600/10"
                  : "bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none whitespace-pre-wrap font-sans"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-indigo-400 text-xs p-2">
            <Bot className="h-4 w-4 animate-spin" />
            <span>AI 导师正在深入思考并组织最通俗的语言...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Starters */}
      <div className="border-t border-slate-800/80 px-4 py-2.5 bg-slate-900/40">
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-2">
          <Lightbulb className="h-3.5 w-3.5 text-amber-400" />
          <span>初学者高频疑问（点击即问）：</span>
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1 text-[11px]">
          {QUICK_QUESTIONS.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(q)}
              className="shrink-0 rounded-full bg-slate-800 hover:bg-slate-700 px-3 py-1 text-slate-300 border border-slate-700 transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <div className="border-t border-slate-800 p-3 sm:p-4 bg-slate-950">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="问问导师：代码是什么意思？这个框架怎么看？"
            className="flex-1 rounded-xl bg-slate-900 border border-slate-800 px-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-40 disabled:pointer-events-none transition-all"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
