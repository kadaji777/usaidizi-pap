import React, { createContext, useState, useContext, useEffect } from 'react';
import localforage from 'localforage';
import toast from 'react-hot-toast';

interface User {
    id: string;
    email: string;
    name: string;
    createdAt: Date;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    register: (name: string, email: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => { checkLoggedInUser(); }, []);

    const checkLoggedInUser = async () => {
        const savedUser = await localforage.getItem<User>('currentUser');
        if (savedUser) setUser(savedUser);
        setLoading(false);
    };

    const login = async (email: string, password: string): Promise<boolean> => {
        const users = await localforage.getItem<any[]>('users') || [];
        const foundUser = users.find(u => u.email === email);
        if (!foundUser) { toast.error('User not found'); return false; }
        if (foundUser.password !== password) { toast.error('Invalid password'); return false; }
        const { password: _, ...userWithoutPassword } = foundUser;
        await localforage.setItem('currentUser', userWithoutPassword);
        setUser(userWithoutPassword);
        toast.success(`Welcome back, ${userWithoutPassword.name}!`);
        return true;
    };

    const register = async (name: string, email: string, password: string): Promise<boolean> => {
        const users = await localforage.getItem<any[]>('users') || [];
        if (users.find(u => u.email === email)) { toast.error('User already exists'); return false; }
        const newUser = { id: Date.now().toString(), name, email, password, createdAt: new Date() };
        users.push(newUser);
        await localforage.setItem('users', users);
        const { password: _, ...userWithoutPassword } = newUser;
        await localforage.setItem('currentUser', userWithoutPassword);
        setUser(userWithoutPassword);
        toast.success('Registration successful!');
        return true;
    };

    const logout = async () => {
        await localforage.removeItem('currentUser');
        setUser(null);
        toast.success('Logged out successfully');
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};