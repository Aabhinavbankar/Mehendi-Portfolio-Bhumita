import { emailUrl, whatsappUrl } from "@/lib/site";

export default function ContactButtons({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-3 sm:flex-row ${className}`}>
      <a
        href={whatsappUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 rounded-full bg-henna px-7 py-3 text-base font-medium text-cream shadow-sm transition-colors hover:bg-henna-deep"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
          <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.19 1.87.12.57-.09 1.76-.72 2-1.42.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35z" />
        </svg>
        Message on WhatsApp
      </a>
      <a
        href={emailUrl()}
        className="inline-flex items-center justify-center gap-2 rounded-full border border-henna px-7 py-3 text-base font-medium text-henna transition-colors hover:bg-henna hover:text-cream"
      >
        Email Bhumita
      </a>
    </div>
  );
}
