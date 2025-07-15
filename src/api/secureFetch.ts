import { getAccessToken, getRefreshToken, refreshToken} from './auth';

export async function secureFetch(input: RequestInfo, init: RequestInit = {}) {
  // Get tokens
  let accessToken = await getAccessToken();

  // Build headers, preserving user's, but injecting access-token if present
  const originalHeaders = new Headers(init.headers || {});
  if (accessToken) originalHeaders.set('access-token', accessToken);
  if (!originalHeaders.has('Content-Type') && (!init.method || init.method === 'POST' || init.method === 'PUT' || init.method === 'PATCH')) {
    originalHeaders.set('Content-Type', 'application/json');
  }

  let response = await fetch(input, {
    ...init,
    headers: originalHeaders,
  });

  // If unauthorized, try refresh and retry ONCE
  if (response.status === 401 || response.status === 403) {
    const refreshed = await refreshToken();
    console.log('try refresh token')
    if (refreshed) {
      const newAccessToken = await getAccessToken();
      const retryHeaders = new Headers(init.headers || {});
      if (newAccessToken) retryHeaders.set('access-token', newAccessToken);
      if (!retryHeaders.has('Content-Type') && (!init.method || init.method === 'POST' || init.method === 'PUT' || init.method === 'PATCH')) {
        retryHeaders.set('Content-Type', 'application/json');
      }
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