/* ==========================================================================
   PARA JONATHAN, MI AMOR - JAVASCRIPT PRINCIPAL UNIFICADO
   Experiencia Romántica Interactiva de Alto Nivel
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {

  // ==========================================================================
  // 1. CANVAS DE CORAZONES Y POLVO CÓSMICO FLOTANTE
  // ==========================================================================
  const canvas = document.getElementById("bg-love-canvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let particles = [];
    let mouse = { x: null, y: null, radius: 110 };

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    }

    class FloatingHeartParticle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 8 + 4;
        this.speedY = Math.random() * 0.5 + 0.2;
        this.speedX = (Math.random() - 0.5) * 0.35;
        this.opacity = Math.random() * 0.45 + 0.25;
        this.color = Math.random() > 0.4 ? "rgba(255, 117, 143," : "rgba(192, 132, 252,";
        this.isHeart = Math.random() > 0.45;
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.fillStyle = `${this.color} ${this.opacity})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = "rgba(255, 117, 143, 0.4)";

        if (this.isHeart) {
          ctx.beginPath();
          const s = this.size * 0.6;
          ctx.moveTo(0, s * 0.3);
          ctx.bezierCurveTo(-s, -s * 0.6, -s * 1.4, s * 0.6, 0, s * 1.5);
          ctx.bezierCurveTo(s * 1.4, s * 0.6, s, -s * 0.6, 0, s * 0.3);
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, this.size * 0.35, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      update() {
        this.y -= this.speedY;
        this.x += this.speedX;

        if (this.y < -20) {
          this.y = canvas.height + 20;
          this.x = Math.random() * canvas.width;
        }
        if (this.x < -20) this.x = canvas.width + 20;
        if (this.x > canvas.width + 20) this.x = -20;

        if (mouse.x != null && mouse.y != null) {
          const dx = this.x - mouse.x;
          const dy = this.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const angle = Math.atan2(dy, dx);
            this.x += Math.cos(angle) * 1.5;
            this.y += Math.sin(angle) * 1.5;
          }
        }
        this.draw();
      }
    }

    function initParticles() {
      particles = [];
      const count = Math.min(Math.floor(window.innerWidth / 20), 65);
      for (let i = 0; i < count; i++) {
        particles.push(new FloatingHeartParticle());
      }
    }

    function animateCanvas() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => p.update());
      requestAnimationFrame(animateCanvas);
    }

    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("mousemove", (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });
    window.addEventListener("mouseleave", () => {
      mouse.x = null;
      mouse.y = null;
    });

    resizeCanvas();
    animateCanvas();
  }

  // ==========================================================================
  // 2. CRONÓMETRO DE AMOR EN TIEMPO REAL (DESDE EL 21 DE MAYO DE 2026)
  // ==========================================================================
  const DEFAULT_DATE = "2026-05-21T00:00:00";
  let startDate = new Date(localStorage.getItem("love_start_date_jonathan") || DEFAULT_DATE);

  const daysEl = document.getElementById("timer-days");
  const hoursEl = document.getElementById("timer-hours");
  const minutesEl = document.getElementById("timer-minutes");
  const secondsEl = document.getElementById("timer-seconds");
  const totalSecondsEl = document.getElementById("live-total-seconds");
  const editDateChip = document.getElementById("edit-date-chip");
  const displayStartDate = document.getElementById("display-start-date");

  function pad(n) { return n < 10 ? "0" + n : n; }

  function updateTimer() {
    const now = new Date();
    let diff = now.getTime() - startDate.getTime();
    if (diff < 0) diff = 0;

    const totalSeconds = Math.floor(diff / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);
    const days = Math.floor(totalHours / 24);

    const hours = totalHours % 24;
    const minutes = totalMinutes % 60;
    const seconds = totalSeconds % 60;

    if (daysEl) daysEl.textContent = days;
    if (hoursEl) hoursEl.textContent = pad(hours);
    if (minutesEl) minutesEl.textContent = pad(minutes);
    if (secondsEl) secondsEl.textContent = pad(seconds);

    if (totalSecondsEl) {
      totalSecondsEl.textContent = `${totalSeconds.toLocaleString("es-ES")} segundos amándote cada día más ❤️`;
    }
  }

  if (displayStartDate) {
    displayStartDate.textContent = `21 Mayo ${startDate.getFullYear()}`;
  }

  if (editDateChip) {
    editDateChip.addEventListener("click", () => {
      const currentYear = startDate.getFullYear();
      const inputYear = prompt("¿En qué año empezó su historia el 21 de Mayo? (Ej: 2026):", currentYear);
      if (inputYear && !isNaN(inputYear)) {
        const yr = parseInt(inputYear, 10);
        startDate = new Date(`${yr}-05-21T00:00:00`);
        localStorage.setItem("love_start_date_jonathan", startDate.toISOString());
        if (displayStartDate) displayStartDate.textContent = `21 Mayo ${yr}`;
        updateTimer();
        if (window.confetti) window.confetti({ particleCount: 50, spread: 60 });
      }
    });
  }

  updateTimer();
  setInterval(updateTimer, 1000);

  // Botón "Enviarte un Abrazo" en el Hero
  const btnHeroSendHug = document.getElementById("btn-send-hug");
  if (btnHeroSendHug) {
    btnHeroSendHug.addEventListener("click", () => {
      showToast("¡Abrazo virtual enviado con éxito a Jonathan! 🫂❤️");
      if (window.confetti) {
        window.confetti({ particleCount: 110, spread: 80, origin: { y: 0.6 } });
      }
    });
  }

  // ==========================================================================
  // 3. GLOBO TERRÁQUEO 3D HIPERREALISTA DE LA TIERRA DESDE EL ESPACIO (THREE.JS)
  // Texturas satelitales NASA + Marcadores destacados (Rojo Fuerte & Verde Fuerte)
  // ==========================================================================
  (function initGlobe() {
    const container = document.getElementById("globe-3d-canvas-container");
    const loadingEl = document.getElementById("globe-loading-indicator");
    if (!container) return;

    const LOCATIONS = {
      // Ecuador (Guayaquil): Marcador ROJO FUERTE DE ALTO CONTRASTE
      ecuador: { name: "Guayaquil, Ecuador 🇪🇨", lat: -2.1894, lon: -79.8891, color: 0xff0044, ringColor: 0xff1744 },
      // España (Cataluña): Marcador VERDE FUERTE DE ALTO CONTRASTE
      spain: { name: "Cataluña, España 🇪🇸", lat: 41.3851, lon: 2.1734, color: 0x00e676, ringColor: 0x00ff88 }
    };
    const GLOBE_RADIUS = 25;

    let scene, camera, renderer, controls, arcCurve, photonMesh, earthMesh, cloudsMesh;
    let animProgress = 0;
    let isAutoRotating = true;
    const pulseRings = [];

    function latLonToVector3(lat, lon, radius, alt = 0) {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);
      const r = radius + alt;
      const x = -(r * Math.sin(phi) * Math.cos(theta));
      const z = r * Math.sin(phi) * Math.sin(theta);
      const y = r * Math.cos(phi);
      return new THREE.Vector3(x, y, z);
    }

    function setupScene() {
      const w = container.clientWidth || 800;
      const h = container.clientHeight || 600;

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 1500);
      camera.position.set(0, 15, 72);

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.05;
      container.appendChild(renderer.domElement);

      controls = new THREE.OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.06;
      controls.minDistance = 32;
      controls.maxDistance = 110;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.35;
      controls.enablePan = false;

      // ==========================================
      // ILUMINACIÓN REALISTA DEL ESPACIO
      // ==========================================
      const sunLight = new THREE.DirectionalLight(0xffffff, 1.4);
      sunLight.position.set(60, 30, 50);
      scene.add(sunLight);

      const ambientLight = new THREE.AmbientLight(0xdbeafe, 0.45);
      scene.add(ambientLight);

      const nightFillLight = new THREE.DirectionalLight(0x1e1b4b, 0.35);
      nightFillLight.position.set(-60, -20, -50);
      scene.add(nightFillLight);

      // ==========================================
      // CAMPO DE ESTRELLAS CÓSMICO
      // ==========================================
      const starGeo = new THREE.BufferGeometry();
      const starCount = 1400;
      const starPos = new Float32Array(starCount * 3);
      for (let i = 0; i < starCount * 3; i += 3) {
        const r = 300 + Math.random() * 300;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);
        starPos[i] = r * Math.sin(phi) * Math.cos(theta);
        starPos[i + 1] = r * Math.sin(phi) * Math.sin(theta);
        starPos[i + 2] = r * Math.cos(phi);
      }
      starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
      const starMat = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 1.1,
        transparent: true,
        opacity: 0.8
      });
      scene.add(new THREE.Points(starGeo, starMat));

      // ==========================================
      // CARGA DE TEXTURAS FOTOGRÁFICAS SATELITALES NASA
      // ==========================================
      const textureLoader = new THREE.TextureLoader();
      
      const dayMap = textureLoader.load('assets/earth/earth_day_2048.jpg', () => hideLoading());
      const normalMap = textureLoader.load('assets/earth/earth_normal_2048.jpg');
      const specMap = textureLoader.load('assets/earth/earth_specular_2048.jpg');
      const cloudsMap = textureLoader.load('assets/earth/earth_clouds_1024.png');

      // 1. Esfera del Planeta Tierra Realista
      const earthGeo = new THREE.SphereGeometry(GLOBE_RADIUS, 64, 64);
      const earthMat = new THREE.MeshPhongMaterial({
        map: dayMap,
        normalMap: normalMap,
        normalScale: new THREE.Vector2(0.85, 0.85),
        specularMap: specMap,
        specular: new THREE.Color(0x384858),
        shininess: 25
      });
      earthMesh = new THREE.Mesh(earthGeo, earthMat);
      scene.add(earthMesh);

      // 2. Capa de Nubes Realista en 3D
      const cloudsGeo = new THREE.SphereGeometry(GLOBE_RADIUS * 1.012, 64, 64);
      const cloudsMat = new THREE.MeshPhongMaterial({
        map: cloudsMap,
        transparent: true,
        opacity: 0.82,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      cloudsMesh = new THREE.Mesh(cloudsGeo, cloudsMat);
      scene.add(cloudsMesh);

      // 3. Resplandor Atmosférico Rayleigh
      const atmosVertexShader = `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `;
      const atmosFragmentShader = `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.68 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.8);
          gl_FragColor = vec4(0.38, 0.68, 1.0, 1.0) * intensity;
        }
      `;
      const atmosMat = new THREE.ShaderMaterial({
        vertexShader: atmosVertexShader,
        fragmentShader: atmosFragmentShader,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
        transparent: true
      });
      const atmosMesh = new THREE.Mesh(new THREE.SphereGeometry(GLOBE_RADIUS * 1.12, 64, 64), atmosMat);
      scene.add(atmosMesh);

      // ==========================================
      // MARCADORES DESTACADOS Y DE ALTO CONTRASTE (ROJO FUERTE Y VERDE FUERTE)
      // ==========================================
      function addDistinctMarker(loc) {
        const basePos = latLonToVector3(loc.lat, loc.lon, GLOBE_RADIUS, 0.2);
        const headPos = latLonToVector3(loc.lat, loc.lon, GLOBE_RADIUS, 1.5);

        // 1. Pilar / Pin vertical de luz elevándose del suelo
        const pinGeo = new THREE.CylinderGeometry(0.12, 0.12, 1.3, 16);
        const pinMat = new THREE.MeshBasicMaterial({ color: loc.color });
        const pinMesh = new THREE.Mesh(pinGeo, pinMat);
        pinMesh.position.copy(basePos.clone().lerp(headPos, 0.5));
        pinMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), basePos.clone().normalize());
        scene.add(pinMesh);

        // 2. Esfera cabezal brillante principal
        const dotMesh = new THREE.Mesh(
          new THREE.SphereGeometry(0.85, 20, 20),
          new THREE.MeshBasicMaterial({ color: loc.color })
        );
        dotMesh.position.copy(headPos);
        scene.add(dotMesh);

        // 3. Núcleo central blanco brillante para máximo contraste
        const coreMesh = new THREE.Mesh(
          new THREE.SphereGeometry(0.42, 16, 16),
          new THREE.MeshBasicMaterial({ color: 0xffffff })
        );
        coreMesh.position.copy(headPos);
        scene.add(coreMesh);

        // 4. Anillo de radar pulsante concéntrico sobre la superficie
        const ring = new THREE.Mesh(
          new THREE.RingGeometry(0.8, 1.8, 32),
          new THREE.MeshBasicMaterial({ color: loc.ringColor, side: THREE.DoubleSide, transparent: true, opacity: 0.9 })
        );
        ring.position.copy(basePos.clone().multiplyScalar(1.015));
        ring.lookAt(basePos.clone().multiplyScalar(2));
        scene.add(ring);
        pulseRings.push(ring);
      }

      addDistinctMarker(LOCATIONS.ecuador);
      addDistinctMarker(LOCATIONS.spain);

      // ==========================================
      // LÍNEA CURVA LUMINOSA Y ULTRA VISIBLE (ARCO 3D)
      // ==========================================
      const pGye = latLonToVector3(LOCATIONS.ecuador.lat, LOCATIONS.ecuador.lon, GLOBE_RADIUS, 1.5);
      const pCat = latLonToVector3(LOCATIONS.spain.lat, LOCATIONS.spain.lon, GLOBE_RADIUS, 1.5);
      const mid = pGye.clone().lerp(pCat, 0.5);
      const alt = pGye.distanceTo(pCat) * 0.48;
      mid.normalize().multiplyScalar(GLOBE_RADIUS + alt);

      arcCurve = new THREE.QuadraticBezierCurve3(pGye, mid, pCat);
      
      // 1. Tubo 3D luminoso principal de neón
      const tubeGeo = new THREE.TubeGeometry(arcCurve, 100, 0.3, 12, false);
      const tubeMat = new THREE.MeshBasicMaterial({
        color: 0xff758f,
        transparent: true,
        opacity: 0.9
      });
      const tubeMesh = new THREE.Mesh(tubeGeo, tubeMat);
      scene.add(tubeMesh);

      // 2. Halo exterior difuso brillante
      const glowTubeGeo = new THREE.TubeGeometry(arcCurve, 100, 0.6, 12, false);
      const glowTubeMat = new THREE.MeshBasicMaterial({
        color: 0xffb3c6,
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending
      });
      const glowTubeMesh = new THREE.Mesh(glowTubeGeo, glowTubeMat);
      scene.add(glowTubeMesh);

      // 3. Línea central de luz de alta precisión
      const arcGeo = new THREE.BufferGeometry().setFromPoints(arcCurve.getPoints(120));
      const arcLine = new THREE.Line(
        arcGeo, 
        new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 2.5, transparent: true, opacity: 0.98 })
      );
      scene.add(arcLine);

      // 4. Fotón / Cometa de luz viajero
      photonMesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.9, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
      );
      const photonGlow = new THREE.Mesh(
        new THREE.SphereGeometry(1.5, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0xff758f, transparent: true, opacity: 0.7, blending: THREE.AdditiveBlending })
      );
      photonMesh.add(photonGlow);
      scene.add(photonMesh);

      function hideLoading() {
        if (loadingEl) {
          loadingEl.style.opacity = "0";
          setTimeout(() => loadingEl.style.display = "none", 400);
        }
      }
      setTimeout(hideLoading, 1200);

      setupCamButtons();
      renderLoop();
    }

    function setupCamButtons() {
      const btnGye = document.getElementById("btn-focus-ecuador");
      const btnCat = document.getElementById("btn-focus-spain");
      const btnBoth = document.getElementById("btn-focus-both");
      const btnRot = document.getElementById("btn-toggle-autorotate");

      function focus(lat, lon, zoom = 46) {
        controls.autoRotate = false;
        const target = latLonToVector3(lat, lon, zoom);
        const start = camera.position.clone();
        const startTime = performance.now();
        function update(now) {
          const progress = Math.min((now - startTime) / 1000, 1);
          const ease = 0.5 - Math.cos(progress * Math.PI) / 2;
          camera.position.lerpVectors(start, target, ease);
          camera.lookAt(0, 0, 0);
          if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
      }

      if (btnGye) btnGye.addEventListener("click", () => focus(LOCATIONS.ecuador.lat, LOCATIONS.ecuador.lon));
      if (btnCat) btnCat.addEventListener("click", () => focus(LOCATIONS.spain.lat, LOCATIONS.spain.lon));
      if (btnBoth) btnBoth.addEventListener("click", () => focus(20, -38, 72));
      if (btnRot) {
        btnRot.addEventListener("click", () => {
          isAutoRotating = !isAutoRotating;
          controls.autoRotate = isAutoRotating;
          btnRot.classList.toggle("active", isAutoRotating);
        });
      }

      window.addEventListener("resize", () => {
        if (!container || !renderer || !camera) return;
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
      });
    }

    function renderLoop() {
      requestAnimationFrame(renderLoop);
      if (cloudsMesh) cloudsMesh.rotation.y += 0.00025;
      if (arcCurve && photonMesh) {
        animProgress += 0.0035;
        if (animProgress > 1) animProgress = 0;
        photonMesh.position.copy(arcCurve.getPoint(animProgress));
      }
      pulseRings.forEach((ring, idx) => {
        const s = 1 + (Math.sin(Date.now() * 0.004 + idx * 1.5) * 0.22);
        ring.scale.set(s, s, s);
      });
      controls.update();
      renderer.render(scene, camera);
    }

    setupScene();
  })();

  // Relojes duales Guayaquil / Cataluña
  function updateDualClocks() {
    const clockGye = document.getElementById("clock-guayaquil");
    const clockCat = document.getElementById("clock-catalunya");
    const diffEl = document.getElementById("clock-tz-diff");
    const now = new Date();

    const gyeStr = new Intl.DateTimeFormat("es-EC", { timeZone: "America/Guayaquil", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }).format(now);
    const catStr = new Intl.DateTimeFormat("es-ES", { timeZone: "Europe/Madrid", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }).format(now);

    if (clockGye) clockGye.textContent = gyeStr;
    if (clockCat) clockCat.textContent = catStr;

    const gyeH = parseInt(gyeStr.split(":")[0], 10);
    const catH = parseInt(catStr.split(":")[0], 10);
    let diff = catH - gyeH;
    if (diff < 0) diff += 24;
    if (diffEl) diffEl.textContent = `${diff}h diferencia`;
  }
  setInterval(updateDualClocks, 1000);
  updateDualClocks();

  // ==========================================================================
  // 4. RECORDATORIO DE FECHAS SAGRADAS & EXPORTACIÓN A CALENDARIO
  // ==========================================================================
  const DEFAULT_DATES = [
    {
      id: "date-may21",
      title: 'El día que empezó todo (empezamos a hablar)',
      exactDay: '21 de Mayo (2026)',
      tag: 'El Comienzo',
      tagClass: 'default-tag',
      emoji: '💬',
      desc: '',
      secret: '21 de Mayo ❤️',
      month: 4, // Mayo (0-indexed)
      day: 21,
      year: 2026,
      isDefault: true
    },
    {
      id: "date-jan05",
      title: 'Cumpleaños de Jonathan',
      exactDay: '05 de Enero (2006)',
      tag: 'Cumpleaños',
      tagClass: 'birthday-tag',
      emoji: '🎂',
      desc: '',
      secret: '¡Feliz Cumpleaños Jonathan! 🎂🎉',
      month: 0, // Enero
      day: 5,
      year: 2006,
      isDefault: true
    },
    {
      id: "date-nov21",
      title: 'Cumpleaños de Riham',
      exactDay: '21 de Noviembre (2006)',
      tag: 'Cumpleaños',
      tagClass: 'alert-tag',
      emoji: '👑',
      desc: '',
      secret: '¡Feliz Cumpleaños Riham! 👑🌸',
      month: 10, // Noviembre
      day: 21,
      year: 2006,
      isDefault: true
    }
  ];

  function getDates() {
    try {
      localStorage.removeItem("jonathan_special_dates");
      const saved = localStorage.getItem("jonathan_special_dates_v2");
      return saved ? JSON.parse(saved) : DEFAULT_DATES;
    } catch (e) {
      return DEFAULT_DATES;
    }
  }
  function saveDates(dates) {
    localStorage.setItem("jonathan_special_dates_v2", JSON.stringify(dates));
  }

  function calcDaysToNext(targetMonth, targetDay) {
    const now = new Date();
    const curYear = now.getFullYear();
    let target = new Date(curYear, targetMonth, targetDay);
    if (now.getMonth() === targetMonth && now.getDate() === targetDay) {
      return { isToday: true, days: 0 };
    }
    if (now > target) {
      target = new Date(curYear + 1, targetMonth, targetDay);
    }
    const diffDays = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
    return { isToday: false, days: diffDays };
  }

  const datesContainer = document.getElementById("dates-cards-container");
  const datesCountTag = document.getElementById("dates-total-count");

  function renderDates() {
    if (!datesContainer) return;
    const dates = getDates();
    if (datesCountTag) datesCountTag.textContent = dates.length;
    datesContainer.innerHTML = "";

    dates.forEach(item => {
      const countdown = calcDaysToNext(item.month, item.day);
      const card = document.createElement("div");
      card.className = `date-card glass-panel ${item.tagClass || ''}`;
      card.id = item.id;

      card.innerHTML = `
        <div class="date-card-tag ${item.tagClass || ''}"><i class="fa-solid fa-heart"></i> ${item.tag}</div>
        ${!item.isDefault ? `<button class="btn-card-top-delete" title="Eliminar fecha"><i class="fa-solid fa-trash-can"></i></button>` : ''}
        <div class="date-emoji-wrap"><span class="date-big-emoji">${item.emoji || '💖'}</span></div>
        <div class="date-exact-day">${item.exactDay}</div>
        <h3 class="date-title-text">${item.title}</h3>
        ${item.desc ? `<p class="date-desc-text">${item.desc}</p>` : ''}
        <div class="date-countdown-pill">
          ${countdown.isToday 
            ? '<i class="fa-solid fa-sparkles"></i> <strong>¡ES HOY! ¡A CELEBRAR! 🎉</strong>' 
            : `<i class="fa-solid fa-clock"></i> Faltan <strong>${countdown.days} días</strong>`}
        </div>
        <div class="date-secret-drawer">
          <div class="secret-message-box">
            <i class="fa-solid fa-heart-circle-check"></i>
            <p>${item.secret}</p>
          </div>
        </div>
        <div class="date-card-actions-group">
          <button class="btn-reveal-date">
            <span>Ver secreto</span> <i class="fa-solid fa-wand-magic-sparkles"></i>
          </button>
          <button class="btn-save-cal-date" title="Guardar recordatorio en calendario">
            <i class="fa-solid fa-calendar-plus"></i> <span>Guardar en Calendario</span>
          </button>
        </div>
      `;

      // Evento Ver Secreto
      const btnReveal = card.querySelector(".btn-reveal-date");
      btnReveal.addEventListener("click", () => {
        card.classList.toggle("revealed");
        if (window.confetti) window.confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      });

      // Evento Guardar en Calendario
      const btnCal = card.querySelector(".btn-save-cal-date");
      btnCal.addEventListener("click", () => openCalendarModal(item));

      // Evento Eliminar si es personalizada
      const btnDel = card.querySelector(".btn-card-top-delete");
      if (btnDel) {
        btnDel.addEventListener("click", () => {
          if (confirm(`¿Eliminar el recordatorio "${item.title}"?`)) {
            const updated = dates.filter(d => d.id !== item.id);
            saveDates(updated);
            renderDates();
            if (window.AuthPairingService) {
              window.AuthPairingService.syncPairData("date", { action: "delete", id: item.id });
            }
          }
        });
      }

      datesContainer.appendChild(card);
    });
  }

  // Generador de archivo .ics descargable y enlace Google Calendar
  function generateIcs(item) {
    const padNum = (n) => (n < 10 ? "0" + n : n);
    const now = new Date();
    const curYear = now.getFullYear();
    const m = padNum(item.month + 1);
    const d = padNum(item.day);
    const dtStart = `${curYear}${m}${d}`;
    const dtEnd = `${curYear}${m}${d}`;

    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Jonathan & Riham//Love Calendar//ES",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      `UID:love-event-${item.id}-${Date.now()}@jonathan-riham.com`,
      `DTSTAMP:${curYear}0101T000000Z`,
      `DTSTART;VALUE=DATE:${dtStart}`,
      `DTEND;VALUE=DATE:${dtEnd}`,
      `SUMMARY:💖 ${item.title}`,
      `DESCRIPTION:${item.desc} | Celebrando nuestro amor eterno.`,
      "RRULE:FREQ=YEARLY",
      "BEGIN:VALARM",
      "TRIGGER:-PT9H",
      "ACTION:DISPLAY",
      `DESCRIPTION:Recordatorio de Amor: ${item.title}`,
      "END:VALARM",
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${item.title.replace(/[^\w\s]/gi, '').trim() || 'Fecha_Especial'}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  let selectedCalItem = null;
  const modalCalendar = document.getElementById("modal-save-calendar");
  const calTitle = document.getElementById("calendar-event-title");
  const btnDownloadIcs = document.getElementById("btn-download-ics");
  const btnOpenGcal = document.getElementById("btn-open-gcal");
  const btnCloseCal = document.getElementById("btn-close-calendar-modal");

  function openCalendarModal(item) {
    selectedCalItem = item;
    if (calTitle) calTitle.textContent = `${item.emoji || '💖'} ${item.title} (${item.exactDay})`;
    if (modalCalendar) modalCalendar.classList.remove("hidden");
  }

  if (btnCloseCal) btnCloseCal.addEventListener("click", () => modalCalendar.classList.add("hidden"));
  if (modalCalendar) {
    modalCalendar.addEventListener("click", (e) => {
      if (e.target === modalCalendar) modalCalendar.classList.add("hidden");
    });
  }

  if (btnDownloadIcs) {
    btnDownloadIcs.addEventListener("click", () => {
      if (selectedCalItem) {
        generateIcs(selectedCalItem);
        showToast("📅 ¡Archivo .ics descargado! Ábrelo para agregarlo a tu calendario.");
        if (window.confetti) window.confetti({ particleCount: 60, spread: 70 });
      }
    });
  }

  if (btnOpenGcal) {
    btnOpenGcal.addEventListener("click", () => {
      if (selectedCalItem) {
        const padNum = (n) => (n < 10 ? "0" + n : n);
        const curYear = new Date().getFullYear();
        const m = padNum(selectedCalItem.month + 1);
        const d = padNum(selectedCalItem.day);
        const dt = `${curYear}${m}${d}`;
        const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent('💖 ' + selectedCalItem.title)}&dates=${dt}/${dt}&details=${encodeURIComponent(selectedCalItem.desc + ' - Nuestro rincón de amor')}&recur=RRULE:FREQ=YEARLY`;
        window.open(gcalUrl, "_blank");
      }
    });
  }

  // Modal Añadir Fecha Especial
  const modalAddDate = document.getElementById("modal-add-date");
  const btnOpenAddDate = document.getElementById("btn-open-add-date");
  const btnCloseAddDate = document.getElementById("btn-close-add-date");
  const btnCancelAddDate = document.getElementById("btn-cancel-add-date");
  const formAddDate = document.getElementById("form-add-date");

  if (btnOpenAddDate) btnOpenAddDate.addEventListener("click", () => modalAddDate.classList.remove("hidden"));
  function closeAddDate() {
    modalAddDate.classList.add("hidden");
    formAddDate.reset();
  }
  if (btnCloseAddDate) btnCloseAddDate.addEventListener("click", closeAddDate);
  if (btnCancelAddDate) btnCancelAddDate.addEventListener("click", closeAddDate);

  if (formAddDate) {
    formAddDate.addEventListener("submit", (e) => {
      e.preventDefault();
      const title = document.getElementById("input-date-title").value.trim();
      const dateVal = document.getElementById("input-date-value").value;
      const emoji = document.getElementById("select-date-emoji").value;
      const tag = document.getElementById("input-date-tag").value.trim();
      const desc = document.getElementById("input-date-desc").value.trim();
      const secret = document.getElementById("input-date-secret").value.trim();

      if (!title || !dateVal) return;

      const dateParts = dateVal.split("-");
      const yr = parseInt(dateParts[0], 10);
      const mo = parseInt(dateParts[1], 10) - 1;
      const dy = parseInt(dateParts[2], 10);

      const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
      const exactDayStr = `${pad(dy)} de ${monthNames[mo]} (${yr})`;

      const newDateItem = {
        id: "date-" + Date.now(),
        title: title,
        exactDay: exactDayStr,
        tag: tag || "Momento Especial",
        tagClass: "default-tag",
        emoji: emoji || "💖",
        desc: desc,
        secret: secret || "¡Un momento inolvidable juntos! 💖",
        month: mo,
        day: dy,
        year: yr,
        isDefault: false
      };
      dates.push(newDateItem);

      saveDates(dates);
      renderDates();
      closeAddDate();

      if (window.AuthPairingService) {
        window.AuthPairingService.syncPairData("date", { action: "add", date: newDateItem });
      }

      showToast("📅 ¡Nueva fecha especial guardada con éxito!");
      if (window.confetti) window.confetti({ particleCount: 70, spread: 70 });
    });
  }

  renderDates();

  // ==========================================================================
  // 5. GALERÍA GAMER Y SUBIDA DIRECTA DE FOTOS
  // ==========================================================================
  function createArtwork(game, title, c1, c2, icon) {
    const cvs = document.createElement("canvas");
    cvs.width = 600; cvs.height = 400;
    const c = cvs.getContext("2d");
    const g = c.createLinearGradient(0, 0, cvs.width, cvs.height);
    g.addColorStop(0, c1); g.addColorStop(1, c2);
    c.fillStyle = g; c.fillRect(0, 0, cvs.width, cvs.height);

    // Decoración estelar
    c.fillStyle = "rgba(255, 255, 255, 0.15)";
    for (let i = 0; i < 40; i++) {
      c.beginPath();
      c.arc(Math.random() * cvs.width, Math.random() * cvs.height, Math.random() * 3, 0, Math.PI * 2);
      c.fill();
    }

    c.font = "72px sans-serif";
    c.textAlign = "center"; c.textBaseline = "middle";
    c.fillText(icon, cvs.width / 2, cvs.height / 2 - 25);

    c.font = "bold 26px sans-serif";
    c.fillStyle = "#ffffff";
    c.fillText(game.toUpperCase(), cvs.width / 2, cvs.height / 2 + 50);

    c.font = "italic 18px serif";
    c.fillStyle = "rgba(255, 255, 255, 0.88)";
    c.fillText(title, cvs.width / 2, cvs.height / 2 + 85);
    return cvs.toDataURL("image/png");
  }

  // ==========================================================================
  // 5. GALERÍA GAMER: FOTOS REALES ORGANIZADAS POR JUEGO (ROBLOX, MINECRAFT, ARENA BREAKOUT)
  // ==========================================================================
  
  // 1. Fotos de Roblox (21 fotos)
  const ROBLOX_MEMORIES = Array.from({ length: 21 }, (_, i) => ({
    id: `rbx-${i + 1}`,
    game: "roblox",
    gameName: "Roblox",
    badge: "🎲",
    title: `Roblox · Foto ${i + 1}`,
    desc: "",
    date: "Roblox",
    likes: 1,
    img: `assets/gallery/roblox/roblox_${i + 1}.jpeg`
  }));

  // 2. Fotos de Minecraft (16 fotos)
  const MINECRAFT_MEMORIES = Array.from({ length: 16 }, (_, i) => ({
    id: `mc-${i + 1}`,
    game: "minecraft",
    gameName: "Minecraft",
    badge: "🧱",
    title: `Minecraft · Foto ${i + 1}`,
    desc: "",
    date: "Minecraft",
    likes: 1,
    img: `assets/gallery/minecraft/minecraft_${i + 1}.jpeg`
  }));

  // 3. Fotos de Arena Breakout (8 fotos)
  const ARENA_BREAKOUT_MEMORIES = Array.from({ length: 8 }, (_, i) => ({
    id: `ab-${i + 1}`,
    game: "arena_breakout",
    gameName: "Arena Breakout",
    badge: "🎯",
    title: `Arena Breakout · Foto ${i + 1}`,
    desc: "",
    date: "Arena Breakout",
    likes: 1,
    img: `assets/gallery/arena_breakout/arena_breakout_${i + 1}.jpeg`
  }));

  // Lista unificada completa de todas las 45 fotos gamer reales
  const DEFAULT_GAMER_MEMORIES = [...ROBLOX_MEMORIES, ...MINECRAFT_MEMORIES, ...ARENA_BREAKOUT_MEMORIES];

  function getGamerMemories() {
    try {
      localStorage.removeItem("jonathan_gamer_memories_custom_v1");
      localStorage.removeItem("jonathan_gamer_memories_custom_v2");
      localStorage.removeItem("jonathan_gamer_memories_custom_v3");
      localStorage.removeItem("jonathan_gamer_memories_custom_v4");
      const saved = localStorage.getItem("jonathan_gamer_memories_custom_v5");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn("Parse error for gamer memories", e);
    }
    return DEFAULT_GAMER_MEMORIES;
  }

  function saveGamerMemories(memories) {
    localStorage.setItem("jonathan_gamer_memories_custom_v5", JSON.stringify(memories));
  }

  let curFilter = "all";
  const galleryGrid = document.getElementById("gamer-gallery-grid");
  const countPill = document.getElementById("gallery-total-count");

  function renderGallery() {
    if (!galleryGrid) return;
    const memories = getGamerMemories();
    const filtered = curFilter === "all" ? memories : memories.filter(m => m.game === curFilter);

    if (countPill) countPill.textContent = filtered.length;
    galleryGrid.innerHTML = "";

    filtered.forEach(item => {
      const card = document.createElement("div");
      card.className = "gamer-card-item";
      card.innerHTML = `
        <div class="gamer-card-media">
          <img class="gamer-card-img" src="${item.img}" alt="${item.title}" loading="lazy" onerror="this.src='assets/roblox/roblox_1.jpeg'">
          <div class="gamer-card-tag"><span>${item.badge || "🎮"}</span> ${item.gameName}</div>
          <button class="gamer-card-edit-btn" title="Personalizar título, fecha o dedicatoria"><i class="fa-solid fa-pen-to-square"></i></button>
          <button class="gamer-card-like-btn" title="Me encanta"><i class="fa-solid fa-heart"></i></button>
        </div>
        <div class="gamer-card-body">
          <div class="gamer-card-date"><i class="fa-regular fa-calendar"></i> ${item.date}</div>
          <h3 class="gamer-card-title">${item.title}</h3>
          ${item.desc ? `<p class="gamer-card-desc">${item.desc}</p>` : ''}
          <div class="gamer-card-footer">
            <span><i class="fa-solid fa-expand"></i> Ver foto</span>
            <span><i class="fa-solid fa-heart"></i> ${item.likes || 1}</span>
          </div>
        </div>
      `;

      card.addEventListener("click", (e) => {
        if (e.target.closest(".gamer-card-like-btn") || e.target.closest(".gamer-card-edit-btn")) return;
        openLightbox(item);
      });

      const editBtn = card.querySelector(".gamer-card-edit-btn");
      if (editBtn) {
        editBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          openEditMemoryModal(item);
        });
      }

      const likeBtn = card.querySelector(".gamer-card-like-btn");
      likeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        item.likes = (item.likes || 0) + 1;
        saveGamerMemories(memories);
        renderGallery();
        if (window.AuthPairingService) {
          window.AuthPairingService.syncPairData("photo", { gallery: "gamer", action: "like", id: item.id, likes: item.likes });
        }
        if (window.confetti) window.confetti({ particleCount: 25, spread: 40 });
      });

      galleryGrid.appendChild(card);
    });
  }

  // Filtros de la Galería Gamer
  document.querySelectorAll(".chip-filter").forEach(chip => {
    chip.addEventListener("click", () => {
      document.querySelectorAll(".chip-filter").forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      curFilter = chip.dataset.filter;
      renderGallery();
    });
  });

  renderGallery();

  // ==========================================================================
  // 5.1 SECCIÓN EXCLUSIVA "NOSOTROS" (FOTOS REALES Y PERSONALES)
  // ==========================================================================
  const DEFAULT_NOSOTROS_PHOTOS = [
    {
      id: "nos-1",
      title: "Foto 1",
      desc: "",
      date: "Nosotros",
      tag: "Nosotros ✨",
      likes: 1,
      img: "assets/gallery/nosotros/nosotros_1.jpeg"
    },
    {
      id: "nos-2",
      title: "Foto 2",
      desc: "",
      date: "Nosotros",
      tag: "Nosotros ✨",
      likes: 1,
      img: "assets/gallery/nosotros/nosotros_2.jpeg"
    },
    {
      id: "nos-3",
      title: "Foto 3",
      desc: "",
      date: "Nosotros",
      tag: "Nosotros ✨",
      likes: 1,
      img: "assets/gallery/nosotros/nosotros_3.jpeg"
    }
  ];

  function getNosotrosPhotos() {
    try {
      localStorage.removeItem("jonathan_nosotros_photos_custom_v1");
      localStorage.removeItem("jonathan_nosotros_photos_custom_v2");
      localStorage.removeItem("jonathan_nosotros_photos_custom_v3");
      localStorage.removeItem("jonathan_nosotros_photos_custom_v4");
      const saved = localStorage.getItem("jonathan_nosotros_photos_custom_v5");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn("Parse error for nosotros photos", e);
    }
    return DEFAULT_NOSOTROS_PHOTOS;
  }

  function saveNosotrosPhotos(photos) {
    localStorage.setItem("jonathan_nosotros_photos_custom_v5", JSON.stringify(photos));
  }

  const nosotrosGrid = document.getElementById("nosotros-gallery-grid");
  const nosotrosCountTag = document.getElementById("nosotros-total-count");

  function renderNosotros() {
    if (!nosotrosGrid) return;
    const photos = getNosotrosPhotos();
    if (nosotrosCountTag) nosotrosCountTag.textContent = photos.length;
    nosotrosGrid.innerHTML = "";

    photos.forEach(item => {
      const card = document.createElement("div");
      card.className = "nosotros-polaroid-card glass-panel";
      card.innerHTML = `
        <div class="polaroid-tape"></div>
        <div class="polaroid-image-holder">
          <img src="${item.img}" alt="${item.title}" loading="lazy" onerror="this.src='assets/gallery/nosotros/nosotros_1.jpeg'">
          <div class="polaroid-tag-badge"><i class="fa-solid fa-heart"></i> ${item.tag || "Nosotros"}</div>
        </div>
        <div class="polaroid-details">
          <div class="polaroid-date"><i class="fa-regular fa-calendar-heart"></i> ${item.date}</div>
          <h3 class="polaroid-title">${item.title}</h3>
          ${item.desc ? `<p class="polaroid-desc">"${item.desc}"</p>` : ''}
          <div class="polaroid-actions">
            <button class="btn-nosotros-zoom"><i class="fa-solid fa-expand"></i> Ver foto</button>
            <button class="btn-nosotros-edit" title="Personalizar título, fecha o dedicatoria"><i class="fa-solid fa-pen-to-square"></i> Editar</button>
            <button class="btn-nosotros-like"><i class="fa-solid fa-heart"></i> <span>${item.likes || 1}</span></button>
          </div>
        </div>
      `;

      card.addEventListener("click", (e) => {
        if (e.target.closest(".btn-nosotros-like") || e.target.closest(".btn-nosotros-edit")) return;
        openLightbox({
          id: item.id,
          gameName: item.tag || "Nosotros",
          date: item.date,
          title: item.title,
          desc: item.desc,
          likes: item.likes,
          img: item.img
        });
      });

      const editBtn = card.querySelector(".btn-nosotros-edit");
      if (editBtn) {
        editBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          openEditMemoryModal(item);
        });
      }

      const likeBtn = card.querySelector(".btn-nosotros-like");
      likeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        item.likes = (item.likes || 0) + 1;
        saveNosotrosPhotos(photos);
        likeBtn.querySelector("span").textContent = item.likes;
        if (window.AuthPairingService) {
          window.AuthPairingService.syncPairData("photo", { gallery: "nosotros", action: "like", id: item.id, likes: item.likes });
        }
        if (window.confetti) window.confetti({ particleCount: 35, spread: 50, origin: { y: 0.7 } });
      });

      nosotrosGrid.appendChild(card);
    });
  }

  // Modal Añadir Foto a Nosotros
  const modalUploadNosotros = document.getElementById("modal-upload-nosotros");
  const btnOpenUploadNosotros = document.getElementById("btn-open-upload-nosotros");
  const btnCloseUploadNosotros = document.getElementById("btn-close-upload-nosotros");
  const btnCancelUploadNosotros = document.getElementById("btn-cancel-upload-nosotros");
  const formUploadNosotros = document.getElementById("form-upload-nosotros");

  if (btnOpenUploadNosotros) btnOpenUploadNosotros.addEventListener("click", () => modalUploadNosotros.classList.remove("hidden"));
  function closeUploadNosotros() {
    if (modalUploadNosotros) modalUploadNosotros.classList.add("hidden");
    if (formUploadNosotros) formUploadNosotros.reset();
  }
  if (btnCloseUploadNosotros) btnCloseUploadNosotros.addEventListener("click", closeUploadNosotros);
  if (btnCancelUploadNosotros) btnCancelUploadNosotros.addEventListener("click", closeUploadNosotros);
  if (modalUploadNosotros) {
    modalUploadNosotros.addEventListener("click", (e) => {
      if (e.target === modalUploadNosotros) closeUploadNosotros();
    });
  }

  if (formUploadNosotros) {
    formUploadNosotros.addEventListener("submit", (e) => {
      e.preventDefault();
      const title = document.getElementById("input-nosotros-title").value.trim();
      const dateVal = document.getElementById("input-nosotros-date").value.trim();
      const tagVal = document.getElementById("input-nosotros-tag").value.trim();
      const desc = document.getElementById("input-nosotros-desc").value.trim();
      const fileInput = document.getElementById("input-nosotros-file");
      const urlInput = document.getElementById("input-nosotros-url").value.trim();

      const now = new Date();
      const defaultDate = `${now.getDate()} de ${now.toLocaleString("es-ES", { month: "long" })} de ${now.getFullYear()}`;

      function finalizeNosotros(imgUrl) {
        const photos = getNosotrosPhotos();
        const newPhoto = {
          id: "nos-" + Date.now(),
          title: title,
          date: dateVal || defaultDate,
          tag: tagVal || "Nosotros ✨",
          desc: desc,
          likes: 1,
          img: imgUrl
        };
        photos.unshift(newPhoto);
        saveNosotrosPhotos(photos);
        renderNosotros();
        closeUploadNosotros();

        if (window.AuthPairingService) {
          window.AuthPairingService.syncPairData("photo", { gallery: "nosotros", action: "add", item: newPhoto });
        }

        showToast("💖 ¡Foto añadida a nuestro apartado Nosotros!");
        if (window.confetti) window.confetti({ particleCount: 70, spread: 70 });
      }

      if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();
        reader.onload = (evt) => finalizeNosotros(evt.target.result);
        reader.readAsDataURL(fileInput.files[0]);
      } else if (urlInput) {
        finalizeNosotros(urlInput);
      } else {
        finalizeNosotros(createArtwork("Nosotros", title, "#ff758f", "#c084fc", "💖"));
      }
    });
  }

  renderNosotros();

  // ==========================================================================
  // 5.2 SECCIÓN "NUESTROS HIJOS" 🐾 (SOFI & BENJI)
  // ==========================================================================
  function playPetSound(type) {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === "cat") {
        const now = ctx.currentTime;
        osc.type = "sine";
        osc.frequency.setValueAtTime(480, now);
        osc.frequency.exponentialRampToValueAtTime(750, now + 0.15);
        osc.frequency.exponentialRampToValueAtTime(420, now + 0.45);
        
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.18, now + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
        
        osc.start(now);
        osc.stop(now + 0.5);
      } else if (type === "dog") {
        const now = ctx.currentTime;
        osc.type = "triangle";
        osc.frequency.setValueAtTime(340, now);
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.18);
        
        gain.gain.setValueAtTime(0.22, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
        
        osc.start(now);
        osc.stop(now + 0.22);
      }
    } catch (e) {
      // Audio restricted before gesture
    }
  }

  // Sofi (Gata de Riham)
  const btnPetSofi = document.getElementById("btn-pet-sofi");
  const btnTreatSofi = document.getElementById("btn-treat-sofi");
  const treatsSofiCount = document.getElementById("treats-sofi-count");
  const imgPetSofi = document.getElementById("img-pet-sofi");
  const uploadPetSofi = document.getElementById("upload-pet-sofi");

  let sofiTreats = parseInt(localStorage.getItem("sofi_treats_count") || "18", 10);
  if (treatsSofiCount) treatsSofiCount.textContent = sofiTreats;

  const savedSofiPhoto = localStorage.getItem("custom_pet_sofi_photo");
  if (savedSofiPhoto && imgPetSofi) imgPetSofi.src = savedSofiPhoto;

  if (btnPetSofi) {
    btnPetSofi.addEventListener("click", () => {
      playPetSound("cat");
      showToast("¡Sofi está ronroneando feliz y amasando patitas para mamá Riham y papá Jonathan! 🐱🌸");
      if (window.confetti) {
        window.confetti({
          particleCount: 45,
          spread: 60,
          origin: { y: 0.65 },
          colors: ['#ff758f', '#ffb703', '#e9d5ff']
        });
      }
    });
  }

  if (btnTreatSofi) {
    btnTreatSofi.addEventListener("click", () => {
      sofiTreats += 1;
      localStorage.setItem("sofi_treats_count", sofiTreats);
      if (treatsSofiCount) treatsSofiCount.textContent = sofiTreats;
      playPetSound("cat");
      showToast("¡Le diste un pescadito a Sofi! Se lo comió feliz y pide más mimos 🐟💖");
      if (window.confetti) window.confetti({ particleCount: 30, spread: 45 });
    });
  }

  if (uploadPetSofi) {
    uploadPetSofi.addEventListener("change", (e) => {
      if (e.target.files && e.target.files[0]) {
        const reader = new FileReader();
        reader.onload = (evt) => {
          const photoData = evt.target.result;
          localStorage.setItem("custom_pet_sofi_photo", photoData);
          if (imgPetSofi) imgPetSofi.src = photoData;
          showToast("📸 ¡Foto de Sofi actualizada con éxito!");
          if (window.confetti) window.confetti({ particleCount: 50, spread: 60 });
        };
        reader.readAsDataURL(e.target.files[0]);
      }
    });
  }

  // Benji (Perro de Jonathan)
  const btnPetBenji = document.getElementById("btn-pet-benji");
  const btnTreatBenji = document.getElementById("btn-treat-benji");
  const treatsBenjiCount = document.getElementById("treats-benji-count");
  const imgPetBenji = document.getElementById("img-pet-benji");
  const uploadPetBenji = document.getElementById("upload-pet-benji");

  let benjiTreats = parseInt(localStorage.getItem("benji_treats_count") || "24", 10);
  if (treatsBenjiCount) treatsBenjiCount.textContent = benjiTreats;

  const savedBenjiPhoto = localStorage.getItem("custom_pet_benji_photo");
  if (savedBenjiPhoto && imgPetBenji) imgPetBenji.src = savedBenjiPhoto;

  if (btnPetBenji) {
    btnPetBenji.addEventListener("click", () => {
      playPetSound("dog");
      showToast("¡Benji está moviendo la colita con felicidad y dando la patita! 🐶✨");
      if (window.confetti) {
        window.confetti({
          particleCount: 45,
          spread: 60,
          origin: { y: 0.65 },
          colors: ['#f59e0b', '#fbbf24', '#8b5cf6']
        });
      }
    });
  }

  if (btnTreatBenji) {
    btnTreatBenji.addEventListener("click", () => {
      benjiTreats += 1;
      localStorage.setItem("benji_treats_count", benjiTreats);
      if (treatsBenjiCount) treatsBenjiCount.textContent = benjiTreats;
      playPetSound("dog");
      showToast("¡Le diste una galleta de huesito a Benji! ¡Está brincando de alegría! 🦴✨");
      if (window.confetti) window.confetti({ particleCount: 30, spread: 45 });
    });
  }

  if (uploadPetBenji) {
    uploadPetBenji.addEventListener("change", (e) => {
      if (e.target.files && e.target.files[0]) {
        const reader = new FileReader();
        reader.onload = (evt) => {
          const photoData = evt.target.result;
          localStorage.setItem("custom_pet_benji_photo", photoData);
          if (imgPetBenji) imgPetBenji.src = photoData;
          showToast("📸 ¡Foto de Benji actualizada con éxito!");
          if (window.confetti) window.confetti({ particleCount: 50, spread: 60 });
        };
        reader.readAsDataURL(e.target.files[0]);
      }
    });
  }

  // ==========================================================================
  // 5.3 ÁLBUM COMPLETO DE FOTOS DE SOFI (27 FOTOS) Y BENJI (32 FOTOS)
  // ==========================================================================
  const SOFI_MEMORIES = Array.from({ length: 27 }, (_, i) => ({
    id: `pet-sofi-${i + 1}`,
    pet: "sofi",
    gameName: "🐱 Sofi",
    badge: "🐱",
    title: `Sofi · Foto ${i + 1}`,
    desc: "",
    date: "Cataluña, España",
    likes: 1,
    img: `assets/pets/sofi/sofi_${i + 1}.jpeg`
  }));

  const BENJI_MEMORIES = Array.from({ length: 32 }, (_, i) => ({
    id: `pet-benji-${i + 1}`,
    pet: "benji",
    gameName: "🐶 Benji",
    badge: "🐶",
    title: `Benji · Foto ${i + 1}`,
    desc: "",
    date: "Guayaquil, Ecuador",
    likes: 1,
    img: `assets/pets/benji/benji_${i + 1}.jpeg`
  }));

  // Mezclar fotos de Sofi y Benji de manera intercalada y armoniosa
  function createMixedPetMemories(sofiArr, benjiArr) {
    const mixed = [];
    const maxLen = Math.max(sofiArr.length, benjiArr.length);
    for (let i = 0; i < maxLen; i++) {
      if (i < sofiArr.length) mixed.push(sofiArr[i]);
      if (i < benjiArr.length) mixed.push(benjiArr[i]);
    }
    return mixed;
  }

  const DEFAULT_PET_MEMORIES = createMixedPetMemories(SOFI_MEMORIES, BENJI_MEMORIES);

  function getPetMemories() {
    try {
      localStorage.removeItem("jonathan_pet_photos_custom_v1");
      localStorage.removeItem("jonathan_pet_photos_custom_v2");
      const saved = localStorage.getItem("jonathan_pet_photos_custom_v3");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn("Parse error for pet memories", e);
    }
    return DEFAULT_PET_MEMORIES;
  }

  function savePetMemories(memories) {
    localStorage.setItem("jonathan_pet_photos_custom_v3", JSON.stringify(memories));
  }

  let curPetFilter = "all";
  const petsGalleryGrid = document.getElementById("pets-gallery-grid");
  const countPetsAll = document.getElementById("count-pets-all");
  const countPetsSofi = document.getElementById("count-pets-sofi");
  const countPetsBenji = document.getElementById("count-pets-benji");

  function renderPetsGallery() {
    if (!petsGalleryGrid) return;
    const allPets = getPetMemories();
    const sofiList = allPets.filter(p => p.pet === "sofi");
    const benjiList = allPets.filter(p => p.pet === "benji");

    if (countPetsAll) countPetsAll.textContent = allPets.length;
    if (countPetsSofi) countPetsSofi.textContent = sofiList.length;
    if (countPetsBenji) countPetsBenji.textContent = benjiList.length;

    const filtered = curPetFilter === "all" ? allPets : allPets.filter(p => p.pet === curPetFilter);
    petsGalleryGrid.innerHTML = "";

    filtered.forEach(item => {
      const card = document.createElement("div");
      card.className = "pet-gallery-card-item";
      card.innerHTML = `
        <div class="pet-card-media">
          <img class="pet-gallery-img" src="${item.img}" alt="${item.title}" loading="lazy" onerror="this.src='assets/pets/${item.pet === 'sofi' ? 'sofi/sofi_1.jpeg' : 'benji/benji_1.jpeg'}'">
          <div class="gamer-card-tag"><span>${item.badge || "🐾"}</span> ${item.gameName || (item.pet === "sofi" ? "Sofi" : "Benji")}</div>
          <button class="gamer-card-edit-btn" title="Personalizar título, fecha o dedicatoria"><i class="fa-solid fa-pen-to-square"></i></button>
          <button class="gamer-card-like-btn" title="Me encanta"><i class="fa-solid fa-heart"></i></button>
        </div>
        <div class="gamer-card-body">
          <div class="gamer-card-date"><i class="fa-regular fa-calendar"></i> ${item.date}</div>
          <h3 class="gamer-card-title">${item.title}</h3>
          ${item.desc ? `<p class="gamer-card-desc">${item.desc}</p>` : ''}
          <div class="gamer-card-footer">
            <span><i class="fa-solid fa-expand"></i> Ver foto</span>
            <span><i class="fa-solid fa-heart"></i> ${item.likes || 1}</span>
          </div>
        </div>
      `;

      card.addEventListener("click", (e) => {
        if (e.target.closest(".gamer-card-like-btn") || e.target.closest(".gamer-card-edit-btn")) return;
        openLightbox(item);
      });

      const editBtn = card.querySelector(".gamer-card-edit-btn");
      if (editBtn) {
        editBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          openEditMemoryModal(item);
        });
      }

      const likeBtn = card.querySelector(".gamer-card-like-btn");
      likeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        item.likes = (item.likes || 0) + 1;
        savePetMemories(allPets);
        renderPetsGallery();
        if (window.AuthPairingService) {
          window.AuthPairingService.syncPairData("photo", { gallery: "pets", action: "like", id: item.id, likes: item.likes });
        }
        if (window.confetti) window.confetti({ particleCount: 25, spread: 40 });
      });

      petsGalleryGrid.appendChild(card);
    });
  }

  // Filtros de Mascotas
  document.querySelectorAll("#pet-filter-chips .chip-filter").forEach(chip => {
    chip.addEventListener("click", () => {
      document.querySelectorAll("#pet-filter-chips .chip-filter").forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      curPetFilter = chip.dataset.petFilter;
      renderPetsGallery();
    });
  });

  renderPetsGallery();

  // Modal Subir Foto a Mascotas
  const modalUploadPet = document.getElementById("modal-upload-pet");
  const btnOpenUploadPet = document.getElementById("btn-open-upload-pet-photo");
  const btnCloseUploadPet = document.getElementById("btn-close-upload-pet");
  const btnCancelUploadPet = document.getElementById("btn-cancel-upload-pet");
  const formUploadPet = document.getElementById("form-upload-pet");

  if (btnOpenUploadPet) btnOpenUploadPet.addEventListener("click", () => modalUploadPet.classList.remove("hidden"));
  function closeUploadPet() {
    if (modalUploadPet) modalUploadPet.classList.add("hidden");
    if (formUploadPet) formUploadPet.reset();
  }
  if (btnCloseUploadPet) btnCloseUploadPet.addEventListener("click", closeUploadPet);
  if (btnCancelUploadPet) btnCancelUploadPet.addEventListener("click", closeUploadPet);
  if (modalUploadPet) {
    modalUploadPet.addEventListener("click", (e) => {
      if (e.target === modalUploadPet) closeUploadPet();
    });
  }

  if (formUploadPet) {
    formUploadPet.addEventListener("submit", (e) => {
      e.preventDefault();
      const petTarget = document.getElementById("select-pet-target").value;
      const title = document.getElementById("input-pet-title").value.trim();
      const desc = document.getElementById("input-pet-desc").value.trim();
      const fileInput = document.getElementById("input-pet-file");
      const urlInput = document.getElementById("input-pet-url").value.trim();

      const isSofi = petTarget === "sofi";
      const badge = isSofi ? "🐱" : "🐶";
      const petName = isSofi ? "🐱 Sofi (Gatita)" : "🐶 Benji (Perrito)";
      const now = new Date();
      const dateStr = `${now.getDate()} de ${now.toLocaleString("es-ES", { month: "long" })} de ${now.getFullYear()}`;

      function finalizePet(imgUrl) {
        const pets = getPetMemories();
        const newPet = {
          id: `pet-custom-${Date.now()}`,
          pet: petTarget,
          gameName: petName,
          badge: badge,
          title: title,
          desc: desc,
          date: dateStr,
          likes: 1,
          img: imgUrl
        };
        pets.unshift(newPet);
        savePetMemories(pets);
        renderPetsGallery();
        closeUploadPet();

        if (window.AuthPairingService) {
          window.AuthPairingService.syncPairData("photo", { gallery: "pets", action: "add", item: newPet });
        }

        showToast(`🐾 ¡Foto agregada con éxito al álbum de ${isSofi ? 'Sofi' : 'Benji'}!`);
        if (window.confetti) window.confetti({ particleCount: 70, spread: 70 });
      }

      if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();
        reader.onload = (evt) => finalizePet(evt.target.result);
        reader.readAsDataURL(fileInput.files[0]);
      } else if (urlInput) {
        finalizePet(urlInput);
      } else {
        finalizePet(createArtwork(isSofi ? "Sofi" : "Benji", title, isSofi ? "#ff758f" : "#f59e0b", "#4a0e4e", badge));
      }
    });
  }

  // Modal Subir Foto Gamer
  const modalUpload = document.getElementById("modal-upload-photo");
  const btnOpenUpload = document.getElementById("btn-open-upload-modal");
  const btnCloseUpload = document.getElementById("btn-close-upload");
  const btnCancelUpload = document.getElementById("btn-cancel-upload");
  const formUpload = document.getElementById("form-upload-memory");

  if (btnOpenUpload) btnOpenUpload.addEventListener("click", () => modalUpload.classList.remove("hidden"));
  function closeUpload() {
    modalUpload.classList.add("hidden");
    formUpload.reset();
  }
  if (btnCloseUpload) btnCloseUpload.addEventListener("click", closeUpload);
  if (btnCancelUpload) btnCancelUpload.addEventListener("click", closeUpload);

  if (formUpload) {
    formUpload.addEventListener("submit", (e) => {
      e.preventDefault();
      const selectGame = document.getElementById("select-game");
      const title = document.getElementById("input-photo-title").value.trim();
      const desc = document.getElementById("input-photo-desc").value.trim();
      const fileInput = document.getElementById("input-photo-file");
      const urlInput = document.getElementById("input-photo-url").value.trim();

      const gameVal = selectGame.value;
      const gameText = selectGame.options[selectGame.selectedIndex].text.replace(/^[^\w]+/, "").trim();
      const badge = selectGame.options[selectGame.selectedIndex].text.split(" ")[0] || "🎮";
      const now = new Date();
      const dateStr = `${now.getDate()} de ${now.toLocaleString("es-ES", { month: "long" })} de ${now.getFullYear()}`;

      function finalize(imgUrl) {
        const memories = getGamerMemories();
        const newMem = {
          id: "g-" + Date.now(),
          game: gameVal,
          gameName: gameText,
          badge: badge,
          title: title,
          desc: desc,
          date: dateStr,
          likes: 1,
          img: imgUrl
        };
        memories.unshift(newMem);
        saveGamerMemories(memories);
        renderGallery();
        closeUpload();

        if (window.AuthPairingService) {
          window.AuthPairingService.syncPairData("photo", { gallery: "gamer", action: "add", item: newMem });
        }

        showToast("🎮 ¡Foto agregada con éxito al álbum de Jonathan!");
        if (window.confetti) window.confetti({ particleCount: 70, spread: 70 });
      }

      if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();
        reader.onload = (evt) => finalize(evt.target.result);
        reader.readAsDataURL(fileInput.files[0]);
      } else if (urlInput) {
        finalize(urlInput);
      } else {
        finalize(createArtwork(gameText, title, "#38184c", "#1e1b4b", "🎮"));
      }
    });
  }

  // Lightbox
  const modalLightbox = document.getElementById("modal-gallery-lightbox");
  const closeLightbox = document.getElementById("btn-close-lightbox");
  const lbImg = document.getElementById("lightbox-full-img");
  const lbBadge = document.getElementById("lightbox-badge");
  const lbDate = document.getElementById("lightbox-date");
  const lbTitle = document.getElementById("lightbox-title-text");
  const lbCaption = document.getElementById("lightbox-caption-text");
  const lbLikeCount = document.getElementById("lightbox-like-count");
  const lbLikeBtn = document.getElementById("btn-lightbox-like");
  const btnLightboxEdit = document.getElementById("btn-lightbox-edit");
  let activeItem = null;

  function openLightbox(item) {
    activeItem = item;
    lbImg.src = item.img;
    lbBadge.textContent = item.gameName || item.tag || "Recuerdo";
    lbDate.textContent = item.date;
    lbTitle.textContent = item.title;
    if (lbCaption) {
      lbCaption.textContent = item.desc || "";
      lbCaption.style.display = item.desc ? "block" : "none";
    }
    lbLikeCount.textContent = item.likes || 1;
    modalLightbox.classList.remove("hidden");
  }

  if (closeLightbox) closeLightbox.addEventListener("click", () => modalLightbox.classList.add("hidden"));
  if (modalLightbox) {
    modalLightbox.addEventListener("click", (e) => {
      if (e.target === modalLightbox) modalLightbox.classList.add("hidden");
    });
  }
  if (lbLikeBtn) {
    lbLikeBtn.addEventListener("click", () => {
      if (!activeItem) return;
      
      // 1. Gamer memory
      const gamerMemories = getGamerMemories();
      const gTarget = gamerMemories.find(m => m.id === activeItem.id);
      if (gTarget) {
        gTarget.likes = (gTarget.likes || 0) + 1;
        activeItem.likes = gTarget.likes;
        lbLikeCount.textContent = gTarget.likes;
        saveGamerMemories(gamerMemories);
        renderGallery();
        if (window.confetti) window.confetti({ particleCount: 30, spread: 50 });
        return;
      }

      // 2. Nosotros photo
      const nosotrosPhotos = getNosotrosPhotos();
      const nTarget = nosotrosPhotos.find(m => m.id === activeItem.id);
      if (nTarget) {
        nTarget.likes = (nTarget.likes || 0) + 1;
        activeItem.likes = nTarget.likes;
        lbLikeCount.textContent = nTarget.likes;
        saveNosotrosPhotos(nosotrosPhotos);
        renderNosotros();
        if (window.confetti) window.confetti({ particleCount: 30, spread: 50 });
        return;
      }

      // 3. Pet photo
      const petMemories = getPetMemories();
      const pTarget = petMemories.find(m => m.id === activeItem.id);
      if (pTarget) {
        pTarget.likes = (pTarget.likes || 0) + 1;
        activeItem.likes = pTarget.likes;
        lbLikeCount.textContent = pTarget.likes;
        savePetMemories(petMemories);
        renderPetsGallery();
        if (window.confetti) window.confetti({ particleCount: 30, spread: 50 });
      }
    });
  }

  // ==========================================================================
  // MODAL 8: PERSONALIZAR TÍTULO, FECHA Y DESCRIPCIÓN DE CUALQUIER RECUERDO
  // ==========================================================================
  const modalEditMemory = document.getElementById("modal-edit-memory");
  const btnCloseEditMemory = document.getElementById("btn-close-edit-memory");
  const btnCancelEditMemory = document.getElementById("btn-cancel-edit-memory");
  const formEditMemory = document.getElementById("form-edit-memory");
  const editIdInput = document.getElementById("edit-memory-id");
  const editTitleInput = document.getElementById("edit-memory-title");
  const editDateInput = document.getElementById("edit-memory-date");
  const editCategoryInput = document.getElementById("edit-memory-category");
  const editDescInput = document.getElementById("edit-memory-desc");

  function openEditMemoryModal(item) {
    if (!item || !modalEditMemory) return;
    editIdInput.value = item.id;
    editTitleInput.value = item.title || "";
    editDateInput.value = item.date || "";
    editCategoryInput.value = item.gameName || item.tag || "Recuerdo";
    editDescInput.value = item.desc || "";
    modalEditMemory.classList.remove("hidden");
  }

  function closeEditMemoryModal() {
    if (modalEditMemory) modalEditMemory.classList.add("hidden");
  }

  if (btnCloseEditMemory) btnCloseEditMemory.addEventListener("click", closeEditMemoryModal);
  if (btnCancelEditMemory) btnCancelEditMemory.addEventListener("click", closeEditMemoryModal);
  if (modalEditMemory) {
    modalEditMemory.addEventListener("click", (e) => {
      if (e.target === modalEditMemory) closeEditMemoryModal();
    });
  }

  if (btnLightboxEdit) {
    btnLightboxEdit.addEventListener("click", () => {
      if (activeItem) {
        openEditMemoryModal(activeItem);
      }
    });
  }

  if (formEditMemory) {
    formEditMemory.addEventListener("submit", (e) => {
      e.preventDefault();
      const id = editIdInput.value;
      const newTitle = editTitleInput.value.trim();
      const newDate = editDateInput.value.trim();
      const newCategory = editCategoryInput.value.trim();
      const newDesc = editDescInput.value.trim();

      if (!newTitle) return;

      // 1. Revisar si es foto gamer
      const gamerMemories = getGamerMemories();
      const gamerTarget = gamerMemories.find(m => m.id === id);
      if (gamerTarget) {
        gamerTarget.title = newTitle;
        gamerTarget.date = newDate;
        gamerTarget.gameName = newCategory;
        gamerTarget.desc = newDesc;
        saveGamerMemories(gamerMemories);
        renderGallery();
        if (window.AuthPairingService) {
          window.AuthPairingService.syncPairData("photo", { gallery: "gamer", action: "edit", item: gamerTarget });
        }
      }

      // 2. Revisar si es foto de "Nosotros"
      const nosotrosPhotos = getNosotrosPhotos();
      const nosotrosTarget = nosotrosPhotos.find(m => m.id === id);
      if (nosotrosTarget) {
        nosotrosTarget.title = newTitle;
        nosotrosTarget.date = newDate;
        nosotrosTarget.tag = newCategory;
        nosotrosTarget.desc = newDesc;
        saveNosotrosPhotos(nosotrosPhotos);
        renderNosotros();
        if (window.AuthPairingService) {
          window.AuthPairingService.syncPairData("photo", { gallery: "nosotros", action: "edit", item: nosotrosTarget });
        }
      }

      // 3. Revisar si es foto de "Nuestros Hijos" (Sofi / Benji)
      const petMemories = getPetMemories();
      const petTarget = petMemories.find(m => m.id === id);
      if (petTarget) {
        petTarget.title = newTitle;
        petTarget.date = newDate;
        petTarget.gameName = newCategory;
        petTarget.desc = newDesc;
        savePetMemories(petMemories);
        renderPetsGallery();
        if (window.AuthPairingService) {
          window.AuthPairingService.syncPairData("photo", { gallery: "pets", action: "edit", item: petTarget });
        }
      }

      // 4. Si el lightbox está abierto, actualizar su vista
      if (activeItem && activeItem.id === id) {
        activeItem.title = newTitle;
        activeItem.date = newDate;
        activeItem.gameName = newCategory;
        activeItem.desc = newDesc;
        if (lbTitle) lbTitle.textContent = newTitle;
        if (lbDate) lbDate.textContent = newDate;
        if (lbBadge) lbBadge.textContent = newCategory;
        if (lbCaption) lbCaption.textContent = newDesc;
      }

      closeEditMemoryModal();
      showToast("✨ ¡Título, fecha y dedicatoria guardados con éxito!");
      if (window.confetti) window.confetti({ particleCount: 60, spread: 70 });
    });
  }

  // ==========================================================================
  // 6. BLOC DE NOTAS COMPARTIDO EN TIEMPO REAL (GUN.JS + LOCAL SYNC)
  // ==========================================================================
  const DEFAULT_NOTES = [
    { id: "n1", author: "Riham (Cataluña 👧🏻🌸)", text: "¡Hola Jonathan mi amor! 💖 Recuerda que hoy jugamos en la noche. ¡Te extraño un montón!", color: "pink", pin: "pin-red", rot: -2, time: "Hoy, 10:30", reactions: { "❤️": 5, "🥰": 3 } },
    { id: "n2", author: "Jonathan (Guayaquil 👦🏻✨)", text: "¡Aquí en Ecuador pensando en ti todo el día! 🇪🇨 Ni los 9.080 km hacen que deje de sonreír con tus mensajes.", color: "lavender", pin: "pin-purple", rot: 2.5, time: "Hoy, 09:15", reactions: { "❤️": 7, "🎮": 4 } },
    { id: "n3", author: "Riham (Cataluña 👧🏻🌸)", text: "Nota sagrada: ¡El 21 de Noviembre es mi cumple! Tienes que felicitarme primero que nadieee 😉👑", color: "peach", pin: "pin-gold", rot: -1.5, time: "Ayer", reactions: { "👑": 6, "🥰": 2 } }
  ];

  // Gun.js para sincronización internacional peer-to-peer / relay en tiempo real
  let gunDb = null;
  let gunNotesNode = null;
  try {
    if (typeof Gun !== "undefined") {
      gunDb = Gun([
        'https://gun-manhattan.herokuapp.com/gun',
        'https://peer.wallie.io/gun',
        'https://gun-us.herokuapp.com/gun'
      ]);
      gunNotesNode = gunDb.get('jonathan_riham_romantic_shared_notes_v2026');
    }
  } catch (err) {
    console.warn("Gun.js relay offline, fallback to local sync", err);
  }

  const noteBroadcast = typeof BroadcastChannel !== "undefined" ? new BroadcastChannel("jonathan_notes_channel_2026") : null;

  function getNotes() {
    const saved = localStorage.getItem("jonathan_shared_notes");
    return saved ? JSON.parse(saved) : DEFAULT_NOTES;
  }

  function saveNotes(notes, broadcast = true) {
    localStorage.setItem("jonathan_shared_notes", JSON.stringify(notes));
    if (broadcast && noteBroadcast) {
      noteBroadcast.postMessage({ type: "SYNC", notes: notes });
    }
    if (broadcast && gunNotesNode) {
      try {
        gunNotesNode.put({ data: JSON.stringify(notes), updated: Date.now() });
      } catch (e) {
        console.warn("Gun sync put err", e);
      }
    }
  }

  const notesContainer = document.getElementById("post-its-container");
  const typingAlert = document.getElementById("typing-alert-box");

  function renderNotes() {
    if (!notesContainer) return;
    const notes = getNotes();
    notesContainer.innerHTML = "";

    notes.forEach((note, idx) => {
      const card = document.createElement("div");
      card.className = `sticky-note-item postit-${note.color || 'pink'}`;
      card.style.setProperty("--rot", `${note.rot || (idx % 2 === 0 ? -2 : 2)}deg`);

      let reactHtml = "";
      for (const [emoji, cnt] of Object.entries(note.reactions || { "❤️": 1 })) {
        reactHtml += `<button class="btn-reaction-chip" data-emoji="${emoji}"><span>${emoji}</span> <small>${cnt}</small></button>`;
      }

      card.innerHTML = `
        <div class="note-pin-head ${note.pin || 'pin-red'}"></div>
        <div class="postit-header">
          <span class="postit-author">${note.author}</span>
          <span class="postit-time">${note.time}</span>
        </div>
        <div class="postit-body-text">${note.text}</div>
        <div class="postit-footer-row">
          <div class="postit-reactions-box">
            ${reactHtml}
            <button class="btn-reaction-chip btn-add-react" title="Reaccionar"><span>+❤️</span></button>
          </div>
          <button class="btn-delete-postit" title="Eliminar notita"><i class="fa-solid fa-trash-can"></i></button>
        </div>
      `;

      card.querySelectorAll(".btn-reaction-chip:not(.btn-add-react)").forEach(btn => {
        btn.addEventListener("click", () => {
          const em = btn.dataset.emoji;
          note.reactions[em] = (note.reactions[em] || 0) + 1;
          saveNotes(notes);
          renderNotes();
          if (window.AuthPairingService) {
            window.AuthPairingService.syncPairData("note", { action: "react", noteId: note.id, emoji: em, count: note.reactions[em] });
          }
        });
      });

      const addBtn = card.querySelector(".btn-add-react");
      if (addBtn) {
        addBtn.addEventListener("click", () => {
          const em = prompt("Elige un emoji para reaccionar: ❤️, 🥰, 🔥, 🎮, 👑, 🥺, ✨", "❤️");
          if (em) {
            note.reactions[em] = (note.reactions[em] || 0) + 1;
            saveNotes(notes);
            renderNotes();
            if (window.AuthPairingService) {
              window.AuthPairingService.syncPairData("note", { action: "react", noteId: note.id, emoji: em, count: note.reactions[em] });
            }
          }
        });
      }

      const delBtn = card.querySelector(".btn-delete-postit");
      if (delBtn) {
        delBtn.addEventListener("click", () => {
          if (confirm("¿Descolgar esta notita del muro?")) {
            saveNotes(notes.filter(n => n.id !== note.id));
            renderNotes();
            if (window.AuthPairingService) {
              window.AuthPairingService.syncPairData("note", { action: "delete", noteId: note.id });
            }
          }
        });
      }

      notesContainer.appendChild(card);
    });
  }

  // Escuchar cambios de Gun.js en tiempo real
  if (gunNotesNode) {
    gunNotesNode.on((record) => {
      if (record && record.data) {
        try {
          const remoteNotes = JSON.parse(record.data);
          if (Array.isArray(remoteNotes)) {
            localStorage.setItem("jonathan_shared_notes", JSON.stringify(remoteNotes));
            renderNotes();
          }
        } catch (e) {}
      }
    });
  }

  if (noteBroadcast) {
    noteBroadcast.onmessage = (e) => {
      if (e.data && e.data.type === "SYNC") {
        renderNotes();
      } else if (e.data && e.data.type === "TYPING") {
        if (typingAlert) {
          typingAlert.classList.remove("hidden");
          setTimeout(() => typingAlert.classList.add("hidden"), 3000);
        }
      }
    };
  }

  // Modal Nueva Nota
  const modalNote = document.getElementById("modal-create-note");
  const btnOpenNote = document.getElementById("btn-open-new-note");
  const btnCloseNote = document.getElementById("btn-close-note-modal");
  const btnCancelNote = document.getElementById("btn-cancel-note");
  const formNote = document.getElementById("form-create-note");
  const noteInput = document.getElementById("input-note-text");

  if (btnOpenNote) btnOpenNote.addEventListener("click", () => modalNote.classList.remove("hidden"));
  function closeNote() {
    modalNote.classList.add("hidden");
    formNote.reset();
  }
  if (btnCloseNote) btnCloseNote.addEventListener("click", closeNote);
  if (btnCancelNote) btnCancelNote.addEventListener("click", closeNote);

  if (noteInput) {
    noteInput.addEventListener("input", () => {
      if (noteBroadcast) noteBroadcast.postMessage({ type: "TYPING" });
      if (window.AuthPairingService) window.AuthPairingService.syncPairData("typing", {});
    });
  }

  if (formNote) {
    formNote.addEventListener("submit", (e) => {
      e.preventDefault();
      const author = document.getElementById("select-note-author").value;
      const colorRadio = document.querySelector("input[name='notecolor']:checked");
      const color = colorRadio ? colorRadio.value : "pink";
      const text = noteInput.value.trim();
      if (!text) return;

      const now = new Date();
      const time = `Hoy, ${now.getHours()}:${pad(now.getMinutes())}`;
      const pins = ["pin-red", "pin-purple", "pin-gold"];
      const notes = getNotes();

      const newNote = {
        id: "n-" + Date.now(),
        author: author,
        text: text,
        color: color,
        pin: pins[Math.floor(Math.random() * pins.length)],
        rot: parseFloat((Math.random() * 6 - 3).toFixed(1)),
        time: time,
        reactions: { "❤️": 1 }
      };

      notes.unshift(newNote);
      saveNotes(notes);
      renderNotes();
      closeNote();

      if (window.AuthPairingService) {
        window.AuthPairingService.syncPairData("note", { action: "add", note: newNote });
      }

      showToast("📝 ¡Notita pegada en el muro con éxito!");
      if (window.confetti) window.confetti({ particleCount: 50, spread: 60 });
    });
  }

  renderNotes();

  // ==========================================================================
  // 7. SISTEMA DE "ENVIAR UN ABRAZO" EN TIEMPO REAL 🫂💖 (ESPAÑA ↔ ECUADOR)
  // ==========================================================================
  let activeSender = localStorage.getItem("jonathan_active_identity") || "riham";
  let selectedHugType = "apretado";
  let selectedHugTitle = "Te extraño";
  let selectedHugEmoji = "🫂";

  const btnIdentityRiham = document.getElementById("btn-identity-riham");
  const btnIdentityJonathan = document.getElementById("btn-identity-jonathan");
  const hugBtnActionText = document.getElementById("hug-btn-action-text");
  const hugBtnSubText = document.getElementById("hug-btn-sub-text");
  const hugBtnEmoji = document.getElementById("hug-btn-emoji");
  const btnSendLiveHug = document.getElementById("btn-send-live-hug");
  const inputHugMessage = document.getElementById("input-hug-message");
  const statTotalHugs = document.getElementById("stat-total-hugs");
  const statHugsRiham = document.getElementById("stat-hugs-riham");
  const statHugsJonathan = document.getElementById("stat-hugs-jonathan");
  const hugHistoryList = document.getElementById("hug-history-list");

  // Overlay de abrazo recibido
  const hugReceivedOverlay = document.getElementById("hug-received-overlay");
  const btnCloseHugOverlay = document.getElementById("btn-close-hug-overlay");
  const btnReturnHug = document.getElementById("btn-return-hug");
  const receivedHugEmoji = document.getElementById("received-hug-emoji");
  const receivedHugTitle = document.getElementById("received-hug-title");
  const receivedSenderName = document.getElementById("received-sender-name");
  const receivedHugMessageText = document.getElementById("received-hug-message-text");
  const receivedHugTime = document.getElementById("received-hug-time");
  const hugFloatingElements = document.getElementById("hug-floating-elements");

  // Sonidos Sintetizados Cálidos (Web Audio API)
  function playHugChime(type = "warm") {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;

      // Acorde armónico romántico (Do mayor 7 / Fa mayor 9 suave)
      const freqs = type === "sparkle" 
        ? [523.25, 659.25, 783.99, 987.77, 1046.50] // C5, E5, G5, B5, C6
        : [392.00, 493.88, 587.33, 739.99, 880.00]; // G4, B4, D5, F#5, A5

      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);

        gain.gain.setValueAtTime(0, now + idx * 0.06);
        gain.gain.linearRampToValueAtTime(0.12 / freqs.length, now + idx * 0.06 + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.06 + 1.8);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 1.8);
      });
    } catch (e) {}
  }

  // Identidad
  function updateIdentityUI() {
    if (btnIdentityRiham) btnIdentityRiham.classList.toggle("active", activeSender === "riham");
    if (btnIdentityJonathan) btnIdentityJonathan.classList.toggle("active", activeSender === "jonathan");

    if (hugBtnActionText) {
      hugBtnActionText.textContent = activeSender === "riham" 
        ? "Enviar Abrazo a Jonathan" 
        : "Enviar Abrazo a Riham";
    }
    if (hugBtnSubText) {
      hugBtnSubText.textContent = activeSender === "riham" 
        ? "Llegará en vivo a Guayaquil, Ecuador 🇪🇨 ✨" 
        : "Llegará en vivo a Cataluña, España 🇪🇸 ✨";
    }
  }

  if (btnIdentityRiham) {
    btnIdentityRiham.addEventListener("click", () => {
      activeSender = "riham";
      localStorage.setItem("jonathan_active_identity", "riham");
      updateIdentityUI();
      showToast("🌸 Identidad cambiada: Ahora eres Riham (Cataluña 🇪🇸)");
    });
  }

  if (btnIdentityJonathan) {
    btnIdentityJonathan.addEventListener("click", () => {
      activeSender = "jonathan";
      localStorage.setItem("jonathan_active_identity", "jonathan");
      updateIdentityUI();
      showToast("✨ Identidad cambiada: Ahora eres Jonathan (Guayaquil 🇪🇨)");
    });
  }

  updateIdentityUI();

  // Chips de tipo de abrazo
  document.querySelectorAll(".hug-type-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      document.querySelectorAll(".hug-type-chip").forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      selectedHugType = chip.dataset.hugType;
      selectedHugTitle = chip.dataset.hugTitle;
      selectedHugEmoji = chip.dataset.hugEmoji;
      if (hugBtnEmoji) hugBtnEmoji.textContent = selectedHugEmoji;
    });
  });

  // Estadísticas e Historial (Inician en 0)
  const DEFAULT_HUG_STATS = { total: 0, riham: 0, jonathan: 0 };
  const DEFAULT_HUG_HISTORY = [];

  function getHugStats() {
    // Limpiar claves previas de pruebas si existían
    try {
      localStorage.removeItem("jonathan_hug_stats_v1");
    } catch(e) {}
    const saved = localStorage.getItem("jonathan_hug_stats_v2");
    return saved ? JSON.parse(saved) : DEFAULT_HUG_STATS;
  }
  function saveHugStats(stats) {
    localStorage.setItem("jonathan_hug_stats_v2", JSON.stringify(stats));
  }

  function getHugHistory() {
    try {
      localStorage.removeItem("jonathan_hug_history_v1");
    } catch(e) {}
    const saved = localStorage.getItem("jonathan_hug_history_v2");
    return saved ? JSON.parse(saved) : DEFAULT_HUG_HISTORY;
  }
  function saveHugHistory(history) {
    localStorage.setItem("jonathan_hug_history_v2", JSON.stringify(history));
  }

  function renderHugUI() {
    const stats = getHugStats();
    const history = getHugHistory();

    if (statTotalHugs) statTotalHugs.textContent = stats.total;
    if (statHugsRiham) statHugsRiham.textContent = stats.riham;
    if (statHugsJonathan) statHugsJonathan.textContent = stats.jonathan;

    if (hugHistoryList) {
      hugHistoryList.innerHTML = "";
      if (history.length === 0) {
        hugHistoryList.innerHTML = `
          <div style="text-align: center; padding: 2rem 1rem; color: var(--text-secondary); font-size: 0.95rem;">
            <i class="fa-regular fa-paper-plane" style="font-size: 1.8rem; margin-bottom: 0.5rem; display: block; color: var(--primary-color);"></i>
            <span>Aún no se han enviado abrazos. ¡Presiona el botón de arriba para mandar el primer abrazo en tiempo real! 🫂💖</span>
          </div>
        `;
      } else {
        history.slice(0, 8).forEach(item => {
          const row = document.createElement("div");
          row.className = "hug-history-item";
          row.innerHTML = `
            <div class="hug-item-left">
              <span class="hug-item-emoji">${item.emoji || "🫂"}</span>
              <div class="hug-item-details">
                <strong>${item.title} • <small style="color: var(--text-secondary); font-weight: 500;">De ${item.senderName}</small></strong>
                ${item.message ? `<div class="hug-item-msg">"${item.message}"</div>` : ''}
              </div>
            </div>
            <span class="hug-item-time"><i class="fa-regular fa-clock"></i> ${item.time}</span>
          `;
          hugHistoryList.appendChild(row);
        });
      }
    }
  }

  renderHugUI();

  // Diccionario de normalización para títulos limpios de abrazos
  const HUG_TITLE_MAP = {
    "apretado": "Te extraño",
    "Abrazo Apretadito": "Te extraño",
    "Apretadito": "Te extraño",
    "besito": "Cariñoso",
    "Con Mimos & Besito": "Cariñoso",
    "Con Memos & Besito": "Cariñoso",
    "buenas-noches": "Buenas noches",
    "De Buenas Noches": "Buenas noches",
    "energia": "Para darte ánimos",
    "De Energía & Fuerza": "Para darte ánimos",
    "consentido": "Porque sí",
    "De Consentido/a": "Porque sí"
  };

  function normalizeHugTitle(title, type) {
    if (HUG_TITLE_MAP[title]) return HUG_TITLE_MAP[title];
    if (HUG_TITLE_MAP[type]) return HUG_TITLE_MAP[type];
    return title || "Te extraño";
  }

  // Sincronización en Tiempo Real: Gun.js + BroadcastChannel + Supabase
  let gunHugsNode = null;
  if (gunDb) {
    try {
      gunHugsNode = gunDb.get('jonathan_riham_romantic_hugs_v2026');
    } catch (e) {}
  }

  const hugBroadcast = typeof BroadcastChannel !== "undefined" 
    ? new BroadcastChannel("jonathan_hugs_channel_2026") 
    : null;

  let lastReceivedHugId = null;
  const pageInitTime = Date.now();

  // Función al Recibir un Abrazo (SOLO en tiempo real activo)
  function triggerReceivedHug(hugData, isLiveEvent = false) {
    if (!hugData) return;

    // Descartar si es un registro histórico o cargado al inicio (anterior a la carga de la página)
    const eventTime = hugData.timestamp || hugData.timeNumber || 0;
    if (!isLiveEvent && eventTime < (pageInitTime - 2000)) {
      return;
    }

    if (hugData.id && hugData.id === lastReceivedHugId) return;
    if (hugData.id) lastReceivedHugId = hugData.id;

    // Normalizar título a la nueva versión limpia
    const cleanTitle = normalizeHugTitle(hugData.title, hugData.type);
    const isSenderRiham = hugData.sender === "riham";

    // Actualizar datos del modal
    if (receivedHugEmoji) receivedHugEmoji.textContent = hugData.emoji || "🫂";
    if (receivedHugTitle) receivedHugTitle.textContent = `¡Has recibido un abrazo: ${cleanTitle}!`;
    if (receivedSenderName) {
      receivedSenderName.textContent = hugData.senderName || (isSenderRiham ? "Riham (Cataluña 👧🏻🌸)" : "Jonathan (Guayaquil 👦🏻✨)");
    }
    if (receivedHugMessageText) {
      receivedHugMessageText.textContent = hugData.message 
        ? `"${hugData.message}"` 
        : (isSenderRiham 
            ? `"Te mando este abrazo con todo mi amor desde Cataluña, mi vida."` 
            : `"Te mando este abrazo con toda mi fuerza desde Guayaquil, te amo infinito."`);
    }
    if (receivedHugTime) receivedHugTime.innerHTML = `<i class="fa-regular fa-clock"></i> ${hugData.time || "Hace un momento"}`;

    // Partículas flotantes de amor en pantalla
    if (hugFloatingElements) {
      hugFloatingElements.innerHTML = "";
      const emojis = [hugData.emoji || "🫂", "💖", "✨", "🌸", "🥰", "💌"];
      for (let i = 0; i < 24; i++) {
        const p = document.createElement("span");
        p.className = "floating-hug-particle";
        p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        p.style.left = `${Math.random() * 95}%`;
        p.style.animationDelay = `${Math.random() * 1.5}s`;
        p.style.animationDuration = `${Math.random() * 2 + 2.5}s`;
        p.style.fontSize = `${Math.random() * 1.5 + 1.5}rem`;
        hugFloatingElements.appendChild(p);
      }
    }

    // Reproducir sonido cálido
    playHugChime("sparkle");

    // Vibración en dispositivos móviles
    try {
      if (navigator.vibrate) navigator.vibrate([150, 80, 250, 100, 300]);
    } catch (e) {}

    // Lluvia de confeti
    if (window.confetti) {
      window.confetti({
        particleCount: 100,
        spread: 100,
        origin: { y: 0.5 },
        colors: ['#ff758f', '#c084fc', '#fbbf24', '#ff4d6d']
      });
    }

    // Mostrar overlay emergente
    if (hugReceivedOverlay) hugReceivedOverlay.classList.remove("hidden");

    // Guardar en historial y stats
    const stats = getHugStats();
    stats.total += 1;
    if (hugData.sender === "riham") stats.riham += 1;
    else stats.jonathan += 1;
    saveHugStats(stats);

    const history = getHugHistory();
    history.unshift({
      ...hugData,
      title: cleanTitle
    });
    saveHugHistory(history);
    renderHugUI();
  }

  // Escuchar Gun.js solo para eventos EN VIVO después de iniciar
  if (gunHugsNode) {
    gunHugsNode.on((record) => {
      if (record && record.data && record.time && record.time > pageInitTime) {
        try {
          const remoteHug = JSON.parse(record.data);
          if (remoteHug && remoteHug.sender !== activeSender) {
            triggerReceivedHug(remoteHug, true);
          }
        } catch (e) {}
      }
    });
  }

  // Escuchar BroadcastChannel (Pruebas multi-pestaña)
  if (hugBroadcast) {
    hugBroadcast.onmessage = (e) => {
      if (e.data && e.data.type === "HUG_SENT") {
        const remoteHug = e.data.data;
        if (remoteHug && remoteHug.sender !== activeSender && (remoteHug.timestamp || 0) > pageInitTime) {
          triggerReceivedHug(remoteHug, true);
        }
      }
    };
  }

  // Enviar Abrazo
  function sendLiveHug(customMsg = null) {
    const now = new Date();
    const timeStr = `Hoy, ${now.getHours()}:${pad(now.getMinutes())}`;
    const msg = customMsg !== null ? customMsg : (inputHugMessage ? inputHugMessage.value.trim() : "");

    const isRiham = activeSender === "riham";
    const senderLabel = isRiham ? "Riham (Cataluña 👧🏻🌸)" : "Jonathan (Guayaquil 👦🏻✨)";
    const recipientLabel = isRiham ? "Jonathan (Guayaquil 👦🏻✨)" : "Riham (Cataluña 👧🏻🌸)";

    const hugData = {
      id: "hug-" + Date.now(),
      sender: activeSender,
      senderName: senderLabel,
      recipient: isRiham ? "jonathan" : "riham",
      recipientName: recipientLabel,
      type: selectedHugType,
      title: selectedHugTitle,
      emoji: selectedHugEmoji,
      message: msg,
      time: timeStr,
      timestamp: Date.now()
    };

    // Actualizar localmente
    const stats = getHugStats();
    stats.total += 1;
    if (isRiham) stats.riham += 1;
    else stats.jonathan += 1;
    saveHugStats(stats);

    const history = getHugHistory();
    history.unshift(hugData);
    saveHugHistory(history);
    renderHugUI();

    // Limpiar input
    if (inputHugMessage) inputHugMessage.value = "";

    // Sonido y confeti local
    playHugChime("warm");
    if (window.confetti) {
      window.confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.75 },
        colors: ['#ff758f', '#c084fc', '#ff4d6d']
      });
    }

    // Transmitir en tiempo real
    if (gunHugsNode) {
      try {
        gunHugsNode.put({ data: JSON.stringify(hugData), time: Date.now() });
      } catch (e) {}
    }
    if (hugBroadcast) {
      hugBroadcast.postMessage({ type: "HUG_SENT", data: hugData });
    }
    if (window.AuthPairingService) {
      window.AuthPairingService.syncPairData("hug", hugData);
    }

    showToast(`🫂 ¡${selectedHugTitle} enviado con éxito a ${isRiham ? 'Jonathan' : 'Riham'}!`);
  }

  if (btnSendLiveHug) {
    btnSendLiveHug.addEventListener("click", () => sendLiveHug());
  }

  // Devolver abrazo desde el overlay
  if (btnReturnHug) {
    btnReturnHug.addEventListener("click", () => {
      if (hugReceivedOverlay) hugReceivedOverlay.classList.add("hidden");
      // Temporalmente enviar de vuelta
      const returnMsg = "¡Te devuelvo este abrazo con el doble de fuerza y mimos! 💖✨";
      sendLiveHug(returnMsg);
    });
  }

  if (btnCloseHugOverlay) {
    btnCloseHugOverlay.addEventListener("click", () => {
      if (hugReceivedOverlay) hugReceivedOverlay.classList.add("hidden");
    });
  }

  if (hugReceivedOverlay) {
    hugReceivedOverlay.addEventListener("click", (e) => {
      if (e.target === hugReceivedOverlay) hugReceivedOverlay.classList.add("hidden");
    });
  }

  // ==========================================================================
  // 8. CARTA SECRETA Y MODAL
  // ==========================================================================
  const btnOpenLetter = document.getElementById("open-letter-btn");
  const modalLetter = document.getElementById("modal-love-letter");
  const btnCloseLetter = document.getElementById("btn-close-letter");

  if (btnOpenLetter) {
    btnOpenLetter.addEventListener("click", () => {
      modalLetter.classList.remove("hidden");
      if (window.confetti) window.confetti({ particleCount: 90, spread: 80, origin: { y: 0.5 } });
    });
  }
  if (btnCloseLetter) btnCloseLetter.addEventListener("click", () => modalLetter.classList.add("hidden"));
  if (modalLetter) {
    modalLetter.addEventListener("click", (e) => {
      if (e.target === modalLetter) modalLetter.classList.add("hidden");
    });
  }

  // ==========================================================================
  // 9. SELECTOR DE TEMA (PASTEL / NOCHE ESTRELLADA)
  // ==========================================================================
  const themeBtn = document.getElementById("theme-toggle-btn");
  const themeIcon = document.getElementById("theme-icon");
  const htmlRoot = document.documentElement;

  const savedTheme = localStorage.getItem("jonathan_theme") || "pastel-romantic";
  htmlRoot.setAttribute("data-theme", savedTheme);
  updateThemeIcon(savedTheme);

  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const cur = htmlRoot.getAttribute("data-theme");
      const next = cur === "starry-night" ? "pastel-romantic" : "starry-night";
      htmlRoot.setAttribute("data-theme", next);
      localStorage.setItem("jonathan_theme", next);
      updateThemeIcon(next);
      if (window.confetti) window.confetti({ particleCount: 30, spread: 50 });
    });
  }

  function updateThemeIcon(theme) {
    if (!themeIcon) return;
    themeIcon.className = theme === "starry-night" ? "fa-solid fa-sun" : "fa-solid fa-moon";
  }

  // ==========================================================================
  // 10. WIDGET DE CLIMA EN TIEMPO REAL (CATALUÑA 🇪🇸 ↔ GUAYAQUIL 🇪🇨)
  // API Pública y Gratuita de Open-Meteo (Sin necesidad de API Key)
  // ==========================================================================
  const btnRefreshWeather = document.getElementById("btn-refresh-weather");
  const iconWeatherCat = document.getElementById("icon-weather-cat");
  const tempWeatherCat = document.getElementById("temp-weather-cat");
  const descWeatherCat = document.getElementById("desc-weather-cat");
  const humidityWeatherCat = document.getElementById("humidity-weather-cat");
  const windWeatherCat = document.getElementById("wind-weather-cat");

  const iconWeatherGye = document.getElementById("icon-weather-gye");
  const tempWeatherGye = document.getElementById("temp-weather-gye");
  const descWeatherGye = document.getElementById("desc-weather-gye");
  const humidityWeatherGye = document.getElementById("humidity-weather-gye");
  const windWeatherGye = document.getElementById("wind-weather-gye");

  function getWeatherInterpretation(wmoCode, isDay = 1) {
    if (wmoCode === 0) return { icon: isDay ? "☀️" : "🌙", desc: isDay ? "Cielo Despejado & Soleado" : "Noche Despejada & Estrellada" };
    if (wmoCode === 1 || wmoCode === 2) return { icon: isDay ? "🌤️" : "☁️", desc: "Parcialmente Nublado" };
    if (wmoCode === 3) return { icon: "☁️", desc: "Nublado & Templado" };
    if (wmoCode === 45 || wmoCode === 48) return { icon: "🌫️", desc: "Niebla Romántica" };
    if (wmoCode >= 51 && wmoCode <= 57) return { icon: "🌦️", desc: "Llovizna Suave" };
    if (wmoCode >= 61 && wmoCode <= 65) return { icon: "🌧️", desc: "Lluvia Fresca" };
    if (wmoCode >= 71 && wmoCode <= 77) return { icon: "❄️", desc: "Nieve / Clima Frío" };
    if (wmoCode >= 80 && wmoCode <= 82) return { icon: "🌧️", desc: "Chubascos Lluviosos" };
    if (wmoCode >= 95) return { icon: "⛈️", desc: "Tormenta Eléctrica" };
    return { icon: "☀️", desc: "Clima Templado & Agradable" };
  }

  async function fetchRealtimeWeather() {
    if (btnRefreshWeather) btnRefreshWeather.classList.add("spinning");

    try {
      const catUrl = "https://api.open-meteo.com/v1/forecast?latitude=41.3888&longitude=2.1590&current=temperature_2m,relative_humidity_2m,is_day,weather_code,wind_speed_10m&timezone=Europe%2FMadrid";
      const gyeUrl = "https://api.open-meteo.com/v1/forecast?latitude=-2.1962&longitude=-79.8862&current=temperature_2m,relative_humidity_2m,is_day,weather_code,wind_speed_10m&timezone=America%2FGuayaquil";

      const [catRes, gyeRes] = await Promise.all([
        fetch(catUrl).catch(() => null),
        fetch(gyeUrl).catch(() => null)
      ]);

      if (catRes && catRes.ok) {
        const catData = await catRes.json();
        if (catData && catData.current) {
          const cur = catData.current;
          const info = getWeatherInterpretation(cur.weather_code, cur.is_day);
          if (iconWeatherCat) iconWeatherCat.textContent = info.icon;
          if (tempWeatherCat) tempWeatherCat.textContent = `${Math.round(cur.temperature_2m)}°C`;
          if (descWeatherCat) descWeatherCat.textContent = info.desc;
          if (humidityWeatherCat) humidityWeatherCat.textContent = `${cur.relative_humidity_2m}%`;
          if (windWeatherCat) windWeatherCat.textContent = `${Math.round(cur.wind_speed_10m)} km/h`;
        }
      }

      if (gyeRes && gyeRes.ok) {
        const gyeData = await gyeRes.json();
        if (gyeData && gyeData.current) {
          const cur = gyeData.current;
          const info = getWeatherInterpretation(cur.weather_code, cur.is_day);
          if (iconWeatherGye) iconWeatherGye.textContent = info.icon;
          if (tempWeatherGye) tempWeatherGye.textContent = `${Math.round(cur.temperature_2m)}°C`;
          if (descWeatherGye) descWeatherGye.textContent = info.desc;
          if (humidityWeatherGye) humidityWeatherGye.textContent = `${cur.relative_humidity_2m}%`;
          if (windWeatherGye) windWeatherGye.textContent = `${Math.round(cur.wind_speed_10m)} km/h`;
        }
      }

    } catch (e) {
      console.warn("No se pudo cargar el clima en tiempo real, usando valores por defecto:", e);
    } finally {
      setTimeout(() => {
        if (btnRefreshWeather) btnRefreshWeather.classList.remove("spinning");
      }, 700);
    }
  }

  if (btnRefreshWeather) {
    btnRefreshWeather.addEventListener("click", () => {
      fetchRealtimeWeather();
      showToast("🌤️ ¡Clima de Cataluña y Guayaquil actualizado en tiempo real!");
    });
  }
  fetchRealtimeWeather();

  // ==========================================================================
  // 11. BUZÓN "CARTAS PARA ABRIR CUANDO..." 💌📬 (CON BLOQUEO POR FECHA)
  // ==========================================================================
  const ENVELOPES_STORAGE_KEY = "jonathan_envelopes_v10";

  const DEFAULT_ENVELOPES = [
    {
      id: "env-1",
      title: "Abre dentro de 3 meses",
      emoji: "📅",
      subtitle: "Para cuando nuestro amor haya crecido aún más",
      stampDate: "21 · 12 · 2026",
      unlockDate: "2026-12-21T00:00:00",
      badge: "Hito de 3 Meses",
      content: "Oye, si estás leyendo esto es porque ya pasaron 3 meses desde que hice tu pagina web. Es increible pensar cómo empezó todo en el Arena Breakout, cuando éramos solo amigos jugando y tú siempre me esperabas en el juego para entrar juntos a partida. De la nada pasamos a hablar sin parar, hasta que el 21 de mayo por fin te lanzaste a pedirme el número (menos mal que se te quitó la vergüenza). Mira dónde estamos ahora, jugando a mil cosas y hablándonos todo el día. Espero que sigamos riéndonos de las mismas tonterías. Te quiero un montón."
    },
    {
      id: "env-2",
      title: "Abre cuando tengas un mal día",
      emoji: "🌧️",
      subtitle: "Un refugio cálido cuando las cosas no salgan bien",
      stampDate: "Cualquier Día Difícil",
      unlockDate: null,
      badge: "Refugio & Mimos",
      content: "Sé que a veces los días se ponen pesados, pero me pasaba por aquí para recordarte que no estás solo. Aunque estemos lejos, siempre te voy a querer, estare para ti y para hacerte compañía. Acuérdate de que fuiste el primero en decirme que me querías y me amabas, y eso a mí no se me olvida. Descansa un poco o escríbeme. Estoy aquí para lo que necesites, mi lindo <3"
    },
    {
      id: "env-3",
      title: "Abre dentro de 5 meses",
      emoji: "⏳",
      subtitle: "Un hito más de nuestro camino juntos",
      stampDate: "21 · 10 · 2026",
      unlockDate: "2026-10-21T00:00:00",
      badge: "5 Meses de Amor",
      content: "5 meses jajajaja Si esto no se ha roto jaja, seguro que en este tiempo hemos subido mil fotos más a la carpeta de los juegos y nos hemos enviado muchos abrazos por la web. Me encanta ver cómo ha ido cambiando todo desde que éramos tímidos al principio. Gracias por seguir esperándome para jugar como el primer día y por hacerme tan feliz. Ojalá te haya sacado una sonrisa al leer esto. te amooooooooooo <3"
    },
    {
      id: "env-4",
      title: "Abre cuando me extrañes",
      emoji: "🥺",
      subtitle: "Cierra los ojos y siente mi calor",
      stampDate: "Cuando Sientas la Distancia",
      unlockDate: null,
      badge: "Abrazo Virtual Infinito",
      content: "Si abriste esto es porque seguro estás pensando en mí y la distancia se siente un poco más pesada hoy. Solo quiero recordarte que siempre estare contigo. Piensa en todo lo que hemos hablado desde aquel 21 de mayo y lo bonito que es saber que nos tenemos. Acuérdate de que yo también te extraño y te quiero muchíssisisisisisisisisisiisisimo <3333333"
    },
    {
      id: "env-5",
      title: "Abre dentro de 1 año",
      emoji: "🎂",
      subtitle: "Celebrando 365 días de puro amor",
      stampDate: "21 · 05 · 2027",
      unlockDate: "2027-05-21T00:00:00",
      badge: "Primer Aniversario",
      content: "Si miras atrás a cuando nos conocimos por el Arena, parece mentira todo lo que ha pasado. Pasamos de ser amigos a hablar a diario, jugar a mil cosas más y tener todo. Espero que te esté yendo increíble y que sigamos compartiendo momentos así. Gracias por atreverte a pedirme el número aquel día. Te amo muchisisisisisisisimo."
    }
  ];

  function isEnvelopeLocked(env) {
    if (!env || !env.unlockDate) return false;
    const now = new Date();
    const unlock = new Date(env.unlockDate);
    return now.getTime() < unlock.getTime();
  }

  function getDaysToUnlock(env) {
    if (!env || !env.unlockDate) return 0;
    const now = new Date();
    const unlock = new Date(env.unlockDate);
    const diff = unlock.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }

  function getEnvelopes() {
    try {
      localStorage.removeItem("jonathan_envelopes_v1");
      localStorage.removeItem("jonathan_envelopes_v2");
      localStorage.removeItem("jonathan_envelopes_v3");
      localStorage.removeItem("jonathan_envelopes_v4");
      localStorage.removeItem("jonathan_envelopes_v5");
      localStorage.removeItem("jonathan_envelopes_v6");
      localStorage.removeItem("jonathan_envelopes_v7");
      localStorage.removeItem("jonathan_envelopes_v8");
      localStorage.removeItem("jonathan_envelopes_v9");
      const saved = localStorage.getItem(ENVELOPES_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_ENVELOPES;
  }

  function saveEnvelopes(envs) {
    try {
      localStorage.setItem(ENVELOPES_STORAGE_KEY, JSON.stringify(envs));
    } catch (e) {}
  }

  const envelopesGrid = document.getElementById("envelopes-grid");
  const mailboxTotalCount = document.getElementById("mailbox-total-count");
  const btnOpenCreateLetter = document.getElementById("btn-open-create-letter");

  const modalOpenEnvelope = document.getElementById("modal-open-envelope");
  const btnCloseEnvelopeModal = document.getElementById("btn-close-envelope-modal");
  const btnCloseEnvelopeDone = document.getElementById("btn-close-envelope-done");
  const btnEditEnvelopeContent = document.getElementById("btn-edit-envelope-content");

  const envModalBadge = document.getElementById("env-modal-badge");
  const envModalDate = document.getElementById("env-modal-date");
  const envModalEmoji = document.getElementById("env-modal-emoji");
  const envModalTitle = document.getElementById("env-modal-title");
  const envModalBodyText = document.getElementById("env-modal-body-text");

  const modalEditEnvelope = document.getElementById("modal-edit-envelope");
  const btnCloseEditEnvelope = document.getElementById("btn-close-edit-envelope");
  const btnCancelEditEnvelope = document.getElementById("btn-cancel-edit-envelope");
  const formEditEnvelope = document.getElementById("form-edit-envelope");
  const modalEnvelopeFormTitle = document.getElementById("modal-envelope-form-title");
  const inputEnvelopeId = document.getElementById("edit-envelope-id");
  const inputEnvelopeTitle = document.getElementById("input-envelope-title");
  const selectEnvelopeEmoji = document.getElementById("select-envelope-emoji");
  const inputEnvelopeSubtitle = document.getElementById("input-envelope-subtitle");
  const inputEnvelopeContent = document.getElementById("input-envelope-content");

  let currentOpenedEnvelope = null;

  function renderEnvelopes() {
    if (!envelopesGrid) return;
    const envs = getEnvelopes();

    if (mailboxTotalCount) mailboxTotalCount.textContent = envs.length;

    envelopesGrid.innerHTML = envs.map(env => {
      const locked = isEnvelopeLocked(env);
      const daysLeft = getDaysToUnlock(env);

      return `
        <div class="envelope-3d-card ${locked ? 'is-locked' : ''}" data-id="${env.id}">
          <div class="envelope-wax-seal">${locked ? '🔒' : (env.emoji || '💌')}</div>
          <div class="envelope-stamp-corner">${env.stampDate || '21 · 05 · 2026'}</div>
          <div class="envelope-card-content">
            <span class="envelope-tag-pill ${locked ? 'locked-tag' : ''}">
              <i class="fa-solid ${locked ? 'fa-lock' : 'fa-heart'}"></i> 
              ${locked ? `Se abre el ${env.stampDate}` : (env.badge || 'Carta Especial')}
            </span>
            <h3 class="envelope-card-title">${env.title}</h3>
            <p class="envelope-card-subtitle">"${env.subtitle}"</p>
            <span class="envelope-open-hint ${locked ? 'hint-locked' : ''}">
              <i class="fa-solid ${locked ? 'fa-lock' : 'fa-envelope-open-text'}"></i> 
              ${locked ? `Bloqueada (Faltan ${daysLeft} días)` : 'Toca para abrir sobre'}
            </span>
          </div>
        </div>
      `;
    }).join("");

    envelopesGrid.querySelectorAll(".envelope-3d-card").forEach(card => {
      card.addEventListener("click", () => {
        const id = card.getAttribute("data-id");
        const envs = getEnvelopes();
        const found = envs.find(x => x.id === id);
        if (!found) return;

        if (isEnvelopeLocked(found)) {
          card.classList.add("shake-locked");
          setTimeout(() => card.classList.remove("shake-locked"), 500);
          const days = getDaysToUnlock(found);
          showToast(`🔒 ¡Aún no puedes abrir este sobre, amorcito! Se desbloqueará el ${found.stampDate} (Faltan ${days} días) ⏳❤️`);
          return;
        }

        openEnvelopeModal(found);
      });
    });
  }

  function openEnvelopeModal(env) {
    currentOpenedEnvelope = env;
    if (envModalBadge) envModalBadge.textContent = `💌 ${env.badge || 'Carta para abrir cuando...'}`;
    if (envModalDate) envModalDate.textContent = env.stampDate || "21 · 05 · 2026";
    if (envModalEmoji) envModalEmoji.textContent = env.emoji || "💌";
    if (envModalTitle) envModalTitle.textContent = env.title;
    if (envModalBodyText) envModalBodyText.textContent = env.content;

    if (modalOpenEnvelope) modalOpenEnvelope.classList.remove("hidden");

    playHugChime("sparkle");
    if (window.confetti) {
      window.confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#ff758f', '#c084fc', '#f59e0b']
      });
    }
  }

  if (btnCloseEnvelopeModal && modalOpenEnvelope) {
    btnCloseEnvelopeModal.addEventListener("click", () => modalOpenEnvelope.classList.add("hidden"));
  }
  if (btnCloseEnvelopeDone && modalOpenEnvelope) {
    btnCloseEnvelopeDone.addEventListener("click", () => {
      modalOpenEnvelope.classList.add("hidden");
      showToast("💌 ¡Carta guardada en el corazón con todo mi amor!");
    });
  }
  if (modalOpenEnvelope) {
    modalOpenEnvelope.addEventListener("click", (e) => {
      if (e.target === modalOpenEnvelope) modalOpenEnvelope.classList.add("hidden");
    });
  }

  if (btnEditEnvelopeContent && modalEditEnvelope) {
    btnEditEnvelopeContent.addEventListener("click", () => {
      if (!currentOpenedEnvelope) return;
      if (modalOpenEnvelope) modalOpenEnvelope.classList.add("hidden");

      if (modalEnvelopeFormTitle) modalEnvelopeFormTitle.innerHTML = `<i class="fa-solid fa-pen-to-square"></i> Editar Carta: ${currentOpenedEnvelope.title}`;
      if (inputEnvelopeId) inputEnvelopeId.value = currentOpenedEnvelope.id;
      if (inputEnvelopeTitle) inputEnvelopeTitle.value = currentOpenedEnvelope.title;
      if (selectEnvelopeEmoji) selectEnvelopeEmoji.value = currentOpenedEnvelope.emoji || "💌";
      if (inputEnvelopeSubtitle) inputEnvelopeSubtitle.value = currentOpenedEnvelope.subtitle;
      if (inputEnvelopeContent) inputEnvelopeContent.value = currentOpenedEnvelope.content;

      modalEditEnvelope.classList.remove("hidden");
    });
  }

  if (btnOpenCreateLetter && modalEditEnvelope) {
    btnOpenCreateLetter.addEventListener("click", () => {
      if (modalEnvelopeFormTitle) modalEnvelopeFormTitle.innerHTML = `<i class="fa-solid fa-pen-nib"></i> Escribir Nueva Carta "Abrir Cuando..."`;
      if (formEditEnvelope) formEditEnvelope.reset();
      if (inputEnvelopeId) inputEnvelopeId.value = "";
      modalEditEnvelope.classList.remove("hidden");
    });
  }

  if (btnCloseEditEnvelope && modalEditEnvelope) {
    btnCloseEditEnvelope.addEventListener("click", () => modalEditEnvelope.classList.add("hidden"));
  }
  if (btnCancelEditEnvelope && modalEditEnvelope) {
    btnCancelEditEnvelope.addEventListener("click", () => modalEditEnvelope.classList.add("hidden"));
  }
  if (modalEditEnvelope) {
    modalEditEnvelope.addEventListener("click", (e) => {
      if (e.target === modalEditEnvelope) modalEditEnvelope.classList.add("hidden");
    });
  }

  if (formEditEnvelope) {
    formEditEnvelope.addEventListener("submit", (e) => {
      e.preventDefault();
      const id = inputEnvelopeId ? inputEnvelopeId.value : "";
      const title = inputEnvelopeTitle.value.trim();
      const emoji = selectEnvelopeEmoji.value;
      const subtitle = inputEnvelopeSubtitle.value.trim();
      const content = inputEnvelopeContent.value.trim();

      if (!title || !content) return;

      const envs = getEnvelopes();

      let targetEnv = null;
      if (id) {
        const found = envs.find(x => x.id === id);
        if (found) {
          found.title = title;
          found.emoji = emoji;
          found.subtitle = subtitle || "Para un momento muy especial";
          found.content = content;
          targetEnv = found;
        }
      } else {
        targetEnv = {
          id: "env-" + Date.now(),
          title: title,
          emoji: emoji || "💌",
          subtitle: subtitle || "Para cuando llegue el momento indicado",
          stampDate: "Nueva Carta",
          badge: "Carta Personalizada",
          content: content
        };
        envs.push(targetEnv);
      }

      saveEnvelopes(envs);
      renderEnvelopes();

      if (window.AuthPairingService && targetEnv) {
        window.AuthPairingService.syncPairData("envelope", { action: id ? "edit" : "add", envelope: targetEnv });
      }

      formEditEnvelope.reset();
      modalEditEnvelope.classList.add("hidden");
      showToast("💌 ¡Carta guardada exitosamente en el buzón virtual!");
      if (window.confetti) window.confetti({ particleCount: 70, spread: 70 });
    });
  }

  renderEnvelopes();

  // ==========================================================================
  // 12. SUSCRIPCIONES Y SINCRONIZACIÓN CON BACKEND / REALTIME PAIRING SERVICE
  // ==========================================================================
  if (window.AuthPairingService) {
    // 1. Sincronización de Identidad activa
    window.AuthPairingService.onAuthStateChanged((user) => {
      if (user && user.role) {
        activeSender = user.role;
        updateIdentityUI();
      }
    });

    // 2. Abrazos en tiempo real
    window.AuthPairingService.onPairData("hug", (hugData) => {
      if (hugData && hugData.sender !== activeSender) {
        triggerReceivedHug(hugData, true);
      }
    });

    // 3. Bloc de notas en tiempo real
    window.AuthPairingService.onPairData("note", (data) => {
      if (!data) return;
      const notes = getNotes();
      if (data.action === "add" && data.note) {
        if (!notes.some(n => n.id === data.note.id)) {
          notes.unshift(data.note);
          saveNotes(notes, false);
          renderNotes();
          playHugChime("sparkle");
          showToast("📝 ¡Tu amorcito ha pegado una nueva notita en el muro! 💖");
          if (window.confetti) window.confetti({ particleCount: 50, spread: 60 });
        }
      } else if (data.action === "react" && data.noteId) {
        const note = notes.find(n => n.id === data.noteId);
        if (note) {
          note.reactions = note.reactions || {};
          note.reactions[data.emoji] = data.count;
          saveNotes(notes, false);
          renderNotes();
        }
      } else if (data.action === "delete" && data.noteId) {
        const filtered = notes.filter(n => n.id !== data.noteId);
        saveNotes(filtered, false);
        renderNotes();
      }
    });

    // 4. Muro de fotos compartido en tiempo real (Roblox, Minecraft, Arena Breakout, Nosotros, Mascotas)
    window.AuthPairingService.onPairData("photo", (data) => {
      if (!data) return;
      const { gallery, action, item, id, likes } = data;
      if (gallery === "gamer") {
        const memories = getGamerMemories();
        if (action === "add" && item) {
          if (!memories.some(m => m.id === item.id)) memories.unshift(item);
        } else if (action === "like" && id) {
          const found = memories.find(m => m.id === id);
          if (found) found.likes = likes;
        } else if (action === "edit" && item) {
          const idx = memories.findIndex(m => m.id === item.id);
          if (idx !== -1) memories[idx] = item;
        }
        saveGamerMemories(memories);
        renderGallery();
      } else if (gallery === "nosotros") {
        const photos = getNosotrosPhotos();
        if (action === "add" && item) {
          if (!photos.some(m => m.id === item.id)) photos.unshift(item);
        } else if (action === "like" && id) {
          const found = photos.find(m => m.id === id);
          if (found) found.likes = likes;
        } else if (action === "edit" && item) {
          const idx = photos.findIndex(m => m.id === item.id);
          if (idx !== -1) photos[idx] = item;
        }
        saveNosotrosPhotos(photos);
        renderNosotros();
      } else if (gallery === "pets") {
        const pets = getPetMemories();
        if (action === "add" && item) {
          if (!pets.some(m => m.id === item.id)) pets.unshift(item);
        } else if (action === "like" && id) {
          const found = pets.find(m => m.id === id);
          if (found) found.likes = likes;
        } else if (action === "edit" && item) {
          const idx = pets.findIndex(m => m.id === item.id);
          if (idx !== -1) pets[idx] = item;
        }
        savePetMemories(pets);
        renderPetsGallery();
      }
      showToast("📸 ¡Tu amorcito ha actualizado una foto en la galería! ✨");
      if (window.confetti) window.confetti({ particleCount: 50, spread: 60 });
    });

    // 5. Cartas del Buzón en tiempo real
    window.AuthPairingService.onPairData("envelope", (data) => {
      if (!data || !data.envelope) return;
      const envs = getEnvelopes();
      const idx = envs.findIndex(e => e.id === data.envelope.id);
      if (idx !== -1) {
        envs[idx] = data.envelope;
      } else {
        envs.push(data.envelope);
      }
      saveEnvelopes(envs);
      renderEnvelopes();
      showToast("💌 ¡Tu amorcito ha actualizado una carta en el buzón! ✨");
      if (window.confetti) window.confetti({ particleCount: 50, spread: 60 });
    });

    // 6. Fechas especiales en tiempo real
    window.AuthPairingService.onPairData("date", (data) => {
      if (!data) return;
      const dates = getDates();
      if (data.action === "add" && data.date) {
        if (!dates.some(d => d.id === data.date.id)) {
          dates.push(data.date);
          saveDates(dates);
          renderDates();
          showToast("📅 ¡Tu amorcito ha guardado una nueva fecha especial!");
          if (window.confetti) window.confetti({ particleCount: 50, spread: 60 });
        }
      } else if (data.action === "delete" && data.id) {
        const updated = dates.filter(d => d.id !== data.id);
        saveDates(updated);
        renderDates();
      }
    });

    // 7. Alerta de escritura
    window.AuthPairingService.onPairData("typing", () => {
      const typingAlert = document.getElementById("typing-alert-box");
      if (typingAlert) {
        typingAlert.classList.remove("hidden");
        setTimeout(() => typingAlert.classList.add("hidden"), 3500);
      }
    });

    // 8. Sincronización masiva inicial desde la base de datos Supabase
    window.AuthPairingService.onPairData("all", (allData) => {
      if (!allData) return;
      if (allData.notes && Array.isArray(allData.notes) && allData.notes.length > 0) {
        saveNotes(allData.notes, false);
        renderNotes();
      }
      if (allData.dates && Array.isArray(allData.dates) && allData.dates.length > 0) {
        saveDates(allData.dates);
        renderDates();
      }
      if (allData.gamer && Array.isArray(allData.gamer) && allData.gamer.length > 0) {
        saveGamerMemories(allData.gamer);
        renderGallery();
      }
      if (allData.nosotros && Array.isArray(allData.nosotros) && allData.nosotros.length > 0) {
        saveNosotrosPhotos(allData.nosotros);
        renderNosotros();
      }
      if (allData.pets && Array.isArray(allData.pets) && allData.pets.length > 0) {
        savePetMemories(allData.pets);
        renderPetsGallery();
      }
      if (allData.envelopes && Array.isArray(allData.envelopes) && allData.envelopes.length > 0) {
        saveEnvelopes(allData.envelopes);
        renderEnvelopes();
      }
    });
  }

  // Toast Helper
  function showToast(msg) {
    const toast = document.getElementById("love-toast");
    const text = document.getElementById("toast-message-text");
    if (!toast || !text) return;
    text.textContent = msg;
    toast.classList.remove("hidden");
    setTimeout(() => toast.classList.add("hidden"), 3500);
  }

  // Scroll Spy
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");
  window.addEventListener("scroll", () => {
    let cur = "";
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 130) cur = s.getAttribute("id");
    });
    navLinks.forEach(l => {
      l.classList.remove("active");
      if (l.getAttribute("href") === `#${cur}`) l.classList.add("active");
    });
  });
});
