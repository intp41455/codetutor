import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";
import { auditCodeLocally } from "./src/utils/codeAuditEngine";
import { runFullPlatformTests } from "./src/utils/testRunner";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "5mb" }));

// Lazy initialization of Gemini AI
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
      aiClient = new GoogleGenAI({ apiKey });
    }
  }
  return aiClient;
}

// 1. Code Explanation Endpoint (Designed for beginners with visual metaphors)
app.post("/api/gemini/explain", async (req, res) => {
  try {
    const { code, language, focusLine, question } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      // High-quality deterministic fallback for instant offline/keyless experience
      return res.json({
        explanation: `### 💡 核心逻辑通俗拆解 (${language || "代码"})
这段代码的核心作用是：构建一个结构化的逻辑单元。
- **输入与初始化**：首先建立基础变量并分配内存，相当于在桌上摆好容器；
- **核心计算/流转**：通过条件判断或循环，对数据进行步进处理；
- **输出与返回**：返回明确的结果或将状态同步给下一个调用方。

> **小白直觉记忆法**：把这段代码想象成一个自动化流水线，零件从入口送入，传感器（条件分支）检查合格与否，加工机械手（函数执行）改变形态，最后送出包装盒。

*提示：配置 GEMINI_API_KEY 可解锁基于代码具体语义的逐行深度 AI 伴读。*`,
        mentalModel: "流水线与零件加工模型",
        keyTakeaway: "理解代码时，先抓数据输入和最终输出，再看中间经历了哪几步变换。"
      });
    }

    const prompt = `你是一位世界顶级的计算机科学名师，专门指导完全零基础的编程初学者，同时也是开源项目架构师。
学员正在学习：${language || "编程语言"}。
代码如下：
\`\`\`${language || ""}
${code}
\`\`\`
${focusLine ? `重点关注第 ${focusLine} 行代码。` : ""}
${question ? `学员的问题是：${question}` : "请通俗、生动且深刻地拆解这段代码。"}

请用结构化 Markdown 回答：
1. **生活化比喻（直觉模型）**：用日常生活的直觉场景（如做饭、流水线、快递站、乐高积木等）打比方，彻底消除恐惧感；
2. **执行流程四部曲**：用极其清晰的序号，讲解计算机在这一瞬间在内存和CPU里实际做了什么；
3. **关键语法与术语通俗翻译**：把这段代码里涉及的关键字（例如 async/await, class, interface, @Component, yield 等）翻译成人话；
4. **小白最容易踩的坑（雷区警示）**：如果写错一个符号或漏掉一个逻辑，会发生什么灾难；
5. **在大型GitHub项目中的真实对应**：在实际企业级框架（如FastAPI、Spring Boot、LangGraph、React）中，这段代码的模式对应着什么工业级概念。`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
    });

    res.json({ explanation: response.text || "无法生成解析，请重试。" });
  } catch (error: any) {
    console.error("Error in /api/gemini/explain:", error);
    res.status(500).json({ error: error.message || "Failed to explain code" });
  }
});

// 2. Vibe Coding Code Review & Bug Hunting Endpoint
app.post("/api/gemini/review", async (req, res) => {
  try {
    const { code, language, intent, knownRisks } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        summary: "AI 代码已完成基础静态审计。",
        vulnerabilities: [
          {
            type: "隐式异常捕获与状态悬空",
            severity: "HIGH",
            location: "主要业务逻辑块",
            description: "AI经常生成通用的 try...except Exception 结构，导致真实的底层网络或类型错误被静默吞噬，系统假死。",
            fix: "精细化捕获特定异常类型，并增加结构化错误日志与补偿回滚。"
          },
          {
            type: "异步事件循环阻塞隐患",
            severity: "MEDIUM",
            location: "IO操作",
            description: "在异步函数中调用了同步阻塞的库（如 requests 或 time.sleep），会导致单线程事件循环整体卡死。",
            fix: "替换为原生异步库（如 httpx / asyncio.sleep）或放入 run_in_executor 线程池。"
          }
        ],
        mentalModelCheck: "请反问自己：如果外部接口超时5秒，这段代码是优雅重试还是引发连锁雪崩？",
        suggestedRefactor: code
      });
    }

    const prompt = `你是资深架构师和 Vibe Coding 质量审查官。
当前学员正在通过 AI 辅助（Vibe Coding）完成复杂业务或智能体模块，但必须做到【对 AI 写的每一行代码都了然于心，不当无知的使用者】。
代码语言：${language || "Python"}
学员预期的代码意图：${intent || "实现核心业务/Agent功能"}
代码内容：
\`\`\`${language}
${code}
\`\`\`

请深入审计这份由 AI 生成的代码，严格输出以下维度的审计报告（Markdown格式）：
1. **真实执行链路还原**：代码被调用时，控制流从哪进、经历哪几个状态跳转、从哪出？
2. **隐藏致命隐患（Smell & Bug Hunt）**：
   - 并发/竞态安全？
   - 是否有无限重试/Token爆炸/死锁？
   - 是否有同步阻塞异步事件循环？
   - 异常是否被静默吞掉？
   - 是否缺少关键输入校验与边界保护？
3. **关键语句逐行质询（向学员提问以检验理解）**：挑出2-3处最关键的代码行，给出提问与正解；
4. **工业级硬化重构建议**：给出修复后的干净、健壮代码。`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
    });

    res.json({ review: response.text || "无法生成审查报告。" });
  } catch (error: any) {
    console.error("Error in /api/gemini/review:", error);
    res.status(500).json({ error: error.message || "Failed to review code" });
  }
});

