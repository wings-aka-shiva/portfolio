import { Link } from "react-router-dom";
import { ResumeRequestTrigger } from "./ResumeRequest";
import { btnPrimary, monoLink } from "./styles";

function BackLink() {
  return (
    <Link to="/" className={monoLink}>
      ← back to home
    </Link>
  );
}

interface PageShellProps {
  children: React.ReactNode;
  /** Max-width class for the page column */
  width?: string;
}

/** Sub-page frame: back link on top, back link + resume request at the end. */
export function PageShell({ children, width = "max-w-[1200px]" }: PageShellProps) {
  return (
    <div className={`${width} mx-auto px-4 sm:px-10 pt-24 md:pt-28 pb-20`}>
      <BackLink />
      <div className="mt-8">{children}</div>
      <div className="mt-16 pt-8 border-t border-border-soft flex flex-wrap items-center justify-between gap-4">
        <BackLink />
        <ResumeRequestTrigger className={btnPrimary} />
      </div>
    </div>
  );
}
