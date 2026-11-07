// Gestor de Instalación y PWA para JoRi App
(function () {
  'use strict';

  // 1. Registro del Service Worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('./sw.js')
        .then((reg) => console.log('❤️ JoRi PWA: Service Worker listo en', reg.scope))
        .catch((err) => console.warn('JoRi PWA: Error al registrar Service Worker:', err));
    });
  }

  // 2. Comprobar si ya está instalada / abierta como App
  const isStandalone =
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true;

  if (isStandalone) {
    console.log('❤️ JoRi App: Ejecutándose en modo App instalada');
    return; // Ya está instalada, no mostramos banner de instalación
  }

  // 3. Capturar el evento de instalación nativo (Android / Chrome / Edge)
  let deferredPrompt = null;
  const banner = document.getElementById('pwa-install-banner');
  const installBtn = document.getElementById('pwa-install-btn');
  const closeBtn = document.getElementById('pwa-close-btn');

  // Si el usuario ya lo cerró en esta sesión, no insistir de inmediato
  const isDismissed = sessionStorage.getItem('jori_pwa_dismissed');

  window.addEventListener('beforeinstallprompt', (e) => {
    // Evitar que el navegador muestre el mini-infobar automático
    e.preventDefault();
    deferredPrompt = e;

    if (banner && !isDismissed) {
      setTimeout(() => {
        banner.classList.remove('hidden');
        banner.classList.add('visible');
      }, 2500); // Aparece suavemente después de 2.5s
    }
  });

  if (installBtn) {
    installBtn.addEventListener('click', async () => {
      if (!deferredPrompt) {
        // En caso de iOS Safari
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        if (isIOS) {
          alert("📱 Para instalar en tu iPhone:\n1. Toca el botón 'Compartir' (el icono cuadrado con flecha hacia arriba abajo en la pantalla).\n2. Desliza y pulsa 'Añadir a pantalla de inicio' ➕.");
        } else {
          alert("📱 Para instalar la app, abre las opciones de tu navegador (los 3 puntos arriba a la derecha) y selecciona 'Instalar aplicación' o 'Añadir a la pantalla de inicio'.");
        }
        return;
      }

      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`Elección del usuario: ${outcome}`);
      deferredPrompt = null;

      if (banner) {
        banner.classList.remove('visible');
        banner.classList.add('hidden');
      }
    });
  }

  if (closeBtn && banner) {
    closeBtn.addEventListener('click', () => {
      banner.classList.remove('visible');
      banner.classList.add('hidden');
      sessionStorage.setItem('jori_pwa_dismissed', 'true');
    });
  }

  window.addEventListener('appinstalled', () => {
    console.log('🎉 ¡JoRi App se ha instalado con éxito!');
    if (banner) {
      banner.classList.remove('visible');
      banner.classList.add('hidden');
    }
  });

  // Si es iOS, mostrar el banner informativo si no está instalada
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  if (isIOS && !isStandalone && banner && !isDismissed) {
    setTimeout(() => {
      const textSub = banner.querySelector('.pwa-text-box p');
      if (textSub) textSub.innerText = "Toca aquí para ver cómo instalarla en tu iPhone ❤️";
      banner.classList.remove('hidden');
      banner.classList.add('visible');
    }, 3500);
  }
})();

