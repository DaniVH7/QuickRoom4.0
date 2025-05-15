import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../lib/supabase';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Error fetching user:', error);
      } else {
        setUser(data);
      }
    };

    // Llamada inicial para cargar el usuario
    fetchUser();

    // Listener para cambios de autenticación
    const { data: authListener, error: authError } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    // Comprobar si el listener se configuró correctamente
    if (authError) {
      console.error('Error al configurar el listener:', authError);
    }

    // Limpiar el listener cuando el componente se desmonte
    return () => {
      // Verificar si el listener tiene el método unsubscribe
      if (authListener?.unsubscribe) {
        authListener.unsubscribe();
      }
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para acceder al contexto de autenticación
export const useAuth = () => {
  return useContext(AuthContext);
};
