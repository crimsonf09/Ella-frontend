const API_BASE = 'http://127.0.0.1:3000/api';

export async function setAccessToken(token: string | null) {
    await chrome.storage.local.set({ accessToken: token });
}

export async function getAccessToken(): Promise<string | null> {
    return new Promise(resolve => {
        chrome.storage.local.get('accessToken', result => {
            resolve(result.accessToken ?? null);
        });
    });
}

export async function setRefreshToken(token: string | null) {
    await chrome.storage.local.set({ refreshToken: token });
}

export async function getRefreshToken(): Promise<string | null> {
    return new Promise(resolve => {
        chrome.storage.local.get('refreshToken', result => {
            resolve(result.refreshToken ?? null);
        });
    });
}

// --- REGISTER FUNCTION ---
export async function register(
    email: string,
    firstname: string,
    middlename: string,
    lastname: string,
    nickname: string,
    department: string,
    password: string
) {
    const res = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email,
            firstname,
            middlename,
            lastname,
            nickname,
            department,
            password,
        }),
    });

    if (!res.ok) {
        const err = await res.text();
        throw new Error(err || 'Registration failed');
    }
    return await res.json();
}

export async function login(email: string, password: string) {
    console.log(email)
    const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    const accessToken = res.headers.get('access-token');
    const refreshToken = res.headers.get('refresh-token');
    console.log("loggggg")
    if (res.ok && accessToken && refreshToken) {
        await setAccessToken(accessToken);
        await setRefreshToken(refreshToken);
        return true;
    } else {
        let errorMsg = 'Login failed';
        try {
            const data = await res.json();
            if (data && data.error) errorMsg = data.error;
        } catch (e) {
            const text = await res.text();
            if (text) errorMsg = text;
        }
        throw new Error(errorMsg);
    }
}

export async function refreshToken() {
    const refreshToken = await getRefreshToken();
    if (!refreshToken) {
        console.warn('No refresh token stored');
        return false;
    }
    const res = await fetch(`${API_BASE}/refresh`, {
        method: 'POST',
        headers: {
            'refresh-token': refreshToken,
        },
    });

    if (res.ok) {
        const accessToken = res.headers.get('access-token');
        await setAccessToken(accessToken);
        return true;
    } else {
        console.warn('Token refresh failed');
        return false;
    }
}

export async function logout() {
    const accessToken = await getAccessToken();
    const refreshToken = await getRefreshToken();

    await fetch(`${API_BASE}/logout`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken ?? ''}`,
            'refresh-token': refreshToken ?? '',
        },
    });

    await setAccessToken(null);
    await setRefreshToken(null);
    console.log('Logged out');
}
export async function checkLoginStatus() {
  const refreshed = await refreshToken();
  return !!refreshed;
}