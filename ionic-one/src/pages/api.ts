// src/lib/api.ts
import { Capacitor } from "@capacitor/core";
import { Preferences } from "@capacitor/preferences";

/** ---------- Config ---------- **/
const platform = Capacitor.getPlatform(); // "ios" | "android" | "web"
export const BASE_URL =
  platform === "ios" || platform === "android"
    ? "http://192.168.1.78:4000"
    : "http://localhost:4000";

/** ---------- Storage (Capacitor Preferences) ---------- **/
export const storage = {
  async getItem(key: string): Promise<string | null> {
    const { value } = await Preferences.get({ key });
    return value ?? null;
  },
  async setItem(key: string, value: string): Promise<void> {
    await Preferences.set({ key, value });
  },
  async removeItem(key: string): Promise<void> {
    await Preferences.remove({ key });
  },
};

/** ---------- Helpers ---------- **/
async function authHeader(): Promise<Record<string, string>> {
  const token = await storage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function buildUrl(
  path: string,
  params?: Record<string, string | number | boolean | undefined>
): string {
  const url = new URL(path, BASE_URL);
  if (params && Object.keys(params).length > 0) {
    const qs = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null) qs.append(k, String(v));
    }
    url.search = qs.toString();
  }
  return url.toString();
}

/** ---------- API Core ---------- **/
export async function apiPost<T = any>(
  path: string,
  body?: unknown
): Promise<T> {
  const url = buildUrl(path);
  console.log("Making POST request to:", url);
  console.log("Request body:", body);

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(await authHeader()),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  console.log("Response status:", res.status);

  const txt = await res.text();
  console.log("Response text:", txt);

  let data: any;
  try {
    data = txt ? JSON.parse(txt) : {};
  } catch (err) {
    console.error("JSON parse error:", err);
    data = { message: txt };
  }

  if (!res.ok) {
    const msg = data?.message ?? data?.error ?? `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return data as T;
}

export async function apiGet<T = any>(
  path: string,
  params: Record<string, string | number | boolean | undefined> = {}
): Promise<T> {
  const url = buildUrl(path, params);
  console.log("Making GET request to:", url);

  const res = await fetch(url, {
    method: "GET",
    headers: {
      ...(await authHeader()),
    },
  });

  if (!res.ok) {
    const msg = `HTTP ${res.status}`;
    throw new Error(msg);
  }

  return (await res.json()) as T;
}

/** ---------- Domain-Specific Helpers ---------- **/
export async function getVehicles<T = any>(
  params: Record<string, string | number | boolean | undefined> = {}
): Promise<T> {
  return apiGet<T>("/vehicles", params);
}

export async function getVehicle<T = any>(id: string | number): Promise<T> {
  return apiGet<T>(`/vehicles/${id}`);
}

// Login helper function
export async function loginUser(email: string, password: string) {
  return apiPost<{
    accessToken: string;
    user: { id: string; email: string; [key: string]: any };
  }>("/login", { email, password });
}

// Signup helper function
export async function signupUser(email: string, password: string) {
  return apiPost<{
    accessToken: string;
    user: { id: string; email: string; [key: string]: any };
  }>("/register", { email, password });
}

// api.ts (add this next to your other helpers)
export async function getUser<T = any>(id: string | number): Promise<T> {
  return apiGet<T>(`/users/${id}`);
}

// Get vehicles filtered by type and location
export async function getVehiclesByTypeAndLocation<T = any>(
  type?: string,
  location?: string,
  extraParams: Record<string, string | number | boolean | undefined> = {}
): Promise<T> {
  // For json-server, exact match works as /vehicles?type=Car&location=Colombo
  // If you need partial, use _like (uncomment below lines and comment the exact keys)
  return apiGet<T>("/vehicles", {
    type: type || undefined,
    location: location || undefined,
    ...extraParams,
  });

  // Partial match variant (json-server):
  // return apiGet<T>("/vehicles", {
  //   type_like: type || undefined,
  //   location_like: location || undefined,
  //   ...extraParams,
  // });
}
