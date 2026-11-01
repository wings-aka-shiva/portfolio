import { useState } from "react";
import { sendContactEmail } from "../../services/contact-email";
import { SectionShell } from "../ui/Section";
import { SectionLabel } from "../ui/SectionLabel";
import { EMAIL, EmailLink } from "../ui/EmailLink";
import { ResumeRequestTrigger } from "../ui/ResumeRequest";
import { btnGhost, btnPrimary, monoLink } from "../ui/styles";

// ─── Types ────────────────────────────────────────────────────────────────────

type FormState = "idle" | "loading" | "success" | "error";

interface Fields {
  name:    string;
  email:   string;
  message: string;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function InputField({
  label,
  id,
  type = "text",
  value,
  onChange,
  disabled,
  required,
}: {
  label: string;
  id: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  disabled: boolean;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="font-body text-xs text-muted tracking-wide">
        {label}
        {required && <span className="text-accent-text ml-1">*</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        required={required}
        className={[
          "bg-surface-2 border border-border rounded-lg px-4 py-3",
          "font-body text-sm text-text placeholder:text-muted",
          "focus:outline-none transition-colors duration-200",
          "focus:border-accent",
          "disabled:opacity-50 disabled:cursor-not-allowed",
        ].join(" ")}
      />
    </div>
  );
}

// Coding platforms live in the "Where I practice" panel
const PROFILE_LINKS = [
  { label: "github", href: "https://github.com/wings-aka-shiva" },
  { label: "linkedin", href: "https://www.linkedin.com/in/shiva4836/" },
];

function ContactInfo() {
  const focusForm = () => document.getElementById("contact-name")?.focus();

  return (
    <div className="flex flex-col gap-5 md:gap-6">
      <SectionLabel n="08" name="contact" />
      <h2 id="contact-title" className="font-display font-extrabold text-[30px] md:text-[48px] leading-[1.08] text-text">
        Hiring, or want to talk shop?
      </h2>

      <EmailLink className="self-start font-mono text-base sm:text-lg text-cyan-text hover:text-text transition-colors duration-200 break-all">
        {EMAIL}
      </EmailLink>

      <div className="flex flex-wrap gap-3">
        <ResumeRequestTrigger className={btnPrimary} />
        <button type="button" onClick={focusForm} className={btnGhost}>
          Send a message
        </button>
      </div>

      <nav aria-label="Profiles">
        <ul className="flex flex-wrap gap-x-5 gap-y-2">
          {PROFILE_LINKS.map(({ label, href }) => (
            <li key={label}>
              <a href={href} target="_blank" rel="noopener noreferrer" className={monoLink}>
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

function SuccessMessage() {
  return (
    <div className="flex flex-col items-center gap-4 py-12 text-center">
      {/* Checkmark circle */}
      <div className="w-14 h-14 rounded-full bg-accent/10 border border-accent/25 flex items-center justify-center">
        <svg
          className="w-6 h-6 text-accent"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M20 6L9 17l-5-5" />
        </svg>
      </div>
      <div>
        <p className="font-display font-semibold text-base text-text">
          Message sent!
        </p>
        <p className="font-body text-sm text-muted mt-1">
          I'll get back to you soon.
        </p>
      </div>
    </div>
  );
}

// ─── Main section ─────────────────────────────────────────────────────────────

function Contact() {
  const [fields, setFields]   = useState<Fields>({ name: "", email: "", message: "" });
  const [state, setState]     = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const set = (key: keyof Fields) => (value: string) =>
    setFields((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("loading");
    setErrorMsg("");

    try {
      await sendContactEmail({
        name:    fields.name,
        email:   fields.email,
        message: fields.message,
      });
      setState("success");
    } catch {
      setErrorMsg("Something went wrong. Please try again or email me directly.");
      setState("error");
    }
  };

  const isLoading = state === "loading";

  return (
    <SectionShell id="contact" labelledBy="contact-title" last>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

        {/* ── Left: tagline + contact info ──────────────────────── */}
        <ContactInfo />

        {/* ── Right: form ───────────────────────────────────────── */}
        <div className="bg-surface border border-border rounded-2xl p-5 md:p-8">
          {state === "success" ? (
            <SuccessMessage />
          ) : (
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4 md:gap-5">
              <InputField
                label="Name"
                id="contact-name"
                value={fields.name}
                onChange={set("name")}
                disabled={isLoading}
                required
              />
              <InputField
                label="Email"
                id="contact-email"
                type="email"
                value={fields.email}
                onChange={set("email")}
                disabled={isLoading}
                required
              />

              {/* Message textarea */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="contact-message"
                  className="font-body text-xs text-muted tracking-wide"
                >
                  Message <span className="text-accent-text">*</span>
                </label>
                <textarea
                  id="contact-message"
                  value={fields.message}
                  onChange={(e) => set("message")(e.target.value)}
                  disabled={isLoading}
                  required
                  rows={4}
                  className={[
                    "bg-surface-2 border border-border rounded-lg px-4 py-3",
                    "font-body text-sm text-text placeholder:text-muted",
                    "focus:outline-none transition-colors duration-200 resize-none",
                    "focus:border-accent",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                  ].join(" ")}
                />
              </div>

              {/* Error message */}
              {state === "error" && (
                <p className="font-body text-xs text-red-400 leading-relaxed">
                  {errorMsg}
                </p>
              )}

              {/* Submit */}
              <button
                type="submit"
                className={`${btnPrimary} w-full disabled:opacity-40 disabled:cursor-not-allowed`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="w-4 h-4 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden
                    >
                      <circle
                        className="opacity-25"
                        cx="12" cy="12" r="10"
                        stroke="currentColor" strokeWidth="3"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                    Sending...
                  </>
                ) : (
                  "Send message"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </SectionShell>
  );
}

export default Contact;
