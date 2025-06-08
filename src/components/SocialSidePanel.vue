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
    >
      <span class="social-icon" v-html="getSocialIcon(platform)"></span>
      <span class="social-label">{{ getSocialLabel(platform) }}</span>
    </a>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

interface Props {
  socialMedia: {
    facebook: string;
    instagram: string;
    whatsapp: string;
    twitter: string;
  };
}

const props = defineProps<Props>();
const emit = defineEmits(['socialClick']);
const isMobile = ref(false);

const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768;
};

onMounted(() => {
  checkMobile();
  window.addEventListener('resize', checkMobile);
});

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile);
});

// Puedes cambiar estos íconos por SVGs o usar Font Awesome (recomendado)
const getSocialIcon = (platform: string): string => {
  const icons = {
    facebook: '<img src="src/assets/image/logos/facebook.png" alt="Facebook" />',
    instagram: '<img src="src/assets/image/logos/instagram (1).png" alt="Instagram" />',
    whatsapp: '<img src="src/assets/image/logos/whatsapp.png" alt="WhatsApp" />',
    twitter: '<img src="src/assets/image/logos/tik-tok.png" alt="Twitter" />',
  };
  return icons[platform as keyof typeof icons] || '🔗';
};

const getSocialLabel = (platform: string): string => {
  const labels = {
    facebook: 'Facebook',
    instagram: 'Instagram',
    whatsapp: 'WhatsApp',
    twitter: 'Twitter',
  };
  return labels[platform as keyof typeof labels] || platform;
};

const handleClick = (platform: string) => {
  emit('socialClick', platform);
};
</script>

<style scoped>
/* --- General --- */
.social-side-panel {
  position: fixed;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  background: rgba(255, 255, 255, 0.1);
  padding: 0.8rem;
  border-radius: 16px 0 0 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  z-index: 9999;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease-in-out;
  width: fit-content;
}

/* --- Link --- */
.social-link {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.6rem;
  color: #333;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  width: 2.6rem;
  min-width: 2.6rem;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    
}

.social-link:hover {
  width: 13rem;
  padding: 0.8rem 1.2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  justify-content: flex-start;
}

/* --- Icono --- */
.social-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1px;
  height: 1px;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.social-icon img {
  width: 20%;
  height: 20%;
}



/* --- Etiqueta --- */
.social-label {
  font-size: 1rem;
  font-weight: 500;
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
  width: 0;
}

.social-link:hover .social-label {
  opacity: 1;
  transform: translateX(0);
  width: auto;
  margin-left: 0.5rem;
}

/* --- Colores por red --- */
.social-facebook:hover {
  background-color: #1877f2;
  color: white;
}

.social-instagram:hover {
  background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
  color: white;
}

.social-whatsapp:hover {
  background-color: #25d366;
  color: white;
}

.social-twitter:hover {
  background-color: #1da1f2;
  color: white;
}

/* --- Móvil --- */
.social-side-panel.is-mobile {
  position: fixed;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  top: auto;
  flex-direction: row;
  background: rgba(255, 255, 255, 0.95);
  padding: 0.8rem 1.2rem;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
  width: auto;
}

.is-mobile .social-link {
  flex-direction: column;
  width: auto;
  min-width: auto;
  padding: 0.6rem;
  gap: 0.4rem;
  background: transparent;
  box-shadow: none;
}

.is-mobile .social-label {
  opacity: 1;
  transform: none;
  width: auto;
  margin: 0;
  font-size: 0.75rem;
  font-weight: 600;
  color: #333;
}

.is-mobile .social-icon {
  width: 28px;
  height: 28px;
  margin-bottom: 2px;
}

@media (max-width: 480px) {
  .social-side-panel.is-mobile {
    bottom: 1rem;
    padding: 0.6rem 1rem;
  }
  
  .is-mobile .social-icon {
    width: 24px;
    height: 24px;
  }
}

@media (max-width: 360px) {
  .is-mobile .social-icon {
    width: 20px;
    height: 20px;
  }
}
</style>
