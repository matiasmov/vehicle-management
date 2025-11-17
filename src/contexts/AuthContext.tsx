import { User } from '@supabase/supabase-js';
import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from '../lib/supabase';

interface AuthContextProps {
  user: User | null;
  setAuth: (authUser: User | null) => void;
}

const AuthContext = createContext({} as AuthContextProps);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  function setAuth(authUser: User | null) {
    setUser(authUser);
  }


  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
