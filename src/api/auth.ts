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

export async function loginTest() {
    const email = 'test1@example.com';
    const password = 'mypassword123';

    console.log('loginsss');
    console.log(`${API_BASE}/login`);

    const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    console.log(data);

    const accessToken = res.headers.get('access-token');
    const refreshToken = res.headers.get('refresh-token');

    if (res.ok && accessToken && refreshToken) {
        await setAccessToken(accessToken);
        await setRefreshToken(refreshToken);
        console.log('ok');
        console.log('AccessToken:', accessToken);
        console.log('RefreshToken:', refreshToken);
    } else {
        console.log('fail again');
    }
}

export async function refreshToken() {
    console.log('re1');

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

    console.log('refresh');

    if (res.ok) {
        const data = await res.json();
        await setAccessToken(data.accessToken);
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