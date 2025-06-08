<!--
  Componente de Navegación Principal
  Implementa principios SOLID y Clean Architecture
  Recibe datos del componente padre y emite eventos
-->

<template>
  <nav class="navbar" :class="{ 'navbar-scrolled': isScrolled }">
    <div class="container">
      <div class="navbar-content">
        <!-- Logo y marca -->
        <div class="navbar-brand">
          <router-link to="/" class="brand-link" @click="closeMenu">
            <div class="brand-logo">
              <img src="../assets/image/logos/LOGOOPTIVISIÓN4K.webp" alt="logo" class="logo-icon" />
              <div class="brand-text">
                <span class="brand-name">{{ companyName }}</span>
                <span class="brand-tagline">{{ tagline }}</span>
              </div>
            </div>
          </router-link>
        </div>

        <!-- Menú principal (desktop) -->
        <ul class="navbar-menu" :class="{ 'menu-open': isMobileMenuOpen }">
          <li 
            v-for="item in navigationItems" 
            :key="item.id"
            class="menu-item"
          >
            <router-link 
              :to="item.path" 
              class="menu-link"
              :class="{ 'active': isActiveRoute(item.path) }"
              @click="handleMenuClick(item)"
            >
              <span class="menu-icon">{{ item.icon }}</span>
              <span class="menu-text">{{ item.label }}</span>
            </router-link>
          </li>
        </ul>

        <!-- Acciones de la navbar -->
        <div class="navbar-actions">
          <!-- Botón de carrito -->
          <button 
            class="cart-button"
            @click="handleCartClick"
            :class="{ 'cart-has-items': cartItemCount > 0 }"
          >
            <span class="cart-icon">🛒</span>
            <span v-if="cartItemCount > 0" class="cart-badge">
              {{ cartItemCount }}
            </span>
          </button>

          <!-- Botón CTA principal -->
          <router-link 
            to="/contacto" 
            class="btn btn-primary cta-button"
            @click="closeMenu"
          >
            <span class="btn-icon">📞</span>
            <span class="btn-text">{{ ctaText }}</span>
          </router-link>

          <!-- Botón menú móvil -->
          <button 
            class="mobile-menu-toggle"
            @click="toggleMobileMenu"
            :aria-expanded="isMobileMenuOpen"
            aria-label="Toggle menu"
          >
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
          </button>
        </div>
      </div>
    </div>

    <!-- Overlay para menú móvil -->
    <div 
      v-if="isMobileMenuOpen" 
      class="mobile-overlay"
      @click="closeMobileMenu"
    ></div>

    <!-- Menú móvil -->
    <div 
      v-if="isMobileMenuOpen" 
      class="mobile-menu"
      :class="{ 'is-active': isMobileMenuOpen }"
    >
      <ul class="mobile-menu-list">
        <li 
          v-for="item in navigationItems" 
          :key="item.id"
          class="mobile-menu-item"
        >
          <router-link 
            :to="item.path" 
            class="mobile-menu-link"
            @click="handleMenuClick(item)"
          >
            <span class="mobile-menu-icon">{{ item.icon }}</span>
            <span class="mobile-menu-text">{{ item.label }}</span>
          </router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';

// Props del componente
interface Props {
  companyName: string;
  tagline: string;
  ctaText: string;
  cartItemCount: number;
  navigationItems: Array<{
    id: string;
    label: string;
    path: string;
    icon: string;
  }>;
}

const props = withDefaults(defineProps<Props>(), {
  companyName: 'Optivision 4k',
  tagline: 'Mira al mundo con otros ojos',
  ctaText: 'Contactar',
  cartItemCount: 0,
  navigationItems: () => [
    { id: 'home', label: 'Inicio', path: '/', icon: '🏠' },
    { id: 'products', label: 'Productos', path: '/productos', icon: '👓' },
    { id: 'services', label: 'Servicios', path: '/servicios', icon: '⚕️' },
    { id: 'about', label: 'Nosotros', path: '/nosotros', icon: 'ℹ️' },
    { id: 'contact', label: 'Contacto', path: '/contacto', icon: '📞' }
  ]
});

