<!--
  Componente App Principal
  Integra Vue Router, navegación, footer y todos los componentes
  Siguiendo principios SOLID y Clean Architecture con Vue 3 Composition API
-->

<template>
  <div id="app" class="app">
    <!-- Navegación principal -->
    <AppNavigation
      :company-name="companyData.companyName"
      :tagline="companyData.tagline"
      :cta-text="'Contactar'"
      :cart-item-count="cartItemCount"
      :navigation-items="navigationItems"
      @cart-click="handleCartClick"
      @menu-item-click="handleMenuItemClick"
      @logo-click="handleLogoClick"
    />

    <!-- Panel de redes sociales flotante -->
    <SocialSidePanel
      :social-media="companyData.socialMedia"
      @social-click="handleSocialClick"
    />

    <!-- Contenido principal (donde se renderizan las rutas) -->
    <main class="main-content">
      <router-view v-slot="{ Component, route }">
        <transition 
          :name="getTransitionName(route)" 
          mode="out-in"
          @enter="onPageEnter"
          @leave="onPageLeave"
        >
          <div :key="route.path" class="page-container">
            <component :is="Component" />
          </div>
        </transition>
      </router-view>
    </main>

    <!-- Footer -->
    <AppFooter
      :company-info="companyData"
      :quick-links="quickLinks"
      :featured-services="featuredServices"
      :social-media="companyData.socialMedia"
      @link-click="handleFooterLinkClick"
      @service-click="handleFooterServiceClick"
      @contact-click="handleFooterContactClick"
      @social-click="handleSocialClick"
      @policy-click="handlePolicyClick"
      @newsletter-submit="handleNewsletterSubmit"
    />

    <!-- Shopping Cart Modal/Drawer (si está abierto) -->
    <ShoppingCart 
      v-if="isCartOpen"
      :is-open="isCartOpen"
      :items="cartItems"
      :cart-summary="cartSummary"
      @close="closeCart"
      @remove-item="handleRemoveFromCart"
      @update-quantity="handleUpdateQuantity"
      @checkout="handleCheckout"
      @continue-shopping="handleContinueShopping"
      @shop-now="handleShopNow"
    />

    <!-- Componente de notificaciones globales -->
    <div id="notifications-container"></div>

    <!-- Loading overlay global -->
    <div v-if="isGlobalLoading" class="global-loading">
      <div class="loading-spinner">
        <div class="spinner-ring"></div>
        <p class="loading-text">Cargando...</p>
      </div>
    </div>

    <!-- Back to top button -->
    <button 
      v-if="showBackToTop"
      class="back-to-top"
      @click="scrollToTop"
      aria-label="Volver arriba"
    >
      <span class="back-icon">↑</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AppNavigation from '@/components/AppNavigation.vue';
import AppFooter from '@/components/AppFooter.vue';
import ShoppingCart from '@/components/ShoppingCart.vue';
import SocialSidePanel from '@/components/SocialSidePanel.vue';
import { useShoppingCart } from '@/composables/useShoppingCart';
import { useNotifications } from '@/composables/useNotifications';
import { generalService } from '@/services/generalService';

// Router y composables
const route = useRoute();
const router = useRouter();
const { itemCount, isOpen: isCartOpen, closeCart, items: cartItems, cartSummary, removeFromCart, updateQuantity } = useShoppingCart();
const { showSuccess, showError, showInfo } = useNotifications();

// Estado reactivo
const isGlobalLoading = ref(false);
const showBackToTop = ref(false);
const companyData = ref<any>({
  companyName: 'Optivision4k',
  tagline: 'Cuidado Visual de Calidad',
  description: 'Somos especialistas en cuidado visual con más de 2 años de experiencia.',
  phone: '+57 312 376 5934',
  whatsapp: '+57 312 376 5934',
  email: 'info@opticavision4k.com',
  address: 'Solo Servicios a Domicilio',
  addressDetails: 'Atendemos en Bucaramanga y alrededores',
  workingHours: 'Lunes a Viernes: 8:00 AM - 6:00 PM | Sábados: 9:00 AM - 4:00 PM',
  socialMedia: {
    facebook: 'https://facebook.com/opticavision4k',
    instagram: 'https://instagram.com/opticavision4k',
    whatsapp: 'https://wa.me/573123765934',
    twitter: 'https://twitter.com/opticavision4k'
  }
});

