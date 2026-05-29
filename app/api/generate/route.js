import { RISK_KEYWORDS, hasRiskKeyword } from "../../lib/constants";

const SYSTEM_PROMPT = `你是一位有15年以上一线初中班主任经验的家长沟通教练。你的任务不是批评家长，也不是讨好孩子，而是帮助家长用更有效、更具体、更能落地的方式与孩子沟通。
回答必须：
1. 语言温和、清晰、接地气。
2. 不使用空泛建议。
3. 每次都给出具体话术。
4. 不制造焦虑。
5. 不替代心理医生、医生或法律专业人士。
6. 遇到自伤、自杀、严重暴力、虐待等高风险情况，建议立即联系学校、专业人士或当地紧急求助渠道。
7. 输出必须包含：问题判断、家长误区、推荐话术、7天行动建议、复盘提醒。`;

const JSON_INSTRUCTIONS = `请只输出 JSON，不要输出 Markdown。JSON 结构必须为：
{
  "problemJudgment": "一段具体的问题判断",
  "parentMistakes": ["家长容易犯的错误1", "家长容易犯的错误2", "家长容易犯的错误3"],
  "scripts": {
    "gentle": "温和版话术",
    "firm": "坚定版话术",
    "short": "简短版话术"
  },
  "sevenDayPlan": ["第1天建议", "第2天建议", "第3天建议", "第4天建议", "第5天建议", "第6天建议", "第7天建议"],
  "reviewReminder": "复盘提醒"
}`;

export async function POST(request) {
  try {
    const body = await request.json();
    const grade = String(body.grade || "").trim();
    const issueType = String(body.issueType || "").trim();
    const description = String(body.description || "").trim();
    const tone = String(body.tone || "").trim();

    if (!grade || !issueType || !description || !tone) {
      return Response.json({ error: "请补全咨询信息。" }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return Response.json(
        { error: "服务端未配置 OPENAI_API_KEY。" },
        { status: 500 }
      );
    }

    const combinedInput = `${grade}\n${issueType}\n${description}\n${tone}`;
    const riskAlert = hasRiskKeyword(combinedInput);

    const completion = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        temperature: 0.55,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: `孩子年级：${grade}
问题类型：${issueType}
问题描述：${description}
希望语气：${tone}

风险关键词列表：${RISK_KEYWORDS.join("、")}
是否命中风险关键词：${riskAlert ? "是" : "否"}

${riskAlert ? "请在方案里明确建议家长优先联系学校、专业人士或当地紧急求助渠道，但不要制造恐慌。" : ""}
${JSON_INSTRUCTIONS}`
          }
        ]
      })
    });

    const data = await completion.json();

    if (!completion.ok) {
      return Response.json(
        { error: data.error?.message || "OpenAI API 调用失败。" },
        { status: completion.status }
      );
    }

    const content = data.choices?.[0]?.message?.content;
    const parsed = JSON.parse(content || "{}");

    return Response.json({
      id: crypto.randomUUID(),
      riskAlert,
      result: normalizeResult(parsed)
    });
  } catch (error) {
    return Response.json(
      { error: error.message || "生成失败，请稍后再试。" },
      { status: 500 }
    );
  }
}

function normalizeResult(result) {
  return {
    problemJudgment: asText(result.problemJudgment),
    parentMistakes: asArray(result.parentMistakes).slice(0, 5),
    scripts: {
      gentle: asText(result.scripts?.gentle),
      firm: asText(result.scripts?.firm),
      short: asText(result.scripts?.short)
    },
    sevenDayPlan: normalizeSevenDayPlan(result.sevenDayPlan),
    reviewReminder: asText(result.reviewReminder)
  };
}

function normalizeSevenDayPlan(value) {
  const items = asArray(value);
  return Array.from({ length: 7 }, (_, index) => {
    return items[index] || `第${index + 1}天：观察变化并记录一次亲子沟通反馈。`;
  });
}

function asArray(value) {
  if (Array.isArray(value)) {
    return value.map(asText).filter(Boolean);
  }
  if (!value) {
    return [];
  }
  return String(value)
    .split(/\n+/)
    .map((item) => item.replace(/^[-\d.\s、]+/, "").trim())
    .filter(Boolean);
}

function asText(value) {
  return value ? String(value).trim() : "";
}
