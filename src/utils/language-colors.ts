// Colors sourced from github-linguist (github.com/github-linguist/linguist)
const map: Record<string, string> = {
  TypeScript:  "#3178c6",
  JavaScript:  "#f1e05a",
  Python:      "#3572a5",
  Rust:        "#dea584",
  Go:          "#00add8",
  Java:        "#b07219",
  "C++":       "#f34b7d",
  C:           "#555555",
  "C#":        "#178600",
  HTML:        "#e34c26",
  CSS:         "#563d7c",
  SCSS:        "#c6538c",
  Shell:       "#89e051",
  Vue:         "#41b883",
  Svelte:      "#ff3e00",
  Ruby:        "#701516",
  PHP:         "#4f5d95",
  Kotlin:      "#a97bff",
  Swift:       "#f05138",
  Dart:        "#00b4ab",
};

export function getLanguageColor(lang: string | null): string {
  if (!lang) return "#6b7280";
  return map[lang] ?? "#6b7280";
}
