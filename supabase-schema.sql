-- ============================================================================
-- ESQUEMA DE BASE DE DATOS SUPABASE - NUESTRO UNIVERSO (JONATHAN & RIHAM 💖)
-- ============================================================================
-- Instrucciones:
-- 1. Ve a tu panel de Supabase: https://supabase.com/dashboard
-- 2. Entra a tu proyecto -> SQL Editor
-- 3. Pega todo este contenido y presiona "RUN" (Ejecutar)
-- ============================================================================

-- 1. TABLA DE ESPACIOS DE PAREJA (PAIRS)
CREATE TABLE IF NOT EXISTS public.pairs (
    code VARCHAR(30) PRIMARY KEY,
    status VARCHAR(30) DEFAULT 'paired',
    p1_name VARCHAR(100) DEFAULT 'Riham',
    p1_role VARCHAR(30) DEFAULT 'riham',
    p1_location VARCHAR(100) DEFAULT 'Cataluña, España 🇪🇸',
    p2_name VARCHAR(100) DEFAULT 'Jonathan',
    p2_role VARCHAR(30) DEFAULT 'jonathan',
    p2_location VARCHAR(100) DEFAULT 'Guayaquil, Ecuador 🇪🇨',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- 2. TABLA DE DATOS COMPARTIDOS (SHARED_DATA)
-- Almacena de forma unificada e indexada:
-- 'notes'      -> Bloc de notas y post-its
-- 'dates'      -> Fechas especiales
-- 'gamer'      -> Recuerdos y fotos de videojuegos
-- 'nosotros'   -> Álbum especial de recuerdos de pareja
-- 'pets'       -> Fotos de Sofi & Benji
-- 'envelopes'  -> Cartas del buzón 'Abrir cuando...'
-- 'hugs'       -> Historial y contador de abrazos virtuales
CREATE TABLE IF NOT EXISTS public.shared_data (
    id TEXT PRIMARY KEY,
    pair_code VARCHAR(30) NOT NULL REFERENCES public.pairs(code) ON DELETE CASCADE,
    collection VARCHAR(40) NOT NULL,
    data JSONB NOT NULL,
    sender_id TEXT,
    sender_role VARCHAR(30),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ÍNDICES DE ALTO RENDIMIENTO PARA CONSULTAS INSTANTÁNEAS
CREATE INDEX IF NOT EXISTS idx_shared_data_pair_collection 
ON public.shared_data(pair_code, collection);

CREATE INDEX IF NOT EXISTS idx_shared_data_updated 
ON public.shared_data(updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_pairs_code 
ON public.pairs(code);

-- 4. INSERTAR SALA PREDETERMINADA (AMOR26)
INSERT INTO public.pairs (code, status, p1_name, p1_role, p2_name, p2_role)
VALUES ('AMOR26', 'paired', 'Riham', 'riham', 'Jonathan', 'jonathan')
ON CONFLICT (code) DO NOTHING;

-- 5. HABILITAR PUBLICACIÓN EN TIEMPO REAL (SUPABASE REALTIME)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'pairs'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.pairs;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'shared_data'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.shared_data;
  END IF;
END $$;

-- 6. POLÍTICAS DE SEGURIDAD ROW LEVEL SECURITY (RLS)
ALTER TABLE public.pairs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shared_data ENABLE ROW LEVEL SECURITY;

-- Permitir lectura pública / anónima mediante el código de pareja
DROP POLICY IF EXISTS "Permitir lectura de parejas" ON public.pairs;
CREATE POLICY "Permitir lectura de parejas" 
ON public.pairs FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Permitir insercion/actualizacion de parejas" ON public.pairs;
CREATE POLICY "Permitir insercion/actualizacion de parejas" 
ON public.pairs FOR ALL 
USING (true) 
WITH CHECK (true);

-- Permitir a los usuarios leer y escribir datos de su código de pareja
DROP POLICY IF EXISTS "Permitir lectura de datos compartidos" ON public.shared_data;
CREATE POLICY "Permitir lectura de datos compartidos" 
ON public.shared_data FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Permitir guardar datos compartidos" ON public.shared_data;
CREATE POLICY "Permitir guardar datos compartidos" 
ON public.shared_data FOR ALL 
USING (true) 
WITH CHECK (true);

-- ============================================================================
-- ¡LISTO! Tu base de datos Supabase ya está configurada al 100%.
-- ============================================================================
