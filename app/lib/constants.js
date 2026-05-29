export const ISSUE_TYPES = [
  "孩子沉迷手机",
  "成绩下降",
  "不写作业",
  "顶嘴叛逆",
  "考前焦虑",
  "不愿沟通"
];

export const GRADES = ["初一", "初二", "初三"];

export const TONES = ["温和", "坚定", "鼓励", "严肃"];

export const HISTORY_KEY = "parent-communication-agent-history";

export const RESULT_KEY = "parent-communication-agent-current-result";

export const RISK_KEYWORDS = [
  "自杀",
  "自残",
  "想死",
  "家暴",
  "虐待",
  "打死",
  "离家出走",
  "精神崩溃"
];

export function hasRiskKeyword(text) {
  return RISK_KEYWORDS.some((keyword) => text.includes(keyword));
}
