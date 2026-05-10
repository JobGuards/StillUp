import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  transpilePackages: ["@stillup/shared"],
};

export default withSentryConfig(nextConfig, {
  org: "stillup",
  project: "stillup-web",
  silent: true,
});
