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
  z-index: var(--z-fixed);
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
}

.hamburger-line {
  width: 100%;
  height: 2px;
  background: var(--gray-700);
  border-radius: 1px;
  transition: all var(--transition-fast);
}

/* Overlay móvil */
.mobile-overlay {
  display: none;
  position: fixed;
  top: 70px;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: var(--z-modal-backdrop);
}

/* Menú móvil */
.mobile-menu {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--white);
  z-index: var(--z-mobile-nav);
  display: flex;
  flex-direction: column;
  padding: var(--spacing-lg);
  transform: translateX(100%);
  transition: transform var(--transition-normal);
}

.mobile-menu.is-active {
  transform: translateX(0);
  box-shadow: var(--shadow-2xl);
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
    font-size: 1.5rem;
  }

  /* Menú móvil */
  .mobile-menu-toggle {
    display: flex;
  }

  .navbar-menu {
    position: fixed;
    top: 60px;
    right: 0;
    bottom: 0;
    width: 280px;
    background: white;
    flex-direction: column;
    align-items: stretch;
    padding: var(--spacing-lg);
    gap: var(--spacing-sm);
    transform: translateX(100%);
    transition: transform var(--transition-normal);
    box-shadow: var(--shadow-xl);
    overflow-y: auto;
  }

  .menu-open {
    transform: translateX(0);
  }

  .menu-link {
    padding: var(--spacing-md);
    justify-content: flex-start;
    border-radius: var(--border-radius-lg);
  }

  .menu-icon {
    font-size: var(--font-size-lg);
  }

  .menu-text {
    font-size: var(--font-size-base);
  }

  .mobile-overlay {
    display: block;
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
}
</style>
