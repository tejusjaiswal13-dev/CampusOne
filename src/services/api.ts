export const demoEnabled = import.meta.env.VITE_DEMO_MODE === "true";
const base = (
  import.meta.env.VITE_API_URL || "http://localhost:3001/api"
).replace(/\/$/, "");
let token = sessionStorage.getItem("campus-api-token");
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}
export const setToken = (value: string | null) => {
  token = value;
  if (value) sessionStorage.setItem("campus-api-token", value);
  else sessionStorage.removeItem("campus-api-token");
};
export const hasToken = () => !!token;
export async function api<T>(
  path: string,
  method = "GET",
  body?: unknown,
): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${base}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: AbortSignal.timeout(12000),
    });
  } catch {
    throw new ApiError(0, "Server unreachable. Check your connection.");
  }
  if (response.status === 204) return undefined as T;
  const data = await response
    .json()
    .catch(() => ({ error: "Invalid server response" }));
  if (!response.ok) {
    if (response.status === 401) {
      setToken(null);
      window.dispatchEvent(new Event("campus-session-expired"));
    }
    throw new ApiError(response.status, data.error || "Request failed");
  }
  return data as T;
}
