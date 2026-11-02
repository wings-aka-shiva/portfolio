import { Link } from "react-router-dom";
import { SectionLabel } from "../ui/SectionLabel";
import { SectionShell } from "../ui/Section";
import { Photo } from "./AboutMe";
import { readMinutes } from "../../data/story";

function AboutTeaser() {
  return (
    <SectionShell id="about" labelledBy="about-title">
      <Link
        to="/about"
        className="group bg-surface border border-border rounded-[20px] p-5 sm:p-10 flex flex-wrap items-center gap-6 sm:gap-10 hover:border-accent-text/50 transition-colors duration-200"
      >
        <Photo className="hidden sm:block" sizeClass="w-[168px] h-[168px]" plain />

        <div className="flex-[1_1_320px] min-w-0">
          <div className="flex items-center gap-4">
            <Photo className="sm:hidden" sizeClass="w-[88px] h-[88px]" plain />
            <div>
              <SectionLabel n="07" name="about me" className="mb-3" />
              <h2 id="about-title" className="font-display font-extrabold text-[26px] md:text-[32px] leading-tight text-text">
                Story time
                {/* Decorative cursor: screen readers hear just "Story time" */}
                <span className="caret-blink text-accent-text" aria-hidden="true">_</span>
              </h2>
            </div>
          </div>
          <p className="mt-4 max-w-[640px] font-body text-[17px] leading-relaxed text-body">
            I played games on every gadget I could get my hands on. Building them never crossed my mind, until a blue C
            terminal, a login page drawn out of dashes, and a teacher who didn't laugh.
          </p>
          <p className="mt-5 font-mono text-sm text-accent-text group-hover:underline underline-offset-4">
            read my story · {readMinutes} min →
          </p>
        </div>
      </Link>
    </SectionShell>
  );
}

export default AboutTeaser;
