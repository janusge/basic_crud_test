const host = 'http://web:8000';

async function getJoke() {
    const token = localStorage.getItem('token');
    const response = await fetch(`${host}/external/joke`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })

    if (response.ok) {
        return await response.json();
    }
    
    throw new Error('Failed to fetch joke');
}

export { getJoke };