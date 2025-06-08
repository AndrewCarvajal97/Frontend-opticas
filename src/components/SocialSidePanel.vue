<!--
  Componente Panel Lateral de Redes Sociales - SocialSidePanel
  Siguiendo principios SOLID y Clean Architecture
  Aplicando kit de marca oficial de Optivisión 4K
-->

<template>
  <div class="social-side-panel" :class="{ 'is-mobile': isMobile, 'is-collapsed': isMobile && !isExpanded }">
    <!-- Botón de expandir/contraer para móviles -->
    <button 
      v-if="isMobile" 
      class="social-toggle-btn"
      @click="toggleExpand"
      :aria-label="isExpanded ? 'Cerrar redes sociales' : 'Abrir redes sociales'"
    >
      <span class="toggle-icon">{{ isExpanded ? '✕' : '📨' }}</span> 
    </button>
    
    <!-- Enlaces de redes sociales -->
    <div class="social-links-container" v-show="!isMobile || isExpanded">
      <a
        v-for="(url, platform, index) in socialMedia"
        :key="platform"
        :href="url"
        :class="['social-link', `social-${platform}`]"
        :style="{ 'animation-delay': isMobile ? `${index * 0.1}s` : '0s' }"
        target="_blank"
        rel="noopener noreferrer"
        @click="handleClick(platform)"
        :aria-label="`Visitar nuestro ${getSocialLabel(platform)}`"
      >
        <span class="social-icon">
          <img 
            :src="getSocialIcon(platform)" 
            :alt="getSocialLabel(platform)"
            loading="lazy"
          />
        </span>
        <span class="social-label">{{ getSocialLabel(platform) }}</span>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

// Importar imágenes correctamente para Vite
import facebookIcon from '@/assets/image/logos/facebook-removebg-preview.png';
import instagramIcon from '@/assets/image/logos/instagram (1).png';
import whatsappIcon from '@/assets/image/logos/whatsapp-removebg-preview.png';
import tiktokIcon from '@/assets/image/logos/tik-tok.png';

// Interfaces siguiendo principios SOLID
interface SocialMediaUrls {
  facebook: string;
  instagram: string;
  whatsapp: string;
  twitter: string;
}

interface Props {
  socialMedia: SocialMediaUrls;
}

// Props y emisores
const props = defineProps<Props>();
const emit = defineEmits<{
  socialClick: [platform: string];
}>();

// Estado reactivo
const isMobile = ref<boolean>(false);
const isExpanded = ref<boolean>(false);

// Funciones utilitarias
const checkMobile = (): void => {
  isMobile.value = window.innerWidth <= 768;
  if (!isMobile.value) {
    isExpanded.value = false;
  }
};

// Función para alternar la expansión en móvil
const toggleExpand = (): void => {
  isExpanded.value = !isExpanded.value;
};

// Mapa de iconos importados correctamente
const socialIcons: Record<string, string> = {
  facebook: facebookIcon,
  instagram: instagramIcon,
  whatsapp: whatsappIcon,
  twitter: tiktokIcon,
};

// Función para obtener el icono de la red social
const getSocialIcon = (platform: string): string => {
  return socialIcons[platform] || '';
};

// Función para obtener la etiqueta de la red social
const getSocialLabel = (platform: string): string => {
  const labels: Record<string, string> = {
    facebook: 'Facebook',
    instagram: 'Instagram',
    whatsapp: 'WhatsApp',
    twitter: 'TikTok',
  };
  return labels[platform] || platform;
};

// Manejador de clics
const handleClick = (platform: string): void => {
  emit('socialClick', platform);
  if (isMobile.value) {
    isExpanded.value = false;
  }
};

// Lifecycle hooks
onMounted(() => {
  checkMobile();
  window.addEventListener('resize', checkMobile);
});

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile);
});
</script>

