import { getAccessToken, getRefreshToken, refreshToken } from './auth';

export async function secureFetch(input: RequestInfo, init: RequestInit = {}) {
  // ✅ Get stored tokens from chrome.storage.local
  let accessToken = await getAccessToken();
  let refreshTokenVal = await getRefreshToken();

  // ✅ Build headers
  const headers = {
    ...(init.headers || {}),
    'access-token': accessToken ?? '',
    'Content-Type': 'application/json',
  };

  let response = await fetch(input, {
    ...init,
    headers,
  });

  // 🔁 Retry once if access token is expired
  if (response.status === 401 || response.status === 403) {
    const refreshed =  await refreshToken(); // this should store a new accessToken

    if (refreshed) {
      const newAccessToken = await getAccessToken();

      const retryHeaders = {
        ...(init.headers || {}),
        'access-token': newAccessToken ?? '',
        'Content-Type': 'application/json',
      };

      response = await fetch(input, {
        ...init,
        headers: retryHeaders,
      });

      console.log('🔁 Token refreshed and request retried');
    } else {
      console.warn('❌ Token refresh failed');
    }
  }

  return response;
}
