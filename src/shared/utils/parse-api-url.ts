import { BASE_URL } from '../api/api-request.ts';

export const parseApiUrl = (
  params: unknown,
  url: string,
  slug?: string | undefined,
) => {
  if (!url) return '';
  const apiUrl = new URL(`${BASE_URL}${url}${slug ? `/${slug}` : ''}`);
  if (!params) return apiUrl.toString();
  const searchParams = new URLSearchParams();
  for (const key of Object.keys(params || {})) {
    if (params?.[key as keyof BodyInit]) {
      searchParams.append(key, params?.[key as keyof BodyInit]);
    }
  }
  apiUrl.search = searchParams.toString();
  return decodeURIComponent(apiUrl.toString());
};
