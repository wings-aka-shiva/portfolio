import { Link, type LinkProps } from "react-router-dom";
import { useFromHomeState } from "../../hooks/useFromHome";

type BlogBackLinkProps = Omit<LinkProps, "to" | "state" | "children"> & {
  /** The page's own label for the usual link back to /blog */
  label?: string;
};

/**
 * Back link for blog pages. Visitors who came from the homepage panel go back
 * to the homepage at the spot they left; everyone else goes to /blog.
 * Styling (className, style, hover handlers) is left to each page.
 */
export function BlogBackLink({ label = "← Back to Blog", ...linkProps }: BlogBackLinkProps) {
  const fromHome = useFromHomeState();

  return fromHome ? (
    <Link to="/" state={{ restoreHome: true }} {...linkProps}>
      ← back to home
    </Link>
  ) : (
    <Link to="/blog" {...linkProps}>
      {label}
    </Link>
  );
}
