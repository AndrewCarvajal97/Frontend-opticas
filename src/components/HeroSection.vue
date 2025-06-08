<!--
  Componente Hero Principal
  Implementa principios SOLID y Clean Architecture
  Recibe contenido del componente padre y emite eventos de interacción
-->

<template>
  <section class="hero" :class="{ 'hero-animated': isVisible }">
    <div class="hero-background">
      <div class="hero-gradient"></div>
      <div class="hero-pattern"></div>
    </div>

    <div class="container">
      <div class="hero-content">
        <!-- Contenido principal -->
        <div class="hero-main">
          <div class="hero-text">
            <!-- Badge distintivo -->
            <div class="hero-badge animate-slideInDown">
              <span class="badge-icon">🚀</span>
              <span class="badge-text">Servicio Pionero en la Región</span>
            </div>

            <!-- Título principal -->
            <h1 class="hero-title animate-slideInUp">
              {{ safeHeroContent.title }}
            </h1>

            <!-- Subtítulo -->
            <p class="hero-subtitle animate-slideInUp">
              {{ safeHeroContent.subtitle }}
            </p>

            <!-- Descripción -->
            <p class="hero-description animate-slideInUp">
              {{ safeHeroContent.description }}
            </p>

            <!-- Características destacadas -->
            <div class="hero-features animate-slideInUp">
              <div 
                v-for="(feature, index) in safeHeroContent.features" 
                :key="index"
                class="feature-item"
                :style="{ animationDelay: `${index * 100}ms` }"
              >
                <span class="feature-icon">✓</span>
                <span class="feature-text">{{ feature }}</span>
              </div>
            </div>

            <!-- Botones de acción -->
            <div class="hero-actions animate-slideInUp">
              <button 
                class="btn btn-primary btn-lg cta-primary"
                @click="handlePrimaryAction"
              >
                <span class="btn-icon">📞</span>
                <span class="btn-text">{{ safeHeroContent.ctaText }}</span>
              </button>

              <button 
                class="btn btn-outline btn-lg cta-secondary"
                @click="handleSecondaryAction"
              >
                <span class="btn-icon">👓</span>
                <span class="btn-text">Ver Productos</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Sección de precio y oferta -->
        <div class="hero-offer">
          <div class="offer-card glass animate-slideInUp">
            <div class="offer-header">
              <h3 class="offer-subtitle">Oferta Especial</h3>
              <div class="offer-badge">
                <span class="offer-discount">Por tiempo limitado</span>
              </div>
            </div>

            <div class="offer-content">
              <div class="price-display">
                <span class="offer-title">POR TU FÓRMULA MÉDICA</span>
                <div class="price-wrapper">
                  <div class="price-original">
                    <span class="btn-icon">💰</span>
                      <span class="offer-badge-price">{{ formatPrice(safeHeroContent.pricing.homeExam) }}</span>
                    <span class="btn-icon">💰</span>
                    </div>
                  
                  <span class="price-current">BONO ESPECIAL</span>
                </div>
              </div>

              <div class="offer-condition">
                <p class="condition-text">
                  {{ safeHeroContent.pricing.description }}
                </p>
              </div>

              <div class="offer-action">
                <button 
                  class="btn btn-secondary btn-lg offer-btn"
                  @click="handleOfferAction"
                >
                  <span class="btn-icon">🎉</span>
                  <span class="btn-text">¡Aprovecha Ahora!</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Indicadores de confianza -->
      <div class="trust-indicators animate-fadeIn">
        <div class="trust-item">
          <div class="trust-icon">👨‍⚕️</div>
          <div class="trust-text">
            <span class="trust-number">2+</span>
            <span class="trust-label">Años de Experiencia</span>
          </div>
        </div>

        <div class="trust-item">
          <div class="trust-icon">😊</div>
          <div class="trust-text">
            <span class="trust-number">1000+</span>
            <span class="trust-label">Clientes Satisfechos</span>
          </div>
        </div>

        <div class="trust-item">
          <div class="trust-icon">🏆</div>
          <div class="trust-text">
            <span class="trust-number">100%</span>
            <span class="trust-label">Garantía de Calidad</span>
          </div>
        </div>

        <div class="trust-item">
          <div class="trust-icon">⚡</div>
          <div class="trust-text">
            <span class="trust-number">24h</span>
            <span class="trust-label">Servicio Rápido</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Botón de scroll -->
    <button 
      class="scroll-indicator"
      @click="handleScrollDown"
      aria-label="Scroll to content"
    >
      <span class="scroll-icon">⬇️</span>
      <span class="scroll-text">Descubre más</span>
    </button>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';

