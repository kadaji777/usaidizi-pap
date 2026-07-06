import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

interface User {
    id: string;
    name: string;
    email: string;
    role: 'end_user' | 'chw' | 'admin';
    createdAt: Date;
}

const UsersPage: React.FC = () => {
    const { user } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'end_user' as 'end_user' | 'chw' | 'admin',
        password: ''
    });

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        setLoading(true);
        try {
            const storedUsers = localStorage.getItem('users');
            if (storedUsers) {
                setUsers(JSON.parse(storedUsers));
            } else {
  // Find this code block around line 40:
const demoUsers: User[] = [
    { id: '1', name: 'Admin User', email: 'admin@example.com', role: 'admin', createdAt: new Date() },
    { id: '2', name: 'CHW User', email: 'chw@example.com', role: 'chw', createdAt: new Date() },
    { id: '3', name: 'End User', email: 'demo@example.com', role: 'end_user', createdAt: new Date() },
];
setUsers(demoUsers);
                localStorage.setItem('users', JSON.stringify(demoUsers));
            }
        } catch (error) {
            console.error('Error loading users:', error);
        }
        setLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const updatedUsers = [...users];
        if (editingUser) {
            const index = updatedUsers.findIndex(u => u.id === editingUser.id);
            if (index !== -1) {
                updatedUsers[index] = { ...updatedUsers[index], name: formData.name, email: formData.email, role: formData.role };
            }
            toast.success('User updated!');
        } else {
            const newUser = { id: Date.now().toString(), name: formData.name, email: formData.email, role: formData.role, createdAt: new Date() };
            updatedUsers.push(newUser);
            const authUsers = JSON.parse(localStorage.getItem('users') || '[]');
            authUsers.push({ ...newUser, password: formData.password || 'password123' });
            localStorage.setItem('users', JSON.stringify(authUsers));
            toast.success('User created!');
        }
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        setUsers(updatedUsers);
        setShowModal(false);
        setEditingUser(null);
        setFormData({ name: '', email: '', role: 'end_user', password: '' });
    };

    const handleDelete = (userId: string) => {
        if (window.confirm('Delete this user?')) {
            const updatedUsers = users.filter(u => u.id !== userId);
            setUsers(updatedUsers);
            localStorage.setItem('users', JSON.stringify(updatedUsers));
            toast.success('User deleted!');
        }
    };

    const handleEdit = (user: User) => {
        setEditingUser(user);
        setFormData({ name: user.name, email: user.email, role: user.role, password: '' });
        setShowModal(true);
    };

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getRoleBadge = (role: string) => {
        switch(role) {
            case 'admin': return <span className="badge bg-danger">Admin</span>;
            case 'chw': return <span className="badge bg-warning text-dark">CHW</span>;
            default: return <span className="badge bg-secondary">End User</span>;
        }
    };

    if (loading) return <div className="text-center py-5"><div className="spinner-border text-danger"></div></div>;

    return (
        <div className="container py-3" style={{ maxWidth: '480px', margin: '0 auto' }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold mb-0"><i className="bi bi-people me-2 text-primary"></i>User Management</h5>
                <button className="btn btn-danger btn-sm rounded-pill" onClick={() => { setEditingUser(null); setFormData({ name: '', email: '', role: 'end_user', password: '' }); setShowModal(true); }}>
                    <i className="bi bi-plus-lg me-1"></i>Add User
                </button>
            </div>

            <div className="input-group mb-3">
                <span className="input-group-text bg-white border-end-0"><i className="bi bi-search"></i></span>
                <input type="text" className="form-control border-start-0" placeholder="Search users..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>

            {filteredUsers.length === 0 ? (
                <div className="text-center py-5"><i className="bi bi-people fs-1 text-muted"></i><p className="text-muted mt-2">No users found</p></div>
            ) : (
                <div className="list-group">
                    {filteredUsers.map(u => (
                        <div key={u.id} className="list-group-item border-0 shadow-sm mb-2 rounded-3">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <div className="d-flex align-items-center gap-2"><strong>{u.name}</strong>{getRoleBadge(u.role)}</div>
                                    <small className="text-muted">{u.email}</small>
                                    <div><small className="text-muted" style={{ fontSize: '10px' }}>Joined: {new Date(u.createdAt).toLocaleDateString()}</small></div>
                                </div>
                                <div>
                                    <button className="btn btn-sm btn-outline-primary me-1" onClick={() => handleEdit(u)}><i className="bi bi-pencil"></i></button>
                                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(u.id)} disabled={u.id === user?.uid}><i className="bi bi-trash"></i></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header bg-danger text-white">
                                <h6 className="modal-title">{editingUser ? 'Edit User' : 'Add New User'}</h6>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">
                                    <div className="mb-3"><label className="form-label small fw-bold">Full Name</label><input type="text" className="form-control" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} /></div>
                                    <div className="mb-3"><label className="form-label small fw-bold">Email</label><input type="email" className="form-control" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} /></div>
                                    <div className="mb-3"><label className="form-label small fw-bold">Role</label>
                                        <select className="form-select" value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value as any})}>
                                            <option value="end_user">End User (First Aid Responder)</option>
                                            <option value="chw">Community Health Worker</option>
                                            <option value="admin">Administrator</option>
                                        </select>
                                    </div>
                                    {!editingUser && (
                                        <div className="mb-3"><label className="form-label small fw-bold">Default Password</label>
                                        <input type="text" className="form-control" value={formData.password || 'password123'} onChange={(e) => setFormData({...formData, password: e.target.value})} />
                                        <small className="text-muted">User can change this after first login</small></div>
                                    )}
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-danger">{editingUser ? 'Update' : 'Create'} User</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UsersPage;