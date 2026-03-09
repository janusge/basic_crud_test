const host = 'http://127.0.0.1';

async function getUsers() {
    const token = localStorage.getItem('token');
    const response = await fetch(`${host}/users`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })

    if (response.ok) {
        return await response.json();
    }
    
    throw new Error('Failed to fetch users');
}

async function getUser(user_id) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${host}/users/${user_id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })

    if (response.ok) {
        return await response.json();
    }
    
    throw new Error('Failed to fetch users');
}

async function updateUser(user) {
    const token = localStorage.getItem('token');
    const body = JSON.stringify({ name: user.name, email: user.email });

    const response = await fetch(`${host}/users/${user.id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: body,
        })

    if (response.ok) {
        return await response.json();
    }
    
    throw new Error('Failed to update user');
}

async function deleteUser(user_id) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${host}/users/${user_id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
    
    if (response.status === 204) {
        return;
    }
    
    throw new Error('Failed to delete user');
}

export { getUsers, getUser, updateUser, deleteUser };