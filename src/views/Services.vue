<!--
  Vista Services - Página de Servicios
  Implementa principios SOLID y Clean Architecture
  Muestra todos los servicios disponibles con filtros
-->

<template>
  <div class="services-page">
    <!-- Header de la página -->
    <section class="page-header">
      <div class="container">
        <div class="header-content">
          <h1 class="page-title gradient-text">Nuestros Servicios</h1>
          <p class="page-description">
            Servicios ópticos profesionales para el cuidado integral de tu visión
          </p>
          <div class="header-highlights">
            <div class="highlight-item">
              <span class="highlight-icon">🏠</span>
              <span class="highlight-text">Servicio a Domicilio</span>
            </div>
            <div class="highlight-item">
              <span class="highlight-icon">👨‍⚕️</span>
              <span class="highlight-text">Profesionales Certificados</span>
            </div>
            <div class="highlight-item">
              <span class="highlight-icon">⚡</span>
              <span class="highlight-text">Respuesta Rápida</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Servicio destacado - Examen a domicilio -->
    <section class="featured-service section">
      <div class="container">
        <div class="featured-content">
          <div class="featured-text">
            <div class="featured-badge">
              <span class="badge-icon">⭐</span>
              <span class="badge-text">Servicio Estrella</span>
            </div>
            <h2 class="featured-title">Examen Óptico a Domicilio</h2>
            <p class="featured-description">
              Nuestro servicio más popular: llevamos todo el equipo especializado 
              directamente a tu hogar para realizar un examen óptico completo y profesional.
            </p>
            <div class="featured-benefits">
              <div class="benefit-item">
                <span class="benefit-icon">✓</span>
                <span class="benefit-text">Comodidad total en tu hogar</span>
              </div>
              <div class="benefit-item">
                <span class="benefit-icon">✓</span>
                <span class="benefit-text">Equipos de última tecnología</span>
              </div>
              <div class="benefit-item">
                <span class="benefit-icon">✓</span>
                <span class="benefit-text">Completamente GRATIS al comprar lentes</span>
              </div>
            </div>
            <div class="featured-actions">
              <button class="btn btn-primary btn-lg" @click="handleBookFeaturedService">
                <span class="btn-icon">📅</span>
                <span class="btn-text">Agendar Ahora</span>
              </button>
              <button class="btn btn-outline btn-lg" @click="handleLearnMore">
                <span class="btn-icon">ℹ️</span>
                <span class="btn-text">Más Información</span>
              </button>
            </div>
          </div>
          <div class="featured-visual">
            <div class="visual-card">
              <div class="price-display">
                <span class="price-label">Precio Normal</span>
                <span class="price-original">$50,000</span>
                <span class="price-current">GRATIS</span>
                <span class="price-condition">Con compra de lentes</span>
              </div>
              <div class="service-features">
                <div class="feature">
                  <span class="feature-icon">🏠</span>
                  <span class="feature-text">En tu hogar</span>
                </div>
                <div class="feature">
                  <span class="feature-icon">⏱️</span>
                  <span class="feature-text">45-60 min</span>
                </div>
                <div class="feature">
                  <span class="feature-icon">👨‍⚕️</span>
                  <span class="feature-text">Profesional</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Filtros de servicios -->
    <section class="filters-section">
      <div class="container">
        <div class="filters-container">
          <div class="filter-tabs">
            <button
              v-for="category in serviceCategories"
              :key="category"
              class="filter-tab"
              :class="{ 'tab-active': selectedCategory === category }"
              @click="setSelectedCategory(category)"
            >
              {{ getCategoryIcon(category) }} {{ category }}
            </button>
          </div>
          
          <div class="filter-options">
            <div class="filter-group">
              <label class="filter-checkbox">
                <input
                  v-model="showOnlyFree"
                  type="checkbox"
                  @change="applyFilters"
                />
                <span class="checkbox-text">Solo servicios gratuitos</span>
              </label>
            </div>
            
            <div class="filter-group">
              <label class="filter-checkbox">
                <input
                  v-model="showOnlyBookingRequired"
                  type="checkbox"
                  @change="applyFilters"
                />
                <span class="checkbox-text">Requieren cita previa</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Lista de servicios -->
    <section class="services-section section">
      <div class="container">
        <!-- Loading state -->
        <div v-if="isLoading" class="loading-state">
          <div class="loading-grid">
            <div
              v-for="i in 6"
              :key="i"
              class="loading-card"
            >
              <div class="loading-icon"></div>
              <div class="loading-content">
                <div class="loading-line"></div>
                <div class="loading-line short"></div>
                <div class="loading-line medium"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Servicios -->
        <div v-else class="services-grid">
          <ServiceCard
            v-for="service in filteredServices"
            :key="service.id"
            :service="service"
            :show-includes="true"
            :show-benefits="true"
            :show-additional-info="true"
            :max-features="4"
            :max-includes="4"
            @book-service="handleBookService"
            @request-service="handleRequestService"
            @view-details="handleServiceDetails"
            @share-service="handleShareService"
          />
        </div>

        <!-- Estado vacío -->
        <div v-if="!isLoading && filteredServices.length === 0" class="empty-state">
          <div class="empty-illustration">
            <span class="empty-icon">🔍</span>
          </div>
          <h3 class="empty-title">No se encontraron servicios</h3>
          <p class="empty-description">
            No hay servicios que coincidan con los filtros seleccionados
          </p>
          <button class="btn btn-primary" @click="clearFilters">
            <span class="btn-icon">🔄</span>
            <span class="btn-text">Mostrar Todos</span>
          </button>
        </div>
      </div>
    </section>

    <!-- Información adicional -->
    <section class="info-section section bg-gray-50">
      <div class="container">
        <div class="info-grid">
          <div class="info-card">
            <div class="info-icon">📅</div>
            <h3 class="info-title">Horarios de Atención</h3>
            <div class="info-content">
              <p><strong>Lunes a Viernes:</strong> 8:00 AM - 6:00 PM</p>
              <p><strong>Sábados:</strong> 9:00 AM - 4:00 PM</p>
              <p><strong>Domingos:</strong> Cerrado</p>
              <p class="info-note">
                <span class="note-icon">📞</span>
                Emergencias 24/7 con costo adicional
              </p>
            </div>
          </div>

          <div class="info-card">
            <div class="info-icon">🚚</div>
            <h3 class="info-title">Cobertura de Servicio</h3>
            <div class="info-content">
              <p><strong>Área Principal:</strong> Todo Pedraza</p>
              <p><strong>Municipios Cercanos:</strong> Disponible</p>
              <p><strong>Zonas Rurales:</strong> Consultar disponibilidad</p>
              <p class="info-note">
                <span class="note-icon">📍</span>
                Sin costo adicional en área principal
              </p>
            </div>
          </div>

          <div class="info-card">
            <div class="info-icon">💰</div>
            <h3 class="info-title">Política de Precios</h3>
            <div class="info-content">
              <p><strong>Examen a Domicilio:</strong> Gratis con compra</p>
              <p><strong>Reparaciones:</strong> Presupuesto gratuito</p>
              <p><strong>Emergencias:</strong> Recargo del 50%</p>
              <p class="info-note">
                <span class="note-icon">💳</span>
                Aceptamos todos los medios de pago
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ específico de servicios -->
    <section class="faq-services section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Preguntas Frecuentes sobre Servicios</h2>
          <p class="section-description">
            Resuelve tus dudas sobre nuestros servicios
          </p>
        </div>

        <div class="faq-grid">
          <div
            v-for="(faq, index) in serviceFaqs"
            :key="index"
            class="faq-card"
          >
            <div class="faq-icon">{{ faq.icon }}</div>
            <h4 class="faq-question">{{ faq.question }}</h4>
            <p class="faq-answer">{{ faq.answer }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Call to Action -->
    <section class="cta-section section">
      <div class="container">
        <div class="cta-content">
          <h2 class="cta-title">¿Necesitas un servicio personalizado?</h2>
          <p class="cta-description">
            Contáctanos y nuestro equipo te ayudará a encontrar la solución perfecta
          </p>
          <div class="cta-actions">
            <router-link to="/contacto" class="btn btn-primary btn-xl">
              <span class="btn-icon">💬</span>
              <span class="btn-text">Contactar Ahora</span>
            </router-link>
            <button class="btn btn-outline btn-xl" @click="handleWhatsApp">
              <span class="btn-icon">📱</span>
              <span class="btn-text">WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import ServiceCard from '@/components/ServiceCard.vue';
import { useNotifications } from '@/composables/useNotifications';
import { servicesService } from '@/services/servicesService';
import type { OpticalService } from '@/services/servicesService';

// Router y composables
const router = useRouter();
const { showSuccess, showError, showInfo } = useNotifications();

// Estado reactivo
const isLoading = ref(true);
const allServices = ref<OpticalService[]>([]);
const serviceCategories = ref<string[]>([]);
const selectedCategory = ref('Todos');
const showOnlyFree = ref(false);
const showOnlyBookingRequired = ref(false);

// Datos estáticos
const serviceFaqs = [
  {
    icon: '🏠',
    question: '¿Cómo programo un examen a domicilio?',
    answer: 'Puedes programar tu cita a través de nuestro formulario de contacto, por WhatsApp o llamando directamente. Te contactaremos para confirmar fecha y hora.'
  },
  {
    icon: '⏱️',
    question: '¿Cuánto tiempo toma cada servicio?',
    answer: 'Los tiempos varían: examen completo 45-60 min, montaje express 30 min, reparaciones menores 15-30 min. Te informamos el tiempo estimado al agendar.'
  },
  {
    icon: '💰',
    question: '¿Qué formas de pago aceptan?',
    answer: 'Aceptamos efectivo, transferencias bancarias, tarjetas de crédito y débito. También ofrecemos financiación para productos y servicios costosos.'
  },
  {
    icon: '🔧',
    question: '¿Qué incluyen las reparaciones?',
    answer: 'Evaluación gratuita, reparación de bisagras, cambio de tornillos, enderezado de marcos, ajuste de plaquetas y limpieza profesional.'
  },
  {
    icon: '📅',
    question: '¿Puedo cancelar o reprogramar mi cita?',
    answer: 'Sí, puedes cancelar o reprogramar hasta 2 horas antes de la cita sin ningún costo. Para cambios de último momento consulta disponibilidad.'
  },
  {
    icon: '🚚',
    question: '¿Hay costo adicional por el servicio a domicilio?',
    answer: 'No hay costo adicional en nuestra área de cobertura principal. Para zonas alejadas puede aplicar un pequeño recargo de transporte.'
  }
];

// Computed properties
const filteredServices = computed(() => {
  let services = [...allServices.value];

  // Filtro de categoría
  if (selectedCategory.value && selectedCategory.value !== 'Todos') {
    services = services.filter(service => 
      service.category.toLowerCase() === selectedCategory.value.toLowerCase()
    );
  }

  // Filtro de servicios gratuitos
  if (showOnlyFree.value) {
    services = services.filter(service => 
      service.free || service.price === 0 || service.freeWithPurchase
    );
  }

  // Filtro de servicios que requieren cita
  if (showOnlyBookingRequired.value) {
    services = services.filter(service => service.bookingRequired);
  }

  return services;
});

// Métodos
const loadServices = async (): Promise<void> => {
  try {
    isLoading.value = true;

    const [servicesResponse, categoriesResponse] = await Promise.all([
      servicesService.getAllServices(),
      servicesService.getServiceCategories()
    ]);

    allServices.value = servicesResponse.data.services;
    serviceCategories.value = ['Todos', ...categoriesResponse.data];

  } catch (error) {
    console.error('Error loading services:', error);
    showError('Error', 'No se pudieron cargar los servicios');
  } finally {
    isLoading.value = false;
  }
};

const setSelectedCategory = (category: string): void => {
  selectedCategory.value = category;
  applyFilters();
};

const applyFilters = (): void => {
  // Los filtros se aplican automáticamente a través de computed properties
};

const clearFilters = (): void => {
  selectedCategory.value = 'Todos';
  showOnlyFree.value = false;
  showOnlyBookingRequired.value = false;
};

const getCategoryIcon = (category: string): string => {
  const icons = {
    'Todos': '🔍',
    'Servicio Premium': '⭐',
    'Servicio Estándar': '🏥',
    'Servicio Técnico': '🔧',
    'Consultoría': '👨‍💼',
    'Corporativo': '🏢',
    'Suscripción': '🔄',
    'Protección': '🛡️'
  };
  return icons[category as keyof typeof icons] || '⚕️';
};

const handleBookFeaturedService = (): void => {
  router.push('/contacto?service=examen-domicilio');
};

const handleLearnMore = (): void => {
  // Scroll a la sección de servicios
  const servicesSection = document.querySelector('.services-section');
  if (servicesSection) {
    servicesSection.scrollIntoView({ behavior: 'smooth' });
  }
};

const handleBookService = (service: OpticalService): void => {
  if (service.bookingRequired) {
    router.push(`/contacto?service=${service.id}&type=booking`);
  } else {
    showInfo('Información', 'Este servicio no requiere cita previa. Puedes visitarnos directamente.');
  }
};

const handleRequestService = (service: OpticalService): void => {
  router.push(`/contacto?service=${service.id}&type=request`);
};

const handleServiceDetails = (service: OpticalService): void => {
  // En una implementación completa, esto iría a una página de detalles del servicio
  showInfo(
    service.name,
    `${service.description}\n\nDuración: ${service.duration}\nPrecio: ${service.price === 0 ? 'Gratis' : '$' + service.price.toLocaleString()}`
  );
};

const handleShareService = (service: OpticalService): void => {
  if (navigator.share) {
    navigator.share({
      title: `${service.name} - Óptica Visión Plus`,
      text: service.description,
      url: window.location.href
    });
  } else {
    // Fallback para navegadores que no soportan Web Share API
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    showSuccess('¡Copiado!', 'Link copiado al portapapeles');
  }
};

const handleWhatsApp = (): void => {
  window.open('https://wa.me/573001234567?text=Hola, me interesa información sobre sus servicios', '_blank');
};

// Lifecycle hooks
onMounted(() => {
  loadServices();
});
</script>

<style scoped>
.services-page {
  min-height: 100vh;
}

/* Page Header */
.page-header {
  background: var(--gradient-hero);
  color: white;
  padding: var(--spacing-4xl) 0 var(--spacing-3xl);
  margin-top: 70px;
}

.header-content {
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
}

.page-title {
  font-size: var(--font-size-5xl);
  font-weight: var(--font-weight-extrabold);
  margin-bottom: var(--spacing-lg);
  line-height: 1.1;
}

.page-description {
  font-size: var(--font-size-xl);
  margin-bottom: var(--spacing-xl);
  opacity: 0.95;
  line-height: 1.6;
}

.header-highlights {
  display: flex;
  justify-content: center;
  gap: var(--spacing-xl);
  flex-wrap: wrap;
}

.highlight-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  background: rgba(255, 255, 255, 0.1);
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: var(--border-radius-full);
  backdrop-filter: blur(10px);
}