// Interfaces para tipado
interface HeroContent {
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  features: string[];
  pricing: {
    homeExam: number;
    discount: string;
    description: string;
  };
}

// Props con valores predeterminados
const props = withDefaults(defineProps<{
  heroContent?: {
    title?: string;
    subtitle?: string;
    description?: string;
    features?: string[];
    pricing?: {
      homeExam?: number;
      description?: string;
    };
  };
}>(), {
  heroContent: () => ({
    title: 'Bienvenido a Óptica Visión Plus',
    subtitle: 'Tu visión, nuestra prioridad',
    description: 'Examen óptico a domicilio y productos de calidad',
    features: [],
    pricing: {
      homeExam: 0,
      description: 'Examen gratuito al comprar tus lentes'
    }
  })
});

// Computed properties para manejar valores seguros
const safeHeroContent = computed(() => {
  return {
    title: props.heroContent?.title || 'Bienvenido a Óptica Visión Plus',
    subtitle: props.heroContent?.subtitle || 'Tu visión, nuestra prioridad',
    description: props.heroContent?.description || 'Examen óptico a domicilio y productos de calidad',
    features: props.heroContent?.features || [],
    pricing: {
      homeExam: props.heroContent?.pricing?.homeExam || 0,
      description: props.heroContent?.pricing?.description || 'Examen gratuito al comprar tus lentes'
    }
  };
});

// Props del componente
interface Props {
  heroContent: HeroContent;
}


// Eventos que emite el componente
const emit = defineEmits<{
  primaryAction: [];
  secondaryAction: [];
  offerAction: [];
  scrollDown: [];
}>();

// Estado reactivo local
const isVisible = ref(false);

// Computed properties
const formatPrice = computed(() => (price: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price).replace('COP', '').trim();
});

// Métodos
const handlePrimaryAction = (): void => {
  emit('primaryAction');
};

const handleSecondaryAction = (): void => {
  emit('secondaryAction');
};

const handleOfferAction = (): void => {
  emit('offerAction');
};

const handleScrollDown = (): void => {
  emit('scrollDown');
};

// Lifecycle hooks
onMounted(() => {
  // Activar animaciones después de un breve delay
  setTimeout(() => {
    isVisible.value = true;
  }, 100);
});
</script>

<style scoped>
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  overflow: hidden;
  padding: var(--spacing-4xl) 0 var(--spacing-3xl);
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
}

.hero-gradient {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--gradient-hero);
  opacity: 0.95;
}

.hero-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.1) 2px, transparent 2px),
    radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.1) 2px, transparent 2px);
  background-size: 60px 60px;
  animation: float 20s ease-in-out infinite;
}

.container {
  position: relative;
  z-index: 1;
  width: 100%;
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
}
.hero-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  justify-content: center;
  margin: 0;
}

/* Contenido principal */
.hero-main {
  color: white;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  padding: var(--spacing-xs) var(--spacing-md);
  border-radius: var(--border-radius-full);
  margin-bottom: var(--spacing-lg);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.badge-icon {
  font-size: var(--font-size-sm);
}

.badge-text {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

.hero-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: var(--font-weight-extrabold);
  line-height: 1.1;
  margin-bottom: var(--spacing-lg);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.hero-subtitle {
  font-size: clamp(1.25rem, 3vw, 1.75rem);
  font-weight: var(--font-weight-semibold);
  margin-bottom: var(--spacing-md);
  color: rgba(255, 255, 255, 0.95);
}

.hero-description {
  font-size: var(--font-size-lg);
  line-height: 1.6;
  margin-bottom: var(--spacing-xl);
  color: rgba(255, 255, 255, 0.9);
  max-width: 600px;
}

.hero-features {
  display: grid;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-xl);
}

.feature-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  opacity: 0;
  animation: slideInLeft 0.6s ease-out forwards;
}

