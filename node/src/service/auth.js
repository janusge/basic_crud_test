const host = 'http://web:8000';

async function login(email, password) {
    const data = await get_token(email, password);

    localStorage.setItem('token', data.access_token);
};

async function get_token(email, password) {
    try {
        const body = JSON.stringify({ email, password });
        const response = await fetch(`${host}/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: body,
        });

        if (response.ok) {
            return await response.json();    
        }
        
        if (response.status === 401) {
            throw new Error('Invalid email or password.');
        }

        throw new Error(error.message || 'Service unavailable. Please try again later.');
    } catch (error) {
        throw new Error(error.message || 'Service unavailable. Please try again later.');
    }
}

async function logout() {
    localStorage.removeItem('token');
};

async function validateToken() {
    const token = localStorage.getItem('token');
    
    try {
        const response = await fetch(`${host}/users/verify-token/${token}`);
        if (!response.ok) {
            throw new Error('Token verification failed');
        }
    } catch (error) {
        localStorage.removeItem('token');
        throw new Error('Not authorized. Please log in again.');
    }
};

export { login, logout, validateToken };