// Computed properties
const cartItemCount = computed(() => itemCount.value);

// Configuración de navegación
const navigationItems = [
  { id: 'home', label: 'Inicio', path: '/', icon: '🏠' },
  { id: 'products', label: 'Productos', path: '/productos', icon: '👓' },
  { id: 'services', label: 'Servicios', path: '/servicios', icon: '⚕️' },
  { id: 'contact', label: 'Contacto', path: '/contacto', icon: '📞' }
];

const quickLinks = [
  { id: 'home', label: 'Inicio', path: '/', icon: '🏠' },
  { id: 'products', label: 'Productos', path: '/productos', icon: '👓' },
  { id: 'services', label: 'Servicios', path: '/servicios', icon: '⚕️' },
  { id: 'contact', label: 'Contacto', path: '/contacto', icon: '📞' },
  { id: 'cart', label: 'Carrito', path: '/carrito', icon: '🛒' }
];

const featuredServices = [
  { id: 'home-exam', name: 'Examen a Domicilio', icon: '🏠' },
  { id: 'express', name: 'Montaje Express', icon: '⚡' },
  { id: 'repair', name: 'Reparaciones', icon: '🔧' },
  { id: 'consultation', name: 'Asesoría Gratuita', icon: '💬' }
];

// Métodos de manejo de eventos
const handleCartClick = (): void => {
  router.push('/carrito');
};

const handleMenuItemClick = (item: any): void => {
  // Analytics o tracking
  console.log('Menu item clicked:', item);
};

const handleLogoClick = (): void => {
  router.push('/');
};

const handleFooterLinkClick = (link: any): void => {
  router.push(link.path);
};

const handleFooterServiceClick = (service: any): void => {
  router.push(`/servicios/${service.id}`);
};

const handleFooterContactClick = (type: string): void => {
  console.log('Contact clicked:', type);
  
  // Tracking para analytics
  if (type === 'phone') {
    showInfo('Llamada', 'Iniciando llamada...');
  } else if (type === 'email') {
    showInfo('Email', 'Abriendo cliente de email...');
  }
};

const handleSocialClick = (platform: string): void => {
  showInfo('Redes Sociales', `Abriendo ${platform}...`);
  console.log('Social clicked:', platform);
};

const handlePolicyClick = (type: string): void => {
  // Por ahora mostrar info, en futuro desarrollo crear páginas específicas
  showInfo('Información Legal', `Mostrando ${type}...`);
  console.log('Policy clicked:', type);
};

const handleNewsletterSubmit = async (email: string): Promise<void> => {
  try {
    await generalService.subscribeNewsletter({ email });
    showSuccess('¡Suscrito!', 'Te has suscrito exitosamente a nuestro newsletter');
  } catch (error) {
    showError('Error', 'No se pudo completar la suscripción');
  }
};

const handleCheckout = (): void => {
  router.push('/checkout');
};

// Métodos adicionales para ShoppingCart
const handleRemoveFromCart = (itemId: string): void => {
  const success = removeFromCart(itemId);
  if (success) {
    showSuccess('¡Producto removido!', 'El producto fue eliminado del carrito');
  } else {
    showError('Error', 'No se pudo remover el producto');
  }
};

const handleUpdateQuantity = (itemId: string, quantity: number): void => {
  const success = updateQuantity(itemId, quantity);
  if (success) {
    showSuccess('Actualizado', 'Cantidad actualizada correctamente');
  } else {
    showError('Error', 'No se pudo actualizar la cantidad');
  }
};

const handleContinueShopping = (): void => {
  closeCart();
  router.push('/productos');
};

const handleShopNow = (): void => {
  closeCart();
  router.push('/productos');
};

// Métodos de transiciones y efectos
const getTransitionName = (route: any): string => {
  // Transiciones personalizadas según la ruta
  if (route.meta?.transition) {
    return route.meta.transition;
  }
  
  // Transición por defecto
  return 'page-fade';
};

