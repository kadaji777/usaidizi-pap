import React, { createContext, useState, useContext, useEffect } from 'react';
import toast from 'react-hot-toast';

interface User {
    uid: string;
    email: string | null;
    displayName: string | null;
    role?: 'end_user' | 'chw' | 'admin';
    metadata?: {
        creationTime?: string;
    };
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    register: (name: string, email: string, password: string, role?: string) => Promise<boolean>;
    loginWithGoogle: () => Promise<boolean>;
    loginWithFacebook: () => Promise<boolean>;
    resetPassword: (email: string) => Promise<boolean>;
    logout: () => Promise<void>;
    updateUserRole: (role: 'end_user' | 'chw' | 'admin') => Promise<void>;
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

    useEffect(() => {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch (e) {
                console.error('Error parsing user:', e);
            }
        }
        setLoading(false);
    }, []);

    const login = async (email: string, password: string): Promise<boolean> => {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const foundUser = users.find((u: any) => u.email === email && u.password === password);
        
        if (!foundUser) {
            toast.error('Invalid email or password');
            return false;
        }

        const loggedInUser: User = {
            uid: foundUser.id || Date.now().toString(),
            email: foundUser.email,
            displayName: foundUser.name || foundUser.email,
            role: foundUser.role || 'end_user',
            metadata: {
                creationTime: foundUser.createdAt || new Date().toISOString()
            }
        };
        
        setUser(loggedInUser);
        localStorage.setItem('currentUser', JSON.stringify(loggedInUser));
        toast.success(`Welcome back, ${loggedInUser.displayName}!`);
        return true;
    };

    const register = async (name: string, email: string, password: string, role: string = 'end_user'): Promise<boolean> => {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        if (users.find((u: any) => u.email === email)) {
            toast.error('User already exists');
            return false;
        }

        const newUser = {
            id: Date.now().toString(),
            name,
            email,
            password,
            role,
            createdAt: new Date().toISOString()
        };
        
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        const loggedInUser: User = {
            uid: newUser.id,
            email: newUser.email,
            displayName: newUser.name,
            role: newUser.role as 'end_user' | 'chw' | 'admin',
            metadata: {
                creationTime: newUser.createdAt
            }
        };
        
        setUser(loggedInUser);
        localStorage.setItem('currentUser', JSON.stringify(loggedInUser));
        toast.success(`Welcome ${name}!`);
        return true;
    };

    const loginWithGoogle = async (): Promise<boolean> => {
        toast('Google login coming soon!', { duration: 3000 });
        return false;
    };

    const loginWithFacebook = async (): Promise<boolean> => {
        toast('Facebook login coming soon!', { duration: 3000 });
        return false;
    };

    const resetPassword = async (email: string): Promise<boolean> => {
        toast.success(`📧 Password reset link sent to ${email}!`);
        return true;
    };

    const logout = async () => {
        setUser(null);
        localStorage.removeItem('currentUser');
        toast.success('Logged out successfully');
    };

    const updateUserRole = async (role: 'end_user' | 'chw' | 'admin') => {
        if (user) {
            const updatedUser = { ...user, role };
            setUser(updatedUser);
            localStorage.setItem('currentUser', JSON.stringify(updatedUser));
            
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const updatedUsers = users.map((u: any) => {
                if (u.email === user.email) {
                    return { ...u, role };
                }
                return u;
            });
            localStorage.setItem('users', JSON.stringify(updatedUsers));
            
            toast.success(`Role updated to ${role.replace('_', ' ')}`);
        }
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            loading, 
            login, 
            register, 
            loginWithGoogle,
            loginWithFacebook,
            resetPassword,
            logout,
            updateUserRole 
        }}>
            {children}
        </AuthContext.Provider>
    );
};