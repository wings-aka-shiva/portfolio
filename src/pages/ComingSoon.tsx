import { Link } from "react-router-dom";

interface Props {
  emoji: string;
  category: string;
}

function ComingSoon({ emoji, category }: Props) {
  return (
    <div className="min-h-screen flex flex-col pt-24 pb-20">
      {/* Back link */}
      <div className="max-w-4xl mx-auto px-6 w-full mb-12">
        <Link
          to="/blog"
          className="inline-flex items-center gap-1.5 font-body text-xs text-muted hover:text-accent transition-colors duration-200"
        >
          ← Back to Blog
        </Link>
      </div>

      {/* Centered content */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
        <span
          className="text-8xl mb-8 block leading-none select-none opacity-80"
          role="img"
          aria-label={category}
        >
          {emoji}
        </span>
        <h1 className="font-display font-bold text-3xl text-text mb-3">
          {category}
        </h1>
        <p className="font-body text-sm text-muted mb-1.5">
          This chapter is being written.
        </p>
        <p className="font-body text-xs text-faint">Check back soon.</p>
      </div>
    </div>
  );
}

export default ComingSoon;