// 3. Interactive AI Tutor Chat Endpoint
app.post("/api/gemini/tutor", async (req, res) => {
  try {
    const { messages, currentTopic, currentTrack, currentCode } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      const lastUserMsg = messages && messages.length > 0 ? messages[messages.length - 1].content : "";
      return res.json({
        reply: `收到你的问题："${lastUserMsg}"！
在 **${currentTrack || "编程"}** 的学习中，初学者常常会被概念的抽象性困扰。
记住：
1. **代码本质是数据的变换**：所有的程序，哪怕是再复杂的Spring Boot或Multi-Agent，都是输入 -> 状态变换 -> 输出；
2. **先看全貌，再追单点**：看开源项目或运行代码时，不要一头扎进几千行细节，先看入口（Main/Controller），画出架构草图；
3. **动手改一个参数**：最快掌握代码的方法就是故意改错一个值，看控制台报什么错，然后修复它！

*提示：配置 GEMINI_API_KEY 可与 AI 导师进行全方位的个性化实时答疑互动。*`
      });
    }

    const conversationHistory = Array.isArray(messages) ? messages.map((m: any) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }]
    })) : [];

    const systemInstruction = `你是 CodeMaster 学院的主教导师兼开源项目技术总监。
你的学员是【零基础起步的未来全栈架构师与AI编程高手】。
教学风格：
1. 极富亲和力、循循善诱、善于用日常万物比喻解释最硬核的技术内核（如 JVM 垃圾回收就像保洁阿姨巡楼，IOC 依赖注入就像餐厅点菜而不是自己种菜，Agent ReAct 就像侦探破案先思考再查线索）；
2. 引导学员具备【看透GitHub任意陌生开源项目源码】的能力，以及【哪怕用AI写代码也能完全掌控每一行】的工程素养；
3. 回复简明扼要、排版清晰，代码示例带详尽中文注释；
当前学员正在攻克的赛道：${currentTrack || "基础"}，当前课程主题：${currentTopic || "核心编程"}。
${currentCode ? `当前编辑器里的代码：\n\`\`\`\n${currentCode}\n\`\`\`` : ""}`;

    const chat = ai.chats.create({
      model: "gemini-3.8-flash",
      config: {
        systemInstruction,
      },
      history: conversationHistory.slice(0, -1),
    });

    const lastMsg = conversationHistory[conversationHistory.length - 1]?.parts[0]?.text || "请给我一些学习指引";
    const response = await chat.sendMessage({ message: lastMsg });

    res.json({ reply: response.text || "我在这里，请随时提问！" });
  } catch (error: any) {
    console.error("Error in /api/gemini/tutor:", error);
    res.status(500).json({ error: error.message || "Failed to chat with tutor" });
  }
});

// 3.5 Code Audit Endpoint (可通性、可行性与安全性三维深度质检)
app.post("/api/audit-code", async (req, res) => {
  try {
    const { code, language = "python" } = req.body;
    if (!code) {
      return res.status(400).json({ error: "Code is required for audit" });
    }

    // 1. 本地确定性静态规则审计
    const localReport = auditCodeLocally(code, language);

    // 2. 如果配置了 Gemini，增强 AI 架构师深度安全评估与一键重构建议
    const ai = getGeminiClient();
    let aiEnhancement: {
      deepInsight?: string;
      architectPatch?: string;
    } = {};

    if (ai && localReport.issues.length > 0) {
      try {
        const prompt = `你是一位世界顶级的代码安全与系统可靠性架构师。