// Eventos que emite el componente
const emit = defineEmits<{
  cartClick: [];
  menuItemClick: [item: any];
  logoClick: [];
}>();

// Estado reactivo local
const isMobileMenuOpen = ref(false);
const isScrolled = ref(false);
const route = useRoute();

// Computed properties
const isActiveRoute = computed(() => (path: string) => {
  return route.path === path || (path !== '/' && route.path.startsWith(path));
});

// Métodos
const toggleMobileMenu = (): void => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
  
  // Prevenir scroll del body cuando el menú está abierto
  if (isMobileMenuOpen.value) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
};

const closeMobileMenu = (): void => {
  isMobileMenuOpen.value = false;
  document.body.style.overflow = '';
};

const closeMenu = (): void => {
  closeMobileMenu();
  emit('logoClick');
};

const handleMenuClick = (item: any): void => {
  closeMobileMenu();
  emit('menuItemClick', item);
};

const handleCartClick = (): void => {
  closeMobileMenu();
  emit('cartClick');
};

// Manejo del scroll para cambiar la apariencia de la navbar
const handleScroll = (): void => {
  isScrolled.value = window.scrollY > 50;
};

// Lifecycle hooks
onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  
  // Limpiar overflow del body al montar
  document.body.style.overflow = '';
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  document.body.style.overflow = '';
});
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1050;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  transition: all var(--transition-normal);
}

.navbar-scrolled {
  background: rgba(255, 255, 255, 0.98);
  box-shadow: var(--shadow-md);
}

.navbar-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;
  gap: var(--spacing-lg);
}

/* Marca y logo */
.navbar-brand {
  flex-shrink: 0;
}

.brand-link {
  text-decoration: none;
  color: inherit;
}

.brand-logo {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.logo-icon {
  width: 80px;
  height: 80px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
  aspect-ratio: 1 / 1;
}

.brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.brand-name {
  font-family: var(--font-family-heading);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--primary-color);
}

.brand-tagline {
  font-size: var(--font-size-xs);
  color: var(--gray-600);
  font-weight: var(--font-weight-medium);
}

/* Menú principal */
.navbar-menu {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  list-style: none;
  margin: 0;
  padding: 0;
}

.menu-item {
  position: relative;
}

.menu-link {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  text-decoration: none;
  color: var(--gray-700);
  font-weight: var(--font-weight-medium);
  border-radius: var(--border-radius-lg);
  transition: all var(--transition-fast);
  position: relative;
}

.menu-link:hover {
  background: var(--gray-100);
  color: var(--primary-color);
  transform: translateY(-1px);
}

.menu-link.active {
  color: var(--primary-color);
  background: rgba(99, 102, 241, 0.1);
}

.menu-link.active::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 4px;
  background: var(--primary-color);
  border-radius: 50%;
}

.menu-icon {
  font-size: var(--font-size-base);
}

.menu-text {
  font-size: var(--font-size-sm);
}

/* Acciones de la navbar */
.navbar-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.cart-button {
  position: relative;
  background: none;
  border: none;
  padding: var(--spacing-sm);
  border-radius: var(--border-radius-lg);
  cursor: pointer;
  transition: all var(--transition-fast);
  color: var(--gray-700);
}

.cart-button:hover {
  background: var(--gray-100);
  transform: translateY(-1px);
}

.cart-button.cart-has-items {
  color: var(--primary-color);
}

.cart-icon {
  font-size: 1.25rem;
}

.cart-badge {
  position: absolute;
  top: -2px;
  right: -2px;
  background: var(--error-color);
  color: white;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  padding: 2px 6px;
  border-radius: var(--border-radius-full);
  min-width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: bounce 0.5s ease-out;
}

.cta-button {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  white-space: nowrap;
}

.btn-icon {
  font-size: var(--font-size-sm);
}

