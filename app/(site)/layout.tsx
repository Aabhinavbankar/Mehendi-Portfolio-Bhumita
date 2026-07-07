import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import StickyWhatsApp from "@/components/StickyWhatsApp";

// Layout for the public marketing site. The admin (/admin) is deliberately
// outside this group so it never renders the public nav / footer / WhatsApp CTA.
export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">{children}</main>
      <Footer />
      <StickyWhatsApp />
    </div>
  );
}
