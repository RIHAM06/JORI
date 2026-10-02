/**
 * ============================================================================
 * CONTROLADOR UI DE AUTENTICACIÓN Y VINCULACIÓN PRIVADA DE PAREJA
 * Flujo Limpio en 2 Pasos con Interfaz Blanca y Scroll Adaptable
 * Para Jonathan & Riham 💖
 * ============================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  const authService = window.AuthPairingService;
  if (!authService) return;

  // ==========================================================================
  // 1. INYECCIÓN DINÁMICA DE LA INTERFAZ
  // ==========================================================================
  function injectAuthDOM() {
    if (document.getElementById("auth-pairing-overlay")) return;

    const sessionEntered = sessionStorage.getItem("jonathan_session_entered") === "true";
    const initialUser = authService.getCurrentUser();
    const shouldShowCover = !sessionEntered || !initialUser;
    const overlayClass = shouldShowCover ? "auth-pairing-overlay" : "auth-pairing-overlay hidden";
    const closeBtnStyle = (sessionEntered && initialUser) ? "" : "style=\"display: none;\"";

    if (shouldShowCover) {
      document.body.classList.add("auth-locked");
    }

    const overlayHTML = `
      <!-- PORTAL DE AUTENTICACIÓN Y VINCULACIÓN -->
      <div id="auth-pairing-overlay" class="${overlayClass}">
        <div class="auth-portal-card" id="auth-portal-card">
          <button type="button" class="btn-close-auth-modal" id="btn-close-auth-overlay" title="Cerrar ventana" ${closeBtnStyle}>
            <i class="fa-solid fa-xmark"></i>
          </button>

          <!-- ============================================================== -->
          <!-- PASO 1: IDENTIFICACIÓN / INICIAR SESIÓN                        -->
          <!-- ============================================================== -->
          <div id="auth-view-login-register" class="auth-view-pane">
            <div class="auth-portal-header">
              <div class="auth-step-pill">
                <span class="step-badge-num">Paso 1 de 2</span> Identificación
              </div>
              <span class="auth-portal-icon-wrap">💑</span>
              <h2 class="auth-portal-title">¿Quién eres hoy?</h2>
              <p class="auth-portal-sub">
                Selecciona tu perfil para identificarte y conectar en tiempo real:
              </p>
            </div>

            <!-- ACCESO RÁPIDO 1-CLICK (RIHAM / JONATHAN) -->
            <div class="auth-quick-cards-grid">
              <button type="button" class="auth-identity-big-card" id="btn-quick-riham">
                <span class="card-big-avatar">👧🏻🌸</span>
                <strong class="card-big-name">Soy Riham</strong>
                <small class="card-big-loc">Cataluña, España 🇪🇸</small>
                <span class="card-enter-pill"><i class="fa-solid fa-arrow-right"></i> Entrar</span>
              </button>

              <button type="button" class="auth-identity-big-card" id="btn-quick-jonathan">
                <span class="card-big-avatar">👦🏻✨</span>
                <strong class="card-big-name">Soy Jonathan</strong>
                <small class="card-big-loc">Guayaquil, Ecuador 🇪🇨</small>
                <span class="card-enter-pill"><i class="fa-solid fa-arrow-right"></i> Entrar</span>
              </button>
            </div>

            <!-- Separador / Opciones avanzadas de correo -->
            <div class="auth-toggle-advanced-wrap">
              <button type="button" class="btn-text-link" id="btn-toggle-advanced-auth">
                <i class="fa-solid fa-envelope"></i> <span>Otras opciones (Correo y Contraseña)</span>
              </button>
            </div>

            <!-- Formulario Desplegable de Email/Password (Opcional) -->
            <div id="auth-advanced-form-box" class="auth-advanced-box hidden">
              <div class="auth-tabs-nav">
                <button type="button" class="auth-tab-btn active" id="tab-btn-login">
                  <i class="fa-solid fa-right-to-bracket"></i> Iniciar Sesión
                </button>
                <button type="button" class="auth-tab-btn" id="tab-btn-register">
                  <i class="fa-solid fa-user-plus"></i> Registrarse
                </button>
              </div>

              <!-- Alerta -->
              <div id="auth-alert-box" class="auth-alert-message error hidden">
                <i class="fa-solid fa-circle-exclamation"></i>
                <span id="auth-alert-text">Error al iniciar sesión</span>
              </div>

              <form id="form-auth-submit">
                <div class="auth-form-group hidden" id="group-display-name">
                  <label class="auth-input-label">Tu Nombre o Apodo:</label>
                  <input type="text" id="auth-input-name" class="auth-input-field" placeholder="Tu nombre..." maxlength="35">
                </div>

                <div class="auth-form-group">
                  <label class="auth-input-label">Correo Electrónico:</label>
                  <input type="email" id="auth-input-email" class="auth-input-field" placeholder="correo@ejemplo.com" required>
                </div>

                <div class="auth-form-group">
                  <label class="auth-input-label">Contraseña:</label>
                  <input type="password" id="auth-input-password" class="auth-input-field" placeholder="••••••••" required minlength="6">
                </div>

                <button type="submit" class="auth-submit-btn" id="btn-auth-submit">
                  <i class="fa-solid fa-heart"></i>
                  <span id="auth-submit-btn-text">Iniciar Sesión</span>
                </button>
              </form>
            </div>
          </div>

          <!-- ============================================================== -->
          <!-- PASO 2: VINCULACIÓN CON TU PAREJA (PAIRING CODE)               -->
          <!-- ============================================================== -->
          <div id="auth-view-pairing" class="auth-view-pane hidden">
            <div class="auth-portal-header">
              <div class="auth-step-pill">
                <span class="step-badge-num">Paso 2 de 2</span> Conectar Pareja
              </div>
              <span class="auth-portal-icon-wrap" id="pairing-header-avatar">💌</span>
              <h2 class="auth-portal-title">Vincular con tu Pareja</h2>
              <p class="auth-portal-sub">
                Hola <strong id="pairing-user-greeting">Amor</strong>, comparte o ingresa el código para sincronizar en tiempo real:
              </p>
            </div>

            <!-- Selector Modo: Mi Código / Ingresar Código -->
            <div class="pairing-options-grid" id="pairing-mode-selector">
              <div class="pairing-action-card active" id="btn-mode-create-space">
                <span class="pairing-card-icon">✨</span>
                <span class="pairing-card-title">Mi Código</span>
                <span class="pairing-card-desc">Comparte el código con tu pareja</span>
              </div>
              <div class="pairing-action-card" id="btn-mode-join-space">
                <span class="pairing-card-icon">🔑</span>
                <span class="pairing-card-title">Ingresar Código</span>
                <span class="pairing-card-desc">Escribe el código de tu pareja</span>
              </div>
            </div>

            <!-- OPCIÓN A: VER Y COMPARTIR CÓDIGO -->
            <div id="pane-create-space" class="pair-code-display-box">
              <span class="pair-code-label">Código de Pareja:</span>
              <div class="pair-code-badge-wrap">
                <span class="pair-code-digits" id="display-generated-pair-code">AMOR26</span>
              </div>

              <div class="pair-code-actions">
                <button type="button" class="btn-copy-pair-code" id="btn-copy-pair-code">
                  <i class="fa-solid fa-copy"></i> Copiar Código
                </button>
                <a href="#" target="_blank" class="btn-share-whatsapp" id="btn-share-whatsapp">
                  <i class="fa-brands fa-whatsapp"></i> Mandar por WhatsApp
                </a>
              </div>

              <div class="pair-waiting-pulse">
                <span class="pulse-dot-ring"></span>
                <span id="pair-waiting-status-text">🟢 Sincronización en vivo activa</span>
              </div>
            </div>

            <!-- OPCIÓN B: INGRESAR CÓDIGO DE LA PAREJA -->
            <div id="pane-join-space" class="pair-join-form-box hidden">
              <form id="form-join-pair">
                <div class="auth-form-group">
                  <label class="auth-input-label">Ingresa el código que te dio tu pareja:</label>
                  <input type="text" id="input-join-pair-code" class="auth-input-field pair-code-input-large" placeholder="AMOR26" required maxlength="12" autocomplete="off">
                </div>
                <button type="submit" class="auth-submit-btn" id="btn-submit-join-pair">
                  <i class="fa-solid fa-heart-circle-check"></i>
                  <span>Vincular Dispositivos 💕</span>
                </button>
              </form>
            </div>

            <!-- Botones de Acción del Paso 2 -->
            <div class="pairing-footer-actions">
              <button type="button" class="btn-finish-flow" id="btn-finish-pairing">
                <i class="fa-solid fa-check"></i> <span>¡Entrar a la Web! ✨</span>
              </button>
              <button type="button" class="btn-text-link" id="btn-pairing-logout">
                <i class="fa-solid fa-arrow-left"></i> <span>Cambiar de Usuario (Paso 1)</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    `;

    document.body.insertAdjacentHTML("beforeend", overlayHTML);

    // Inyectar Chip de Pareja en el Navbar
    const navActions = document.querySelector(".nav-actions");
    if (navActions && !document.getElementById("nav-pair-status-chip")) {
      const chipHTML = `
        <div class="nav-pair-status-chip" id="nav-pair-status-chip" title="Estado de Emparejamiento">
          <div class="nav-pair-avatars-merged">
            <span class="avatar-p1" id="nav-chip-avatar1">👧🏻</span>
            <span class="avatar-p2" id="nav-chip-avatar2">👦🏻</span>
          </div>
          <span class="nav-pair-names" id="nav-chip-names">Riham & Jonathan</span>
          <span class="live-pulse-green"></span>

          <!-- Menú desplegable de Pareja -->
          <div class="pair-dropdown-menu hidden" id="pair-dropdown-menu">
            <div class="pair-dropdown-header">
              <strong id="dropdown-user-name">Riham</strong>
              <small id="dropdown-user-loc">Cataluña, España 🇪🇸</small>
              <span class="pair-dropdown-code-tag" id="dropdown-pair-code">Código: AMOR26</span>
            </div>
            <button type="button" class="pair-dropdown-item" id="btn-dropdown-open-modal">
              <i class="fa-solid fa-link"></i> Gestionar Emparejamiento
            </button>
            <button type="button" class="pair-dropdown-item" id="btn-dropdown-copy-code">
              <i class="fa-solid fa-copy"></i> Copiar Código de Pareja
            </button>
            <button type="button" class="pair-dropdown-item" id="btn-dropdown-share-ws">
              <i class="fa-brands fa-whatsapp"></i> Compartir por WhatsApp
            </button>
            <button type="button" class="pair-dropdown-item danger" id="btn-dropdown-logout">
              <i class="fa-solid fa-arrow-right-from-bracket"></i> Cambiar de Usuario
            </button>
          </div>
        </div>
      `;
      navActions.insertAdjacentHTML("afterbegin", chipHTML);
    }
  }

  injectAuthDOM();

  // ==========================================================================
  // 2. ELEMENTOS DEL DOM
  // ==========================================================================
  const overlay = document.getElementById("auth-pairing-overlay");
  const btnCloseOverlay = document.getElementById("btn-close-auth-overlay");
  const viewLoginRegister = document.getElementById("auth-view-login-register");
  const viewPairing = document.getElementById("auth-view-pairing");

  // Paso 1: 1-Click Login & Email
  const btnQuickRiham = document.getElementById("btn-quick-riham");
  const btnQuickJonathan = document.getElementById("btn-quick-jonathan");
  const btnToggleAdvanced = document.getElementById("btn-toggle-advanced-auth");
  const boxAdvancedForm = document.getElementById("auth-advanced-form-box");

  const tabBtnLogin = document.getElementById("tab-btn-login");
  const tabBtnRegister = document.getElementById("tab-btn-register");
  const groupDisplayName = document.getElementById("group-display-name");
  const formAuth = document.getElementById("form-auth-submit");
  const inputEmail = document.getElementById("auth-input-email");
  const inputPassword = document.getElementById("auth-input-password");
  const inputName = document.getElementById("auth-input-name");
  const alertBox = document.getElementById("auth-alert-box");
  const alertText = document.getElementById("auth-alert-text");
  const authSubmitBtnText = document.getElementById("auth-submit-btn-text");

  // Paso 2: Emparejamiento
  const pairingHeaderAvatar = document.getElementById("pairing-header-avatar");
  const pairingUserGreeting = document.getElementById("pairing-user-greeting");
  const btnModeCreateSpace = document.getElementById("btn-mode-create-space");
  const btnModeJoinSpace = document.getElementById("btn-mode-join-space");
  const paneCreateSpace = document.getElementById("pane-create-space");
  const paneJoinSpace = document.getElementById("pane-join-space");
  const displayPairCode = document.getElementById("display-generated-pair-code");
  const btnCopyPairCode = document.getElementById("btn-copy-pair-code");
  const btnShareWhatsApp = document.getElementById("btn-share-whatsapp");
  const formJoinPair = document.getElementById("form-join-pair");
  const inputJoinCode = document.getElementById("input-join-pair-code");
  const btnFinishPairing = document.getElementById("btn-finish-pairing");
  const btnPairingLogout = document.getElementById("btn-pairing-logout");

  // Navbar Chip & Dropdown
  const navPairChip = document.getElementById("nav-pair-status-chip");
  const pairDropdown = document.getElementById("pair-dropdown-menu");
  const navChipAvatar1 = document.getElementById("nav-chip-avatar1");
  const navChipAvatar2 = document.getElementById("nav-chip-avatar2");
  const navChipNames = document.getElementById("nav-chip-names");
  const navChipCode = document.getElementById("nav-chip-code");
  const dropdownUserName = document.getElementById("dropdown-user-name");
  const dropdownUserLoc = document.getElementById("dropdown-user-loc");
  const dropdownPairCode = document.getElementById("dropdown-pair-code");
  const btnDropdownOpenModal = document.getElementById("btn-dropdown-open-modal");
  const btnDropdownCopyCode = document.getElementById("btn-dropdown-copy-code");
  const btnDropdownShareWs = document.getElementById("btn-dropdown-share-ws");
  const btnDropdownLogout = document.getElementById("btn-dropdown-logout");

  let isRegisterMode = false;

  function showAlert(msg, isError = true) {
    if (!alertBox || !alertText) return;
    alertText.textContent = msg;
    alertBox.className = `auth-alert-message ${isError ? "error" : "success"}`;
    alertBox.classList.remove("hidden");
  }

  function hideAlert() {
    if (alertBox) alertBox.classList.add("hidden");
  }

  // ==========================================================================
  // 3. CONTROL DE VISTAS Y BLOQUEO DE PORTADA (PASO 1 VS PASO 2)
  // ==========================================================================
  function lockPortal() {
    document.body.classList.add("auth-locked");
  }

  function unlockPortal() {
    document.body.classList.remove("auth-locked");
    if (overlay) overlay.classList.add("hidden");
  }

  function showStep1() {
    lockPortal();
    if (overlay) overlay.classList.remove("hidden");
    if (viewLoginRegister) viewLoginRegister.classList.remove("hidden");
    if (viewPairing) viewPairing.classList.add("hidden");

    // Si no ha entrado al portal en esta sesión, ocultar botón de cierre
    const sessionEntered = sessionStorage.getItem("jonathan_session_entered") === "true";
    const currentUser = authService.getCurrentUser();
    if (btnCloseOverlay) {
      btnCloseOverlay.style.display = (sessionEntered && currentUser) ? "flex" : "none";
    }
    hideAlert();
  }

  function showStep2(user) {
    lockPortal();
    if (overlay) overlay.classList.remove("hidden");
    if (viewLoginRegister) viewLoginRegister.classList.add("hidden");
    if (viewPairing) viewPairing.classList.remove("hidden");

    const sessionEntered = sessionStorage.getItem("jonathan_session_entered") === "true";
    const currentUser = user || authService.getCurrentUser();
    if (btnCloseOverlay) {
      btnCloseOverlay.style.display = (sessionEntered && currentUser) ? "flex" : "none";
    }

    if (currentUser) {
      if (pairingUserGreeting) pairingUserGreeting.textContent = currentUser.displayName;
      if (pairingHeaderAvatar) pairingHeaderAvatar.textContent = currentUser.avatar || "💌";
    }

    let pair = authService.getCurrentPair();
    if (!pair) {
      authService.createPairSpace("AMOR26").then(p => updatePairUI(p));
    } else {
      updatePairUI(pair);
    }
  }

  function updatePairUI(pair) {
    if (!pair) return;
    if (displayPairCode) displayPairCode.textContent = pair.code || "AMOR26";

    if (btnShareWhatsApp) {
      const pageUrl = window.location.origin + window.location.pathname;
      const joinUrl = `${pageUrl}?pair=${pair.code}`;
      const msg = encodeURIComponent(`¡Hola mi amor! ❤️ Entra a nuestro espacio privado con este enlace: ${joinUrl} o usa el código: *${pair.code}* ✨`);
      btnShareWhatsApp.href = `https://api.whatsapp.com/send?text=${msg}`;
    }
  }

  // ==========================================================================
  // 4. EVENTOS PASO 1: IDENTIFICACIÓN
  // ==========================================================================
  if (btnQuickRiham) {
    btnQuickRiham.addEventListener("click", async () => {
      const user = await authService.quickDemoLogin("riham");
      showStep2(user);
    });
  }

  if (btnQuickJonathan) {
    btnQuickJonathan.addEventListener("click", async () => {
      const user = await authService.quickDemoLogin("jonathan");
      showStep2(user);
    });
  }

  if (btnToggleAdvanced && boxAdvancedForm) {
    btnToggleAdvanced.addEventListener("click", () => {
      boxAdvancedForm.classList.toggle("hidden");
    });
  }

  if (tabBtnLogin && tabBtnRegister) {
    tabBtnLogin.addEventListener("click", () => {
      isRegisterMode = false;
      tabBtnLogin.classList.add("active");
      tabBtnRegister.classList.remove("active");
      if (groupDisplayName) groupDisplayName.classList.add("hidden");
      if (authSubmitBtnText) authSubmitBtnText.textContent = "Iniciar Sesión";
      hideAlert();
    });

    tabBtnRegister.addEventListener("click", () => {
      isRegisterMode = true;
      tabBtnRegister.classList.add("active");
      tabBtnLogin.classList.remove("active");
      if (groupDisplayName) groupDisplayName.classList.remove("hidden");
      if (authSubmitBtnText) authSubmitBtnText.textContent = "Crear Cuenta 💕";
      hideAlert();
    });
  }

  if (formAuth) {
    formAuth.addEventListener("submit", async (e) => {
      e.preventDefault();
      hideAlert();
      const email = inputEmail.value.trim();
      const password = inputPassword.value;
      const displayName = inputName ? inputName.value.trim() : "";

      try {
        let user;
        if (isRegisterMode) {
          user = await authService.register(email, password, displayName);
        } else {
          user = await authService.login(email, password);
        }
        showStep2(user);
      } catch (err) {
        showAlert(err.message || "Error al procesar solicitud.");
      }
    });
  }

  // ==========================================================================
  // 5. EVENTOS PASO 2: EMPAREJAMIENTO Y ENTRADA AL PORTAL
  // ==========================================================================
  if (btnModeCreateSpace && btnModeJoinSpace) {
    btnModeCreateSpace.addEventListener("click", () => {
      btnModeCreateSpace.classList.add("active");
      btnModeJoinSpace.classList.remove("active");
      if (paneCreateSpace) paneCreateSpace.classList.remove("hidden");
      if (paneJoinSpace) paneJoinSpace.classList.add("hidden");
    });

    btnModeJoinSpace.addEventListener("click", () => {
      btnModeJoinSpace.classList.add("active");
      btnModeCreateSpace.classList.remove("active");
      if (paneJoinSpace) paneJoinSpace.classList.remove("hidden");
      if (paneCreateSpace) paneCreateSpace.classList.add("hidden");
      if (inputJoinCode) inputJoinCode.focus();
    });
  }

  if (btnCopyPairCode) {
    btnCopyPairCode.addEventListener("click", () => {
      const code = displayPairCode ? displayPairCode.textContent : "AMOR26";
      navigator.clipboard.writeText(code).then(() => {
        if (typeof window.showToast === "function") {
          window.showToast(`📋 ¡Código ${code} copiado al portapapeles!`);
        }
        btnCopyPairCode.innerHTML = `<i class="fa-solid fa-check"></i> ¡Copiado!`;
        setTimeout(() => {
          btnCopyPairCode.innerHTML = `<i class="fa-solid fa-copy"></i> Copiar Código`;
        }, 2500);
      });
    });
  }

  if (formJoinPair) {
    formJoinPair.addEventListener("submit", async (e) => {
      e.preventDefault();
      const code = inputJoinCode.value.trim();
      if (!code) return;

      try {
        const pair = await authService.joinPairSpace(code);
        updatePairUI(pair);
        sessionStorage.setItem("jonathan_session_entered", "true");
        if (typeof window.showToast === "function") {
          window.showToast("🎉 ¡Dispositivos emparejados con éxito en tiempo real! 💕");
        }
        unlockPortal();
      } catch (err) {
        alert(err.message || "Error al vincular con ese código.");
      }
    });
  }

  if (btnFinishPairing) {
    btnFinishPairing.addEventListener("click", () => {
      sessionStorage.setItem("jonathan_session_entered", "true");
      unlockPortal();
      const user = authService.getCurrentUser();
      const name = user ? user.displayName : "Amor";
      if (typeof window.showToast === "function") {
        window.showToast(`✨ ¡Bienvenido/a a nuestro espacio, ${name}! 💕`);
      }
      if (typeof confetti === "function") {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    });
  }

  if (btnCloseOverlay) {
    btnCloseOverlay.addEventListener("click", () => {
      const sessionEntered = sessionStorage.getItem("jonathan_session_entered") === "true";
      const user = authService.getCurrentUser();
      if (sessionEntered && user) {
        unlockPortal();
      }
    });
  }

  if (btnPairingLogout) {
    btnPairingLogout.addEventListener("click", () => {
      sessionStorage.removeItem("jonathan_session_entered");
      authService.logout();
      showStep1();
    });
  }

  // ==========================================================================
  // 6. NAVBAR STATUS CHIP & DROPDOWN
  // ==========================================================================
  if (navPairChip && pairDropdown) {
    navPairChip.addEventListener("click", (e) => {
      if (e.target.closest(".pair-dropdown-menu")) return;
      pairDropdown.classList.toggle("hidden");
    });

    document.addEventListener("click", (e) => {
      if (!navPairChip.contains(e.target)) {
        pairDropdown.classList.add("hidden");
      }
    });
  }

  if (btnDropdownOpenModal) {
    btnDropdownOpenModal.addEventListener("click", () => {
      if (pairDropdown) pairDropdown.classList.add("hidden");
      const user = authService.getCurrentUser();
      if (user) {
        showStep2(user);
      } else {
        showStep1();
      }
    });
  }

  if (btnDropdownCopyCode) {
    btnDropdownCopyCode.addEventListener("click", () => {
      const pair = authService.getCurrentPair();
      const code = pair ? pair.code : "AMOR26";
      navigator.clipboard.writeText(code).then(() => {
        if (typeof window.showToast === "function") {
          window.showToast(`📋 ¡Código ${code} copiado!`);
        }
      });
    });
  }

  if (btnDropdownLogout) {
    btnDropdownLogout.addEventListener("click", () => {
      if (pairDropdown) pairDropdown.classList.add("hidden");
      sessionStorage.removeItem("jonathan_session_entered");
      authService.logout();
      showStep1();
    });
  }

  // ==========================================================================
  // 7. SINCRONIZACIÓN MAESTRA DE ESTADO DE AUTENTICACIÓN
  // ==========================================================================
  function syncNavbarChip(user, pair) {
    if (!navPairChip) return;

    if (!user) {
      if (navChipNames) navChipNames.textContent = "Identificarse";
      if (navChipAvatar1) navChipAvatar1.textContent = "👤";
      if (navChipAvatar2) navChipAvatar2.textContent = "✨";
      return;
    }

    const isRiham = user.role === "riham";
    if (navChipAvatar1) navChipAvatar1.textContent = isRiham ? "👧🏻" : "👦🏻";
    if (navChipAvatar2) navChipAvatar2.textContent = isRiham ? "👦🏻" : "👧🏻";

    const partnerName = isRiham ? "Jonathan" : "Riham";
    if (navChipNames) navChipNames.textContent = `${user.displayName} & ${partnerName}`;

    if (dropdownUserName) dropdownUserName.textContent = `${user.displayName}`;
    if (dropdownUserLoc) dropdownUserLoc.textContent = user.location || "";
    if (dropdownPairCode) dropdownPairCode.textContent = `Código: ${pair ? pair.code : 'AMOR26'}`;
  }

  authService.onAuthStateChanged(user => syncNavbarChip(user, authService.getCurrentPair()));
  authService.onPairStateChanged(pair => syncNavbarChip(authService.getCurrentUser(), pair));

  // Comprobación al cargar la página: al abrir la web, lo primero es la pantalla de bienvenida/portada
  const sessionEntered = sessionStorage.getItem("jonathan_session_entered") === "true";
  const initialUser = authService.getCurrentUser();

  if (!sessionEntered || !initialUser) {
    if (initialUser) {
      showStep2(initialUser);
    } else {
      showStep1();
    }
  } else {
    syncNavbarChip(initialUser, authService.getCurrentPair());
    unlockPortal();
  }
});
