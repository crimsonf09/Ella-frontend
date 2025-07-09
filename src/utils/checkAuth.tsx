import { getAccessToken } from './auth'; // adjust import path if needed

export async function checkLoginStatus() {
  try {
    const token = await getAccessToken();

    if (!token) {
      console.log('❌ No token found in local storage');
      return { loggedIn: false, user: null };
    }

    const res = await fetch('http://localhost:3000/api/profile', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) {
      console.log('❌ Not authenticated or token invalid');
      return { loggedIn: false, user: null };
    }

    const user = await res.json();
    return { loggedIn: true, user };

  } catch (err) {
    console.error('❌ Error checking login status:', err);
    return { loggedIn: false, user: null };
  }
}