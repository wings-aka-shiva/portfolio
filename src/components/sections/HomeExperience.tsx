import { Link } from "react-router-dom";
import { HomeSection } from "../ui/Section";
import { DateText } from "../ui/DateText";
import { homeTimeline, type TimelineEntry } from "../../data/timeline";
import { LifeMarker, TechMarker, TimelineFrame, TimelineLegend } from "./Timeline";

const COLUMNS = "md:grid-cols-[1fr_56px_1fr]";

function Row({ entry }: { entry: TimelineEntry }) {
  const isTech = entry.track === "tech";

  return (
    <li className={`grid grid-cols-[36px_1fr] ${COLUMNS} items-center min-h-[54px] py-2 md:py-0`}>
      {/* Marker on the line */}
      <span className="col-start-1 row-start-1 md:col-start-2 flex justify-center">
        {isTech ? <TechMarker /> : <LifeMarker />}
      </span>

      {isTech ? (
        <Link
          to={`/experience#${entry.id}`}
          className="col-start-2 row-start-1 md:col-start-1 pr-4 md:pr-0 md:pl-6 md:text-right font-mono text-[15px] font-medium text-text hover:text-white transition-colors duration-200"
        >
          {entry.role} <span className="text-accent-text font-semibold">@{entry.org}</span>{" "}
          <span className="text-[#8b8ba7] whitespace-nowrap">
            // <DateText value={entry.dates ?? ""} />
          </span>
        </Link>
      ) : (
        <p className="col-start-2 row-start-1 md:col-start-3 pr-4 md:pr-6 font-serif text-[15px] text-life-text">
          <b className="text-life-strong font-normal">{entry.org}</b>, {entry.role}
          {entry.dates && (
            <span className="italic text-[13px] text-life-date ml-1.5 whitespace-nowrap">
              <DateText value={entry.dates} />
            </span>
          )}
        </p>
      )}
    </li>
  );
}

function HomeExperience() {
  return (
    <HomeSection
      id="experience"
      n="01"
      label="experience"
      title="Where I've worked"
      more={{ to: "/experience", label: "full experience →" }}
    >
      <TimelineLegend columns={COLUMNS} />
      <TimelineFrame>
        <ol aria-label="Experience timeline, newest first" className="py-5">
          {homeTimeline.map((entry) => (
            <Row key={entry.id} entry={entry} />
          ))}
        </ol>
      </TimelineFrame>
    </HomeSection>
  );
}

export default HomeExperience;
