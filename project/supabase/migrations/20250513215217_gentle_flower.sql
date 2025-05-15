/*
  # Create rooms (cuartos) table schema

  1. New Tables
    - `cuartos`
      - `id` (bigint, primary key)
      - `id_administrador` (bigint)
      - `precio` (text)
      - `amueblado` (text)
      - `agua` (text)
      - `luz` (text)
      - `internet` (text)
      - `vigilancia` (text)
      - `cocina` (text)
      - `baño_compartido` (text)
      - `cuarto_compartido` (text)
      - `calificacion` (numeric)
      - `tipo_condominio` (text)
      - `calle` (text)
      - `estado` (text)
      - `municipio` (text)
      - `cp` (text)
      - `piso` (text)
      - `numero_cuarto` (text)
      - `disponibilidad` (text)
      - `fotografia_url` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `cuartos` table
    - Add policy for public read access
*/

CREATE TABLE IF NOT EXISTS cuartos (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  id_administrador bigint NOT NULL,
  precio text NOT NULL,
  amueblado text DEFAULT 'No',
  agua text DEFAULT 'No',
  luz text DEFAULT 'No',
  internet text DEFAULT 'No',
  vigilancia text DEFAULT 'No',
  cocina text DEFAULT 'No',
  baño_compartido text DEFAULT 'No',
  cuarto_compartido text DEFAULT 'No',
  calificacion numeric DEFAULT 0,
  tipo_condominio text NOT NULL,
  calle text NOT NULL,
  estado text NOT NULL,
  municipio text NOT NULL,
  cp text NOT NULL,
  piso text NOT NULL,
  numero_cuarto text NOT NULL,
  disponibilidad text NOT NULL DEFAULT 'Disponible',
  fotografia_url text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE cuartos ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access"
  ON cuartos
  FOR SELECT
  TO public
  USING (true);