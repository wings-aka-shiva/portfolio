import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { sendContactEmail } from "../../services/contact-email";
import { EMAIL, EmailLink } from "./EmailLink";

// ─── Types ────────────────────────────────────────────────────────────────────

type FormState = "idle" | "loading" | "success" | "error";

interface Fields {
  name:    string;
  email:   string;
  company: string;
  role:    string;
  link:    string;
  notes:   string;
}

type Errors = Partial<Record<keyof Fields, string>>;

const EMPTY: Fields = { name: "", email: "", company: "", role: "", link: "", notes: "" };

const PREFER_EMAIL_QUERY =
  "subject=Resume%20request&body=Hi%20Shiva,%0D%0A%0D%0ACompany:%20%0D%0ARole:%20%0D%0AJob%20ad%20link:%20%0D%0A%0D%0AThanks";

const inputClass = [
  "bg-surface-2 border border-border rounded-lg px-4 py-3 w-full",
  "font-body text-sm text-text placeholder:text-muted",
  "focus:outline-none transition-colors duration-200",
  "focus:border-accent",
  "disabled:opacity-50 disabled:cursor-not-allowed",
].join(" ");

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

// ─── Validation ───────────────────────────────────────────────────────────────

function validate(f: Fields): Errors {
  const errors: Errors = {};
  if (!f.name.trim())    errors.name    = "Please enter your name.";
  if (!f.company.trim()) errors.company = "Please enter the company.";
  if (!f.role.trim())    errors.role    = "Please enter the role.";

  if (!f.email.trim()) errors.email = "Please enter your email.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) errors.email = "Please enter a valid email address.";

  if (f.link.trim()) {
    try {
      const url = new URL(f.link.trim());
      if (url.protocol !== "http:" && url.protocol !== "https:") throw new Error();
    } catch {
      errors.link = "Please enter a full link, starting with https://";
    }
  }
  return errors;
}

function composeMessage(f: Fields) {
  return [
    "RESUME REQUEST",
    `Company: ${f.company.trim()}`,
    `Role: ${f.role.trim()}`,
    `Job ad: ${f.link.trim() || "not provided"}`,
    `Notes: ${f.notes.trim() || "none"}`,
  ].join("\n");
}

// ─── Field ────────────────────────────────────────────────────────────────────

interface FieldProps {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  children: (props: { id: string; "aria-invalid": boolean; "aria-describedby"?: string }) => React.ReactNode;
}

