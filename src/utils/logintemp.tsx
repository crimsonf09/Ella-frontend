// Login function: send email/password, cookie is set automatically
export async function loginTest() {
  try {
    const payload = {
      email: "test1@example.com",
      password: "mypassword123"
    };

    const response = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',   // IMPORTANT: allows cookies to be saved/used
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    const token = data.token;
    console.log('Login response:', data);

    if (response.ok) {
      // No need to save token manually if backend sets cookie
      console.log('Login successful, cookie should be stored by browser');
    } else {
      console.error('Login failed:', data.error);
    }

    return data;

  } catch (err) {
    console.error('Login error:', err);
    return null;
  }
}

// Protected API call example: cookie sent automatically
export async function fetchProfile() {
  try {
    const response = await fetch('http://localhost:3000/api/profile', {
      method: 'GET',
      credentials: 'include',   // IMPORTANT: sends cookie with request
    });
    console.log(response)
    if (!response.ok) {
      throw new Error('Not authenticated or session expired');
    }

    const profile = await response.json();
    console.log('User profile:', profile);
    return profile;

  } catch (err) {
    console.error('Fetch profile error:', err);
    return null;
  }
}
