import { getAccessToken } from "../api/auth";
import { secureFetch } from "../api/secureFetch";
import type { StatusType } from "./StatusContext";

export async function checkLoginStatus(setStatus: (s: StatusType) => void) {
  function timeoutPromise<T>(promise: Promise<T>, ms: number): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error("timeout")), ms);
      promise
        .then((value) => {
          clearTimeout(timer);
          resolve(value);
        })
        .catch((err) => {
          clearTimeout(timer);
          reject(err);
        });
    });
  }

  try {
    const token = getAccessToken();
    console.log(token);
    if (!token) {
      console.log('❌ No token found in local storage');
      setStatus('warning');
      return { loggedIn: false, user: null };
    }

    let res: Response;
    try {
      // res = await timeoutPromise(
      //   fetch('http://localhost:3000/api/profile', {
      //     method: 'GET',
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //       'Content-Type': 'application/json'
      //     }
      //   }),
      //   3000
      // );
      
      res = await secureFetch(`${ import.meta.env.VITE_API_URL}/profile`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            },
          });
    } catch (err) {
      // This handles fetch timeout or network error
      console.error('❌ Error or timeout during profile fetch:', err);
      setStatus('error');
      return { loggedIn: false, user: null };
    }

    if (!res.ok) {
      console.log('❌ Not authenticated or token invalid');
      setStatus('warning');
      return { loggedIn: false, user: null };
    }

    const user = await res.json();
    setStatus('Rewrite & Correct Mode');
    return { loggedIn: true, user };

  } catch (err) {
    console.error('❌ Error checking login status:', err);
    setStatus('error');
    return { loggedIn: false, user: null };
  }
}