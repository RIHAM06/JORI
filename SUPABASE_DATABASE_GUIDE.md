# 💖 Guía de Base de Datos y Sincronización en Tiempo Real con Supabase

Esta web cuenta con una arquitectura de base de datos **Supabase (PostgreSQL + Realtime)** para guardar, consultar y sincronizar información entre diferentes dispositivos y personas en cualquier parte del mundo.

---

## 🌟 Características Implementadas

- **Base de Datos en la Nube:** Almacenamiento persistente en Supabase PostgreSQL.
- **Identificadores Únicos:** Cada nota, foto, fecha, carta o abrazo tiene un ID único (`note_...`, `date_...`, `nos_...`, `env_...`, `hug_...`).
- **Códigos y Enlaces de Pareja Únicos:**
  - Código predeterminado: **`AMOR26`** (o cualquier código generado).
  - Enlace directo compartible: **`https://tu-web.netlify.app/?pair=AMOR26`**.
  - Al abrir el enlace o escribir el código en otro teléfono o PC, los datos se cargan automáticamente desde la base de datos.
- **Sincronización en Tiempo Real:** Las notas, fotos, cartas, fechas y abrazos se actualizan al instante en ambas pantallas sin necesidad de recargar.
- **Persistencia Multi-Dispositivo:** Los datos no se borran al cerrar el navegador ni al cambiar de dispositivo.
- **Seguridad (RLS):** Aislamiento por código de pareja (`pair_code`) y políticas de Row Level Security.
- **Tolerancia a Fallos / Modo Offline:** Si no hay conexión o no has configurado tus claves aún, la web funciona de inmediato con almacenamiento local y relay P2P de respaldo.

---

## 🚀 Pasos para Configurar tu Base de Datos Supabase (2 minutos)

### Paso 1: Crear un proyecto gratuito en Supabase
1. Entra a [https://supabase.com/](https://supabase.com/) e inicia sesión (o crea una cuenta gratis).
2. Haz clic en **"New Project"** (Nuevo Proyecto).
3. Asigna un nombre (ej. `nuestro-universo`) y una contraseña para la base de datos.
4. Selecciona la región más cercana (ej. `West Europe - Frankfurt` o `Central US`) y haz clic en **"Create new project"**.

---

### Paso 2: Crear las tablas de la base de datos
1. En el menú lateral izquierdo de Supabase, entra en **SQL Editor** (icono con `>_`).
2. Abre el archivo **[`supabase-schema.sql`](file:///c:/Users/Rehan/Desktop/PROYECTOS/Jonathan/supabase-schema.sql)** de este proyecto.
3. Copia todo su contenido, pégalo en el editor SQL de Supabase y presiona el botón verde **"RUN"** (Ejecutar).
4. ¡Listo! Se habrán creado las tablas `pairs`, `shared_data`, los índices de rendimiento y las suscripciones en tiempo real.

---

### Paso 3: Obtener tus claves de API
1. En tu panel de Supabase, ve a **Project Settings** (el icono de engranaje ⚙️ abajo a la izquierda).
2. Haz clic en **API** (bajo *Configuration*).
3. Copia estos dos datos:
   - **Project URL** (ejemplo: `https://abcdefghijklm.supabase.co`)
   - **Project API Keys -> `anon` `public`** (ejemplo: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

---

### Paso 4: Pegar las claves en tu web
Abre el archivo **[`auth-config.js`](file:///c:/Users/Rehan/Desktop/PROYECTOS/Jonathan/auth-config.js)** y reemplaza:

```javascript
supabase: {
  url: "https://tu-proyecto.supabase.co", // <- Pega tu Project URL aquí
  anonKey: "TU_SUPABASE_ANON_KEY"         // <- Pega tu anon public key aquí
}
```

*(También puedes definirlas como variables de entorno en Netlify si lo prefieres: `SUPABASE_URL` y `SUPABASE_ANON_KEY`).*

---

## 🔗 Cómo Compartir y Conectar Dispositivos

1. **Usuario 1 (Riham en España):**
   - Entra a la web, elige *"Soy Riham"* y entra con el código `AMOR26`.
   - Puede añadir fotos, escribir notas de amor o crear cartas.

2. **Usuario 2 (Jonathan en Ecuador):**
   - Abre el enlace compartido (ej: `https://tu-web.netlify.app/?pair=AMOR26`) o entra y escribe el código `AMOR26`.
   - Elige *"Soy Jonathan"*.
   - ¡Al instante verá todas las fotos, cartas, notas y fechas que Riham haya guardado, y todo lo que Jonathan añada aparecerá en la pantalla de Riham en tiempo real!

---

## 📂 Archivos del Sistema de Base de Datos:
- **`supabase-schema.sql`**: Script SQL completo para inicializar las tablas en Supabase.
- **`auth-config.js`**: Configuración de claves y variables de entorno.
- **`auth-service.js`**: Motor de sincronización, consultas y tiempo real con Supabase.
- **`.env.example`**: Plantilla de variables de entorno para hosting.
