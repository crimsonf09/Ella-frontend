export async function checkLoginStatus() {
    try {
        const result = await chrome.storage.local.get('EllaToken');
        const token = result.EllaToken; 
        const res = await fetch('api/users/profile', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        if (!res.ok) {
            console.log('not authenticated');
            return {loggedIn: false,user:null}
        }
        const user = await res.json();
        return { loggedIn: true, user }

    } catch (err) {
        return { loggedIn: false, user: null };
    }
}