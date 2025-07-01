import { getAccessToken, refreshToken } from './auth';

export async function secureFetch(input: RequestInfo, init: RequestInit = {}) {
  // ✅ Get token from chrome.storage.local
  let token = await getAccessToken();

  // ✅ Build headers with token
  const headers = {
    ...(init.headers || {}),
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  let response = await fetch(input, {
    ...init,
    headers,
    // ❌ No cookies used
  });

  // 🔁 Retry once if access token is expired
  if (response.status === 401 || response.status === 403) {
    const refreshed = await refreshToken(); // This will store new accessToken

    if (refreshed) {
      const retryToken = await getAccessToken();
      const retryHeaders = {
        ...(init.headers || {}),
        Authorization: `Bearer ${retryToken}`,
        'Content-Type': 'application/json',
      };

      response = await fetch(input, {
        ...init,
        headers: retryHeaders,
      });
      console.log('refreshdone')
    }
  }

  return response;
}
