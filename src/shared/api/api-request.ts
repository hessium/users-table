import { getCookie } from "../utils/cookier.ts";
import { COOKIES } from "../constants/cookies.ts";
import { parseApiUrl } from "../utils/parse-api-url.ts";
import { LINKS } from "../constants/links.ts";
import { toaster } from "../ui/sonner/sonner.tsx";

export interface ApiRequestProps extends Omit<RequestInit, "body"> {
  url: string;
  data?: unknown;
  params?: Record<string, never>;
  slug?: string;
}

export const BASE_URL = "https://reqres.in/api";
export const API_TOKEN = "reqres-free-v1";

export const apiRequest = async ({
  url,
  params,
  headers,
  data,
  slug,
  ...options
}: ApiRequestProps) => {
  try {
    let authToken: string | null;
    authToken = getCookie(COOKIES.authToken);

    const fullUrl = parseApiUrl(params, url, slug);

    const isFormData = data instanceof FormData;

    const body = isFormData ? data : JSON.stringify(data);

    const response = await fetch(fullUrl, {
      headers: {
        ...(authToken && {
          Authorization: `Bearer ${authToken}`,
        }),
        ...(API_TOKEN && { "X-API-KEY": API_TOKEN }),
        ...(!isFormData && { "Content-Type": "application/json" }),
        ...headers,
      },
      ...((data && { body }) as Record<string, unknown>),
      ...options,
    });

    if (response.status === 204) return { status: 204 };

    const resJson = await response.json();

    if (resJson.status === 403) {
      window.location.replace(LINKS.notAccess);

      return;
    }

    if (resJson.status === 401) {
      return;
    }

    if (import.meta.env.DEV && !response.ok && response.status !== 406) {
      const errorText = resJson.data ? String(resJson.data) : "";
      const errorMessage = `Ошибка HTTP: ${response.status} ${errorText}`;

      toaster(errorMessage + "::" + errorText, "error", { duration: 6000 });
    }

    if (!response.ok && response.status !== 405) {
      const errorText = resJson.data ? String(resJson.data) : "";
      const errorMessage = `Ошибка HTTP: ${response.status} ${errorText}`;

      toaster(errorMessage + "::" + errorText, "error", { duration: 6000 });
    }

    return resJson;
  } catch (error) {
    toaster("Произошла ошибка запроса к API сервера", "error", {
      duration: 6000,
    });
  }
};
