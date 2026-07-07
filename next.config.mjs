/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // When Supabase Storage is wired up (phase 2), design photos are served
    // from your project's storage domain. Add it here so <Image> can optimize them:
    // remotePatterns: [{ protocol: "https", hostname: "<project-ref>.supabase.co" }],
    remotePatterns: [],
  },
};

export default nextConfig;
