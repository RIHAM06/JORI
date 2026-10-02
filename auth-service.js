/**
 * ============================================================================
 * SERVICIO DE BASE DE DATOS Y AUTENTICACIÓN SUPABASE EN TIEMPO REAL
 * (RomanticAuthPairingService)
 * Sincronización persistente en la nube para Jonathan & Riham 💖
 * ============================================================================
 */

class RomanticAuthPairingService {
  constructor() {
    this.config = window.AUTH_PAIRING_CONFIG || {};
    this.provider = this.config.provider || "supabase";

    // Estado en memoria
    this.currentUser = null;
    this.currentPair = null;
    this.connectionStatus = "connecting"; // "connected" | "connecting" | "offline" | "demo"

    // Callbacks de suscripción
    this.authListeners = [];
    this.pairListeners = [];
    this.statusListeners = [];
    this.dataListeners = {
      notes: [],
      dates: [],
      gamer: [],
      nosotros: [],
      pets: [],
      envelopes: [],
      hugs: [],
      all: []
    };

    // Instancias de SDK
    this.supabaseClient = null;
    this.supabaseChannel = null;
    this.gunDb = null;
    this.gunRoomNode = null;
    this.broadcastChannel = null;

    // Claves de almacenamiento local de respaldo
    this.STORAGE_KEYS = {
      USER: "jonathan_auth_user_v2",
      PAIR: "jonathan_auth_pair_v2",
      CODES_LOCAL: "jonathan_pair_codes_db_v2",
      PAIRS_LOCAL: "jonathan_pairs_db_v2",
      NOTES: "jonathan_romantic_notes_v2026",
      DATES: "jonathan_special_dates_v2",
      GAMER: "jonathan_gamer_memories_custom_v5",
      NOSOTROS: "jonathan_nosotros_photos_v4",
      PETS: "jonathan_pets_photos_v4",
      ENVELOPES: "jonathan_envelopes_v10",
      HUGS_STATS: "jonathan_hug_stats_v2",
      HUGS_HISTORY: "jonathan_hug_history_v2"
    };

    this._initService();
  }

  /**
   * Inicialización del proveedor y servicios de comunicación en tiempo real
   */
  _initService() {
    // 1. Cargar sesión local previa
    this._loadLocalSession();

    // 2. Inicializar Supabase si está disponible
    this._initSupabase();

    // 3. Inicializar Gun.js Relay como fallback P2P gratuito
    this._initGunFallback();

    // 4. Configurar canales de comunicación en tiempo real
    this._setupPairRoom();

    // 5. Verificar parámetros de URL (ej: ?pair=AMOR26)
    this._checkUrlPairParams();
  }

  /**
   * Inicializa el cliente oficial de Supabase
   */
  _initSupabase() {
    const supabaseUrl = this.config.supabase?.url;
    const supabaseAnonKey = this.config.supabase?.anonKey;

    const isConfigured = supabaseUrl && 
      supabaseAnonKey && 
      !supabaseUrl.includes("tu-proyecto") && 
      !supabaseAnonKey.includes("TU_SUPABASE_ANON_KEY");

    if (typeof window.supabase !== "undefined" && isConfigured) {
      try {
        this.supabaseClient = window.supabase.createClient(supabaseUrl, supabaseAnonKey, {
          auth: {
            persistSession: true,
            autoRefreshToken: true
          },
          realtime: {
            params: {
              eventsPerSecond: 10
            }
          }
        });

        this.connectionStatus = "connected";
        this._notifyStatusChanged("connected");
        console.log("🚀 Supabase conectado exitosamente como base de datos principal.");
      } catch (err) {
        console.warn("⚠️ Error al inicializar Supabase Client:", err);
        this.connectionStatus = "offline";
        this._notifyStatusChanged("offline");
      }
    } else {
      this.connectionStatus = "demo";
      this._notifyStatusChanged("demo");
      console.log("ℹ️ Supabase en modo local/P2P (Añade tus claves en auth-config.js para sincronización 100% cloud).");
    }
  }

