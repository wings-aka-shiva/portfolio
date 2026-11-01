import emailjs from "@emailjs/browser";

export interface ContactEmail {
  name:    string;
  email:   string;
  message: string;
}

/**
 * Sends a message through the portfolio's EmailJS contact template.
 * Shared by the Contact form and the resume request form so both use the
 * same service, template and parameter names.
 */
export function sendContactEmail({ name, email, message }: ContactEmail) {
  return emailjs.send(
    import.meta.env.VITE_EMAILJS_SERVICE_ID,
    import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
    { name, email, message },
    import.meta.env.VITE_EMAILJS_PUBLIC_KEY
  );
}
