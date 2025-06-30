let accessToken: string | null = null;
export function setAccessToken(token: string) {
    accessToken = token;
}
export function getAccessToken() {
    return accessToken;
}

export async function loginTest() {
    const payload = {
        email: 'test1@example.com',
        password: 'mypassword123',
    };

    const res = await fetch(`${process.env.API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'ella/application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
    });

    const data = await res.json();
    console.log(data);
    if (res.ok) {
        setAccessToken(data.token)
        console.log("ok")
    } else {
        console.log('fail again')
    }

}