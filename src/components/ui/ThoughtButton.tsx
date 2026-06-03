import { useEffect, useState } from "react";
import emailjs from "@emailjs/browser";

type State = "idle" | "loading" | "success" | "error";

interface ThoughtButtonProps {
  ethereal?: boolean;
}

export default function ThoughtButton({ ethereal = false }: ThoughtButtonProps) {
  const [open,    setOpen]    = useState(false);
  const [thought, setThought] = useState("");
  const [name,    setName]    = useState("");
  const [status,  setStatus]  = useState<State>("idle");

  // ESC to close
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") closeModal(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  function openModal()  { setOpen(true); setStatus("idle"); setThought(""); setName(""); }
  function closeModal() { setOpen(false); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!thought.trim()) return;
    setStatus("loading");

    const from  = name.trim() || "Anonymous";
    const body  = `Thought from: ${window.location.href}\n\nFrom: ${from}\n\n"${thought.trim()}"`;

    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        { name: from, email: "shivatirupathi10@gmail.com", message: body },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
      );
      setStatus("success");
      setTimeout(closeModal, 2000);
    } catch {
      setStatus("error");
    }
  }

  const inputCls = [
    "w-full bg-surface-2 border border-border rounded-xl px-4 py-3",
    "font-body text-sm text-text placeholder:text-muted/50",
    "focus:border-accent/40 focus:ring-1 focus:ring-accent/15 outline-none",
    "transition-colors duration-150",
  ].join(" ");

  const btnBase = ethereal
    ? [
        "fixed bottom-6 right-6 z-40",
        "border rounded-full px-4 py-2.5",
        "font-body text-sm transition-all duration-200 cursor-pointer",
      ].join(" ")
    : [
        "fixed bottom-6 right-6 z-40",
        "bg-surface border border-border rounded-full px-4 py-2.5",
        "font-body text-sm text-muted",
        "hover:border-accent/40 hover:text-accent",
        "transition-all duration-200 cursor-pointer",
      ].join(" ");

  const btnStyle: React.CSSProperties = ethereal
    ? {
        background:   "rgba(9,9,15,0.6)",
        borderColor:  "rgba(255,255,255,0.08)",
        color:        "rgba(221,216,208,0.45)",
        backdropFilter: "blur(8px)",
      }
    : {};

  return (
    <>
      {/* Floating trigger */}
      <button
        onClick={openModal}
        className={btnBase}
        style={btnStyle}
      >
        💭 Leave a thought
      </button>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <div className="bg-surface border border-border rounded-2xl p-6 max-w-md w-full relative">

            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-muted hover:text-text transition-colors duration-150 cursor-pointer"
              aria-label="Close"
            >
              ✕
            </button>

            {status === "success" ? (
              <div className="py-8 text-center">
                <p className="font-display font-semibold text-text mb-2">Thank you 🌿</p>
                <p className="font-body text-sm text-muted">Your thought landed safely.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <h2 className="font-display font-semibold text-text">
                    Leave a thought
                  </h2>
                </div>

                <textarea
                  className={inputCls}
                  rows={4}
                  placeholder="What's on your mind..."
                  value={thought}
                  onChange={(e) => setThought(e.target.value)}
                  disabled={status === "loading"}
                />

                <input
                  className={inputCls}
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={status === "loading"}
                />

                {status === "error" && (
                  <p className="font-body text-xs text-red-400">
                    Something went wrong — try again.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "loading" || !thought.trim()}
                  className={[
                    "w-full rounded-xl px-4 py-3",
                    "font-body text-sm font-medium",
                    "bg-accent text-white",
                    "hover:bg-accent-dark transition-colors duration-150",
                    "disabled:opacity-40 disabled:cursor-not-allowed",
                    "cursor-pointer",
                  ].join(" ")}
                >
                  {status === "loading" ? "Sending..." : "Send it →"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
