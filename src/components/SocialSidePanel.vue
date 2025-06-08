<!--
  Componente Panel Lateral de Redes Sociales - SocialSidePanel
  Siguiendo principios SOLID y Clean Architecture
  Aplicando kit de marca oficial de Optivisión 4K
-->

<template>
  <div class="social-side-panel" :class="{ 'is-mobile': isMobile }">
    <a
      v-for="(url, platform) in socialMedia"
      :key="platform"
      :href="url"
      :class="['social-link', `social-${platform}`]"
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
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

// Importar imágenes correctamente para Vite
import facebookIcon from '@/assets/image/logos/facebook.png';
import instagramIcon from '@/assets/image/logos/instagram (1).png';
import whatsappIcon from '@/assets/image/logos/whatsapp.png';
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

// Funciones utilitarias
const checkMobile = (): void => {
  isMobile.value = window.innerWidth <= 768;
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
  background: rgba(10, 10, 10, 0.1);
  padding: 0.8rem;
  border-radius: 16px 0 0 16px;
  box-shadow: 0 8px 32px rgba(10, 10, 10, 0.15);
  z-index: var(--z-fixed, 1030);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(200, 160, 93, 0.2);
  transition: all 0.3s ease-in-out;
  width: fit-content;
}

/* --- Enlaces de Redes Sociales --- */
.social-link {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.8rem;
  color: var(--optivision-black);
  background: var(--optivision-white);
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

/* --- Versión Móvil --- */
.social-side-panel.is-mobile {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  top: auto;
  flex-direction: row;
  background: rgba(255, 255, 255, 0.98);
  padding: 1rem 1.5rem;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(10, 10, 10, 0.15);
  width: auto;
  border: 2px solid var(--optivision-gold);
}

.is-mobile .social-link {
  flex-direction: column;
  width: auto;
  min-width: auto;
  padding: 0.8rem;
  gap: 0.5rem;
  background: transparent;
  box-shadow: none;
  border: none;
  border-radius: 12px;
}

.is-mobile .social-link:hover {
  background: var(--optivision-gold);
  transform: translateY(-4px);
  width: auto;
  padding: 1rem;
}

.is-mobile .social-label {
  opacity: 1;
  transform: none;
  width: auto;
  margin: 0;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--optivision-black);
  text-align: center;
}

.is-mobile .social-link:hover .social-label {
  color: var(--optivision-white);
}

.is-mobile .social-icon {
  width: 28px;
  height: 28px;
  margin-bottom: 2px;
}

.is-mobile .social-icon img {
  border-radius: 6px;
}

/* --- Responsive Design --- */
@media (max-width: 480px) {
  .social-side-panel.is-mobile {
    bottom: 1.5rem;
    padding: 0.8rem 1.2rem;
    border-radius: 16px;
  }
  
  .is-mobile .social-icon {
    width: 24px;
    height: 24px;
  }
  
  .is-mobile .social-label {
    font-size: 0.75rem;
  }
}

@media (max-width: 360px) {
  .social-side-panel.is-mobile {
    padding: 0.6rem 1rem;
  }
  
  .is-mobile .social-icon {
    width: 20px;
    height: 20px;
  }
  
  .is-mobile .social-label {
    font-size: 0.7rem;
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
.social-link:focus {
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
}

/* --- Reducción de Movimiento --- */
@media (prefers-reduced-motion: reduce) {
  .social-link,
  .social-icon,
  .social-label {
    transition: none;
  }
  
  .social-link:hover {
    transform: none;
  }
}
</style>