  /**
   * Inicializa Gun.js para soporte P2P descentralizado de respaldo
   */
  _initGunFallback() {
    try {
      if (typeof Gun !== "undefined") {
        this.gunDb = Gun({
          peers: [
            'https://gun-manhattan.herokuapp.com/gun',
            'https://peer.wallie.io/gun',
            'https://gun-us.herokuapp.com/gun'
          ],
          localStorage: false
        });
      }
    } catch (e) {
      console.warn("Gun.js fallback error:", e);
    }
  }

  isCloudEnabled() {
    return !!this.supabaseClient;
  }

  // ==========================================================================
  // GESTIÓN DE SESIÓN LOCAL Y USUARIO
  // ==========================================================================

  _loadLocalSession() {
    try {
      const savedUser = localStorage.getItem(this.STORAGE_KEYS.USER);
      if (savedUser) this.currentUser = JSON.parse(savedUser);

      const savedPair = localStorage.getItem(this.STORAGE_KEYS.PAIR);
      if (savedPair) this.currentPair = JSON.parse(savedPair);
    } catch (e) {
      console.warn("Error leyendo sesión local:", e);
    }
  }

  _saveLocalSession() {
    try {
      if (this.currentUser) {
        localStorage.setItem(this.STORAGE_KEYS.USER, JSON.stringify(this.currentUser));
        if (this.currentUser.role) {
          localStorage.setItem("jonathan_active_identity", this.currentUser.role);
        }
      } else {
        localStorage.removeItem(this.STORAGE_KEYS.USER);
        localStorage.removeItem("jonathan_active_identity");
      }

      if (this.currentPair) {
        localStorage.setItem(this.STORAGE_KEYS.PAIR, JSON.stringify(this.currentPair));
      } else {
        localStorage.removeItem(this.STORAGE_KEYS.PAIR);
      }
    } catch (e) {
      console.warn("Error guardando sesión local:", e);
    }
  }

  // ==========================================================================
  // CONFIGURACIÓN DE CANALES EN TIEMPO REAL (SUPABASE REALTIME + BROADCAST)
  // ==========================================================================

  _setupPairRoom() {
    const pairCode = this.currentPair?.code || this.config.settings?.defaultPairCode || "AMOR26";
    const roomChannelName = `jonathan_riham_room_${pairCode}`;

    // 1. BroadcastChannel local (sincronización instantánea multi-pestaña)
    if (this.broadcastChannel) {
      try { this.broadcastChannel.close(); } catch(e) {}
    }
    if (typeof BroadcastChannel !== "undefined") {
      this.broadcastChannel = new BroadcastChannel(roomChannelName);
      this.broadcastChannel.onmessage = (e) => this._handleRealtimeMessage(e.data);
    }

    // 2. Supabase Realtime Channel
    if (this.supabaseClient) {
      if (this.supabaseChannel) {
        try { this.supabaseClient.removeChannel(this.supabaseChannel); } catch(e) {}
      }

      this.supabaseChannel = this.supabaseClient.channel(`room_${pairCode}`, {
        config: {
          broadcast: { self: false }
        }
      });

      // Escuchar cambios en la tabla shared_data
      this.supabaseChannel.on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'shared_data',
        filter: `pair_code=eq.${pairCode}`
      }, (payload) => {
        this._handleSupabasePostgresChange(payload);
      });

      // Escuchar eventos broadcast rápidos (ej: abrazos en vivo, confeti)
      this.supabaseChannel.on('broadcast', { event: 'PAIR_EVENT' }, ({ payload }) => {
        this._handleRealtimeMessage(payload);
      });

