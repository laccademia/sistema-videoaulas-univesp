import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "../../../server/routers";

export const trpc = createTRPCReact<AppRouter>();

/**
 * Helper function to get the OAuth login URL
 */
export function getLoginUrl(): string {
  const currentUrl = window.location.href;
  return `/api/oauth/login?redirect=${encodeURIComponent(currentUrl)}`;
}
