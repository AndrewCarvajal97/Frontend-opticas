<!--
  Componente Service Card
  Tarjeta reutilizable para mostrar servicios
  Implementa principios SOLID y Clean Architecture
-->

<template>
  <div 
    class="service-card"
    :class="{ 
      'card-featured': service.featured,
      'card-free': service.free || service.price === 0,
      'card-premium': isPremium,
      'card-booking-required': service.bookingRequired
    }"
  >
    <!-- Badge de estado -->
    <div v-if="showBadges" class="service-badges">
      <span v-if="service.free || service.price === 0" class="badge badge-free">
        GRATIS
      </span>
      <span v-else-if="service.discount && service.discount > 0" class="badge badge-discount">
        -{{ service.discount }}%
      </span>
      <span v-if="service.featured" class="badge badge-featured">
        ⭐ Destacado
      </span>
      <span v-if="isPremium" class="badge badge-premium">
        👑 Premium
      </span>
      <span v-if="service.freeWithPurchase" class="badge badge-offer">
        🎁 Gratis con compra
      </span>
    </div>

    <!-- Icono del servicio -->
    <div class="service-icon">
      <span class="icon-display">{{ service.icon }}</span>
      <div class="icon-background"></div>
    </div>

    <!-- Información del servicio -->
    <div class="service-info">
      <!-- Categoría -->
      <div class="service-category">
        <span class="category-text">{{ service.category }}</span>
      </div>

      <!-- Nombre del servicio -->
      <h3 class="service-name" @click="handleServiceClick">
        {{ service.name }}
      </h3>

      <!-- Descripción -->
      <p v-if="showDescription" class="service-description">
        {{ truncateDescription(service.description) }}
      </p>

      <!-- Duración -->
      <div v-if="showDuration" class="service-duration">
        <span class="duration-icon">⏱️</span>
        <span class="duration-text">{{ service.duration }}</span>
      </div>

      <!-- Rating y reviews -->
      <div v-if="showRating" class="service-rating">
        <div class="rating-stars">
          <span 
            v-for="star in 5"
            :key="star"
            class="star"
            :class="{ 'star-filled': star <= Math.floor(service.rating) }"
          >
            ⭐
          </span>
        </div>
        <span class="rating-value">{{ service.rating.toFixed(1) }}</span>
        <span class="rating-count">({{ service.reviews }})</span>
      </div>

      <!-- Características principales -->
      <div v-if="showFeatures && service.features.length > 0" class="service-features">
        <ul class="features-list">
          <li 
            v-for="feature in service.features.slice(0, maxFeatures)"
            :key="feature"
            class="feature-item"
          >
            <span class="feature-icon">✓</span>
            <span class="feature-text">{{ feature }}</span>
          </li>
        </ul>
        
        <button 
          v-if="service.features.length > maxFeatures"
          class="show-more-features"
          @click="handleShowMoreFeatures"
        >
          +{{ service.features.length - maxFeatures }} más
        </button>
      </div>

      <!-- Incluye -->
      <div v-if="showIncludes && service.includes.length > 0" class="service-includes">
        <h4 class="includes-title">Incluye:</h4>
        <ul class="includes-list">
          <li 
            v-for="item in service.includes.slice(0, maxIncludes)"
            :key="item"
            class="include-item"
          >
            <span class="include-icon">📋</span>
            <span class="include-text">{{ item }}</span>
          </li>
        </ul>
        
        <button 
          v-if="service.includes.length > maxIncludes"
          class="show-more-includes"
          @click="handleShowMoreIncludes"
        >
          Ver todo lo incluido
        </button>
      </div>

      <!-- Beneficios -->
      <div v-if="showBenefits && service.benefits.length > 0" class="service-benefits">
        <h4 class="benefits-title">Beneficios:</h4>
        <ul class="benefits-list">
          <li 
            v-for="benefit in service.benefits.slice(0, maxBenefits)"
            :key="benefit"
            class="benefit-item"
          >
            <span class="benefit-icon">🎯</span>
            <span class="benefit-text">{{ benefit }}</span>
          </li>
        </ul>
      </div>

      <!-- Información adicional -->
      <div v-if="showAdditionalInfo" class="additional-info">
        <div v-if="service.coverage" class="info-item">
          <span class="info-icon">📍</span>
          <span class="info-label">Cobertura:</span>
          <span class="info-value">{{ service.coverage }}</span>
        </div>
        
        <div class="info-item">
          <span class="info-icon">📅</span>
          <span class="info-label">Reserva:</span>
          <span class="info-value">
            {{ service.bookingRequired ? 'Requerida' : 'No requerida' }}
          </span>
        </div>
      </div>
    </div>

    <!-- Pricing -->
    <div class="service-pricing">
      <div v-if="service.free || service.price === 0" class="price-free">
        <span class="free-text">GRATIS</span>
        <span v-if="service.freeWithPurchase" class="free-condition">
          Con compra de lentes
        </span>
      </div>
      
      <div v-else class="price-display">
        <span v-if="service.discount && service.discount > 0" class="price-original">
          ${{ formatPrice(service.originalPrice) }}
        </span>
        <span class="price-current">
          ${{ formatPrice(service.price) }}
        </span>
      </div>
      
      <div v-if="service.discount && service.discount > 0" class="savings">
        Ahorras ${{ formatPrice(service.originalPrice - service.price) }}
      </div>
      
      <div v-if="service.freeWithPurchase" class="special-offer">
        <span class="offer-icon">🎁</span>
        <span class="offer-text">{{ service.pricing?.description || 'Gratis con compra' }}</span>
      </div>
    </div>

    <!-- Acciones del servicio -->
    <div class="service-actions">
      <button 
        v-if="service.bookingRequired"
        class="btn btn-primary book-service"
        @click="handleBookService"
        :disabled="isBooking"
      >
        <span v-if="!isBooking" class="btn-icon">📅</span>
        <span v-else class="btn-icon loading">⏳</span>
        <span class="btn-text">
          {{ isBooking ? 'Reservando...' : 'Reservar Cita' }}
        </span>
      </button>
      
      <button 
        v-else
        class="btn btn-primary request-service"
        @click="handleRequestService"
      >
        <span class="btn-icon">💬</span>
        <span class="btn-text">Solicitar Servicio</span>
      </button>

      <button 
        class="btn btn-ghost details-btn"
        @click="handleViewDetails"
      >
        <span class="btn-icon">ℹ️</span>
        <span class="btn-text">Más Información</span>
      </button>
      
      <button 
        v-if="allowShare"
        class="btn btn-ghost share-btn"
        @click="handleShareService"
      >
        <span class="btn-icon">📤</span>
        <span class="btn-text">Compartir</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { OpticalService } from '@/services/servicesService';

