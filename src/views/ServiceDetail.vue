<!--
  Vista Detalle de Servicio
  Muestra información detallada de un servicio específico
-->

<template>
  <div class="service-detail-page">
    <div class="container">
      <div v-if="isLoading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Cargando servicio...</p>
      </div>

      <div v-else class="service-detail-content">
        <!-- Breadcrumb -->
        <nav class="breadcrumb">
          <router-link to="/">Inicio</router-link>
          <span class="separator">›</span>
          <router-link to="/servicios">Servicios</router-link>
          <span class="separator">›</span>
          <span class="current">{{ serviceId }}</span>
        </nav>

        <!-- Hero del servicio -->
        <div class="service-hero">
          <div class="hero-content">
            <h1 class="service-title">{{ getServiceTitle() }}</h1>
            <p class="service-description">{{ getServiceDescription() }}</p>
            <div class="hero-actions">
              <button @click="handleBookService" class="btn btn-primary btn-xl">
                <span class="btn-icon">📞</span>
                <span class="btn-text">Agendar Servicio</span>
              </button>
              <button @click="handleContactInfo" class="btn btn-outline btn-xl">
                <span class="btn-icon">💬</span>
                <span class="btn-text">Más Información</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Información del servicio -->
        <div class="service-info">
          <div class="info-grid">
            <div class="info-card">
              <div class="card-icon">⏰</div>
              <h3 class="card-title">Duración</h3>
              <p class="card-content">{{ getServiceDuration() }}</p>
            </div>
            
            <div class="info-card">
              <div class="card-icon">💰</div>
              <h3 class="card-title">Precio</h3>
              <p class="card-content">{{ getServicePrice() }}</p>
            </div>
            
            <div class="info-card">
              <div class="card-icon">📍</div>
              <h3 class="card-title">Ubicación</h3>
              <p class="card-content">{{ getServiceLocation() }}</p>
            </div>
            
            <div class="info-card">
              <div class="card-icon">👨‍⚕️</div>
              <h3 class="card-title">Profesional</h3>
              <p class="card-content">Optometrista certificado</p>
            </div>
          </div>
        </div>

        <!-- Características del servicio -->
        <div class="service-features">
          <h2 class="section-title">¿Qué incluye este servicio?</h2>
          <div class="features-grid">
            <div v-for="feature in getServiceFeatures()" :key="feature" class="feature-item">
              <span class="feature-icon">✓</span>
              <span class="feature-text">{{ feature }}</span>
            </div>
          </div>
        </div>

        <!-- CTA final -->
        <div class="final-cta">
          <div class="cta-content">
            <h2 class="cta-title">¿Listo para agendar tu cita?</h2>
            <p class="cta-description">
              Contáctanos y programa tu {{ getServiceTitle().toLowerCase() }} hoy mismo
            </p>
            <div class="cta-actions">
              <button @click="handleBookService" class="btn btn-primary btn-lg">
                <span class="btn-icon">📞</span>
                <span class="btn-text">Agendar Ahora</span>
              </button>
              <a href="https://wa.me/573001234567" target="_blank" class="btn btn-secondary btn-lg">
                <span class="btn-icon">💬</span>
                <span class="btn-text">WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useNotifications } from '@/composables/useNotifications';

const route = useRoute();
const router = useRouter();
const { showInfo } = useNotifications();

const isLoading = ref(true);

const serviceId = computed(() => route.params.id as string);

const getServiceTitle = (): string => {
  const titles = {
    'home-exam': 'Examen Óptico a Domicilio',
    'express': 'Montaje Express',
    'repair': 'Reparación de Gafas',
    'consultation': 'Asesoría Óptica Gratuita'
  };
  return titles[serviceId.value as keyof typeof titles] || 'Servicio Óptico';
};

const getServiceDescription = (): string => {
  const descriptions = {
    'home-exam': 'Realizamos un examen óptico completo en la comodidad de tu hogar con equipos de última tecnología.',
    'express': 'Montaje rápido de tus lentes en menos de 2 horas con la mejor calidad.',
    'repair': 'Reparamos y ajustamos tus gafas favoritas con garantía de calidad.',
    'consultation': 'Asesoría personalizada para encontrar la mejor solución para tu visión.'
  };
  return descriptions[serviceId.value as keyof typeof descriptions] || 'Servicio profesional de óptica';
};

const getServiceDuration = (): string => {
  const durations = {
    'home-exam': '45-60 minutos',
    'express': '1-2 horas',
    'repair': '30-60 minutos',
    'consultation': '20-30 minutos'
  };
  return durations[serviceId.value as keyof typeof durations] || '30-60 minutos';
};

const getServicePrice = (): string => {
  const prices = {
    'home-exam': 'GRATIS con compra de lentes',
    'express': 'Desde $15,000',
    'repair': 'Desde $10,000',
    'consultation': 'GRATIS'
  };
  return prices[serviceId.value as keyof typeof prices] || 'Consultar precio';
};

