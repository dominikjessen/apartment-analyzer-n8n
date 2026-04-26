export type AnalyzeState =
  | { status: "idle" }
  | { status: "success"; data: unknown }
  | { status: "error"; message: string };

export const initialAnalyzeState: AnalyzeState = { status: "idle" };
