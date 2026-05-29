"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import PageShell from "../components/PageShell";
import { HISTORY_KEY, RESULT_KEY } from "../lib/constants";

function asList(value) {
  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }
  if (!value) {
    return [];
  }
  return String(value)
    .split(/\n+/)
    .map((item) => item.replace(/^[-\d.\s、]+/, "").trim())
    .filter(Boolean);
}

function buildCopyText(record) {
  const result = record.result || {};
  const lines = [
    "问题判断",
    result.problemJudgment || "",
    "",
    "家长容易犯的错误",
    ...asList(result.parentMistakes).map((item) => `- ${item}`),
    "",
    "推荐沟通话术",
    `温和版：${result.scripts?.gentle || ""}`,
    `坚定版：${result.scripts?.firm || ""}`,
    `简短版：${result.scripts?.short || ""}`,
    "",
    "7天行动建议",
    ...asList(result.sevenDayPlan).map((item, index) => `${index + 1}. ${item}`),
    "",
    "复盘提醒",
    result.reviewReminder || ""
  ];
  return lines.join("\n");
}

export default function ResultView() {
  const [record, setRecord] = useState(null);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem(RESULT_KEY);
    if (stored) {
      setRecord(JSON.parse(stored));
    }
  }, []);

  const copyText = useMemo(() => (record ? buildCopyText(record) : ""), [record]);

  async function copyResult() {
    if (!copyText) {
      return;
    }
    await navigator.clipboard.writeText(copyText);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  function saveHistory() {
    if (!record) {
      return;
    }

    const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
    const entry = {
      id: record.id || `${Date.now()}`,
      ...record,
      savedAt: new Date().toISOString()
    };
    const nextHistory = [
      entry,
      ...history.filter((item) => item.id !== entry.id)
    ].slice(0, 50);

    localStorage.setItem(HISTORY_KEY, JSON.stringify(nextHistory));
    setSaved(true);
  }

  if (!record) {
    return (
      <PageShell active="/result">
        <section className="rounded-lg border border-slate-200 bg-white p-6 text-center shadow-soft">
          <h1 className="text-xl font-bold text-slate-950">还没有生成结果</h1>
          <Link
            href="/consult"
            className="mt-5 inline-flex rounded-lg bg-slate-950 px-5 py-3 font-semibold text-white"
          >
            重新咨询
          </Link>
        </section>
      </PageShell>
    );
  }

  const result = record.result || {};

  return (
    <PageShell active="/result">
      <section className="flex flex-col gap-4">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft sm:p-7">
          <div className="flex flex-col gap-3">
            <p className="text-sm font-medium text-[#17614d]">
              {record.input?.grade} · {record.input?.issueType} · {record.input?.tone}
            </p>
            <h1 className="text-2xl font-bold text-slate-950">沟通方案</h1>
          </div>

          {record.riskAlert ? (
            <div className="mt-5 rounded-lg border border-red-300 bg-red-50 px-4 py-4 text-sm leading-6 text-red-800">
              <strong className="block text-base">风险提示</strong>
              输入内容包含高风险关键词。请优先联系学校老师、心理健康专业人士或当地紧急求助渠道；如果孩子正在面临即时危险，请立即寻求线下帮助。
            </div>
          ) : null}
        </div>

        <ResultSection title="问题判断">
          <p className="leading-8 text-slate-700">{result.problemJudgment}</p>
        </ResultSection>

        <ResultSection title="家长容易犯的错误">
          <ul className="flex flex-col gap-3">
            {asList(result.parentMistakes).map((item) => (
              <li key={item} className="leading-7 text-slate-700">
                {item}
              </li>
            ))}
          </ul>
        </ResultSection>

        <ResultSection title="推荐沟通话术">
          <div className="flex flex-col gap-3">
            <ScriptBlock label="温和版" value={result.scripts?.gentle} />
            <ScriptBlock label="坚定版" value={result.scripts?.firm} />
            <ScriptBlock label="简短版" value={result.scripts?.short} />
          </div>
        </ResultSection>

        <ResultSection title="7天行动建议">
          <ol className="flex list-decimal flex-col gap-3 pl-5">
            {asList(result.sevenDayPlan).map((item) => (
              <li key={item} className="leading-7 text-slate-700">
                {item}
              </li>
            ))}
          </ol>
        </ResultSection>

        <ResultSection title="复盘提醒">
          <p className="leading-8 text-slate-700">{result.reviewReminder}</p>
        </ResultSection>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <button
            type="button"
            onClick={copyResult}
            className="rounded-lg border border-slate-300 bg-white px-4 py-3 font-semibold text-slate-900 transition hover:bg-slate-50"
          >
            {copied ? "已复制" : "复制结果"}
          </button>
          <button
            type="button"
            onClick={saveHistory}
            className="rounded-lg bg-[#2b8a78] px-4 py-3 font-semibold text-white transition hover:bg-[#237363]"
          >
            {saved ? "已保存" : "保存到历史"}
          </button>
          <Link
            href="/consult"
            className="rounded-lg bg-slate-950 px-4 py-3 text-center font-semibold text-white transition hover:bg-slate-800"
          >
            重新咨询
          </Link>
        </div>
      </section>
    </PageShell>
  );
}

function ResultSection({ title, children }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="mb-4 text-lg font-bold text-slate-950">{title}</h2>
      {children}
    </section>
  );
}

function ScriptBlock({ label, value }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-[#fbfaf6] p-4">
      <p className="mb-2 text-sm font-semibold text-[#923a25]">{label}</p>
      <p className="leading-8 text-slate-800">{value}</p>
    </div>
  );
}