<style scoped>
/**
 * Estilos del Panel Lateral de Redes Sociales
 * Aplicando kit de marca oficial de Optivisión 4K
 * Colores: Negro #0A0A0A, Blanco #FFFFFF, Dorado mate #C5A76E
 */

/* --- Variables del Kit de Marca --- */
:root {
  --optivision-black: #0A0A0A;
  --optivision-white: #FFFFFF;
  --optivision-gold: #C5A76E;
  --optivision-gold-light: #f1c984;
  --optivision-gold-dark: #aa813a;
}

/* --- Panel Principal --- */
.social-side-panel {
  position: fixed;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  background: transparent;
  padding: 0.8rem;
  border-radius: 16px 0 0 16px;
  z-index: var(--z-fixed, 1030);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition: all 0.3s ease-in-out;
  width: fit-content;
}

/* --- Enlaces de Redes Sociales --- */
.social-link {
  display: flex;
  align-items: center;
  gap: 2rem;
  padding: 0.8rem;
  color: var(--optivision-black);
  background: transparent;
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  width: 3rem;
  min-width: 3rem;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(10, 10, 10, 0.08);
  border: 2px solid transparent;
}

.social-link:hover {
  width: 14rem;
  padding: 1rem 1.5rem;
  box-shadow: 0 8px 25px rgba(10, 10, 10, 0.2);
  justify-content: flex-start;
  border-color: var(--optivision-gold);
  background: var(--optivision-gold);
  color: var(--optivision-white);
  transform: translateX(-4px);
}

/* --- Colores Específicos por Red Social --- */
.social-facebook:hover {
  background: #1877f2;
  border-color: #1877f2;
}

.social-instagram:hover {
  background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
  border-color: #e6683c;
}

.social-whatsapp:hover {
  background: #25d366;
  border-color: #25d366;
}

.social-twitter:hover {
  background: var(--optivision-black);
  border-color: var(--optivision-black);
}

/* --- Iconos --- */
.social-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.social-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.social-link:hover .social-icon img {
  filter: brightness(0) invert(1); /* Convierte a blanco en hover */
  transform: scale(1.1);
}

/* --- Etiquetas --- */
.social-label {
  font-family: 'Montserrat', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
  width: 0;
  color: inherit;
}

.social-link:hover .social-label {
  opacity: 1;
  transform: translateX(0);
  width: auto;
  margin-left: 0.8rem;
}

/* --- Botón Toggle para Móviles --- */
.social-toggle-btn {
  display: none;
  position: relative;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: var(--optivision-gold);
  border: none;
  color: var(--optivision-white);
  font-size: 1.2rem;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(10, 10, 10, 0.15);
  transition: all 0.3s ease;
  z-index: 2;
}

.social-toggle-btn:hover {
  transform: scale(1.05);
  background: var(--optivision-gold-dark);
}

.toggle-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

/* --- Versión Móvil --- */
.social-side-panel.is-mobile {
  position: fixed;
  bottom: calc(var(--spacing-lg, 2rem) + 60px); /* Posicionado debajo del botón back-to-top */
  right: var(--spacing-lg, 2rem);
  left: auto;
  top: auto;
  transform: none;
  flex-direction: column;
  align-items: flex-end;
  background: transparent;
  padding: 0;
  border-radius: 0;
  box-shadow: none;
  border: none;
  width: auto;
  z-index: calc(var(--z-fixed, 1030) - 1); /* Un nivel por debajo del back-to-top */
}

.social-side-panel.is-mobile .social-toggle-btn {
  display: flex;
  width: 45px;
  height: 45px;

}

.social-side-panel.is-mobile .social-links-container {
  display: flex;
  flex-direction: column-reverse; /* Para que despliegue hacia arriba */
  gap: 0.5rem;
  margin-bottom: 0.8rem;
  transition: all 0.3s ease;
}

/* Animación de despliegue individual */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Panel colapsado en móvil */
.social-side-panel.is-mobile.is-collapsed {
  bottom: calc(var(--spacing-lg, 2rem) + 60px); /* Ajuste según botón back-to-top */
}

