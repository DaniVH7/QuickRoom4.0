import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

function RoomDetailPages() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    telefono: '',
    fechaInicio: '',
    mensaje: '',
  });
  const [user, setUser] = useState(null);
  const [idUsuarioBD, setIdUsuarioBD] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      // Obtener detalles del cuarto
      const { data: roomData, error: roomError } = await supabase
        .from('cuartos')
        .select('*')
        .eq('id_cuarto', id)
        .single();

      if (roomError) console.error('Error fetching room:', roomError);
      else setRoom(roomData);

      // Obtener usuario autenticado
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError) {
        console.error('Error fetching auth user:', authError);
        return;
      }

      const correo = authData?.user?.email;
      setUser(authData.user);

      // Buscar el ID del usuario en tu tabla personalizada
      const { data: usuarioData, error: usuarioError } = await supabase
        .from('usuarios')
        .select('id_usuario')
        .eq('correo', correo)
        .single();

      if (usuarioError) {
        console.error('Error buscando usuario en tabla usuarios:', usuarioError);
      } else {
        setIdUsuarioBD(usuarioData.id_usuario);
      }
    };

    fetchData();
  }, [id]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !idUsuarioBD) {
      alert('Por favor, inicia sesión para enviar una solicitud.');
      navigate('/login');
      return;
    }

    const fechaInicio = formData.fechaInicio || new Date().toISOString().split('T')[0];

        const { error } = await supabase.from('solicitudes_renta').insert([
      {
        id_cuarto: room.id_cuarto,
        id_usuario: idUsuarioBD,
        id_administrador: room.id_administrador,
        nombre: formData.nombre,
        correo: formData.correo,
        telefono: formData.telefono,
        fecha_inicio: fechaInicio,
        mensaje: formData.mensaje,
      },
    ]);


    if (error) {
      console.error('Error al enviar solicitud:', error);
      alert('Hubo un error al enviar tu solicitud.');
    } else {
      alert('Solicitud enviada exitosamente.');
      setSubmitted(true);
      setShowForm(false);
    }
  };

  if (!room) return <p className="text-center mt-10">Cargando detalles...</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white shadow-lg rounded-lg p-6">
      <h1 className="text-2xl font-bold text-[#5C9FB9] mb-4">Detalles del Cuarto</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <p><strong>Precio:</strong> ${parseFloat(room.precio).toLocaleString('es-MX')}</p>
        <p><strong>Amueblado:</strong> {room.amueblado}</p>
        <p><strong>Agua:</strong> {room.agua}</p>
        <p><strong>Luz:</strong> {room.luz}</p>
        <p><strong>Internet:</strong> {room.internet}</p>
        <p><strong>Vigilancia:</strong> {room.vigilancia}</p>
        <p><strong>Cocina:</strong> {room.cocina}</p>
        <p><strong>Baño compartido:</strong> {room.baño_compartido}</p>
        <p><strong>Cuarto compartido:</strong> {room.cuarto_compartido}</p>
        <p><strong>Tipo de condominio:</strong> {room.tipo_condominio}</p>
        <p><strong>Piso:</strong> {room.piso}</p>
        <p><strong>Número de cuarto:</strong> {room.numero_cuarto}</p>
        <p><strong>Disponibilidad:</strong> {room.disponibilidad}</p>
        <p className="sm:col-span-2"><strong>Dirección:</strong> {room.calle}, {room.municipio}, {room.estado}, CP {room.cp}</p>
      </div>

      {room.fotografia_url && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Fotos</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {room.fotografia_url.split(',').map((url, index) => (
              <img
                key={index}
                src={url.trim()}
                alt={`Foto ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg border"
              />
            ))}
          </div>
        </div>
      )}

      <div className="mt-8">
        {user ? (
          <>
            <button
              className="mt-4 px-4 py-2 bg-[#5C9FB9] text-white rounded hover:bg-[#4a8ca3]"
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? 'Cancelar' : 'Solicitar renta'}
            </button>

            {showForm && (
              <form onSubmit={handleSubmit} className="mt-4 space-y-3">
                <input
                  type="text"
                  placeholder="Tu nombre"
                  className="w-full border p-2 rounded"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="email"
                  placeholder="Tu correo"
                  className="w-full border p-2 rounded"
                  name="correo"
                  value={formData.correo}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="tel"
                  placeholder="Num. de teléfono"
                  className="w-full border p-2 rounded"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  required
                />
                <textarea
                  placeholder="Mensaje"
                  className="w-full border p-2 rounded"
                  name="mensaje"
                  value={formData.mensaje}
                  onChange={handleInputChange}
                />
                <button
                  type="submit"
                  className="bg-[#5C9FB9] text-white px-4 py-2 rounded hover:bg-[#4a8ca3]"
                >
                  Enviar solicitud
                </button>
              </form>
            )}
          </>
        ) : (
          <p className="mt-4 text-red-600">Por favor, inicia sesión o regístrate para enviar una solicitud.</p>
        )}

        {submitted && (
          <p className="mt-4 text-green-600 font-semibold">
            ¡Solicitud enviada exitosamente!
          </p>
        )}
      </div>
    </div>
  );
}

export default RoomDetailPages;
