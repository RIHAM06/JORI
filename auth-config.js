/**
 * ============================================================================
 * CONFIGURACIÓN DE BASE DE DATOS Y AUTENTICACIÓN SUPABASE (NUESTRO UNIVERSO 💖)
 * Para Jonathan & Riham 💖
 * ============================================================================
 * 
 * Este archivo conecta la web con tu base de datos Supabase en tiempo real.
 * Si no has configurado tus claves aún, la web funcionará automáticamente en
 * modo local/P2P de respaldo para que nunca falle.
 */

// Detección de variables de entorno globales (Netlify / Hosting / Window)
const getEnvVar = (name, fallback) => {
  if (typeof window !== "undefined") {
    if (window[name]) return window[name];
    if (window.ENV && window.ENV[name]) return window.ENV[name];
    if (window[`ENV_${name}`]) return window[`ENV_${name}`];
  }
  return fallback;
};

const AUTH_PAIRING_CONFIG = {
  // Proveedor activo: "supabase" (Principal) | "firebase" | "instant_love" (Offline P2P)
  provider: getEnvVar("AUTH_PROVIDER", "supabase"),

  // --------------------------------------------------------------------------
  // CONFIGURACIÓN DE SUPABASE (Base de datos PostgreSQL + Realtime + Auth)
  // --------------------------------------------------------------------------
  // Obtén estas credenciales desde tu consola de Supabase: https://supabase.com/dashboard
  // Entra a tu Proyecto -> Settings (Engranaje) -> API:
  // 1. Project URL (URL del proyecto)
  // 2. Project API Keys -> anon public (Clave anónima pública)
  supabase: {
    url: getEnvVar("SUPABASE_URL", "https://tu-proyecto.supabase.co"),
    anonKey: getEnvVar("SUPABASE_ANON_KEY", "TU_SUPABASE_ANON_KEY")
  },

  // --------------------------------------------------------------------------
  // CONFIGURACIÓN DE FIREBASE (Opcional / Alternativo)
  // --------------------------------------------------------------------------
  firebase: {
    apiKey: getEnvVar("FIREBASE_API_KEY", "TU_FIREBASE_API_KEY"),
    authDomain: "tu-proyecto.firebaseapp.com",
    databaseURL: "https://tu-proyecto-default-rtdb.firebaseio.com",
    projectId: "tu-proyecto"
  },

  // --------------------------------------------------------------------------
  // AJUSTES DEL ESPACIO PRIVADO DE PAREJA
  // --------------------------------------------------------------------------
  settings: {
    // Código predeterminado de vinculación
    defaultPairCode: "AMOR26",
    codePrefix: "AMOR",
    
    // Perfiles predeterminados
    defaultPartners: {
      riham: {
        name: "Riham",
        location: "Cataluña, España 🇪🇸",
        role: "riham",
        avatar: "👧🏻🌸"
      },
      jonathan: {
        name: "Jonathan",
        location: "Guayaquil, Ecuador 🇪🇨",
        role: "jonathan",
        avatar: "👦🏻✨"
      }
    },

    // Sincronización en tiempo real
    autoSyncIntervalMs: 30000,
    allowDemoBypass: true
  }
};

// Exportar globalmente para el navegador
if (typeof window !== "undefined") {
  window.AUTH_PAIRING_CONFIG = AUTH_PAIRING_CONFIG;
}
