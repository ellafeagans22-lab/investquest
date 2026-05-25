import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  /* config options here */
};

export default withSentryConfig(nextConfig, {
  org: "o4511277221150720",
  project: "investquest",
  silent: true,
  disableLogger: true,
  tunnelRoute: "/monitoring",
});