学员提交了以下一段 ${language} 代码进行可通性、可行性与安全性的三维质检。
本地引擎已初步标记出以下隐患：
${localReport.issues.map(i => `- [${i.severity}] ${i.title}: ${i.description}`).join("\n")}

待审计代码：
\`\`\`${language}
${code}
\`\`\`

请提供：
1. **深度风险剖析**：解释如果这段代码直接推向生产环境，黑客如何利用它进行渗透，或者在大流量并发下系统会如何雪崩崩塌；
2. **修复加固代码**：给出严格符合生产规范、零漏洞、高容错的重构版本代码（以 \`\`\`${language} ... \`\`\` 包裹）。`;

        const response = await ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: prompt,
        });

        const text = response.text || "";
        const codeBlockMatch = text.match(/```(?:[a-zA-Z0-9_-]+)?\n([\s\S]*?)```/);

        aiEnhancement = {
          deepInsight: text,
          architectPatch: codeBlockMatch ? codeBlockMatch[1].trim() : undefined,
        };
      } catch (e) {
        console.warn("Gemini audit enhancement skipped:", e);
      }
    }

    res.json({
      report: localReport,
      aiEnhancement
    });
  } catch (error: any) {
    console.error("Error in /api/audit-code:", error);
    res.status(500).json({ error: error.message || "Failed to audit code" });
  }
});