.feature-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: var(--secondary-color);
  color: white;
  border-radius: 50%;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  flex-shrink: 0;
}

.feature-text {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  color: rgba(255, 255, 255, 0.95);
}

.hero-actions {
  display: flex;
  gap: var(--spacing-md);
  flex-wrap: wrap;
}

.cta-primary,
.cta-secondary {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-weight: var(--font-weight-semibold);
}

.cta-primary {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.cta-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3);
}


/* Tarjeta de oferta */
.hero-offer {
  align-self: center;
  min-width: 320px;
  margin-left: 100px;
}

.offer-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: var(--border-radius-2xl);
  padding: var(--spacing-xl);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.offer-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-lg);
}

.offer-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--gray-900);
  margin: 0;
}

.offer-badge {
  background: var(--gradient-accent);
  color: white;
  padding: var(--spacing-xs) var(--spacing-md);
  border-radius: var(--border-radius-full);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  animation: pulse 2s infinite;
}

.offer-badge-price{
  background: var(--gradient-accent);
  color: white;
  padding: var(--spacing-xs) var(--spacing-md);
  border-radius: var(--border-radius-full);
  font-size: var(--font-size-m);
  font-weight: var(--font-weight-bold);
  margin-top: 20px;
}

.price-display {
  text-align: center;
  margin-bottom: var(--spacing-lg);
}

.price-label {
  display: block;
  font-size: var(--font-size-sm);
  color: var(--gray-600);
  margin-bottom: var(--spacing-xs);
}

.price-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-xs);
}

.price-original {
  font-size: var(--font-size-lg);
  color: var(--gray-500);
  margin-top: 15px;
}

.price-current {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-extrabold);
  color: var(--secondary-color);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-top: var(--spacing-xs);
}

.offer-condition {
  margin-bottom: var(--spacing-lg);
}

.condition-text {
  font-size: var(--font-size-sm);
  color: var(--gray-700);
  text-align: center;
  line-height: 1.5;
  margin: 0;
}

.offer-btn {
  width: 100%;
  justify-content: center;
}

/* Indicadores de confianza */
.trust-indicators {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-lg);
  margin-top: var(--spacing-3xl);
  padding-top: var(--spacing-xl);
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.trust-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  color: white;
}

.trust-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.trust-text {
  display: flex;
  flex-direction: column;
}

.trust-number {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  line-height: 1;
}

.trust-label {
  font-size: var(--font-size-sm);
  color: rgba(255, 255, 255, 0.8);
  font-weight: var(--font-weight-medium);
}

/* Indicador de scroll */
.scroll-indicator {
  
  position: absolute;
  bottom: var(--spacing-xl);
  left: 50%;
  transform: translateX(-50%);
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs);
  animation: bounce 2s infinite;
  opacity: 0.8;
  bottom: 0%;
}

.scroll-indicator:hover {
  opacity: 1;
}

.scroll-icon {
  font-size: var(--font-size-lg);
}

.scroll-text {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
}

/* Animaciones */
@keyframes float {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  33% { transform: translate(30px, -30px) rotate(120deg); }
  66% { transform: translate(-20px, 20px) rotate(240deg); }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Responsive */
@media (max-width: 1024px) {
  .hero {
    margin-top: 60px;
    padding: var(--spacing-3xl) 0 var(--spacing-2xl);
  }

  .hero-content {
    grid-template-columns: 1fr;
    gap: var(--spacing-2xl);
    text-align: center;
  }

  .hero-offer {
    justify-self: center;
    min-width: auto;
    max-width: 400px;
  }

  .trust-indicators {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-md);
  }
}

@media (max-width: 768px) {
  .hero {
    min-height: auto;
    padding: var(--spacing-2xl) 0;
  }

  .hero-actions {
    justify-content: center;
  }

  .cta-primary,
  .cta-secondary {
    flex: 1;
    min-width: 0;
    justify-content: center;
  }

  .offer-card {
    padding: var(--spacing-lg);
  }

  .trust-indicators {
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
  }

  .trust-item {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .hero-actions {
    flex-direction: column;
    width: 100%;
  }

  .cta-primary,
  .cta-secondary {
    width: 100%;
  }

  .hero-features {
    text-align: left;
  }

  .feature-item {
    justify-content: center;
  }
}
</style>
