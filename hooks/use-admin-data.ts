"use client";

import {
  useQuery,
  useQueryClient,
  type QueryClient,
  type QueryKey,
} from "@tanstack/react-query";
import { apiGet } from "@/lib/api-client";

/**
 * Query keys for admin data.
 */
export const adminQueryKeys = {
  all: ["admin"] as const,
  stats: ["admin", "stats"] as const,
  applications: ["admin", "applications"] as const,
  applicationList: ["admin", "applications", "list"] as const,
  recentApplications: ["admin", "applications", "recent"] as const,
  application: (id: string) => ["admin", "application", id] as const,
  blocks: ["admin", "blocks"] as const,
  announcements: ["admin", "announcements"] as const,
  users: ["admin", "users"] as const,
  payments: ["admin", "payments"] as const,
  messagingStudents: (search: string) =>
    ["admin", "messaging", "students", search] as const,
  messagingRecipients: (recipientType: string, recipientFilter: string) =>
    ["admin", "messaging", "recipients", recipientType, recipientFilter] as const,
  paymentStudents: (search: string) => ["admin", "payments", "students", search] as const,
};

export function useAdminQuery<T>(
  queryKey: QueryKey,
  url: string | null,
  enabled = true
) {
  return useQuery<T>({
    queryKey,
    queryFn: ({ signal }) => apiGet<T>(url as string, signal),
    enabled: enabled && Boolean(url),
  });
}

/** Returns a helper that marks an admin query key as stale and refetches it. */
export function useInvalidateAdminQuery() {
  const queryClient: QueryClient = useQueryClient();

  return (queryKey: QueryKey) => {
    queryClient.invalidateQueries({ queryKey });
  };
}
