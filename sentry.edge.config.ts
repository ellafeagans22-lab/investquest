import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://df0e7076a5f8a029f91e154cd4c7a999@o4511277221150720.ingest.us.sentry.io/4511451115225088",
  tracesSampleRate: 1.0,
});
