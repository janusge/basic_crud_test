import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout, validateToken } from './service/auth';
import { getUsers, getUser, updateUser, deleteUser } from './service/user';

function Users() {
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedUserToEdit, setSelectedUserToEdit] = useState(null);
    const [selectedUserIdToDelete, setSelectedUserIdToDelete] = useState(null);

    useEffect(() => {
        const verifyToken = async () => {
            setLoading(true);

            try {
                await validateToken();

            } catch (error) {
                navigate('/');

            } finally {
                setLoading(false);
            }
        };

        const fetchUsers = async () => {
            setLoading(true);

            try {
                const users = await getUsers();

                setUsers(users);

            } catch (error) {
                console.error('Error fetching users:', error);

            } finally {
                setLoading(false);
            }
        };

        fetchUsers();

        verifyToken();

    }, [navigate]);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const handleShowUserDetails = async (user) => {
        setLoading(true);

        try {
            const data = await getUser(user.id);

            setSelectedUser(data);

        } catch (error) {
            console.error('Error fetching users:', error);

        } finally {
            setLoading(false);
        }
    };

    const handleShowUserToEdit = async (user) => {
        setLoading(true);

        try {
            const data = await getUser(user.id);

            setSelectedUserToEdit(data);

        } catch (error) {
            console.error('Error fetching users:', error);

        } finally {
            setLoading(false);
        }
    };

    const handleUpdateUser = async (user) => {
        setLoading(true);

        try {
            const data = await updateUser(user);
            
            setUsers(users.map(u => u.id === user.id ? data : u));

        } catch (error) {
            console.error('Error updating user:', error);

        } finally {
            setSelectedUserToEdit(null);
            setLoading(false);
        }
    };

    const handleDeleteUser = async (user_id) => {

        setLoading(true);

        try {
            await deleteUser(user_id);
            
            setSelectedUserIdToDelete(null);
            setUsers(users.filter(u => u.id !== user_id));

        } catch (error) {
            console.error('Error deleting user:', error);

        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <nav style={{ display: 'flex', gap: '1rem', padding: '1rem', backgroundColor: '#333333', color: 'white' }}>
                <a href="/users" style={{ color: 'white', textDecoration: 'none', cursor: 'pointer' }}>Users</a>
                <a href="/joke" style={{ color: 'white', textDecoration: 'none', cursor: 'pointer' }}>Joke</a>
            </nav>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', backgroundColor: '#f0f0f0', maxHeight:'200px', color:"#333333" }}>
                <h1>Users</h1>
                <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }} style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}>Logout</a>
            </div>
            
            <table style={{ flex: 1, width: '100%', borderCollapse: 'collapse', color:"#333333", backgroundColor: '#f0f0f0' }}>
                <thead>
                    <tr style={{ backgroundColor: '#e0e0e0', borderBottom: '2px solid #999' }}>
                        <th style={{ padding: '0.5rem', textAlign: 'left' }}>Name</th>
                        <th style={{ padding: '0.5rem', textAlign: 'center' }}>Action</th>
                    </tr>
                </thead>

                <tbody>
                    {users.map((user) => (
                        <tr key={user.id} style={{ borderBottom: '1px solid #ddd' }}>
                            <td style={{ padding: '0.5rem' }}>{user.name}</td>
                            <td style={{ padding: '0.5rem', textAlign: 'center' }}>
                                <button style={{ cursor: 'pointer', padding: '0.25rem 0.5rem' }} onClick={() => handleShowUserDetails(user)}>Ver</button>
                                <button style={{ cursor: 'pointer', padding: '0.25rem 0.5rem', marginLeft: '0.5rem' }} onClick={() => handleShowUserToEdit(user)}>Editar</button>
                                <button type="button" onClick={() => {
                                    setSelectedUserIdToDelete(user.id);
                                }} style={{ cursor: 'pointer', padding: '0.5rem 1rem', marginLeft: '0.5rem', backgroundColor: '#ff4444', color: 'white', border: 'none', borderRadius: '0.25rem' }}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {selectedUser && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '0.5rem', maxWidth: '400px', color: "#333333" }}>
                        <h2>{selectedUser.name}</h2>
                        <p><strong>Email:</strong> {selectedUser.email}</p>
                        <button onClick={() => setSelectedUser(null)}>Cerrar</button>
                    </div>
                </div>
            )}
            
            {selectedUserToEdit && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '0.5rem', maxWidth: '400px', color: "#333333" }}>
                        <h2>Editar Usuario</h2>

                        <form onSubmit={(e) => { e.preventDefault(); handleUpdateUser(selectedUserToEdit);}}>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Nombre:</label>
                                <input type="text" value={selectedUserToEdit.name} onChange={(e) => setSelectedUserToEdit({ ...selectedUserToEdit, name: e.target.value })} style={{ width: '100%', padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #ccc' }} />
                            </div>
                            
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Email:</label>
                                <input type="email" value={selectedUserToEdit.email} onChange={(e) => setSelectedUserToEdit({ ...selectedUserToEdit, email: e.target.value })} style={{ width: '100%', padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #ccc' }} />
                            </div>

                            <button type="submit" style={{ cursor: 'pointer', padding: '0.5rem 1rem', marginRight: '0.5rem' }}>Guardar</button>
                            <button type="button" onClick={() => setSelectedUserToEdit(null)} style={{ cursor: 'pointer', padding: '0.5rem 1rem' }}>Cerrar</button>
                        </form>
                    </div>
                </div>
            )}

            {selectedUserIdToDelete && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '0.5rem', maxWidth: '400px', color: "#333333" }}>
                        <h2>Confirmar eliminación</h2>
                        <p>¿Está seguro que desea eliminar este usuario?</p>
                        <button onClick={() => handleDeleteUser(selectedUserIdToDelete)} style={{ cursor: 'pointer', padding: '0.5rem 1rem', marginRight: '0.5rem', backgroundColor: '#ff4444', color: 'white', border: 'none', borderRadius: '0.25rem' }}>Eliminar</button>
                        <button type="button" onClick={() => setSelectedUserIdToDelete(null)} style={{ cursor: 'pointer', padding: '0.5rem 1rem' }}>Cancelar</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Users;