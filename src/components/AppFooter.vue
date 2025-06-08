<!--
  Componente Footer
  Implementa principios SOLID y Clean Architecture
  Recibe datos del componente padre y emite eventos de interacción
-->

<template>
  <footer class="footer">
    <div class="container">
      <!-- Sección principal del footer -->
      <div class="footer-main">
        <div class="footer-content">
          <!-- Información de la empresa -->
          <div class="footer-section">
            <div class="footer-brand">
              <div class="brand-logo">
                <img 
                  src="@/assets/image/logos/LOGOOPTIVISIÓN4K.webp" 
                  alt="Optivisión 4K Logo" 
                  class="company-logo"
                  loading="lazy"
                />
                <div class="brand-text">
                  <h3 class="brand-name">{{ companyInfo.companyName }}</h3>
                  <p class="brand-tagline">{{ companyInfo.tagline }}</p>
                </div>
              </div>
              <p class="brand-description">
                {{ companyInfo.description }}
              </p>
            </div>
          </div>

          <!-- Enlaces rápidos -->
          <div class="footer-section">
            <h4 class="section-title">Enlaces Rápidos</h4>
            <ul class="footer-links">
              <li v-for="link in quickLinks" :key="link.id">
                <router-link 
                  :to="link.path" 
                  class="footer-link"
                  @click="handleLinkClick(link)"
                >
                  <span class="link-icon">{{ link.icon }}</span>
                  <span class="link-text">{{ link.label }}</span>
                </router-link>
              </li>
            </ul>
          </div>

          <!-- Servicios destacados -->
          <div class="footer-section">
            <h4 class="section-title">Nuestros Servicios</h4>
            <ul class="footer-links">
              <li v-for="service in featuredServices" :key="service.id">
                <a 
                  href="#" 
                  class="footer-link"
                  @click.prevent="handleServiceClick(service)"
                >
                  <span class="link-icon">{{ service.icon }}</span>
                  <span class="link-text">{{ service.name }}</span>
                </a>
              </li>
            </ul>
          </div>

          <!-- Información de contacto -->
          <div class="footer-section">
            <h4 class="section-title">Contacto</h4>
            <div class="contact-info">
              <div class="contact-item">
                <span class="contact-icon">📍</span>
                <div class="contact-details">
                  <span class="contact-label">Dirección</span>
                  <span class="contact-value">{{ companyInfo.address }}</span>
                </div>
              </div>

              <div class="contact-item">
                <span class="contact-icon">📞</span>
                <div class="contact-details">
                  <span class="contact-label">Teléfono</span>
                  <a 
                    :href="`tel:${companyInfo.phone}`" 
                    class="contact-value contact-link"
                    @click="handleContactClick('phone')"
                  >
                    {{ companyInfo.phone }}
                  </a>
                </div>
              </div>

              <div class="contact-item">
                <span class="contact-icon">✉️</span>
                <div class="contact-details">
                  <span class="contact-label">Email</span>
                  <a 
                    :href="`mailto:${companyInfo.email}`" 
                    class="contact-value contact-link"
                    @click="handleContactClick('email')"
                  >
                    {{ companyInfo.email }}
                  </a>
                </div>
              </div>

              <div class="contact-item">
                <span class="contact-icon">🕒</span>
                <div class="contact-details">
                  <span class="contact-label">Horarios</span>
                  <span class="contact-value">{{ companyInfo.workingHours }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sección de redes sociales y newsletter -->
      <div class="footer-social">
        <div class="social-content">
          <!-- Newsletter -->
          <div class="newsletter-section">
            <h4 class="newsletter-title">¡Mantente Informado!</h4>
            <p class="newsletter-description">
              Recibe promociones exclusivas y consejos para el cuidado visual
            </p>
            <form class="newsletter-form" @submit.prevent="handleNewsletterSubmit">
              <div class="input-group">
                <input
                  v-model="newsletterEmail"
                  type="email"
                  class="newsletter-input"
                  placeholder="Tu email aquí..."
                  required
                />
                <button 
                  type="submit" 
                  class="newsletter-btn"
                  :disabled="isSubmittingNewsletter"
                >
                  <span v-if="!isSubmittingNewsletter" class="btn-icon">📧</span>
                  <span v-else class="btn-icon loading">⏳</span>
                  <span class="btn-text">Suscribirse</span>
                </button>
              </div>
            </form>
          </div>

          <!-- Redes sociales -->
          <div class="social-section">
            <h4 class="social-title">Síguenos</h4>
            <div class="social-links">
              <a
                v-for="(url, platform) in socialMedia"
                :key="platform"
                :href="url"
                class="social-link"
                :class="`social-${platform}`"
                target="_blank"
                rel="noopener noreferrer"
                @click="handleSocialClick(platform)"
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
        </div>
      </div>

      <!-- Pie del footer -->
      <div class="footer-bottom">
        <div class="footer-bottom-content">
          <div class="copyright">
            <p class="copyright-text">
              © {{ currentYear }} {{ companyInfo.companyName }}. Desarrollado por 
              <a href="https://andrewcarvajal.dev" target="_blank" rel="noopener noreferrer">Andres Carvajal</a>
            </p>
          </div>

          <div class="footer-links-bottom">
            <a href="#" class="footer-link-bottom" @click.prevent="handlePolicyClick('privacy')">
              Política de Privacidad
            </a>
            <a href="#" class="footer-link-bottom" @click.prevent="handlePolicyClick('terms')">
              Términos de Servicio
            </a>
            <a href="#" class="footer-link-bottom" @click.prevent="handlePolicyClick('cookies')">
              Política de Cookies
            </a>
          </div>

          <div class="footer-credits">
            <p class="credits-text">
              Hecho con <span class="heart">❤️</span> en Colombia
            </p>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

// Importar imágenes correctamente para Vite
import facebookIcon from '@/assets/image/logos/facebook.png';
import instagramIcon from '@/assets/image/logos/instagram (1).png';
import whatsappIcon from '@/assets/image/logos/whatsapp.png';
import tiktokIcon from '@/assets/image/logos/tik-tok.png';

// Interfaces para tipado
interface CompanyInfo {
  companyName: string;
  tagline: string;
  description: string;
  phone: string;
  email: string;
  address: string;
  workingHours: string;
}

interface QuickLink {
  id: string;
  label: string;
  path: string;
  icon: string;
}

interface FeaturedService {
  id: string;
  name: string;
  icon: string;
}

interface SocialMedia {
  facebook: string;
  instagram: string;
  whatsapp: string;
  twitter: string;
}

// Props del componente
interface Props {
  companyInfo: CompanyInfo;
  quickLinks: QuickLink[];
  featuredServices: FeaturedService[];
  socialMedia: SocialMedia;
}

withDefaults(defineProps<Props>(), {
  quickLinks: () => [
    { id: 'home', label: 'Inicio', path: '/', icon: '🏠' },
    { id: 'products', label: 'Productos', path: '/productos', icon: '👓' },
    { id: 'services', label: 'Servicios', path: '/servicios', icon: '⚕️' },
    { id: 'contact', label: 'Contacto', path: '/contacto', icon: '📞' }
  ],
  featuredServices: () => [
    { id: 'home-exam', name: 'Examen a Domicilio', icon: '🏠' },
    { id: 'express', name: 'Montaje Express', icon: '⚡' },
    { id: 'repair', name: 'Reparaciones', icon: '🔧' },
    { id: 'consultation', name: 'Asesoría Gratuita', icon: '💬' }
  ]
});

// Eventos que emite el componente
const emit = defineEmits<{
  linkClick: [link: QuickLink];
  serviceClick: [service: FeaturedService];
  contactClick: [type: string];
  socialClick: [platform: string];
  policyClick: [type: string];
  newsletterSubmit: [email: string];
}>();

// Estado reactivo local
const newsletterEmail = ref('');
const isSubmittingNewsletter = ref(false);

// Computed properties
const currentYear = computed(() => new Date().getFullYear());

// Métodos
const handleLinkClick = (link: QuickLink): void => {
  emit('linkClick', link);
};

const handleServiceClick = (service: FeaturedService): void => {
  emit('serviceClick', service);
};

const handleContactClick = (type: string): void => {
  emit('contactClick', type);
};

const handleSocialClick = (platform: string): void => {
  emit('socialClick', platform);
};

const handlePolicyClick = (type: string): void => {
  emit('policyClick', type);
};

const handleNewsletterSubmit = async (): Promise<void> => {
  if (!newsletterEmail.value.trim()) return;

  isSubmittingNewsletter.value = true;
  
  try {
    emit('newsletterSubmit', newsletterEmail.value);
    newsletterEmail.value = '';
  } catch (error) {
    console.error('Error submitting newsletter:', error);
  } finally {
    isSubmittingNewsletter.value = false;
  }
};

// Mapa de iconos importados correctamente
const socialIcons: Record<string, string> = {
  facebook: facebookIcon,
  instagram: instagramIcon,
  whatsapp: whatsappIcon,
  twitter: tiktokIcon,
};

const getSocialIcon = (platform: string): string => {
  return socialIcons[platform] || '';
};

const getSocialLabel = (platform: string): string => {
  const labels = {
    facebook: 'Facebook',
    instagram: 'Instagram',
    whatsapp: 'WhatsApp',
    twitter: 'TikTok'
  };
  return labels[platform as keyof typeof labels] || platform;
};
</script>

<style scoped>
.footer {
  background: var(--gray-900);
  color: white;
  margin-top: auto;
  width: 100%;
  overflow: hidden;
}

.container {
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
}

.footer-main {
  padding: var(--spacing-4xl) 0 var(--spacing-2xl);
}

.footer-content {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1.5fr;
  gap: var(--spacing-3xl);
}

.footer-section {
  display: flex;
  flex-direction: column;
}

/* Marca de la empresa */
.footer-brand {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.brand-logo {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.company-logo {
  width: 80px;
  height: 80px;
  aspect-ratio:  1 / 1;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
  filter: brightness(0) invert(1);
}

.brand-text {
  display: flex;
  flex-direction: column;
}

.brand-name {
  font-family: var(--font-family-heading);
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--primary-light);
  margin: 0 0 var(--spacing-xs) 0;
}

.brand-tagline {
  font-size: var(--font-size-sm);
  color: var(--gray-400);
  margin: 0;
  font-weight: var(--font-weight-medium);
}

.brand-description {
  font-size: var(--font-size-base);
  line-height: 1.6;
  color: var(--gray-300);
  margin: 0;
}

/* Títulos de sección */
.section-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: white;
  margin: 0 0 var(--spacing-lg) 0;
  position: relative;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 0;
  width: 30px;
  height: 2px;
  background: var(--primary-color);
  border-radius: 1px;
}

/* Enlaces del footer */
.footer-links {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.footer-link {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  color: var(--gray-300);
  text-decoration: none;
  transition: all var(--transition-fast);
  padding: var(--spacing-xs) 0;
}

.footer-link:hover {
  color: var(--primary-light);
  transform: translateX(4px);
}

.link-icon {
  font-size: var(--font-size-sm);
  width: 20px;
  text-align: center;
}

.link-text {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
}

/* Información de contacto */
.contact-info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.contact-item {
  display: flex;
  gap: var(--spacing-sm);
  align-items: flex-start;
}

.contact-icon {
  font-size: var(--font-size-lg);
  flex-shrink: 0;
  margin-top: 2px;
}

.contact-details {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.contact-label {
  font-size: var(--font-size-sm);
  color: var(--gray-400);
  font-weight: var(--font-weight-medium);
}

.contact-value {
  font-size: var(--font-size-base);
  color: var(--gray-200);
  line-height: 1.4;
}

.contact-link {
  color: var(--primary-light);
  text-decoration: none;
  transition: color var(--transition-fast);
}

.contact-link:hover {
  color: var(--primary-color);
  text-decoration: underline;
}

/* Sección social */
.footer-social {
  background: var(--gray-800);
  padding: var(--spacing-2xl) 0;
  border-top: 1px solid var(--gray-700);
  width: 100%;
}

.social-content {
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--spacing-3xl);
  align-items: start;
}

/* Newsletter */
.newsletter-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  width: 100%;
  max-width: 600px;
}

.newsletter-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: white;
  margin: 0;
}