const getServiceLocation = (): string => {
  const locations = {
    'home-exam': 'En tu domicilio',
    'express': 'En nuestra óptica',
    'repair': 'En nuestra óptica',
    'consultation': 'Presencial o virtual'
  };
  return locations[serviceId.value as keyof typeof locations] || 'Por definir';
};

const getServiceFeatures = (): string[] => {
  const features = {
    'home-exam': [
      'Examen visual completo',
      'Medición de graduación',
      'Revisión de salud ocular',
      'Recomendaciones personalizadas',
      'Equipos profesionales portátiles',
      'Optometrista certificado'
    ],
    'express': [
      'Montaje en menos de 2 horas',
      'Ajuste personalizado',
      'Verificación de calidad',
      'Garantía de montaje',
      'Entrega inmediata'
    ],
    'repair': [
      'Diagnóstico gratuito',
      'Reparación de marcos',
      'Cambio de patillas',
      'Ajuste de nasetas',
      'Soldadura especializada',
      'Garantía en reparación'
    ],
    'consultation': [
      'Asesoría personalizada',
      'Recomendación de productos',
      'Análisis de necesidades',
      'Comparación de opciones',
      'Sin compromiso de compra'
    ]
  };
  return features[serviceId.value as keyof typeof features] || [];
};

const handleBookService = (): void => {
  router.push(`/contacto?service=${serviceId.value}`);
};

const handleContactInfo = (): void => {
  showInfo('Información', 'Redirigiendo a contacto...');
  router.push('/contacto');
};

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false;
  }, 500);
});
</script>

<style scoped>
.service-detail-page {
  padding: var(--spacing-2xl) 0;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: var(--spacing-lg);
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid var(--gray-200);
  border-top: 4px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-xl);
  font-size: var(--font-size-sm);
}

.breadcrumb a {
  color: var(--primary-color);
  text-decoration: none;
}

.breadcrumb a:hover {
  text-decoration: underline;
}

.separator {
  color: var(--gray-400);
}

.current {
  color: var(--gray-600);
  font-weight: var(--font-weight-medium);
  text-transform: capitalize;
}

/* Hero del servicio */
.service-hero {
  background: var(--gradient-primary);
  color: white;
  padding: var(--spacing-4xl) var(--spacing-2xl);
  border-radius: var(--border-radius-2xl);
  text-align: center;
  margin-bottom: var(--spacing-3xl);
}

.service-title {
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-extrabold);
  margin: 0 0 var(--spacing-lg) 0;
}

.service-description {
  font-size: var(--font-size-lg);
  opacity: 0.95;
  max-width: 600px;
  margin: 0 auto var(--spacing-2xl);
  line-height: 1.6;
}

.hero-actions {
  display: flex;
  gap: var(--spacing-lg);
  justify-content: center;
  flex-wrap: wrap;
}

/* Información del servicio */
.service-info {
  margin-bottom: var(--spacing-3xl);
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-xl);
}

.info-card {
  background: white;
  padding: var(--spacing-xl);
  border-radius: var(--border-radius-xl);
  box-shadow: var(--shadow-md);
  text-align: center;
  transition: transform var(--transition-normal);
}

.info-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.card-icon {
  font-size: 3rem;
  margin-bottom: var(--spacing-md);
}

.card-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--gray-900);
  margin: 0 0 var(--spacing-sm) 0;
}

.card-content {
  font-size: var(--font-size-base);
  color: var(--gray-700);
  margin: 0;
}

/* Características */
.service-features {
  margin-bottom: var(--spacing-3xl);
}

.section-title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--gray-900);
  text-align: center;
  margin: 0 0 var(--spacing-2xl) 0;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-lg);
}

.feature-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  background: var(--gray-50);
  border-radius: var(--border-radius-lg);
}

.feature-icon {
  color: var(--success-color);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
}

.feature-text {
  font-size: var(--font-size-base);
  color: var(--gray-700);
}

/* CTA final */
.final-cta {
  background: var(--gray-50);
  padding: var(--spacing-3xl) var(--spacing-2xl);
  border-radius: var(--border-radius-2xl);
  text-align: center;
}

.cta-title {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--gray-900);
  margin: 0 0 var(--spacing-lg) 0;
}

.cta-description {
  font-size: var(--font-size-lg);
  color: var(--gray-600);
  margin: 0 0 var(--spacing-2xl) 0;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.cta-actions {
  display: flex;
  gap: var(--spacing-lg);
  justify-content: center;
  flex-wrap: wrap;
}

/* Responsive */
@media (max-width: 768px) {
  .service-hero {
    padding: var(--spacing-2xl) var(--spacing-lg);
  }

  .service-title {
    font-size: var(--font-size-3xl);
  }

  .hero-actions {
    flex-direction: column;
    align-items: center;
  }

  .hero-actions .btn {
    width: 100%;
    max-width: 300px;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .cta-actions {
    flex-direction: column;
    align-items: center;
  }

  .cta-actions .btn {
    width: 100%;
    max-width: 300px;
  }
}
</style>