// Props del componente
interface Props {
  service: OpticalService;
  showBadges?: boolean;
  showDescription?: boolean;
  showDuration?: boolean;
  showRating?: boolean;
  showFeatures?: boolean;
  showIncludes?: boolean;
  showBenefits?: boolean;
  showAdditionalInfo?: boolean;
  maxFeatures?: number;
  maxIncludes?: number;
  maxBenefits?: number;
  allowShare?: boolean;
  variant?: 'default' | 'compact' | 'detailed';
}

const props = withDefaults(defineProps<Props>(), {
  showBadges: true,
  showDescription: true,
  showDuration: true,
  showRating: true,
  showFeatures: true,
  showIncludes: false,
  showBenefits: false,
  showAdditionalInfo: false,
  maxFeatures: 3,
  maxIncludes: 3,
  maxBenefits: 2,
  allowShare: true,
  variant: 'default'
});

// Eventos que emite el componente
const emit = defineEmits<{
  bookService: [service: OpticalService];
  requestService: [service: OpticalService];
  viewDetails: [service: OpticalService];
  shareService: [service: OpticalService];
  showMoreFeatures: [service: OpticalService];
  showMoreIncludes: [service: OpticalService];
  serviceClick: [service: OpticalService];
}>();

// Estado reactivo local
const isBooking = ref(false);

// Computed properties
const isPremium = computed(() => {
  return props.service.subscription || props.service.warranty || 
         props.service.category === 'Premium' || props.service.price > 100000;
});

// Métodos
const handleServiceClick = (): void => {
  emit('serviceClick', props.service);
};

