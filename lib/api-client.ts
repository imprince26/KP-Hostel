/**
 * Minimal fetch helpers for JSON APIs.
 *
 * Both helpers throw `ApiError` on non-2xx responses so callers can rely on
 * `try/catch` instead of checking `response.ok` everywhere. Use them together
 * with TanStack Query (see `hooks/use-admin-data.ts`) so identical requests are
 * de-duplicated and served from the in-memory cache across client-side route
 * changes.
 */

export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function readBody(response: Response): Promise<Record<string, unknown> | null> {
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text) as Record<string, unknown>;
  } catch {
    return { error: text };
  }
}

export async function apiGet<T>(url: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(url, signal ? { signal } : undefined);
  const body = await readBody(response);

  if (!response.ok) {
    const message =
      (typeof body?.error === "string" && body.error) ||
      `Request failed with status ${response.status}`;
    throw new ApiError(message, response.status);
  }

  return body as T;
}

export async function apiSend<T>(
  url: string,
  method: "POST" | "PUT" | "PATCH" | "DELETE",
  body?: unknown
): Promise<T> {
  const response = await fetch(url, {
    method,
    headers: body === undefined ? undefined : { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const payload = await readBody(response);

  if (!response.ok) {
    const message =
      (typeof payload?.error === "string" && payload.error) ||
      `Request failed with status ${response.status}`;
    throw new ApiError(message, response.status);
  }

  return payload as T;
}