function Field({ id, label, required, error, children }: FieldProps) {
  const errorId = `${id}-error`;
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="font-body text-xs text-muted tracking-wide">
        {label}
        {required ? <span className="text-accent-text ml-1">*</span> : <span className="text-muted ml-1">(optional)</span>}
      </label>
      {children({ id, "aria-invalid": !!error, "aria-describedby": error ? errorId : undefined })}
      {error && (
        <p id={errorId} className="font-body text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────

function ResumeRequestModal({ onClose }: { onClose: () => void }) {
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [state, setState]   = useState<FormState>("idle");
  const [sentTo, setSentTo] = useState<Pick<Fields, "name"> | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const uid = useId();
  const titleId = `${uid}-title`;
  const isLoading = state === "loading";

  const set = (key: keyof Fields) => (value: string) => {
    setFields((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  // Body scroll lock, Esc to close, focus trap, initial focus
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const panel = panelRef.current;
    panel?.querySelector<HTMLElement>("input")?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panel) return;
      const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (items.length === 0) return;
      const first = items[0];
      const last  = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      } else if (!panel.contains(document.activeElement)) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const found = validate(fields);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      // Focus the first invalid field
      const firstKey = (Object.keys(EMPTY) as (keyof Fields)[]).find((k) => found[k]);
      if (firstKey) panelRef.current?.querySelector<HTMLElement>(`#${CSS.escape(`${uid}-${firstKey}`)}`)?.focus();
      return;
    }

    setState("loading");
    try {
      await sendContactEmail({
        name:    fields.name.trim(),
        email:   fields.email.trim(),
        message: composeMessage(fields),
      });
      setSentTo({ name: fields.name.trim() });
      setState("success");
    } catch {
      setState("error");
    }
  };

  const fieldId = (key: keyof Fields) => `${uid}-${key}`;

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} aria-hidden />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative bg-surface border border-border rounded-2xl p-6 max-w-md w-full my-auto"
      >
        <div className="flex items-start justify-between gap-4">
          <h2 id={titleId} className="font-display text-xl font-semibold text-text">
            Request my resume
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 -mr-2 -mt-1 w-8 h-8 flex items-center justify-center rounded-lg text-muted hover:text-text hover:bg-surface-2 transition-colors cursor-pointer"
          >
            <span aria-hidden>✕</span>
          </button>
        </div>

        {state === "success" && sentTo ? (
          <div role="status" className="mt-4">
            <p className="font-body text-sm text-text/85 leading-relaxed">
              Thanks, {sentTo.name}. Got it, I'll be in touch soon.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-6 w-full inline-flex justify-center rounded-lg px-6 py-3 font-body font-medium text-sm text-white bg-accent hover:bg-accent-dark transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <p className="font-body text-sm text-muted leading-relaxed mt-2">
              Happy to share it. Tell me a bit about the role and I'll get it to you.
            </p>

            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4 mt-5">
              <Field id={fieldId("name")} label="Your name" required error={errors.name}>
                {(p) => <input {...p} type="text" autoComplete="name" value={fields.name} onChange={(e) => set("name")(e.target.value)} disabled={isLoading} className={inputClass} />}
              </Field>
              <Field id={fieldId("email")} label="Your email" required error={errors.email}>
                {(p) => <input {...p} type="email" autoComplete="email" value={fields.email} onChange={(e) => set("email")(e.target.value)} disabled={isLoading} className={inputClass} />}
              </Field>
              <Field id={fieldId("company")} label="Company" required error={errors.company}>
                {(p) => <input {...p} type="text" autoComplete="organization" value={fields.company} onChange={(e) => set("company")(e.target.value)} disabled={isLoading} className={inputClass} />}
              </Field>
              <Field id={fieldId("role")} label="Role you're hiring for" required error={errors.role}>
                {(p) => <input {...p} type="text" value={fields.role} onChange={(e) => set("role")(e.target.value)} disabled={isLoading} className={inputClass} />}
              </Field>
              <Field id={fieldId("link")} label="Job ad link" error={errors.link}>
                {(p) => <input {...p} type="url" placeholder="https://" value={fields.link} onChange={(e) => set("link")(e.target.value)} disabled={isLoading} className={inputClass} />}
              </Field>
              <Field id={fieldId("notes")} label="Anything else?">
                {(p) => <textarea {...p} rows={3} value={fields.notes} onChange={(e) => set("notes")(e.target.value)} disabled={isLoading} className={`${inputClass} resize-none`} />}
              </Field>

              {state === "error" && (
                <p role="alert" className="font-body text-xs text-red-400 leading-relaxed">
                  Something went wrong. Email me at {EMAIL} instead.
                </p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="mt-1 w-full inline-flex justify-center rounded-lg px-6 py-3 font-body font-medium text-sm text-white bg-accent hover:bg-accent-dark transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isLoading ? "Sending..." : "Send request"}
              </button>

              <p className="font-body text-xs text-muted text-center">
                Prefer email?{" "}
                <EmailLink query={PREFER_EMAIL_QUERY} className="text-accent-text hover:text-text transition-colors">
                  {EMAIL}
                </EmailLink>
              </p>
            </form>
          </>
        )}
      </div>
    </div>,
    document.body
  );
}

// ─── Trigger ──────────────────────────────────────────────────────────────────

interface ResumeRequestTriggerProps {
  className?: string;
  children?: React.ReactNode;
}

/** A button that opens the resume request modal and returns focus to itself on close. */
export function ResumeRequestTrigger({ className = "", children = "Request my resume" }: ResumeRequestTriggerProps) {
  const [open, setOpen] = useState(false);
  const wasOpen = useRef(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Return focus to the trigger once the modal has unmounted
  useEffect(() => {
    if (wasOpen.current && !open) triggerRef.current?.focus();
    wasOpen.current = open;
  }, [open]);

  const close = useCallback(() => setOpen(false), []);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        className={className}
      >
        {children}
      </button>
      {open && <ResumeRequestModal onClose={close} />}
    </>
  );
}
