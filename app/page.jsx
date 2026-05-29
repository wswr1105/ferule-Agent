import Link from "next/link";
import PageShell from "./components/PageShell";
import { ISSUE_TYPES } from "./lib/constants";

export default function HomePage() {
  return (
    <PageShell active="/">
      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-soft">
        <div className="flex min-h-[420px] flex-col justify-between gap-10 px-5 py-8 sm:px-8 sm:py-10">
          <div className="flex flex-col gap-5">
            <p className="w-fit rounded-md bg-[#e6f4ef] px-3 py-1 text-sm font-medium text-[#17614d]">
              初中家庭沟通 MVP
            </p>
            <div className="flex flex-col gap-3">
              <h1 className="text-4xl font-bold leading-tight text-slate-950 sm:text-5xl">
                家长沟通教练
              </h1>
              <p className="max-w-xl text-lg leading-8 text-slate-600">
                帮你把想说的话，说得孩子愿意听
              </p>
            </div>
            <Link
              href="/consult"
              className="w-full rounded-lg bg-[#cf5d3f] px-5 py-4 text-center text-base font-semibold text-white shadow-sm transition hover:bg-[#b94f35] sm:w-fit"
            >
              开始咨询
            </Link>
          </div>

          <div>
            <h2 className="mb-3 text-base font-semibold text-slate-900">
              高频问题
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {ISSUE_TYPES.map((issue) => (
                <Link
                  key={issue}
                  href={`/consult?type=${encodeURIComponent(issue)}`}
                  className="rounded-lg border border-slate-200 bg-[#fbfaf6] px-4 py-4 text-sm font-medium text-slate-800 transition hover:border-[#cf5d3f] hover:bg-white"
                >
                  {issue}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
