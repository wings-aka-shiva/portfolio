/** Shown in the detail panel for problems that have moved behind LeetCode Premium. */
export default function PremiumPlaceholder() {
  return (
    <div className="bg-surface border border-border rounded-xl p-5">
      <div className="flex items-center gap-2">
        <h3 className="font-display font-semibold text-base text-text">Behind LeetCode Premium</h3>
        <span aria-hidden="true">🔒</span>
      </div>
      <p className="font-body text-sm text-body leading-relaxed mt-3">
        This question has moved under LeetCode Premium, so I can't access it for the moment. Premium
        costs about US$40.
      </p>
      <p className="font-body text-sm text-body leading-relaxed mt-3">
        If you'd like to sponsor it, it goes straight to a Premium subscription. I'll solve this one,
        post the solution here, and unlock the company-tagged questions too.
      </p>
      <a
        href="https://ko-fi.com/wingsakashiva"
        target="_blank"
        rel="noopener noreferrer"
        className={[
          "inline-flex items-center gap-2 mt-4",
          "font-body text-sm text-muted",
          "border border-border rounded-lg px-4 py-2",
          "hover:border-accent/40 hover:text-accent",
          "transition-all duration-200",
        ].join(" ")}
      >
        Sponsor Premium on Ko-fi →
      </a>
    </div>
  );
}
