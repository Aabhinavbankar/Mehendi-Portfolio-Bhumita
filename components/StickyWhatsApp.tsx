import { whatsappUrl, defaultContact, type Contact } from "@/lib/site";
import WhatsAppIcon from "@/components/WhatsAppIcon";

/** Floating WhatsApp button — visible on every screen, the primary conversion path. */
export default function StickyWhatsApp({
  contact = defaultContact,
}: {
  contact?: Contact;
}) {
  return (
    <a
      href={whatsappUrl(contact)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Message Bhumita on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-henna text-cream shadow-lg shadow-henna/30 transition-transform hover:scale-105 hover:bg-henna-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}
