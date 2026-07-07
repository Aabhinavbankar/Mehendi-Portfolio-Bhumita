import { whatsappUrl } from "@/lib/site";

/** Floating WhatsApp button — visible on every screen, the primary conversion path. */
export default function StickyWhatsApp() {
  return (
    <a
      href={whatsappUrl()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Message Bhumita on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-henna text-cream shadow-lg shadow-henna/30 transition-transform hover:scale-105 hover:bg-henna-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
    >
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-7 w-7"
        aria-hidden="true"
      >
        <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.19 1.87.12.57-.09 1.76-.72 2-1.42.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35zM12.04 2.5A9.5 9.5 0 0 0 3.9 16.86L2.5 21.5l4.75-1.25A9.5 9.5 0 1 0 12.04 2.5zm0 17.36c-1.5 0-2.96-.4-4.24-1.16l-.3-.18-2.82.74.75-2.75-.2-.32a7.86 7.86 0 1 1 7.01 3.87z" />
      </svg>
    </a>
  );
}
