import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = async (session) => {
        console.log('Fetching profile for session:', session?.user?.id);
        if (!session?.user) {
            console.log('No user in session, setting user to null');
            setUser(null);
            setLoading(false);
            return;
        }

        try {
            const { data: profile, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();

            if (error) {
                console.warn('Profile fetch error (expected for new users):', error);
            }

            let finalUser = { ...session.user };
            if (profile) {
                finalUser = { ...finalUser, ...profile };
                console.log('Profile merged successfully');
            } else {
                console.log('No profile found, using defaults');
                finalUser.username = session.user.email.split('@')[0];
                finalUser.avatar = '🦸';
            }

            setUser(finalUser);
        } catch (err) {
            console.error('Unexpected error fetching profile:', err);
            setUser(session.user);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // 1. Check active session on mount
        supabase.auth.getSession().then(({ data: { session } }) => {
            fetchProfile(session);
        });

        // 2. Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            console.log('Auth state change event:', _event);
            fetchProfile(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    const login = (email, password) => {
        console.log('AuthContext: Logging in...', email);
        return supabase.auth.signInWithPassword({ email, password });
    };

    const register = (email, password, metadata) => {
        console.log('AuthContext: Registering...', email);
        return supabase.auth.signUp({
            email,
            password,
            options: { data: metadata }
        });
    };

    const logout = () => {
        console.log('AuthContext: Logging out');
        return supabase.auth.signOut();
    };

    const refreshProfile = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
            await fetchProfile(session);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading, refreshProfile }}>
            {children}
        </AuthContext.Provider>
    );
};
