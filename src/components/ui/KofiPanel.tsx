interface KofiPanelProps {
  firstLine: string;
}

function KofiPanel({ firstLine }: KofiPanelProps) {
  return (
    <div className="border-t border-border pt-6 flex flex-col gap-3">
      <p className="font-body text-sm text-muted">{firstLine}</p>
      <p className="font-body text-sm text-muted/70 leading-relaxed">
        You can help me keep the adventure going. It'd give me something to show
        Mum — proof that I'm not just burning my hustle money. No pressure
        though. But if you want to join my side and prove her wrong... I've got
        a few options for you. ☕
      </p>
      <iframe
        src="https://ko-fi.com/wingsakashiva/?hidefeed=true&widget=true&embed=true&preview=true"
        style={{
          background: "transparent",
          height: "420px",
          width: "100%",
          border: "none",
        }}
        title="Support on Ko-fi"
      />
    </div>
  );
}

export default KofiPanel;
