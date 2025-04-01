export type ColorRule = {
  key: string;
  min: number;
  max: number;
  belowClass: string;
  aboveClass: string;
  inClass: string;
};

export let visibleColumns: Record<string, boolean> = {
  page: false,
  itemRank: true,
  instruction: false,
  duration_mean: true,
  duration_sd: true,
  testCode: false,
  diplome: true,
  nCandidates: true,
  correct_pct: true,
  incorrect_pct: true,
  empty_pct: true,
  not_seen_pct: false,
  answered_pct: true,
  difficulty: false,
  discr_comp: true,
  discr_test: true,
  d_index_comp: true,
  d_index_test: true
};

export const colorRules: Record<string, ColorRule> = {
  correct_pct: { key: "correct_pct", min: 25, max: 80, belowClass: "red", aboveClass: "orange", inClass: "green" },
  discr_comp: { key: "discr_comp", min: 0.1, max: 0.2, belowClass: "red", aboveClass: "green", inClass: "orange" },
};