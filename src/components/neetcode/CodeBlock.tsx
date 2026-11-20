import type { CSSProperties, ReactNode } from "react";

type Language = "python" | "java";
type TokenType = "comment" | "string" | "number" | "keyword" | "constant" | "builtin" | "definition";

const TOKEN_STYLE: Record<TokenType, CSSProperties> = {
  comment: { color: "#8b8ba7", fontStyle: "italic" },
  string: { color: "#86efac" },
  number: { color: "#fdba74" },
  keyword: { color: "#a5b4fc" },
  constant: { color: "#fdba74" },
  builtin: { color: "#67e8f9" },
  definition: { color: "#fde68a" },
};

interface LanguageSpec {
  /** Alternation of: 1 comment, 2 string, 3 number, 4 identifier. */
  pattern: RegExp;
  keywords: Set<string>;
  constants: Set<string>;
  builtins: Set<string>;
  /** Keywords whose following identifier is a definition name. */
  definers: Set<string>;
}

const words = (s: string) => new Set(s.split(" "));

const NUMBER = String.raw`\b\d+(?:\.\d+)?\b`;
const IDENT = String.raw`[A-Za-z_]\w*`;

const LANGS: Record<Language, LanguageSpec> = {
  python: {
    pattern: new RegExp(
      [
        String.raw`(#[^\n]*)`,
        String.raw`("""[\s\S]*?"""|'''[\s\S]*?'''|"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*')`,
        `(${NUMBER})`,
        `(${IDENT})`,
      ].join("|"),
      "g",
    ),
    keywords: words(
      "def class return if elif else for while in not and or is import from as with try except finally raise pass break continue lambda yield global nonlocal assert del",
    ),
    constants: words("True False None"),
    builtins: words(
      "set dict list tuple int str bool float len ord range enumerate zip sorted min max sum abs map filter any all print self collections defaultdict Counter deque heapq",
    ),
    definers: words("def class"),
  },
  java: {
    pattern: new RegExp(
      [
        String.raw`(\/\/[^\n]*|\/\*[\s\S]*?\*\/)`,
        String.raw`("(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*')`,
        `(${NUMBER})`,
        `(${IDENT})`,
      ].join("|"),
      "g",
    ),
    keywords: words(
      "public private protected static final class interface new return if else for while do switch case break continue try catch finally throw throws import package extends implements void this super instanceof",
    ),
    constants: words("true false null"),
    builtins: words(
      "int long boolean char double float byte short String Integer Boolean Character HashSet HashMap Map Set List ArrayList Arrays Math",
    ),
    definers: words("class"),
  },
};

/** Single-pass regex tokenizer. Unmatched text (whitespace, punctuation) is kept verbatim. */
function highlight(code: string, language: Language): ReactNode[] {
  const spec = LANGS[language];
  const re = new RegExp(spec.pattern.source, "g");
  const out: ReactNode[] = [];
  let last = 0;
  let afterDefiner = false;
  let m: RegExpExecArray | null;

  const push = (text: string, type?: TokenType) => {
    out.push(
      type ? (
        <span key={out.length} style={TOKEN_STYLE[type]}>
          {text}
        </span>
      ) : (
        text
      ),
    );
  };

  while ((m = re.exec(code)) !== null) {
    const gap = code.slice(last, m.index);
    if (gap) {
      push(gap);
      // Only whitespace may sit between `def`/`class` and the name.
      if (/\S/.test(gap)) afterDefiner = false;
    }

    let type: TokenType | undefined;
    const [text, comment, str, num, ident] = m;
    if (comment !== undefined) type = "comment";
    else if (str !== undefined) type = "string";
    else if (num !== undefined) type = "number";
    else if (ident !== undefined) {
      if (afterDefiner) type = "definition";
      else if (spec.keywords.has(ident)) type = "keyword";
      else if (spec.constants.has(ident)) type = "constant";
      else if (spec.builtins.has(ident)) type = "builtin";
    }

    afterDefiner = ident !== undefined && type === "keyword" && spec.definers.has(ident);
    push(text, type);
    last = m.index + text.length;
  }

  if (last < code.length) push(code.slice(last));
  return out;
}

export default function CodeBlock({ code, language }: { code: string; language: Language }) {
  return (
    <pre className="bg-surface-2 border border-border rounded-xl p-4 font-mono text-xs text-text overflow-x-auto leading-relaxed [font-variant-ligatures:none]">
      <code>{highlight(code, language)}</code>
    </pre>
  );
}
