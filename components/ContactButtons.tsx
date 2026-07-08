import { emailUrl, whatsappUrl, defaultContact, type Contact } from "@/lib/site";
import WhatsAppIcon from "@/components/WhatsAppIcon";

export default function ContactButtons({
  contact = defaultContact,
  className = "",
}: {
  contact?: Contact;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-3 sm:flex-row ${className}`}>
      <a
        href={whatsappUrl(contact)}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 rounded-full bg-henna px-7 py-3 text-base font-medium text-cream shadow-sm transition-colors hover:bg-henna-deep"
      >
        <WhatsAppIcon className="h-5 w-5" />
        Message on WhatsApp
      </a>
      <a
        href={emailUrl(contact)}
        className="inline-flex items-center justify-center gap-2 rounded-full border border-henna px-7 py-3 text-base font-medium text-henna transition-colors hover:bg-henna hover:text-cream"
      >
        Email Bhumita
      </a>
    </div>
  );
}