.highlight-icon {
  font-size: var(--font-size-lg);
}

.highlight-text {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
}

/* Featured Service */
.featured-service {
  background: linear-gradient(135deg, var(--gray-50) 0%, white 100%);
}

.featured-content {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: var(--spacing-3xl);
  align-items: center;
  max-width: 1000px;
  margin: 0 auto;
}

.featured-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  background: var(--gradient-accent);
  color: white;
  padding: var(--spacing-xs) var(--spacing-md);
  border-radius: var(--border-radius-full);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--spacing-lg);
}

.featured-title {
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-extrabold);
  color: var(--gray-900);
  margin-bottom: var(--spacing-lg);
  line-height: 1.2;
}

.featured-description {
  font-size: var(--font-size-lg);
  color: var(--gray-600);
  line-height: 1.6;
  margin-bottom: var(--spacing-xl);
}

.featured-benefits {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-xl);
}

.benefit-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.benefit-icon {
  color: var(--secondary-color);
  font-weight: bold;
  font-size: var(--font-size-base);
}

.benefit-text {
  color: var(--gray-700);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
}

.featured-actions {
  display: flex;
  gap: var(--spacing-md);
}

.visual-card {
  background: white;
  border-radius: var(--border-radius-2xl);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-xl);
  min-width: 300px;
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