const handleBookService = async (): Promise<void> => {
  isBooking.value = true;
  
  try {
    emit('bookService', props.service);
    
    // Simular delay de reserva
    await new Promise(resolve => setTimeout(resolve, 1500));
  } catch (error) {
    console.error('Error booking service:', error);
  } finally {
    isBooking.value = false;
  }
};

const handleRequestService = (): void => {
  emit('requestService', props.service);
};

const handleViewDetails = (): void => {
  emit('viewDetails', props.service);
};

const handleShareService = (): void => {
  emit('shareService', props.service);
};

const handleShowMoreFeatures = (): void => {
  emit('showMoreFeatures', props.service);
};

const handleShowMoreIncludes = (): void => {
  emit('showMoreIncludes', props.service);
};

const truncateDescription = (description: string): string => {
  const maxLength = props.variant === 'compact' ? 80 : 150;
  return description.length > maxLength 
    ? description.substring(0, maxLength) + '...'
    : description;
};

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('es-CO', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
};
</script>

<style scoped>
.service-card {
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: var(--border-radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-normal);
  position: relative;
  height: 100%;
  border: 1px solid var(--gray-200);
}

.service-card:hover {
  box-shadow: var(--shadow-xl);
  transform: translateY(-4px);
}

.card-featured {
  border: 2px solid var(--primary-color);
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.02) 0%, rgba(99, 102, 241, 0.05) 100%);
}

.card-free {
  border: 2px solid var(--secondary-color);
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.02) 0%, rgba(16, 185, 129, 0.05) 100%);
}

.card-premium {
  border: 2px solid var(--accent-color);
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.02) 0%, rgba(245, 158, 11, 0.05) 100%);
}

/* Badges */
.service-badges {
  position: absolute;
  top: var(--spacing-sm);
  left: var(--spacing-sm);
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.badge {
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-full);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  color: white;
  backdrop-filter: blur(4px);
  box-shadow: var(--shadow-sm);
}

.badge-free {
  background: var(--secondary-color);
}

.badge-discount {
  background: var(--error-color);
}

.badge-featured {
  background: var(--primary-color);
}

.badge-premium {
  background: var(--accent-color);
}

.badge-offer {
  background: linear-gradient(45deg, var(--accent-color), var(--secondary-color));
}

/* Icono del servicio */
.service-icon {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 120px;
  background: var(--gray-50);
  overflow: hidden;
}

.icon-display {
  font-size: 3.5rem;
  z-index: 2;
  position: relative;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
}

.icon-background {
  position: absolute;
  top: -20px;
  right: -20px;
  width: 80px;
  height: 80px;
  background: var(--primary-color);
  opacity: 0.1;
  border-radius: 50%;
  transition: all var(--transition-normal);
}

.service-card:hover .icon-background {
  transform: scale(1.2);
  opacity: 0.15;
}

/* Información del servicio */
.service-info {
  padding: var(--spacing-lg);
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.service-category {
  display: flex;
  align-items: center;
}

.category-text {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  color: var(--primary-color);
  background: rgba(99, 102, 241, 0.1);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-full);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.service-name {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--gray-900);
  line-height: 1.2;
  margin: 0;
  cursor: pointer;
  transition: color var(--transition-fast);
}

.service-name:hover {
  color: var(--primary-color);
}

.service-description {
  font-size: var(--font-size-base);
  color: var(--gray-600);
  line-height: 1.5;
  margin: 0;
}

.service-duration {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-size-sm);
  color: var(--gray-700);
}

.duration-icon {
  font-size: var(--font-size-base);
}

.duration-text {
  font-weight: var(--font-weight-medium);
}

/* Rating */
.service-rating {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.rating-stars {
  display: flex;
  gap: 1px;
}

.star {
  font-size: var(--font-size-sm);
  opacity: 0.3;
  transition: opacity var(--transition-fast);
}

.star-filled {
  opacity: 1;
}

.rating-value {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--gray-700);
}

.rating-count {
  font-size: var(--font-size-xs);
  color: var(--gray-500);
}

/* Características */
.service-features {
  margin: var(--spacing-sm) 0;
}

.features-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.feature-item {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-xs);
}

.feature-icon {
  color: var(--secondary-color);
  font-size: var(--font-size-sm);
  font-weight: bold;
  margin-top: 2px;
  flex-shrink: 0;
}

