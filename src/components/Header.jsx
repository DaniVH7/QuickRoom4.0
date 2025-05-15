import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';
import { supabase } from '../lib/supabase'; // Asegúrate de que el archivo supabase.js esté configurado correctamente

const Header = () => {
  const [showModal, setShowModal] = useState(false); // Estado para controlar la visibilidad del modal
  const [isLogin, setIsLogin] = useState(true); // Estado para alternar entre login y registro
  const [formData, setFormData] = useState({ nombre: '', email: '', telefono: '', password: '', fecha_nacimiento: '' });
  const [user, setUser] = useState(null); // Estado para el usuario autenticado

  useEffect(() => {
    const session = supabase.auth.getSession();
    session.then((sessionData) => {
      setUser(sessionData.data.session?.user || null); // Establecer el usuario si está autenticado
    });

    // Suscribirse a cambios en el estado de autenticación
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null); // Actualizar estado cuando cambie el estado de sesión
    });

    // Limpieza de la suscripción cuando el componente se desmonte
    return () => {
      if (authListener?.unsubscribe) {
        authListener.unsubscribe(); // Limpiar la suscripción
      }
    };
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLogin) {
      // Login
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        alert('Error al iniciar sesión: ' + error.message);
      } else {
        alert('Inicio de sesión exitoso');
        setShowModal(false);
      }
    } else {
      // Registro
      const { user, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        alert('Error al registrarse: ' + error.message);
      } else {
        const { data, error: insertError } = await supabase
          .from('usuarios')
          .insert([
            {
              nombre: formData.nombre,
              correo: formData.email,
              telefono: formData.telefono,
              fecha_nacimiento: formData.fecha_nacimiento,
              estado: 'activo', // Estado predeterminado
            },
          ]);

        if (insertError) {
          alert('Error al guardar los datos en la base de datos: ' + insertError.message);
        } else {
          alert('Registro exitoso. Te hemos enviado un correo de confirmación.');
          setIsLogin(true); // Cambiar a login después del registro
        }
      }
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null); // Limpiar el estado del usuario después de cerrar sesión
  };

  return (
    <header className="bg-gradient-to-r from-[#9FD1E5] to-[#5C9FB9] shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <Link to="/" className="flex items-center text-white font-bold text-xl mb-3 sm:mb-0">
            <Home size={24} className="mr-2" />
            <span>QuickRoom</span>
          </Link>
          
          <div className="relative w-full sm:w-64 md:w-80">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search size={18} className="text-gray-500" />
            </div>
            <input
              type="search"
              className="bg-white w-full p-2 pl-10 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#5C9FB9]"
              placeholder="Buscar cuartos..."
            />
          </div>

          {/* Mostrar el botón de bienvenida o login según si hay un usuario autenticado */}
          {user ? (
            <div className="flex items-center">
              <span className="text-white mr-4">Bienvenido, {user.email.split('@')[0]}</span>
              <button
                onClick={handleLogout}
                className="text-white px-4 py-2 bg-[#5C9FB9] rounded hover:bg-[#4a8ca3]"
              >
                Cerrar sesión
              </button>
            </div>
          ) : (
            <button
              className="text-white mt-4 sm:mt-0 px-4 py-2 bg-[#5C9FB9] rounded hover:bg-[#4a8ca3]"
              onClick={() => setShowModal(true)}
            >
              {isLogin ? 'Iniciar sesión' : 'Registrarse'}
            </button>
          )}
        </div>
      </div>

      {/* Modal de login / registro */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">{isLogin ? 'Iniciar sesión' : 'Registrarse'}</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <input
                  type="text"
                  name="nombre"
                  placeholder="Tu nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              )}
              <input
                type="email"
                name="email"
                placeholder="Correo electrónico"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="tel"
                name="telefono"
                placeholder="Número de teléfono"
                value={formData.telefono}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
              {!isLogin && (
                <input
                  type="date"
                  name="fecha_nacimiento"
                  value={formData.fecha_nacimiento}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              )}
              <input
                type="password"
                name="password"
                placeholder="Contraseña"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
              <button
                type="submit"
                className="w-full p-2 bg-[#5C9FB9] text-white rounded hover:bg-[#4a8ca3]"
              >
                {isLogin ? 'Iniciar sesión' : 'Registrarse'}
              </button>
            </form>

            <div className="mt-4 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-[#5C9FB9] underline"
              >
                {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
              </button>
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              X
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
