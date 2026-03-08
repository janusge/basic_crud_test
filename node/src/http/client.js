async function validateToken() {
    const token = localStorage.getItem('token');
    console.log('Verifying token:', token);
    try {
        const response = await fetch(`http://127.0.0.1/users/verify-token/${token}`);
        if (!response.ok) {
            throw new Error('Token verification failed');
        }
    } catch (error) {
        localStorage.removeItem('token');
        throw new Error('Not authorized. Please log in again.');
    }
};

async function logout() {
    localStorage.removeItem('token');
}

export { validateToken, logout };