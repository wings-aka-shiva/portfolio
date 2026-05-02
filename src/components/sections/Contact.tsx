import { useState } from "react";
import emailjs from "@emailjs/browser";
import { Section } from "../ui/Section";
import { Button } from "../ui/Button";

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
        {required && <span className="text-accent ml-1">*</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        required={required}
        className={[
          "bg-surface border border-border rounded-xl px-4 py-3",
          "font-body text-sm text-text placeholder:text-faint",
          "outline-none transition-all duration-200",
          "focus:border-accent focus:ring-2 focus:ring-accent/15",
          "disabled:opacity-50 disabled:cursor-not-allowed",
        ].join(" ")}
      />
    </div>
  );
}

function ContactInfo() {
  const items = [
    {
      label: "Email",
      value: "shivatirupathi10@gmail.com",
      href:  "mailto:shivatirupathi10@gmail.com",
    },
    {
      label: "LinkedIn",
      value: "linkedin.com/in/shiva4836",
      href:  "https://www.linkedin.com/in/shiva4836/",
    },
    {
      label: "GitHub",
      value: "github.com/wings-aka-shiva",
      href:  "https://github.com/wings-aka-shiva",
    },
    {
      label: "Location",
      value: "Melbourne, AU",
      href:  null,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="font-display font-semibold text-xl text-text mb-3 leading-snug">
          Let's build something together.
        </h3>
        <p className="font-body text-sm text-muted leading-relaxed">
          Whether it's a job opportunity, a project, or just a chat about
          tech — my inbox is open.
        </p>
      </div>

      <ul className="flex flex-col gap-3">
        {items.map(({ label, value, href }) => (
          <li key={label} className="flex gap-3 items-start">
            <span className="font-body text-xs text-muted/60 w-16 shrink-0 pt-[1px]">
              {label}
            </span>
            {href ? (
              <a
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                className="font-body text-sm text-text/80 hover:text-accent transition-colors duration-200 break-all"
              >
                {value}
              </a>
            ) : (
              <span className="font-body text-sm text-text/80">{value}</span>
            )}
          </li>
        ))}
      </ul>
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
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          name:    fields.name,
          email:   fields.email,
          message: fields.message,
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );
      setState("success");
    } catch {
      setErrorMsg("Something went wrong. Please try again or email me directly.");
      setState("error");
    }
  };

  const isLoading = state === "loading";

  return (
    <Section id="contact" label="Get In Touch" title="Contact Me">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-start">

        {/* ── Left: tagline + contact info ──────────────────────── */}
        <ContactInfo />

        {/* ── Right: form ───────────────────────────────────────── */}
        <div className="bg-surface border border-border rounded-2xl p-6 md:p-8">
          {state === "success" ? (
            <SuccessMessage />
          ) : (
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
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
                  Message <span className="text-accent">*</span>
                </label>
                <textarea
                  id="contact-message"
                  value={fields.message}
                  onChange={(e) => set("message")(e.target.value)}
                  disabled={isLoading}
                  required
                  rows={5}
                  className={[
                    "bg-surface border border-border rounded-xl px-4 py-3",
                    "font-body text-sm text-text placeholder:text-faint",
                    "outline-none transition-all duration-200 resize-none",
                    "focus:border-accent focus:ring-2 focus:ring-accent/15",
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
              <Button
                variant="primary"
                size="lg"
                className="w-full justify-center"
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
                    Sending…
                  </>
                ) : (
                  "Send Message"
                )}
              </Button>
            </form>
          )}
        </div>
      </div>
    </Section>
  );
}

export default Contact;
