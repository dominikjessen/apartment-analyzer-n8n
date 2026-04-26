"use client";

import { useActionState, useId, type ReactNode } from "react";
import { analyzeListing } from "./actions/analyze";
import {
  initialAnalyzeState,
  type AnalyzeState,
} from "./actions/analyze-state";

function formatResultData(data: unknown): string {
  if (data === null || data === undefined) {
    return String(data);
  }
  if (typeof data === "string") {
    return data;
  }
  if (typeof data === "object") {
    return JSON.stringify(data, null, 2);
  }
  return String(data);
}

function getAnalysisText(data: unknown): string | undefined {
  if (typeof data !== "object" || data === null) {
    return undefined;
  }
  if (!("analysis" in data)) {
    return undefined;
  }
  const value = (data as { analysis: unknown }).analysis;
  return typeof value === "string" ? value : undefined;
}

function AnalysisPanel(props: { state: AnalyzeState }): ReactNode {
  const { state } = props;

  if (state.status === "idle") {
    return <p className="text-sm text-zinc-500">No run yet.</p>;
  }

  if (state.status === "error") {
    return (
      <p className="whitespace-pre-wrap text-sm text-red-600 dark:text-red-400">
        {state.message}
      </p>
    );
  }

  const analysisText = getAnalysisText(state.data);
  if (analysisText !== undefined) {
    return (
      <div className="max-h-[50vh] overflow-auto rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-left font-sans text-sm leading-relaxed whitespace-pre-wrap text-zinc-800 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200">
        {analysisText}
      </div>
    );
  }

  return (
    <pre className="max-h-[50vh] overflow-auto rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-left font-mono text-sm leading-relaxed text-zinc-800 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200">
      {formatResultData(state.data)}
    </pre>
  );
}

export function ApartmentForm(): ReactNode {
  const [state, formAction, isPending] = useActionState(
    analyzeListing,
    initialAnalyzeState,
  );
  const contentFieldId = useId();

  return (
    <div className="flex min-h-0 w-full max-w-2xl flex-1 flex-col">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          Apartment analyzer
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Copy the listing description in your browser and paste it here.
        </p>
      </header>

      <div className="min-h-8 flex-1" aria-hidden="true" />

      <form action={formAction} className="flex flex-col gap-3">
        <label
          htmlFor={contentFieldId}
          className="text-sm font-medium text-zinc-800 dark:text-zinc-200"
        >
          Listing
        </label>
        <textarea
          id={contentFieldId}
          name="content"
          rows={10}
          placeholder="Paste the full listing: address, price, description…"
          className="min-h-32 w-full resize-y rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm leading-relaxed text-zinc-900 placeholder:text-zinc-400 focus:outline-2 focus:outline-offset-2 focus:outline-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:outline-zinc-300"
        />
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isPending}
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-50 transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {isPending ? "Analyzing…" : "Analyze"}
          </button>
        </div>
      </form>

      <section className="mt-8 flex flex-col gap-2">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
          Analysis
        </h2>
        <AnalysisPanel state={state} />
      </section>
    </div>
  );
}
