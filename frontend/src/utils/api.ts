const DEFAULT_BASE =
  import.meta.env.VITE_API_BASE ||
  (import.meta.env.DEV ? "http://localhost:4000" : "https://baptist-church-onitiri.onrender.com");
const ADMIN_TOKEN = import.meta.env.VITE_ADMIN_TOKEN || "";
const AUTH_STORAGE_KEY = "bco_admin_auth_v1";

const getStoredAdminToken = (): string => {
  if (ADMIN_TOKEN) {
    return ADMIN_TOKEN;
  }
  if (typeof window === "undefined") {
    return "";
  }
  const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) {
    return "";
  }
  try {
    const parsed = JSON.parse(raw) as { token?: string };
    return parsed?.token || "";
  } catch {
    return "";
  }
};

const buildUrl = (path: string) => {
  if (!DEFAULT_BASE) {
    return path.startsWith("/") ? path : `/${path}`;
  }
  const base = DEFAULT_BASE.replace(/\/$/, "");
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return `${base}${suffix}`;
};

export type ApiEnvelope<T> = {
  ok: boolean;
  data: T;
  meta?: Record<string, unknown>;
  error?: string;
  details?: unknown;
};

type ApiRequestOptions = Omit<RequestInit, "body"> & { body?: unknown };

export const apiRequest = async <T>(
  path: string,
  options: ApiRequestOptions = {},
  config: { admin?: boolean } = {}
): Promise<ApiEnvelope<T>> => {
  const url = buildUrl(path);
  const headers = new Headers(options.headers || {});

  if (config.admin) {
    const token = getStoredAdminToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const isFormData = typeof FormData !== "undefined" && options.body instanceof FormData;
  if (!isFormData && options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const body = isFormData
    ? (options.body as FormData)
    : options.body
      ? JSON.stringify(options.body)
      : undefined;

  const response = await fetch(url, {
    ...options,
    headers,
    body,
    credentials: config.admin ? "include" : undefined
  });

  const data = (await response.json().catch(() => null)) as ApiEnvelope<T> | null;

  if (!response.ok || !data || data.ok === false) {
    const message = data?.error || `Request failed (${response.status})`;
    throw new Error(message);
  }

  return data;
};
