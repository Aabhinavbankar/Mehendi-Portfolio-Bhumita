import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import StickyWhatsApp from "@/components/StickyWhatsApp";
import RealtimeRefresher from "@/components/RealtimeRefresher";
import { getSiteContent } from "@/lib/content";

// Layout for the public marketing site. The admin (/admin) is deliberately
// outside this group so it never renders the public nav / footer / WhatsApp CTA.
// Contact details are read once here and threaded to every contact link.
export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { contact } = await getSiteContent();

  return (
    <div className="flex min-h-screen flex-col">
      <RealtimeRefresher />
      <Nav contact={contact} />
      <main className="flex-1">{children}</main>
      <Footer contact={contact} />
      <StickyWhatsApp contact={contact} />
    </div>
  );
}
