const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

/** "Jul 2026" -> "2026-07", "2025" -> "2025", "22 Oct 2026" -> "2026-10-22" */
function toDateTime(text: string): string | undefined {
  const parts = text.trim().split(/\s+/);
  const year = parts.find((p) => /^\d{4}$/.test(p));
  if (!year) return undefined;
  const monthIdx = parts.findIndex((p) => MONTHS.includes(p.slice(0, 3).toLowerCase()));
  if (monthIdx === -1) return year;
  const mm = String(MONTHS.indexOf(parts[monthIdx].slice(0, 3).toLowerCase()) + 1).padStart(2, "0");
  const day = parts.find((p) => /^\d{1,2}$/.test(p));
  return day ? `${year}-${mm}-${day.padStart(2, "0")}` : `${year}-${mm}`;
}

/**
 * Renders a date or date range ("May 2023 - Dec 2024", "22-23 Oct 2026")
 * with each end wrapped in a <time> element.
 */
export function DateText({ value }: { value: string }) {
  // Day range within one month, e.g. "22-23 Oct 2026"
  const dayRange = value.match(/^(\d{1,2})-(\d{1,2}) (\w+ \d{4})$/);
  if (dayRange) {
    const [, from, to, monthYear] = dayRange;
    return (
      <>
        <time dateTime={toDateTime(`${from} ${monthYear}`)}>{from}</time>-
        <time dateTime={toDateTime(`${to} ${monthYear}`)}>{to} {monthYear}</time>
      </>
    );
  }

  // A range end without a year ("Jul - Nov 2026") borrows the year of the other end
  const ends = value.split(" - ");
  const rangeYear = ends.map((e) => e.match(/\d{4}/)?.[0]).find(Boolean);
  return (
    <>
      {ends.map((end, i) => {
        const isBareMonth = !/\d{4}/.test(end) && MONTHS.includes(end.slice(0, 3).toLowerCase());
        const dateTime = toDateTime(isBareMonth && rangeYear ? `${end} ${rangeYear}` : end);
        return (
          <span key={i}>
            {i > 0 && " - "}
            {dateTime ? <time dateTime={dateTime}>{end}</time> : end}
          </span>
        );
      })}
    </>
  );
}
