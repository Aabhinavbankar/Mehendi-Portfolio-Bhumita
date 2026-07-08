// Uploaded design photos live in Supabase Storage; allow next/image to optimize
// them by whitelisting the project's storage host (derived from the env URL so
// there's nothing to hand-edit per environment). Placeholder SVGs are local and
// rendered as plain <img>, so they don't need to be listed here.
const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : undefined;

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: supabaseHost
      ? [
          {
            protocol: "https",
            hostname: supabaseHost,
            pathname: "/storage/v1/object/public/**",
          },
        ]
      : [],
  },
};

export default nextConfig;
