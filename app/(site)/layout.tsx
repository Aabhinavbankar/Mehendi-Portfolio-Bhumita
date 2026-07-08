import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import StickyWhatsApp from "@/components/StickyWhatsApp";
import RealtimeRefresher from "@/components/RealtimeRefresher";
import { getSiteContent } from "@/lib/content";
import { createClient } from "@/lib/supabase/server";

// Layout for the public marketing site. The admin (/admin) is deliberately
// outside this group so it never renders the public nav / footer / WhatsApp CTA.
// Contact details are read once here and threaded to every contact link.
export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { contact } = await getSiteContent();

  // Live content refresh is only wired up for the signed-in owner (so their
  // preview updates as they edit). Anonymous visitors don't open a Realtime
  // socket — it would burn connection quota for a page that never changes
  // under them.
  let isOwner = false;
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    isOwner = !!user;
  } catch {
    /* Supabase unreachable → just skip live refresh. */
  }

  return (
    <div className="flex min-h-screen flex-col">
      {isOwner && <RealtimeRefresher />}
      <Nav contact={contact} />
      <main className="flex-1">{children}</main>
      <Footer contact={contact} />
      <StickyWhatsApp contact={contact} />
    </div>
  );
}