.feature-text {
  font-size: var(--font-size-sm);
  color: var(--gray-700);
  line-height: 1.4;
}

.show-more-features {
  background: none;
  border: none;
  color: var(--primary-color);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  margin-top: var(--spacing-xs);
  transition: color var(--transition-fast);
}

.show-more-features:hover {
  color: var(--primary-dark);
  text-decoration: underline;
}

/* Incluye */
.service-includes {
  margin: var(--spacing-md) 0;
}

.includes-title {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--gray-800);
  margin: 0 0 var(--spacing-sm) 0;
}

.includes-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.include-item {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-xs);
}

.include-icon {
  font-size: var(--font-size-sm);
  color: var(--primary-color);
  margin-top: 1px;
  flex-shrink: 0;
}

.include-text {
  font-size: var(--font-size-xs);
  color: var(--gray-600);
  line-height: 1.3;
}

.show-more-includes {
  background: none;
  border: none;
  color: var(--primary-color);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  margin-top: var(--spacing-sm);
  transition: color var(--transition-fast);
}

.show-more-includes:hover {
  color: var(--primary-dark);
  text-decoration: underline;
}

/* Beneficios */
.service-benefits {
  margin: var(--spacing-md) 0;
}

.benefits-title {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--gray-800);
  margin: 0 0 var(--spacing-sm) 0;
}

.benefits-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.benefit-item {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-xs);
}

.benefit-icon {
  font-size: var(--font-size-sm);
  color: var(--accent-color);
  margin-top: 1px;
  flex-shrink: 0;
}

.benefit-text {
  font-size: var(--font-size-xs);
  color: var(--gray-600);
  line-height: 1.3;
}

/* Información adicional */
.additional-info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  margin: var(--spacing-sm) 0;
  padding: var(--spacing-sm);
  background: var(--gray-50);
  border-radius: var(--border-radius-md);
}

.info-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.info-icon {
  font-size: var(--font-size-sm);
  color: var(--gray-500);
}

.info-label {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  color: var(--gray-600);
}

.info-value {
  font-size: var(--font-size-xs);
  color: var(--gray-700);
}

/* Precios */
.service-pricing {
  padding: var(--spacing-lg);
  border-top: 1px solid var(--gray-200);
  background: var(--gray-50);
}

.price-free {
  text-align: center;
  margin-bottom: var(--spacing-md);
}

.free-text {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-extrabold);
  color: var(--secondary-color);
  display: block;
  line-height: 1;
}

.free-condition {
  font-size: var(--font-size-xs);
  color: var(--gray-600);
  margin-top: var(--spacing-xs);
  display: block;
}

.price-display {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  justify-content: center;
  margin-bottom: var(--spacing-sm);
}

.price-original {
  font-size: var(--font-size-lg);
  color: var(--gray-500);
  text-decoration: line-through;
}

.price-current {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--gray-900);
}

.savings {
  font-size: var(--font-size-sm);
  color: var(--secondary-color);
  font-weight: var(--font-weight-medium);
  text-align: center;
  margin-bottom: var(--spacing-sm);
}

.special-offer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-xs);
  background: linear-gradient(45deg, var(--accent-color), var(--secondary-color));
  color: white;
  padding: var(--spacing-sm);
  border-radius: var(--border-radius-md);
  margin: var(--spacing-md) 0;
}

.offer-icon {
  font-size: var(--font-size-base);
}

.offer-text {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  text-align: center;
}

/* Acciones del servicio */
.service-actions {
  padding: var(--spacing-lg);
  padding-top: 0;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  margin-top: auto;
}

.book-service,
.request-service,
.details-btn,
.share-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  font-weight: var(--font-weight-medium);
}

.btn-icon.loading {
  animation: pulse 1s infinite;
}

/* Responsive */
@media (max-width: 768px) {
  .service-info {
    padding: var(--spacing-md);
  }

  .service-pricing {
    padding: var(--spacing-md);
  }

  .service-actions {
    padding: var(--spacing-md);
    padding-top: 0;
  }

  .service-icon {
    height: 100px;
  }

  .icon-display {
    font-size: 3rem;
  }
}
</style>