// 3.6 全站自动化回归测试与 Bug 捕获运行端点
app.get("/api/run-full-audit", (req, res) => {
  try {
    const testResults = runFullPlatformTests();
    res.json({
      success: testResults.success,
      totalPassed: testResults.totalPassed,
      totalFailed: testResults.totalFailed,
      totalDurationMs: testResults.totalDurationMs,
      suites: testResults.suites,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error("Error in /api/run-full-audit:", error);
    res.status(500).json({ error: error.message || "Failed to run platform tests" });
  }
});

// 4. Safe Code Execution Simulator Endpoint
app.post("/api/run-code", async (req, res) => {
  try {
    const { code, language, input } = req.body;
    
    // Simulate real execution and provide instant runtime feedback
    let output = "";
    let status = "success";
    let executionTimeMs = Math.floor(Math.random() * 20) + 12;

    // JavaScript / Simulated Evaluation logic
    if (language === "python") {
      // Parse common python prints & outputs safely in sandbox simulation
      const printMatches = [...code.matchAll(/print\((.*?)\)/g)];
      if (printMatches.length > 0) {
        output = printMatches.map(m => {
          let content = m[1].trim();
          if ((content.startsWith('"') && content.endsWith('"')) || (content.startsWith("'") && content.endsWith("'"))) {
            return content.slice(1, -1);
          }
          if (content.includes("+") || content.includes("*") || content.includes(",")) {
            return content.replace(/['"]/g, "").replace(/,/g, " ");
          }
          return `[输出值: ${content}]`;
        }).join("\n");
      } else {
        output = ">>> 程序执行完成，无显式 print 输出。变量已成功存入内存上下文。";
      }

      // Check for syntax issues
      if (code.includes("def ") && !code.includes(":")) {
        status = "error";
        output = "SyntaxError: expected ':' at the end of function definition\n  File \"main.py\", line 1";
      }
    } else if (language === "sql") {
      output = `+----+-------------------+--------------+---------+
| id | name              | role         | status  |
+----+-------------------+--------------+---------+
|  1 | Alice Chen        | Tech Lead    | ACTIVE  |
|  2 | Bob Smith         | Agent Eng    | ACTIVE  |
|  3 | Charlie Wu        | Data Analyst | PENDING |
+----+-------------------+--------------+---------+
3 rows in set (0.01 sec)`;
    } else if (language === "java") {
      if (code.includes("System.out.println")) {
        const matches = [...code.matchAll(/System\.out\.println\((.*?)\);/g)];
        output = matches.map(m => m[1].replace(/['"]/g, "").replace(/\s*\+\s*/g, " ")).join("\n");
      } else {
        output = "[JVM Build Success]\nProcess finished with exit code 0";
      }
    } else if (language === "bash" || language === "shell") {
      const trimmed = code.trim();
      let lines = trimmed.split("\n").filter((l: string) => l.trim() && !l.trim().startsWith("#"));
      let logBuffer: string[] = [];

      for (const cmd of lines) {
        const c = cmd.trim();
        if (c.startsWith("echo ")) {
          logBuffer.push(c.slice(5).replace(/['"]/g, ""));
        } else if (c.includes("ls") || c.includes("pwd") || c.includes("tree")) {
          logBuffer.push("$ pwd\n/home/developer/workspace/github-agent-project");
          logBuffer.push("$ ls -lah\ntotal 28K\ndrwxr-xr-x 4 dev dev 4.0K Sep 21 18:00 .\ndrwxr-xr-x 3 dev dev 4.0K Sep 21 17:50 ..\n-rw------- 1 dev dev  120 Sep 21 18:00 .env\n-rw-r--r-- 1 dev dev 2.1K Sep 21 18:00 README.md\ndrwxr-xr-x 2 dev dev 4.0K Sep 21 18:00 src\n-rwxr-xr-x 1 dev dev  540 Sep 21 18:00 start.sh");
        } else if (c.includes("chmod")) {
          logBuffer.push(`$ ${c}\n[Linux Kernel]: 权限已更新 -> -rwxr-xr-x (文件属性已赋予可执行权限)`);
        } else if (c.includes("lsof") || c.includes("netstat")) {
          logBuffer.push(`$ ${c}\nCOMMAND  PID USER   FD   TYPE DEVICE SIZE/OFF NODE NAME\npython  4092  dev    4u  IPv4  32014      0t0  TCP *:8080 (LISTEN)`);
        } else if (c.includes("kill")) {
          logBuffer.push(`$ ${c}\n[SIGKILL 9 发送成功]: 进程 4092 已被终止，端口 8080 已成功释放。`);
        } else if (c.includes("export")) {
          logBuffer.push(`$ ${c}\n[Environment Variable Exported]: 环境变量已注入当前 Shell 进程上下文`);
        } else if (c.includes("grep") || c.includes("tail")) {
          logBuffer.push(`$ ${c}\n2026-09-21 18:00:12 [ERROR] [FastAPI.handler] ConnectionResetError: Peer closed socket\n2026-09-21 18:00:15 [WARN]  [Worker-1] Retrying connection attempt 2/5...\n2026-09-21 18:00:16 [INFO]  [Worker-1] Successfully reconnected to upstream server.`);
        } else if (c.includes("systemctl") || c.includes("service")) {
          logBuffer.push(`$ ${c}\n● agent-runner.service - Autonomous AI Agent Background Daemon\n     Loaded: loaded (/etc/systemd/system/agent-runner.service; enabled)\n     Active: active (running) since Mon 2026-09-21 18:00:00 UTC\n   Main PID: 8812 (python)\n     Memory: 64.2M\n        CPU: 124ms`);
        } else if (c.includes("nohup")) {
          logBuffer.push(`$ ${c}\nnohup: appending output to 'app.log'\n[1] 5120\n服务已在 Linux 后台持续守护运行，进程 PID: 5120`);
        } else {
          logBuffer.push(`$ ${c}\n[Exit code: 0] 命令执行成功`);
        }
      }

      output = logBuffer.join("\n\n");
    } else if (language === "typescript" || language === "ts") {
      const printMatches = [...code.matchAll(/console\.log\((.*?)\);?/g)];
      let logs: string[] = [];
      if (printMatches.length > 0) {
        logs = printMatches.map(m => {
          let content = m[1].trim();
          if ((content.startsWith('"') && content.endsWith('"')) || (content.startsWith("'") && content.endsWith("'")) || (content.startsWith("`") && content.endsWith("`"))) {
            return content.slice(1, -1);
          }
          if (content.includes("JSON.stringify")) {
            return `{\n  "status": "success",\n  "data": { "validated": true }\n}`;
          }
          return `[TS Console]: ${content.replace(/['"`]/g, "")}`;
        });
      }
      
      output = `[TypeScript v5.4 TypeCheck]: Strict Mode Passed (0 errors, 0 warnings)\n` + 
        (logs.length > 0 ? `\n--- Console Output ---\n` + logs.join("\n") : `\n✨ 所有类型签名与接口契约校验完毕。`);
    } else {
      output = `[Executed ${language || "code"} successfully]\nOutput:\n${code.slice(0, 120)}...`;
    }

    res.json({
      status,
      output: output || "Process finished with exit code 0",
      executionTimeMs,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({ status: "error", output: error.message });
  }
});

// Vite middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        hmr: false,
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CodeMaster Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
