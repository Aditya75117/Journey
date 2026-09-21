export const LANDING_URL =
  process.env.NEXT_PUBLIC_LANDING_URL ??
  (process.env.NODE_ENV === "production"
    ? "https://aditya-dutta-portfolio-website.vercel.app"
    : "http://localhost:3800");