      this.supabaseChannel.subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(`✨ Canal en tiempo real conectado para la sala: ${pairCode}`);
          this.connectionStatus = "connected";
          this._notifyStatusChanged("connected");
        }
      });
    }

    // 3. Gun.js P2P Room Relay
    if (this.gunDb && pairCode) {
      this.gunRoomNode = this.gunDb.get(`jonathan_riham_v2_${pairCode}`);
      const serviceInitTime = Date.now();
      this.gunRoomNode.on((record) => {
        if (record && record.data && record.time && record.time > serviceInitTime) {
          try {
            const data = JSON.parse(record.data);
            if (data && data.senderId !== this.currentUser?.uid) {
              this._handleRealtimeMessage(data);
            }
          } catch (e) {}
        }
      });
    }
  }

  _checkUrlPairParams() {
    try {
      const params = new URLSearchParams(window.location.search);
      const pairCode = params.get("pair") || params.get("code");
      const userParam = params.get("user") || params.get("role");

      if (pairCode) {
        setTimeout(async () => {
          if (!this.currentUser && userParam) {
            await this.quickDemoLogin(userParam.toLowerCase());
          }
          if (!this.currentPair || this.currentPair.code !== pairCode) {
            try {
              await this.joinPairSpace(pairCode);
            } catch(e) {
              console.log("Auto-join pair from URL:", e.message);
            }
          }
        }, 400);
      }
    } catch (e) {}
  }

  // ==========================================================================
  // AUTENTICACIÓN: LOGIN, REGISTRO, ACCESO RÁPIDO
  // ==========================================================================

  async login(email, password, role = "riham") {
    const cleanEmail = (email || "").trim().toLowerCase();
    const isJonathan = cleanEmail.includes("jonathan") || role === "jonathan";
    const userRole = isJonathan ? "jonathan" : "riham";
    const partnerInfo = this.config.settings?.defaultPartners?.[userRole] || {};

    // Supabase Auth (si está configurado)
    if (this.supabaseClient && password && password !== "123456") {
      try {
        const { data, error } = await this.supabaseClient.auth.signInWithPassword({
          email: cleanEmail,
          password
        });
        if (!error && data?.user) {
          const user = data.user;
          const userData = {
            uid: user.id,
            email: user.email,
            displayName: user.user_metadata?.displayName || partnerInfo.name || (userRole === "jonathan" ? "Jonathan" : "Riham"),
            role: userRole,
            location: partnerInfo.location,
            avatar: partnerInfo.avatar,
            lastLogin: new Date().toISOString()
          };
          this.currentUser = userData;
          this._saveLocalSession();
          this._notifyAuthChanged();
          await this._checkUserPairingStatus(user.id);
          return userData;
        }
      } catch (e) {
        console.warn("Supabase auth fallback to quick user:", e);
      }
    }

    // Modo Rápido / Demo / Persistente
    const userData = {
      uid: "usr_" + userRole + "_" + (cleanEmail.replace(/[^a-zA-Z0-9]/g, "") || "id"),
      email: cleanEmail || (userRole === "jonathan" ? "jonathan@nuestro-universo.com" : "riham@nuestro-universo.com"),
      displayName: partnerInfo.name || (userRole === "jonathan" ? "Jonathan" : "Riham"),
      role: userRole,
      location: partnerInfo.location || (userRole === "jonathan" ? "Guayaquil, Ecuador 🇪🇨" : "Cataluña, España 🇪🇸"),
      avatar: partnerInfo.avatar || (userRole === "jonathan" ? "👦🏻✨" : "👧🏻🌸"),
      lastLogin: new Date().toISOString()
    };

    this.currentUser = userData;
    this._saveLocalSession();
    this._notifyAuthChanged();
    await this._checkUserPairingStatus(userData.uid);
    return userData;
  }

  async register(email, password, displayName, role = "riham") {
    const cleanEmail = (email || "").trim().toLowerCase();
    const userRole = role === "jonathan" ? "jonathan" : "riham";
    const partnerInfo = this.config.settings?.defaultPartners?.[userRole] || {};

    if (this.supabaseClient) {
      try {
        const { data, error } = await this.supabaseClient.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            data: {
              displayName: displayName || partnerInfo.name,
              role: userRole
            }
          }
        });
        if (error) throw error;
      } catch (err) {
        console.warn("Supabase register note:", err.message);
      }
    }

    return this.login(cleanEmail, password, userRole);
  }

  async quickDemoLogin(role = "riham") {
    const isJonathan = role === "jonathan";
    const email = isJonathan ? "jonathan@nuestro-universo.com" : "riham@nuestro-universo.com";
    return this.login(email, "123456", role);
  }

  async logout() {
    if (this.supabaseClient) {
      try { await this.supabaseClient.auth.signOut(); } catch(e) {}
    }
    this.currentUser = null;
    this.currentPair = null;
    this._saveLocalSession();
    this._notifyAuthChanged();
    this._notifyPairChanged();
  }

  // ==========================================================================
  // GESTIÓN DE ESPACIO DE PAREJA (PAIRING CODES & CLOUD SYNC)
  // ==========================================================================

  async createPairSpace(customCode = null) {
    const code = (customCode || `AMOR-${Math.floor(1000 + Math.random() * 9000)}`).toUpperCase().trim();
    const isRiham = this.currentUser?.role === "riham";

    const pairRecord = {
      code: code,
      pairId: `pair_${code}`,
      status: "paired",
      p1_name: isRiham ? this.currentUser?.displayName || "Riham" : "Riham",
      p1_role: "riham",
      p1_location: "Cataluña, España 🇪🇸",
      p2_name: !isRiham ? this.currentUser?.displayName || "Jonathan" : "Jonathan",
      p2_role: "jonathan",
      p2_location: "Guayaquil, Ecuador 🇪🇨",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // 1. Guardar en Supabase (si está conectado)
    if (this.supabaseClient) {
      try {
        await this.supabaseClient.from('pairs').upsert(pairRecord);
      } catch (err) {
        console.warn("Error guardando pair en Supabase:", err);
      }
    }

    // 2. Guardar localmente
    this._savePairCodeLocally(code, pairRecord);
    this._savePairLocally(pairRecord.pairId, pairRecord);
    this.currentPair = pairRecord;
    this._saveLocalSession();
    this._setupPairRoom();
    this._notifyPairChanged();

    // 3. Sincronizar todos los datos de la nube
    await this.loadAllPairData(code);

    return pairRecord;
  }

  async joinPairSpace(inputCode) {
    const code = (inputCode || "").trim().toUpperCase();
    if (!code) throw new Error("Por favor, ingresa un código válido.");

    let pairRecord = null;

    // 1. Buscar en Supabase
    if (this.supabaseClient) {
      try {
        const { data, error } = await this.supabaseClient
          .from('pairs')
          .select('*')
          .eq('code', code)
          .maybeSingle();

        if (data && !error) {
          pairRecord = data;
        }
      } catch (err) {
        console.warn("Error consultando pair en Supabase:", err);
      }
    }

    // 2. Buscar en almacenamiento local si no vino de Supabase
    if (!pairRecord) {
      pairRecord = this._findPairCodeLocally(code);
    }

    // 3. Si no existe aún, crear el registro para este código
    if (!pairRecord) {
      pairRecord = await this.createPairSpace(code);
      return pairRecord;
    }

    this.currentPair = pairRecord;
    this._saveLocalSession();
    this._setupPairRoom();
    this._notifyPairChanged();

    // Sincronizar todos los datos existentes de esta sala
    await this.loadAllPairData(code);

    this._broadcast({
      type: "PAIR_CONNECTED",
      pairRecord: pairRecord
    });

    return pairRecord;
  }

  async _checkUserPairingStatus(uid) {
    const defaultCode = this.config.settings?.defaultPairCode || "AMOR26";
    if (!this.currentPair) {
      await this.joinPairSpace(defaultCode);
    }
  }

  // ==========================================================================
  // OPERACIONES CRUD EN BASE DE DATOS (SHARED_DATA)
  // Sincroniza: notes, dates, gamer, nosotros, pets, envelopes, hugs
  // ==========================================================================

  /**
   * Guarda o actualiza un registro en Supabase y caché local
   */
  async saveItem(collection, item, customPairCode = null) {
    if (!item) return null;
    const pairCode = customPairCode || this.currentPair?.code || "AMOR26";

    // Asegurar que el elemento tenga ID único
    if (!item.id) {
      item.id = `${collection}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    }

    const payloadRecord = {
      id: String(item.id),
      pair_code: pairCode,
      collection: collection,
      data: item,
      sender_id: this.currentUser?.uid || "guest",
      sender_role: this.currentUser?.role || "riham",
      updated_at: new Date().toISOString()
    };

    // 1. Guardar en Supabase
    if (this.supabaseClient) {
      try {
        const { error } = await this.supabaseClient
          .from('shared_data')
          .upsert(payloadRecord, { onConflict: 'id' });

        if (error) throw error;
      } catch (err) {
        console.warn(`Error guardando ${collection} en Supabase:`, err);
      }
    }

    // 2. Transmitir por canal de tiempo real
    this._broadcastDataEvent({
      action: "save",
      collection: collection,
      item: item,
      senderId: this.currentUser?.uid,
      senderRole: this.currentUser?.role,
      timestamp: Date.now()
    });

    return item;
  }

  /**
   * Elimina un registro de Supabase y notifica en tiempo real
   */
  async deleteItem(collection, itemId, customPairCode = null) {
    if (!itemId) return;
    const pairCode = customPairCode || this.currentPair?.code || "AMOR26";

    if (this.supabaseClient) {
      try {
        await this.supabaseClient
          .from('shared_data')
          .delete()
          .eq('id', String(itemId))
          .eq('pair_code', pairCode);
      } catch (err) {
        console.warn(`Error eliminando ${itemId} de Supabase:`, err);
      }
    }

    this._broadcastDataEvent({
      action: "delete",
      collection: collection,
      itemId: itemId,
      senderId: this.currentUser?.uid,
      timestamp: Date.now()
    });
  }

  /**
   * Recupera todos los elementos de una colección desde Supabase
   */
  async fetchCollection(collection, customPairCode = null) {
    const pairCode = customPairCode || this.currentPair?.code || "AMOR26";

    if (this.supabaseClient) {
      try {
        const { data, error } = await this.supabaseClient
          .from('shared_data')
          .select('data, updated_at')
          .eq('pair_code', pairCode)
          .eq('collection', collection)
          .order('updated_at', { ascending: false });

        if (!error && Array.isArray(data) && data.length > 0) {
          return data.map(row => row.data);
        }
      } catch (err) {
        console.warn(`Error leyendo colección ${collection} de Supabase:`, err);
      }
    }
    return null;
  }

  /**
   * Carga todos los datos de todas las colecciones para una sala de pareja
   */
  async loadAllPairData(pairCode) {
    if (!this.supabaseClient || !pairCode) return;

    try {
      const { data, error } = await this.supabaseClient
        .from('shared_data')
        .select('*')
        .eq('pair_code', pairCode);

      if (error || !Array.isArray(data)) return;

      const grouped = {};
      data.forEach(row => {
        if (!grouped[row.collection]) grouped[row.collection] = [];
        grouped[row.collection].push(row.data);
      });

      // Notificar a cada suscriptor de colección con los datos del servidor
      Object.keys(grouped).forEach(collection => {
        this._notifyDataListeners(collection, {
          action: "sync_all",
          items: grouped[collection]
        });
      });

      this._notifyDataListeners("all", grouped);
      console.log(`📥 Datos sincronizados desde Supabase para la sala ${pairCode}:`, Object.keys(grouped));
    } catch (e) {
      console.warn("Error cargando datos de Supabase:", e);
    }
  }

  async syncPairData(eventType, payload) {
    const pairCode = this.currentPair?.code || "AMOR26";
    let collection = eventType;
    if (eventType === "note") collection = "notes";
    if (eventType === "date") collection = "dates";
    if (eventType === "envelope") collection = "envelopes";
    if (eventType === "hug") collection = "hugs";
    if (eventType === "photo" && payload?.gallery) collection = payload.gallery;

    if (payload?.action === "add" || payload?.action === "edit" || payload?.action === "like" || payload?.action === "react") {
      const item = payload.item || payload.note || payload.date || payload.envelope || payload;
      if (item && item.id) {
        await this.saveItem(collection, item, pairCode);
      }
    } else if (payload?.action === "delete") {
      const itemId = payload.id || payload.noteId || payload.itemId;
      if (itemId) {
        await this.deleteItem(collection, itemId, pairCode);
      }
    } else if (eventType === "hug") {
      await this.saveItem("hugs", payload, pairCode);
    } else {
      this._broadcastDataEvent({
        collection: collection,
        eventType: eventType,
        payload: payload,
        senderId: this.currentUser?.uid,
        senderRole: this.currentUser?.role,
        timestamp: Date.now()
      });
    }
  }

  // ==========================================================================
  // MANEJO DE MENSAJES Y EVENTOS EN TIEMPO REAL
  // ==========================================================================

  _broadcastDataEvent(eventPayload) {
    // 1. BroadcastChannel (pestañas)
    this._broadcast({
      type: "PAIR_DATA_SYNC",
      data: eventPayload
    });

    // 2. Supabase Realtime Channel
    if (this.supabaseChannel) {
      try {
        this.supabaseChannel.send({
          type: "broadcast",
          event: "PAIR_EVENT",
          payload: {
            type: "PAIR_DATA_SYNC",
            data: eventPayload
          }
        });
      } catch (e) {}
    }

    // 3. Gun.js Relay
    if (this.gunRoomNode) {
      try {
        this.gunRoomNode.put({
          data: JSON.stringify({ type: "PAIR_DATA_SYNC", data: eventPayload }),
          time: Date.now()
        });
      } catch (e) {}
    }
  }

  _handleSupabasePostgresChange(payload) {
    if (!payload) return;
    const { eventType, new: newRow, old: oldRow } = payload;

    if (eventType === "INSERT" || eventType === "UPDATE") {
      if (newRow && newRow.sender_id !== this.currentUser?.uid) {
        const col = newRow.collection;
        const item = newRow.data;
        const eventObj = {
          action: "save",
          collection: col,
          item: item,
          senderRole: newRow.sender_role,
          timestamp: Date.now()
        };
        this._notifyDataListeners(col, eventObj);
        if (col === "notes") this._notifyDataListeners("note", { action: "add", note: item });
        if (col === "dates") this._notifyDataListeners("date", { action: "add", date: item });
        if (col === "envelopes") this._notifyDataListeners("envelope", { envelope: item });
        if (col === "hugs") this._notifyDataListeners("hug", item);
        if (col === "gamer" || col === "nosotros" || col === "pets") {
          this._notifyDataListeners("photo", { gallery: col, action: "add", item: item });
        }
      }
    } else if (eventType === "DELETE") {
      if (oldRow) {
        const col = oldRow.collection || "notes";
        const eventObj = {
          action: "delete",
          collection: col,
          itemId: oldRow.id
        };
        this._notifyDataListeners(col, eventObj);
        if (col === "notes") this._notifyDataListeners("note", { action: "delete", noteId: oldRow.id });
        if (col === "dates") this._notifyDataListeners("date", { action: "delete", id: oldRow.id });
      }
    }
  }

  _handleRealtimeMessage(msg) {
    if (!msg || !msg.type) return;

    if (msg.type === "PAIR_CONNECTED" && msg.pairRecord) {
      this.currentPair = msg.pairRecord;
      this._saveLocalSession();
      this._notifyPairChanged();
    } else if (msg.type === "PAIR_DATA_SYNC" && msg.data) {
      const ev = msg.data;
      if (ev.senderId !== this.currentUser?.uid) {
        const col = ev.collection || ev.eventType;
        this._notifyDataListeners(col, ev);
        if (col === "notes") this._notifyDataListeners("note", ev);
        if (col === "dates") this._notifyDataListeners("date", ev);
        if (col === "envelopes") this._notifyDataListeners("envelope", ev);
        if (col === "hugs") this._notifyDataListeners("hug", ev.item || ev.payload || ev);
        if (col === "gamer" || col === "nosotros" || col === "pets") this._notifyDataListeners("photo", ev);
      }
    }
  }

  _notifyDataListeners(collection, data) {
    if (this.dataListeners[collection]) {
      this.dataListeners[collection].forEach(cb => {
        try { cb(data); } catch (e) { console.warn(`Listener err on ${collection}:`, e); }
      });
    }
  }

  onPairData(collection, callback) {
    if (!this.dataListeners[collection]) {
      this.dataListeners[collection] = [];
    }
    this.dataListeners[collection].push(callback);
  }

  // ==========================================================================
  // HELPERS DE TRANSMISIÓN Y SUSCRIPCIONES
  // ==========================================================================

  _broadcast(data) {
    if (this.broadcastChannel) {
      try { this.broadcastChannel.postMessage(data); } catch(e) {}
    }
  }

  onAuthStateChanged(callback) {
    this.authListeners.push(callback);
    callback(this.currentUser);
  }

  onPairStateChanged(callback) {
    this.pairListeners.push(callback);
    callback(this.currentPair);
  }

  onConnectionStatusChanged(callback) {
    this.statusListeners.push(callback);
    callback(this.connectionStatus);
  }

  _notifyAuthChanged() {
    this.authListeners.forEach(cb => { try { cb(this.currentUser); } catch(e) {} });
  }

  _notifyPairChanged() {
    this.pairListeners.forEach(cb => { try { cb(this.currentPair); } catch(e) {} });
  }

  _notifyStatusChanged(status) {
    this.statusListeners.forEach(cb => { try { cb(status); } catch(e) {} });
  }

  // Helpers de Base de Datos Local
  _findPairCodeLocally(code) {
    const codes = this._getAllPairCodesLocally();
    return codes[code] || null;
  }

  _savePairCodeLocally(code, pairRecord) {
    const codes = this._getAllPairCodesLocally();
    codes[code] = pairRecord;
    try { localStorage.setItem(this.STORAGE_KEYS.CODES_LOCAL, JSON.stringify(codes)); } catch (e) {}
  }

  _getAllPairCodesLocally() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEYS.CODES_LOCAL);
      return data ? JSON.parse(data) : {};
    } catch (e) { return {}; }
  }

  _savePairLocally(pairId, pairRecord) {
    const pairs = this._getAllPairsLocally();
    pairs[pairId] = pairRecord;
    try { localStorage.setItem(this.STORAGE_KEYS.PAIRS_LOCAL, JSON.stringify(pairs)); } catch (e) {}
  }

  _getAllPairsLocally() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEYS.PAIRS_LOCAL);
      return data ? JSON.parse(data) : {};
    } catch (e) { return {}; }
  }

  getCurrentUser() { return this.currentUser; }
  getCurrentPair() { return this.currentPair; }
  isAuthenticated() { return !!this.currentUser; }
  isPaired() { return !!this.currentPair && this.currentPair.status === "paired"; }
}

// Instanciar y exponer globalmente
if (typeof window !== "undefined") {
  window.AuthPairingService = new RomanticAuthPairingService();
}
