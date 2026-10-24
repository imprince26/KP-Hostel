"use client";

import {
  useQuery,
  useQueryClient,
  type QueryClient,
  type QueryKey,
} from "@tanstack/react-query";
import { apiGet } from "@/lib/api-client";

/**
 * Query keys for every cached resource in the app.
 *
 * Keys are hierarchical on purpose: invalidating `queryKeys.admin.applications`
 * also refreshes `applicationList`, `recentApplications` and every single
 * application detail query, so a review/activation action never leaves stale
 * rows on another admin page.
 */
export const queryKeys = {
  admin: {
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
    paymentStudents: (search: string) => ["admin", "payments", "students", search] as const,
    messagingStudents: (search: string) => ["admin", "messaging", "students", search] as const,
    messagingRecipients: (recipientType: string, recipientFilter: string) =>
      ["admin", "messaging", "recipients", recipientType, recipientFilter] as const,
  },
  student: {
    all: ["student"] as const,
    applications: ["student", "applications"] as const,
    application: (id: string) => ["student", "application", id] as const,
    profile: ["student", "profile"] as const,
    payments: ["student", "payments"] as const,
    preferences: ["student", "preferences"] as const,
  },
  notifications: ["notifications"] as const,
  public: {
    announcements: ["public", "announcements"] as const,
  },
} as const;

/**
 * Reads a JSON endpoint into the shared query cache.
 *
 * The cache lives for the lifetime of the browser tab, so navigating between
 * pages reuses the cached payload instead of re-hitting the API for data that
 * has not changed.
 */
export function useApiQuery<T>(
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

/** Returns a helper that marks a query key as stale and refetches it. */
export function useInvalidateQuery() {
  const queryClient: QueryClient = useQueryClient();

  return (queryKey: QueryKey) => {
    queryClient.invalidateQueries({ queryKey });
  };
}