const onPageEnter = (): void => {
  // Lógica al entrar en una página
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const onPageLeave = (): void => {
  // Lógica al salir de una página
};

// Manejo del scroll
const handleScroll = (): void => {
  showBackToTop.value = window.scrollY > 300;
};

const scrollToTop = (): void => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

// Cargar datos iniciales
const loadAppData = async (): Promise<void> => {
  try {
    isGlobalLoading.value = true;
    
    const response = await generalService.getGeneralContent();
    companyData.value = {
      ...companyData.value,
      ...response.data.general
    };
    
  } catch (error) {
    console.error('Error loading app data:', error);
    showError('Error', 'No se pudieron cargar los datos de la aplicación');
  } finally {
    isGlobalLoading.value = false;
  }
};

// Manejar cambios de ruta para analytics/tracking
watch(
  () => route.path,
  (newPath, oldPath) => {
    console.log(`Navigation: ${oldPath} → ${newPath}`);
    
    // Aquí se puede agregar lógica de analytics
    // Por ejemplo: Google Analytics, Facebook Pixel, etc.
  }
);

// Lifecycle hooks
onMounted(() => {
  loadAppData();
  window.addEventListener('scroll', handleScroll);
  
  // Configurar meta tags básicos
  document.querySelector('meta[name="viewport"]')?.setAttribute(
    'content', 
    'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
  );
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style>
/* Importar estilos centralizados */
@import '@/styles/main.css';
@import '@/styles/optivision.css';

/* Estilos específicos de la aplicación */
.app {
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}

.main-content {
  flex: 1; /* Altura de la navbar */
  position: relative;
  margin-top: 50px; /* Altura de navbar */
}

.page-container {
  min-height: calc(100vh - 70px);
  display: flex;
  flex-direction: column;
}

/* Transiciones de página */
.page-fade-enter-active,
.page-fade-leave-active {
  transition: all 0.3s ease-out;
}

.page-fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.page-fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.page-slide-enter-active,
.page-slide-leave-active {
  transition: all 0.4s ease-out;
}

.page-slide-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.page-slide-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

/* Loading global */
.global-loading {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-modal);
}

.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-lg);
}

.spinner-ring {
  width: 60px;
  height: 60px;
  border: 4px solid var(--gray-200);
  border-top: 4px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-text {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-medium);
  color: var(--gray-700);
  margin: 0;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Back to top button */
.back-to-top {
  position: fixed;
  bottom: var(--spacing-lg);
  right: var(--spacing-lg);
  width: 50px;
  height: 50px;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-lg);
  transition: all var(--transition-normal);
  z-index: var(--z-fixed);
}

.back-to-top:hover {
  background: var(--primary-dark);
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
}

.back-icon {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .main-content {
    margin-top: 0px; /* Altura de navbar en móvil */
  }

  .page-container {
    min-height: calc(100vh - 60px);
  }

  .back-to-top {
    width: 45px;
    height: 45px;
    bottom: var(--spacing-md);
    right: var(--spacing-md);
  }

  .back-icon {
    font-size: var(--font-size-lg);
  }
}

/* Configuraciones globales adicionales */
html {
  scroll-behavior: smooth;
}

body {
  overflow-x: hidden;
}

/* Mejorar la accesibilidad */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Focus states mejorados */
*:focus {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}

button:focus,
a:focus,
input:focus,
textarea:focus,
select:focus {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}

/* Scroll personalizado */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: var(--gray-100);
}

::-webkit-scrollbar-thumb {
  background: var(--gray-400);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--gray-500);
}

/* Animaciones de entrada para elementos */
.animate-on-scroll {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.6s ease-out;
}

.animate-on-scroll.visible {
  opacity: 1;
  transform: translateY(0);
}

/* Print styles */
@media print {
  .navbar,
  .footer,
  .back-to-top,
  .global-loading {
    display: none !important;
  }

  .main-content {
    margin-top: 0 !important;
  }

  .page-container {
    min-height: auto !important;
  }
}
</style>