.price-original {
  display: block;
  font-size: var(--font-size-lg);
  color: var(--gray-500);
  text-decoration: line-through;
  margin-bottom: var(--spacing-xs);
}

.price-current {
  display: block;
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-extrabold);
  color: var(--secondary-color);
  margin-bottom: var(--spacing-xs);
}

.price-condition {
  font-size: var(--font-size-sm);
  color: var(--gray-600);
}

.service-features {
  display: flex;
  justify-content: space-between;
  gap: var(--spacing-md);
}

.feature {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs);
  flex: 1;
}

.feature-icon {
  font-size: var(--font-size-lg);
}

.feature-text {
  font-size: var(--font-size-xs);
  color: var(--gray-600);
  font-weight: var(--font-weight-medium);
  text-align: center;
}

/* Filters Section */
.filters-section {
  background: var(--gray-100);
  padding: var(--spacing-lg) 0;
}

.filters-container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.filter-tabs {
  display: flex;
  gap: var(--spacing-sm);
  overflow-x: auto;
  padding-bottom: var(--spacing-sm);
}

.filter-tab {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-lg);
  background: white;
  border: 2px solid var(--gray-300);
  border-radius: var(--border-radius-full);
  cursor: pointer;
  transition: all var(--transition-fast);
  font-weight: var(--font-weight-medium);
  color: var(--gray-700);
  white-space: nowrap;
}

