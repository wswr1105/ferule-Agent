"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import PageShell from "../components/PageShell";
import { HISTORY_KEY, RESULT_KEY } from "../lib/constants";

export default function HistoryView() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    setHistory(JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]"));
  }, []);

  function openRecord(record) {
    sessionStorage.setItem(RESULT_KEY, JSON.stringify(record));
  }

  function clearHistory() {
    localStorage.removeItem(HISTORY_KEY);
    setHistory([]);
  }

  return (
    <PageShell active="/history">
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft sm:p-7">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-950">历史记录</h1>
            <p className="mt-2 text-sm text-slate-600">
              本机保存，最多显示最近 50 条。
            </p>
          </div>
          {history.length ? (
            <button
              type="button"
              onClick={clearHistory}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
            >
              清空
            </button>
          ) : null}
        </div>

        {history.length ? (
          <div className="flex flex-col gap-3">
            {history.map((record) => (
              <Link
                key={record.id}
                href="/result"
                onClick={() => openRecord(record)}
                className="rounded-lg border border-slate-200 bg-[#fbfaf6] p-4 transition hover:border-[#2b8a78] hover:bg-white"
              >
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-semibold text-slate-950">
                    {record.input?.issueType || "沟通咨询"}
                  </p>
                  <p className="text-sm text-slate-600">
                    {record.input?.grade} · {record.input?.tone} ·{" "}
                    {formatTime(record.savedAt || record.createdAt)}
                  </p>
                  <p className="line-clamp-2 text-sm leading-6 text-slate-700">
                    {record.result?.problemJudgment}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center">
            <p className="text-slate-600">暂无历史咨询记录</p>
            <Link
              href="/consult"
              className="mt-5 inline-flex rounded-lg bg-slate-950 px-5 py-3 font-semibold text-white"
            >
              开始咨询
            </Link>
          </div>
        )}
      </section>
    </PageShell>
  );
}

function formatTime(value) {
  if (!value) {
    return "";
  }
  return new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}
