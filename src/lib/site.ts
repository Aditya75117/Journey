const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const siteUrl = (
  configuredSiteUrl ??
  (process.env.NODE_ENV === "production"
    ? "https://aditya-career-journey.vercel.app"
    : "http://localhost:3801")
).replace(/\/$/, "");

export const site = {
  title: "AD. — Aditya Dutta | Life Journey",
  description:
    "An immersive storytelling portfolio — walk the road from schooling in Nadaun to Senior UI Developer at ShyftLabs.",
  name: "Aditya Dutta",
  role: "Senior UI Developer",
  email: "hello@adityadutta.dev",
  linkedin: "https://www.linkedin.com/in/aditya-dutta-620762205",
} as const;
