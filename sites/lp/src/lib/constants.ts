export { SERVICE_URL, PORTAL_URLS } from "@sotobaco/ui";

const isDev = process.env.NODE_ENV === "development";

export const CORPORATE_URL = isDev ? "http://localhost:3000/" : "/";

export const CONTACT_API_URL =
  process.env.NEXT_PUBLIC_CONTACT_API_URL || "https://contact-api.sotobaco.workers.dev";
