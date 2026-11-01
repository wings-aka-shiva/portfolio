const STATS = [
  { value: "2 yrs",          label: "Industry experience" },
  { value: "Above & Beyond", label: "Award · KEKA Technologies" },
  { value: "0.96660",        label: "Hackathon leaderboard score" },
];

function StoryBar() {
  return (
    <div className="py-6 border-y border-border">
      <div className="max-w-5xl mx-auto px-4">
        <dl className="grid grid-cols-3 divide-x divide-border">
          {STATS.map(({ value, label }) => (
            <div key={label} className="px-3 sm:px-8 first:pl-0 last:pr-0 text-center md:text-left">
              <dt className="sr-only">{label}</dt>
              <dd className="font-display text-lg sm:text-2xl font-bold text-text leading-tight">
                {value}
              </dd>
              <dd className="font-body text-xs text-muted mt-1">{label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

export default StoryBar;
