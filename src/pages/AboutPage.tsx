import { PageShell } from "../components/ui/PageShell";
import { Paragraph, Photo } from "../components/sections/AboutMe";
import { readMinutes, story } from "../data/story";
import { usePageMeta } from "../hooks/usePageMeta";

function AboutPage() {
  usePageMeta(
    "About | Shiva Kumar Tirupathi",
    "Story time: how Shiva Kumar Tirupathi went from drawing a login page out of dashes in a C class to building AI features in Melbourne."
  );

  const lastIndex = story.length - 1;

  return (
    <PageShell width="max-w-[1000px]">
      {/* Header: photo on the right on md+, on top on phones */}
      <div className="max-w-2xl mx-auto flex flex-col-reverse md:flex-row md:items-center md:justify-between gap-8">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h1 className="font-display font-extrabold text-[36px] md:text-[48px] leading-tight text-text">
            Story time <span className="text-accent-text">{"<3"}</span>
          </h1>
          <p className="font-mono text-[13px] text-muted">
            <span aria-hidden>· </span>
            {readMinutes} min read
          </p>
        </div>
        <Photo className="self-center" sizeClass="w-32 h-32 md:w-[168px] md:h-[168px]" plain />
      </div>

      {/* The whole story, no collapse. Chapter labels sit in the left margin on lg+. */}
      <div className="max-w-2xl mx-auto mt-12">
        {story.map((p, i) => (
          <Paragraph key={i} paragraph={p} isFirst={i === 0} isLast={i === lastIndex} />
        ))}
      </div>
    </PageShell>
  );
}

export default AboutPage;
