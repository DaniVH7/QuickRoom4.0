import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import RoomCard from '../components/RoomCard';
import RoomFilters from '../components/RoomFilters';
import { Loader } from 'lucide-react';

function HomePage() {
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [errorRooms, setErrorRooms] = useState('');

  const [solicitudes, setSolicitudes] = useState([]);
  const [loadingSolicitudes, setLoadingSolicitudes] = useState(false);
  const [user, setUser] = useState(null);
  const [idUsuarioBD, setIdUsuarioBD] = useState(null);

  useEffect(() => {
    // Obtener usuario autenticado y solicitudes con info de administrador
    const fetchUserAndSolicitudes = async () => {
      try {
        setLoadingSolicitudes(true);
        const { data: authData, error: authError } = await supabase.auth.getUser();
        if (authError) {
          console.error('Error fetching auth user:', authError);
          return;
        }
        const usuario = authData.user;
        setUser(usuario);

        if (!usuario?.email) return;

        // Buscar el ID del usuario en tabla usuarios
        const { data: usuarioData, error: usuarioError } = await supabase
          .from('usuarios')
          .select('id_usuario')
          .eq('correo', usuario.email)
          .single();

        if (usuarioError) {
          console.error('Error buscando usuario en tabla usuarios:', usuarioError);
          return;
        }

        setIdUsuarioBD(usuarioData.id_usuario);

        // Obtener solicitudes con datos de administrador relacionado
        const { data: solicitudesData, error: solicitudesError } = await supabase
          .from('solicitudes_renta')
          .select(`
            *,
            administrador: id_administrador (
              id_administrador,
              nombre,
              apellidop,
              apellidom,
              telefono,
              correo
            )
          `)
          .eq('id_usuario', usuarioData.id_usuario)
          .order('created_at', { ascending: false });

        if (solicitudesError) {
          console.error('Error fetching solicitudes:', solicitudesError);
          return;
        }

        setSolicitudes(solicitudesData || []);
      } catch (error) {
        console.error('Error general al obtener usuario y solicitudes:', error);
      } finally {
        setLoadingSolicitudes(false);
      }
    };

    fetchUserAndSolicitudes();
  }, []);

  useEffect(() => {
    // Obtener cuartos
    const fetchRooms = async () => {
      try {
        setLoadingRooms(true);
        const { data, error } = await supabase
          .from('cuartos')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        setRooms(data || []);
        setFilteredRooms(data || []);
      } catch (error) {
        console.error('Error fetching rooms:', error);
        setErrorRooms('No se pudieron cargar los cuartos. Por favor, intenta de nuevo más tarde.');
      } finally {
        setLoadingRooms(false);
      }
    };

    fetchRooms();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-[#5C9FB9]">Cuartos disponibles</h1>

      {loadingRooms ? (
        <div className="flex justify-center mt-20">
          <Loader className="animate-spin" size={48} />
        </div>
      ) : errorRooms ? (
        <p className="text-center text-red-600">{errorRooms}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredRooms.map((room) => (
            <RoomCard key={room.id_cuarto} room={room} />
          ))}
        </div>
      )}

      <h2 className="text-2xl font-semibold mt-12 mb-4 text-[#5C9FB9]">Mis solicitudes de renta</h2>

      {loadingSolicitudes ? (
        <div className="flex justify-center mt-10">
          <Loader className="animate-spin" size={36} />
        </div>
      ) : solicitudes.length === 0 ? (
        <p>No tienes solicitudes de renta.</p>
      ) : (
        <ul className="space-y-3">
          {solicitudes.map((solicitud) => (
            <li
              key={solicitud.id_solicitud}
              className="border rounded p-4 bg-white shadow"
            >
              <p><strong>Cuarto ID:</strong> {solicitud.id_cuarto}</p>
              <p><strong>Fecha solicitud:</strong> {new Date(solicitud.created_at).toLocaleDateString()}</p>
              <p><strong>Mensaje:</strong> {solicitud.mensaje}</p>
              <p><strong>Estado:</strong> {solicitud.estado}</p>
              <p><strong>Fecha reunión:</strong> {solicitud.fecha_reunion || 'Sin asignar'}</p>
              <p><strong>Hora reunión:</strong> {solicitud.hora_reunion || 'Sin asignar'}</p>

              {solicitud.administrador ? (
                <div className="mt-2 p-2 border rounded bg-[#f0f9ff]">
                  <p><strong>Administrador:</strong> {solicitud.administrador.nombre} {solicitud.administrador.apellidop} {solicitud.administrador.apellidom}</p>
                  <p><strong>Correo:</strong> {solicitud.administrador.correo}</p>
                  <p><strong>Teléfono:</strong> {solicitud.administrador.telefono}</p>
                </div>
              ) : (
                <p>No hay administrador asignado</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default HomePage;
