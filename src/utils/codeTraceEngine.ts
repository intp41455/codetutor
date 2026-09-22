export interface VariableState {
  name: string;
  value: string;
  type: "string" | "number" | "boolean" | "list" | "dict" | "other";
  changed?: boolean;
}

export interface TraceStep {
  stepNumber: number;
  lineNumber: number;
  rawCode: string;
  explanation: string;
  variables: Record<string, VariableState>;
  stdoutPiece?: string;
  logicType: "assignment" | "io" | "branch" | "loop" | "arithmetic" | "declaration" | "call";
}

/**
 * Parses Python / JS basic scripts into detailed, step-by-step execution traces.
 * Tracks line numbers, variable allocations, arithmetic updates, conditional branches, and stdout output.
 */
export function generateCodeExecutionTrace(code: string, language: string = "python"): TraceStep[] {
  const lines = code.split("\n");
  const steps: TraceStep[] = [];
  const memory: Record<string, VariableState> = {};
  let stepCounter = 1;

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    // Skip empty lines or pure comments in execution tracking
    if (!trimmed || trimmed.startsWith("#") || trimmed.startsWith("//")) {
      continue;
    }

    const lineNumber = i + 1;

    // 1. Check for print(...) or console.log(...)
    const printMatch = trimmed.match(/^print\((.*)\)$/) || trimmed.match(/^console\.log\((.*)\);?$/);
    if (printMatch) {
      const inner = printMatch[1].trim();
      let printedVal = "";

      // Check if it's a string literal
      if ((inner.startsWith('"') && inner.endsWith('"')) || (inner.startsWith("'") && inner.endsWith("'"))) {
        printedVal = inner.slice(1, -1);
      } else if (memory[inner]) {
        printedVal = memory[inner].value;
      } else {
        // Multi-arg or expression
        const parts = inner.split(",").map((p) => p.trim());
        printedVal = parts
          .map((part) => {
            if ((part.startsWith('"') && part.endsWith('"')) || (part.startsWith("'") && part.endsWith("'"))) {
              return part.slice(1, -1);
            }
            if (memory[part]) {
              return memory[part].value;
            }
            return part;
          })
          .join(" ");
      }

      steps.push({
        stepNumber: stepCounter++,
        lineNumber,
        rawCode: trimmed,
        explanation: `调用 I/O 输出系统：从内存读取数据并转换为字符，向控制台屏幕输出 "${printedVal}"。`,
        variables: JSON.parse(JSON.stringify(memory)),
        stdoutPiece: printedVal,
        logicType: "io",
      });
      continue;
    }

    // 2. Check for if/elif condition
    if (trimmed.startsWith("if ") || trimmed.startsWith("elif ") || trimmed.startsWith("else:")) {
      let condText = trimmed;
      let branchExplanation = "";

      if (trimmed.startsWith("if ") || trimmed.startsWith("elif ")) {
        const condition = trimmed.replace(/^(if|elif)\s+/, "").replace(/:$/, "").trim();
        branchExplanation = `逻辑分流判断：CPU 比较表达式「${condition}」，评估分支路径是否成立。`;
      } else {
        branchExplanation = `兜底分支：前面的条件均不满足，执行 else 备用逻辑。`;
      }

      steps.push({
        stepNumber: stepCounter++,
        lineNumber,
        rawCode: trimmed,
        explanation: branchExplanation,
        variables: JSON.parse(JSON.stringify(memory)),
        logicType: "branch",
      });
      continue;
    }

    // 3. Check for for/while loop header
    if (trimmed.startsWith("for ") || trimmed.startsWith("while ")) {
      steps.push({
        stepNumber: stepCounter++,
        lineNumber,
        rawCode: trimmed,
        explanation: `循环流水线：CPU 检查循环计数器，准备启动迭代。`,
        variables: JSON.parse(JSON.stringify(memory)),
        logicType: "loop",
      });
      continue;
    }

    // 4. Check for variable assignment: e.g., var_name = value
    const assignMatch = trimmed.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\s*(=|\+=|-=|\*=)\s*(.+)$/);
    if (assignMatch) {
      const varName = assignMatch[1];
      const operator = assignMatch[2];
      const expr = assignMatch[3].trim();

      let valStr = expr;
      let varType: VariableState["type"] = "string";

      // String literal
      if ((expr.startsWith('"') && expr.endsWith('"')) || (expr.startsWith("'") && expr.endsWith("'"))) {
        valStr = expr.slice(1, -1);
        varType = "string";
      }
      // Simple number
      else if (!isNaN(Number(expr))) {
        valStr = expr;
        varType = "number";
      }
      // Array / List
      else if (expr.startsWith("[") && expr.endsWith("]")) {
        valStr = expr;
        varType = "list";
      }
      // Arithmetic with existing variable: e.g. money + 20, score + 10
      else if (operator === "+=" || expr.includes("+") || expr.includes("-")) {
        varType = "number";
        let existingNum = memory[varName] ? parseInt(memory[varName].value, 10) : 0;
        if (operator === "+=") {
          const delta = parseInt(expr, 10) || 0;
          valStr = (existingNum + delta).toString();
        } else if (expr.includes("+")) {
          const tokens = expr.split("+").map((t) => t.trim());
          let sum = 0;
          tokens.forEach((tok) => {
            if (memory[tok]) {
              sum += parseInt(memory[tok].value, 10) || 0;
            } else {
              sum += parseInt(tok, 10) || 0;
            }
          });
          valStr = sum.toString();
        } else {
          valStr = expr;
        }
      } else if (memory[expr]) {
        // Alias from another variable: b = a
        valStr = memory[expr].value;
        varType = memory[expr].type;
      }

      // Mark changed
      Object.keys(memory).forEach((k) => (memory[k].changed = false));

      const isNew = !memory[varName];
      memory[varName] = {
        name: varName,
        value: valStr,
        type: varType,
        changed: true,
      };

      const explanation = isNew
        ? `内存分配与初始化：在 RAM 中开辟命名空间「${varName}」，装入初始值 ${varType === "string" ? `"${valStr}"` : valStr}。`
        : `变量更新（重新赋值）：CPU 计算表达式，将新值 ${varType === "string" ? `"${valStr}"` : valStr} 覆盖写回「${varName}」的内存槽。`;

      steps.push({
        stepNumber: stepCounter++,
        lineNumber,
        rawCode: trimmed,
        explanation,
        variables: JSON.parse(JSON.stringify(memory)),
        logicType: isNew ? "declaration" : "assignment",
      });
      continue;
    }

    // 5. Default generic step
    steps.push({
      stepNumber: stepCounter++,
      lineNumber,
      rawCode: trimmed,
      explanation: `指令执行：CPU 解析并运算语句。`,
      variables: JSON.parse(JSON.stringify(memory)),
      logicType: "arithmetic",
    });
  }

  // Fallback: If code had no executable lines parsed
  if (steps.length === 0) {
    steps.push({
      stepNumber: 1,
      lineNumber: 1,
      rawCode: code.split("\n")[0] || "# 空指令",
      explanation: "程序等待输入，当前未检测到执行指令。",
      variables: {},
      logicType: "declaration",
    });
  }

  return steps;
}
