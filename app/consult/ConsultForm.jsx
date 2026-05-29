"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PageShell from "../components/PageShell";
import { GRADES, ISSUE_TYPES, RESULT_KEY, TONES } from "../lib/constants";

export default function ConsultForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialType = useMemo(() => {
    const value = searchParams.get("type");
    return ISSUE_TYPES.includes(value) ? value : ISSUE_TYPES[0];
  }, [searchParams]);

  const [form, setForm] = useState({
    grade: GRADES[0],
    issueType: initialType,
    description: "",
    tone: TONES[0]
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!form.description.trim()) {
      setError("请先写一点具体情况。");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "生成失败，请稍后再试。");
      }

      sessionStorage.setItem(
        RESULT_KEY,
        JSON.stringify({
          ...payload,
          input: form,
          createdAt: new Date().toISOString()
        })
      );
      router.push("/result");
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <PageShell active="/consult">
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft sm:p-7">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-950">开始咨询</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            填写孩子当前情况，生成可直接使用的沟通方案。
          </p>
        </div>

        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-slate-800">
              孩子年级
            </span>
            <select
              value={form.grade}
              onChange={(event) => updateField("grade", event.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 outline-none transition focus:border-[#2b8a78] focus:ring-2 focus:ring-[#2b8a78]/20"
            >
              {GRADES.map((grade) => (
                <option key={grade}>{grade}</option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-slate-800">
              问题类型
            </span>
            <select
              value={form.issueType}
              onChange={(event) => updateField("issueType", event.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 outline-none transition focus:border-[#2b8a78] focus:ring-2 focus:ring-[#2b8a78]/20"
            >
              {ISSUE_TYPES.map((issue) => (
                <option key={issue}>{issue}</option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-slate-800">
              问题描述
            </span>
            <textarea
              rows={7}
              value={form.description}
              onChange={(event) => updateField("description", event.target.value)}
              placeholder="例如：最近两次数学都没考好，一回家就刷短视频，说两句就顶嘴。"
              className="min-h-40 rounded-lg border border-slate-300 bg-white px-4 py-3 text-base leading-7 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#2b8a78] focus:ring-2 focus:ring-[#2b8a78]/20"
            />
          </label>

          <fieldset className="flex flex-col gap-2">
            <legend className="text-sm font-semibold text-slate-800">
              希望语气
            </legend>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {TONES.map((tone) => (
                <label
                  key={tone}
                  className={`cursor-pointer rounded-lg border px-4 py-3 text-center text-sm font-medium transition ${
                    form.tone === tone
                      ? "border-[#cf5d3f] bg-[#fff1ea] text-[#923a25]"
                      : "border-slate-200 bg-white text-slate-700"
                  }`}
                >
                  <input
                    type="radio"
                    name="tone"
                    value={tone}
                    checked={form.tone === tone}
                    onChange={(event) => updateField("tone", event.target.value)}
                    className="sr-only"
                  />
                  {tone}
                </label>
              ))}
            </div>
          </fieldset>

          {error ? (
            <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-slate-950 px-5 py-4 text-base font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {isSubmitting ? "正在生成..." : "生成沟通方案"}
          </button>
        </form>
      </section>
    </PageShell>
  );
}
