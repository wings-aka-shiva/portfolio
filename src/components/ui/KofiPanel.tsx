interface KofiPanelProps {
  firstLine: string;
}

function KofiPanel({ firstLine }: KofiPanelProps) {
  return (
    <div className="border-t border-border pt-4 mt-6">
      <p className="font-body text-sm text-muted">{firstLine}</p>
      <a
        href="https://ko-fi.com/wingsakashiva"
        target="_blank"
        rel="noopener noreferrer"
        className={[
          "inline-flex items-center gap-2 mt-3",
          "font-body text-sm text-muted",
          "border border-border rounded-lg px-4 py-2",
          "hover:border-accent/40 hover:text-accent",
          "transition-all duration-200",
        ].join(" ")}
      >
        ☕ Keep me caffeinated →
      </a>
    </div>
  );
}

export default KofiPanel;