.newsletter-description {
  font-size: var(--font-size-base);
  color: var(--gray-300);
  margin: 0;
  line-height: 1.5;
}

.newsletter-form {
  margin-top: var(--spacing-md);
  width: 100%;
}

.input-group {
  display: flex;
  gap: var(--spacing-sm);
  width: 100%;
}

.newsletter-input {
  flex: 1;
  padding: var(--spacing-sm) var(--spacing-md);
  border: 2px solid var(--gray-600);
  border-radius: var(--border-radius-lg);
  background: var(--gray-700);
  color: white;
  font-size: var(--font-size-base);
  transition: all var(--transition-fast);
}

.newsletter-input:focus {
  outline: none;
  border-color: var(--primary-color);
  background: var(--gray-600);
}

.newsletter-input::placeholder {
  color: var(--gray-400);
}

.newsletter-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-lg);
  background: var(--gradient-primary);
  color: white;
  border: none;
  border-radius: var(--border-radius-lg);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-fast);
  white-space: nowrap;
}

.newsletter-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.newsletter-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-icon.loading {
  animation: pulse 1s infinite;
}

/* Redes sociales */
.social-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  align-items: flex-end;
}

.social-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: white;
  margin: 0;
}

.social-links {
  display: flex;
  gap: var(--spacing-md);
  flex-wrap: wrap;
  justify-content: flex-end;
}