.filter-tab:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.tab-active {
  background: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
}

.filter-options {
  display: flex;
  gap: var(--spacing-xl);
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  align-items: center;
}

.filter-checkbox {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  cursor: pointer;
  font-size: var(--font-size-base);
  color: var(--gray-700);
}

.filter-checkbox input {
  margin: 0;
}

/* Services Grid */
.section {
  padding: var(--spacing-4xl) 0;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: var(--spacing-xl);
}

/* Loading State */
.loading-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: var(--spacing-xl);
}

.loading-card {
  background: white;
  border-radius: var(--border-radius-xl);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-sm);
}

.loading-icon {
  width: 60px;
  height: 60px;
  background: var(--gray-200);
  border-radius: 50%;
  margin: 0 auto var(--spacing-lg);
  animation: pulse 1.5s infinite;
}

.loading-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.loading-line {
  height: 16px;
  background: var(--gray-200);
  border-radius: var(--border-radius-sm);
  animation: pulse 1.5s infinite;
}

.loading-line.short {
  width: 60%;
}

.loading-line.medium {
  width: 80%;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: var(--spacing-4xl) var(--spacing-lg);
}

.empty-illustration {
  margin-bottom: var(--spacing-xl);
}

.empty-icon {
  font-size: 4rem;
  opacity: 0.3;
}