.btn-text {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

/* Botón menú móvil */
.mobile-menu-toggle {
  display: none;
  flex-direction: column;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  gap: 4px;
  z-index: 1070;
}

.hamburger-line {
  width: 100%;
  height: 2px;
  background: var(--gray-700, #4b5563);
  border-radius: 1px;
  transition: all 0.3s ease;
}

/* Transforma el botón hamburguesa en X cuando está activo */
.mobile-menu-toggle[aria-expanded="true"] .hamburger-line:nth-child(1) {
  transform: translateY(6px) rotate(45deg);
}

.mobile-menu-toggle[aria-expanded="true"] .hamburger-line:nth-child(2) {
  opacity: 0;
}

.mobile-menu-toggle[aria-expanded="true"] .hamburger-line:nth-child(3) {
  transform: translateY(-6px) rotate(-45deg);
}

/* Overlay móvil */
.mobile-overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1040;
  backdrop-filter: blur(2px);
}

/* Menú móvil */
.mobile-menu {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 85%;
  max-width: 380px;
  background: var(--white, #FFFFFF);
  z-index: 1060;
  display: flex;
  flex-direction: column;
  padding: calc(60px + var(--spacing-lg, 1rem)) var(--spacing-lg, 1rem) var(--spacing-lg, 1rem);
  transform: translateX(100%);
  transition: transform 0.3s ease;
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.15);
  overflow-y: auto;
}

.mobile-menu.is-active {
  transform: translateX(0);
  box-shadow: var(--shadow-2xl, 0 25px 50px -12px rgba(0, 0, 0, 0.25));
}

/* Animación para el menú móvil */
@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.mobile-menu-item {
  width: 100%;
  animation: fadeInRight 0.3s ease forwards;
  animation-delay: calc(var(--item-index, 0) * 0.05s);
  opacity: 0;
}

.mobile-menu-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md, 1rem);
}

.mobile-menu-item {
  width: 100%;
}

.mobile-menu-link {
  display: flex;
  align-items: center;
  gap: var(--spacing-md, 1rem);
  padding: var(--spacing-md, 1rem);
  text-decoration: none;
  color: var(--gray-700, #4b5563);
  font-weight: var(--font-weight-medium, 500);
  border-radius: var(--border-radius-lg, 0.5rem);
  transition: all 0.2s ease;
  font-size: var(--font-size-lg, 1.125rem);
  border-left: 3px solid transparent;
}

.mobile-menu-link:hover,
.mobile-menu-link:active {
  background: var(--gray-100, #f3f4f6);
  color: var(--primary-color, #6366f1);
  border-left-color: var(--primary-color, #6366f1);
}

.mobile-menu-icon {
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
}

/* Responsive */
@media (max-width: 768px) {
  .navbar-content {
    height: 60px;
  }

  .brand-name {
    font-size: var(--font-size-base);
  }

  .brand-tagline {
    display: none;
  }

  .logo-icon {
    width: 60px;
    height: 60px;
  }

  /* Menú móvil */
  .mobile-menu-toggle {
    display: flex;
  }

  .navbar-menu {
    display: none;
  }

  .mobile-overlay {
    display: block;
  }

  .mobile-menu {
    padding-top: 80px;
    min-height: 450px;
  }

  .mobile-menu-list {
    padding: 0;
    margin: 0;
  }

  .mobile-menu-item {
    margin-bottom: 10px;
  }

  .cta-button .btn-text {
    display: none;
  }

  .cta-button {
    padding: var(--spacing-sm);
    min-width: 44px;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .navbar-content {
    gap: var(--spacing-sm);
  }

  .navbar-actions {
    gap: var(--spacing-xs);
  }

  .cart-button {
    padding: var(--spacing-xs);
  }
  
  .mobile-menu {
    width: 90%;
    padding: 70px var(--spacing-md, 0.75rem) var(--spacing-md, 0.75rem);
  }
  
  .mobile-menu-link {
    padding: 0.85rem;
    font-size: var(--font-size-base, 1rem);
  }
  
  .mobile-menu-icon {
    font-size: 1.25rem;
  }
}

@media (max-width: 360px) {
  .mobile-menu {
    width: 100%;
    padding: 70px var(--spacing-sm, 0.5rem) var(--spacing-sm, 0.5rem);
  }
  
  .logo-icon {
    width: 50px;
    height: 50px;
  }
}
</style>
