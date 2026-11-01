/** Shared class strings for the v3 site chrome. */

const btnBase =
  "inline-flex items-center justify-center gap-2 rounded-[10px] py-3.5 font-body text-[15px] transition-colors duration-200 cursor-pointer";

export const btnPrimary = `${btnBase} px-[22px] bg-accent text-white font-semibold hover:bg-accent-dark`;

export const btnGhost = `${btnBase} px-3 sm:px-[22px] border border-border text-text font-medium hover:border-accent-text/60`;

export const monoLink = "font-mono text-[13px] text-muted hover:text-text transition-colors duration-200";

export const accentLink = "font-mono text-[13px] text-accent-text hover:text-text transition-colors duration-200";

/** Outer width and gutters shared by the nav, home sections and footer */
export const container = "max-w-[1200px] mx-auto px-4 sm:px-10";
