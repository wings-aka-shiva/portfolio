import { useEffect } from "react";

/** Sets document.title and the meta description on mount, and restores both on unmount. */
export function usePageMeta(title: string, description: string) {
  useEffect(() => {
    const meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const prevTitle = document.title;
    const prevDescription = meta?.content;

    document.title = title;
    if (meta) meta.content = description;

    return () => {
      document.title = prevTitle;
      if (meta && prevDescription !== undefined) meta.content = prevDescription;
    };
  }, [title, description]);
}