.is-mobile .social-link {
  flex-direction: column;
  width: auto;
  min-width: auto;
  padding: 0.8rem;
  gap: 0.5rem;
  box-shadow: 0 4px 8px rgba(10, 10, 10, 0.12);
  border-radius: 12px;
  animation: slideUp 0.5s ease forwards;
}

.is-mobile .social-facebook {
  background: #1877f2;
  border-color: #1877f2;
}

.is-mobile .social-instagram {
  background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
  border-color: #e6683c;
}

.is-mobile .social-whatsapp {
  background: #25d366;
  border-color: #25d366;
}

.is-mobile .social-twitter {
  background: var(--optivision-black);
  border-color: var(--optivision-black);
}

.is-mobile .social-link:hover {
  transform: scale(1.1);
  width: auto;
  padding: 0.8rem;
}

.is-mobile .social-label {
  opacity: 1;
  transform: none;
  width: auto;
  margin: 0;
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--optivision-white);
  text-align: center;
}

.is-mobile .social-icon {
  width: 24px;
  height: 24px;
  margin-bottom: 2px;
}

.is-mobile .social-icon img {
  border-radius: 6px;
  filter: brightness(0) invert(1); /* Iconos en blanco para móvil */
}

/* --- Responsive Design --- */
@media (max-width: 480px) {
  .social-side-panel.is-mobile {
    bottom: calc(var(--spacing-md, 1.5rem) + 55px);
    right: var(--spacing-md, 1.5rem);
  }
  
  .social-toggle-btn {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }
  
  .social-side-panel.is-mobile .social-links-container {
    gap: 0.4rem;
  }
  
  .is-mobile .social-icon {
    width: 22px;
    height: 22px;
  }
  
  .is-mobile .social-label {
    font-size: 0.65rem;
  }
  
  .is-mobile .social-link {
    padding: 0.6rem;
  }
  
  .is-mobile .social-link:hover {
    padding: 0.6rem;
  }
}

@media (max-width: 360px) {
  .social-side-panel.is-mobile {
    bottom: calc(var(--spacing-md, 1.5rem) + 50px);
    right: var(--spacing-md, 1.5rem);
  }
  
  .social-toggle-btn {
    width: 38px;
    height: 38px;
  }
  
  .social-side-panel.is-mobile .social-links-container {
    gap: 0.3rem;
  }
  
  .is-mobile .social-icon {
    width: 20px;
    height: 20px;
  }
  
  .is-mobile .social-label {
    font-size: 0.6rem;
  }
  
  .is-mobile .social-link {
    padding: 0.5rem;
  }
  
  .is-mobile .social-link:hover {
    padding: 0.5rem;
  }
}

/* --- Animaciones y Efectos --- */
@keyframes socialPulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.social-link:active {
  animation: socialPulse 0.3s ease;
}

/* --- Efectos de Accesibilidad --- */
.social-link:focus, .social-toggle-btn:focus {
  outline: 3px solid var(--optivision-gold);
  outline-offset: 2px;
}

.social-link:focus:not(:hover) {
  background: var(--optivision-white);
  color: var(--optivision-black);
}

/* --- Estados de Alto Contraste --- */
@media (prefers-contrast: high) {
  .social-side-panel {
    background: rgba(0, 0, 0, 0.9);
    border: 2px solid var(--optivision-gold);
  }
  
  .social-link {
    border: 2px solid var(--optivision-black);
  }
  
  .social-toggle-btn {
    border: 2px solid var(--optivision-black);
  }
}

/* --- Reducción de Movimiento --- */
@media (prefers-reduced-motion: reduce) {
  .social-link,
  .social-icon,
  .social-label,
  .social-toggle-btn {
    transition: none;
    animation: none !important;
  }
  
  .social-link:hover,
  .social-toggle-btn:hover {
    transform: none;
  }
}
</style>