.social-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-md);
  background: var(--gray-700);
  border-radius: var(--border-radius-lg);
  text-decoration: none;
  color: var(--gray-300);
  transition: all var(--transition-fast);
  min-width: 80px;
}

.social-link:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.social-facebook:hover {
  background: #1877f2;
  color: white;
}

.social-instagram:hover {
  background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
  color: white;
}

.social-whatsapp:hover {
  background: #25d366;
  color: white;
}

.social-twitter:hover {
  background: #000000;
  color: white;
}

.social-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  margin-bottom: 5px;
}

.social-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.3s ease;
}

.social-link:hover .social-icon img {
  transform: scale(1.1);
  filter: brightness(1.2);
}

.social-label {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
}

/* Pie del footer */
.footer-bottom {
  background: var(--black);
  padding: var(--spacing-lg) 0;
  border-top: 1px solid var(--gray-800);
  width: 100%;
}

.footer-bottom-content {
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--spacing-lg);
}

/* Responsive */
@media (max-width: 1200px) {
  .footer-content {
    grid-template-columns: 1.5fr 1fr 1fr 1fr;
    gap: var(--spacing-xl);
  }
  
  .social-content {
    grid-template-columns: 1.5fr 1fr;
    gap: var(--spacing-xl);
  }
}

@media (max-width: 1024px) {
  .footer-content {
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-lg);
  }

  .social-content {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .newsletter-section {
    max-width: 100%;
    align-items: center;
  }

  .social-section {
    align-items: center;
  }

  .social-links {
    justify-content: center;
  }

  .input-group {
    max-width: 500px;
    margin: 0 auto;
  }
}

@media (max-width: 768px) {
  .container,
  .social-content,
  .footer-bottom-content {
    padding: 0 var(--spacing-md);
  }

  .footer-content {
    grid-template-columns: 1fr;
    gap: var(--spacing-xl);
  }

  .footer-section {
    align-items: center;
    text-align: center;
  }

  .brand-logo {
    justify-content: center;
  }

  .company-logo {
    width: 50px;
  }

  .section-title::after {
    left: 50%;
    transform: translateX(-50%);
  }

  .footer-links {
    align-items: center;
  }

  .contact-item {
    justify-content: center;
  }

  .social-icon {
    width: 28px;
    height: 28px;
  }

  .footer-bottom-content {
    flex-direction: column;
    gap: var(--spacing-md);
    text-align: center;
  }

  .footer-links-bottom {
    flex-wrap: wrap;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .container,
  .social-content,
  .footer-bottom-content {
    padding: 0 var(--spacing-sm);
  }

  .company-logo {
    width: 40px;
  }

  .social-icon {
    width: 24px;
    height: 24px;
  }

  .input-group {
    flex-direction: column;
  }

  .newsletter-btn {
    width: 100%;
  }
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}
</style>