.empty-title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--gray-700);
  margin-bottom: var(--spacing-md);
}

.empty-description {
  font-size: var(--font-size-lg);
  color: var(--gray-600);
  margin-bottom: var(--spacing-xl);
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}

/* Info Section */
.info-section {
  background: var(--gray-50);
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-xl);
}

.info-card {
  background: white;
  border-radius: var(--border-radius-xl);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-md);
  text-align: center;
}

.info-icon {
  font-size: 3rem;
  margin-bottom: var(--spacing-lg);
}

.info-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--gray-900);
  margin-bottom: var(--spacing-md);
}

.info-content p {
  margin-bottom: var(--spacing-sm);
  color: var(--gray-700);
}

.info-note {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-xs);
  color: var(--primary-color);
  font-weight: var(--font-weight-medium);
  margin-top: var(--spacing-md);
}

/* FAQ Grid */
.faq-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-xl);
}

.faq-card {
  background: white;
  border-radius: var(--border-radius-xl);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-md);
  text-align: center;
  transition: transform var(--transition-normal);
}

.faq-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.faq-icon {
  font-size: 2.5rem;
  margin-bottom: var(--spacing-lg);
}

.faq-question {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--gray-900);
  margin-bottom: var(--spacing-md);
}

.faq-answer {
  color: var(--gray-600);
  line-height: 1.6;
  margin: 0;
}

/* CTA Section */
.cta-section {
  background: var(--gradient-primary);
  color: white;
  text-align: center;
}

.cta-title {
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-extrabold);
  margin-bottom: var(--spacing-lg);
}

.cta-description {
  font-size: var(--font-size-lg);
  margin-bottom: var(--spacing-xl);
  opacity: 0.95;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.cta-actions {
  display: flex;
  justify-content: center;
  gap: var(--spacing-md);
  flex-wrap: wrap;
}

/* Responsive */
@media (max-width: 1024px) {
  .featured-content {
    grid-template-columns: 1fr;
    gap: var(--spacing-2xl);
    text-align: center;
  }

  .visual-card {
    max-width: 400px;
    margin: 0 auto;
  }
}

@media (max-width: 768px) {
  .page-header {
    padding: var(--spacing-2xl) 0;
    margin-top: 60px;
  }

  .page-title {
    font-size: var(--font-size-4xl);
  }

  .header-highlights {
    gap: var(--spacing-md);
  }

  .highlight-item {
    padding: var(--spacing-xs) var(--spacing-md);
  }

  .featured-title {
    font-size: var(--font-size-3xl);
  }

  .featured-actions {
    flex-direction: column;
    align-items: center;
  }

  .filter-tabs {
    gap: var(--spacing-xs);
  }

  .filter-options {
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .services-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-lg);
  }

  .info-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-lg);
  }

  .faq-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-lg);
  }

  .cta-actions {
    flex-direction: column;
    align-items: center;
  }
}

@media (max-width: 480px) {
  .featured-actions .btn {
    width: 100%;
  }

  .cta-actions .btn {
    width: 100%;
    max-width: 300px;
  }
}
</style>
