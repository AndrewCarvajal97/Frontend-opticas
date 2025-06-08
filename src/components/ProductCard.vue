<!--
  Componente Product Card
  Tarjeta reutilizable para mostrar productos
  Implementa principios SOLID y Clean Architecture
-->

<template>
  <div 
    class="product-card"
    :class="{ 
      'card-featured': featured,
      'card-sale': onSale,
      'card-new': isNew,
      'card-out-of-stock': !product.inStock
    }"
  >
    <!-- Badge de estado -->
    <div v-if="showBadges" class="product-badges">
      <span v-if="!product.inStock" class="badge badge-stock">
        Agotado
      </span>
      <span v-else-if="product.discount > 0" class="badge badge-discount">
        -{{ product.discount }}%
      </span>
      <span v-else-if="isNew" class="badge badge-new">
        Nuevo
      </span>
      <span v-if="featured" class="badge badge-featured">
        ⭐ Destacado
      </span>
    </div>

    <!-- Imagen del producto -->
    <div class="product-image" @click="handleImageClick">
      <img 
        :src="currentImage"
        :alt="product.name"
        class="product-img"
        @error="handleImageError"
        @load="handleImageLoad"
      />
      
      <!-- Indicadores de imagen múltiple -->
      <div v-if="product.images.length > 1" class="image-indicators">
        <button
          v-for="(image, index) in product.images"
          :key="index"
          class="indicator-dot"
          :class="{ 'dot-active': currentImageIndex === index }"
          @click.stop="setCurrentImage(index)"
        ></button>
      </div>

      <!-- Overlay de acciones -->
      <div class="product-overlay">
        <div class="overlay-actions">
          <button 
            class="action-btn quick-view"
            @click.stop="handleQuickView"
            title="Vista rápida"
          >
            <span class="btn-icon">👁️</span>
          </button>
          
          <button 
            class="action-btn add-to-wishlist"
            @click.stop="handleWishlist"
            title="Agregar a favoritos"
          >
            <span class="btn-icon">❤️</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Información del producto -->
    <div class="product-info">
      <!-- Marca y categoría -->
      <div class="product-meta">
        <span class="product-brand">{{ product.brand }}</span>
        <span class="product-category">{{ getCategoryName(product.category) }}</span>
      </div>

      <!-- Nombre del producto -->
      <h3 class="product-name" @click="handleProductClick">
        {{ product.name }}
      </h3>

      <!-- Descripción breve -->
      <p v-if="showDescription" class="product-description">
        {{ truncateDescription(product.description) }}
      </p>

      <!-- Rating y reviews -->
      <div v-if="showRating" class="product-rating">
        <div class="rating-stars">
          <span 
            v-for="star in 5"
            :key="star"
            class="star"
            :class="{ 'star-filled': star <= Math.floor(product.rating) }"
          >
            ⭐
          </span>
        </div>
        <span class="rating-value">{{ product.rating.toFixed(1) }}</span>
        <span class="rating-count">({{ product.reviews }})</span>
      </div>

      <!-- Opciones de producto -->
      <div v-if="showOptions && hasOptions" class="product-options">
        <!-- Colores disponibles -->
        <div v-if="product.colors && product.colors.length > 0" class="color-options">
          <span class="options-label">Colores:</span>
          <div class="color-swatches">
            <button
              v-for="color in product.colors.slice(0, 4)"
              :key="color"
              class="color-swatch"
              :class="{ 'swatch-selected': selectedColor === color }"
              :title="color"
              @click="handleColorSelect(color)"
            >
              <span class="color-indicator" :style="{ backgroundColor: getColorValue(color) }"></span>
            </button>
            <span v-if="product.colors.length > 4" class="more-colors">
              +{{ product.colors.length - 4 }}
            </span>
          </div>
        </div>

        
      </div>

      <!-- Características destacadas -->
      <div v-if="showFeatures && product.features.length > 0" class="product-features">
        <ul class="features-list">
          <li 
            v-for="feature in product.features.slice(0, 2)"
            :key="feature"
            class="feature-item"
          >
            <span class="feature-icon">✓</span>
            <span class="feature-text">{{ feature }}</span>
          </li>
        </ul>
      </div>

      <!-- Pricing -->
      <div class="product-pricing">
        <div class="price-display">
          <span v-if="product.discount > 0" class="price-original">
            ${{ formatPrice(product.originalPrice || product.price) }}
          </span>
          <span class="price-current">
            ${{ formatPrice(product.price) }}
          </span>
        </div>
        
        <div v-if="product.discount > 0" class="savings">
          Ahorras ${{ formatPrice((product.originalPrice || product.price) - product.price) }}
        </div>
      </div>

      <!-- Stock indicator -->
      <div v-if="showStock" class="stock-indicator">
        <div class="stock-bar">
          <div 
            class="stock-fill"
            :style="{ width: `${stockPercentage}%` }"
            :class="{
              'stock-low': stockPercentage < 25,
              'stock-medium': stockPercentage >= 25 && stockPercentage < 50,
              'stock-good': stockPercentage >= 50
            }"
          ></div>
        </div>
        <span class="stock-text">
          {{ product.inStock ? `${product.stockQuantity} disponibles` : 'Agotado' }}
        </span>
      </div>
    </div>

    <!-- Acciones del producto -->
    <div class="product-actions">
      <button 
        v-if="product.inStock"
        class="btn btn-primary add-to-cart"
        @click="handleAddToCart"
        :disabled="isAddingToCart"
      >
        <span v-if="!isAddingToCart" class="btn-icon">🛒</span>
        <span v-else class="btn-icon loading">⏳</span>
        <span class="btn-text">
          {{ isAddingToCart ? 'Agregando...' : 'Agregar al Carrito' }}
        </span>
      </button>
      
      <button 
        v-else
        class="btn btn-outline notify-btn"
        @click="handleNotifyStock"
      >
        <span class="btn-icon">🔔</span>
        <span class="btn-text">Notificarme</span>
      </button>

      <button 
        class="btn btn-ghost details-btn"
        @click="handleViewDetails"
      >
        <span class="btn-icon">👁️</span>
        <span class="btn-text">Ver Detalles</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Product } from '@/services/productsService';

// Props del componente
interface Props {
  product: Product;
  featured?: boolean;
  onSale?: boolean;
  isNew?: boolean;
  showBadges?: boolean;
  showDescription?: boolean;
  showRating?: boolean;
  showOptions?: boolean;
  showFeatures?: boolean;
  showStock?: boolean;
  variant?: 'default' | 'compact' | 'detailed';
}

const props = withDefaults(defineProps<Props>(), {
  featured: false,
  onSale: false,
  isNew: false,
  showBadges: true,
  showDescription: true,
  showRating: true,
  showOptions: true,
  showFeatures: false,
  showStock: true,
  variant: 'default'
});

// Eventos que emite el componente
const emit = defineEmits<{
  addToCart: [product: Product, options: any];
  viewDetails: [product: Product];
  quickView: [product: Product];
  wishlist: [product: Product];
  notifyStock: [product: Product];
  colorSelect: [color: string];
  sizeSelect: [size: string];
  imageClick: [product: Product];
}>();

// Estado reactivo local
const currentImageIndex = ref(0);
const selectedColor = ref<string>('');
const selectedSize = ref<string>('');
const isAddingToCart = ref(false);

// Computed properties
const currentImage = computed(() => {
  return props.product.images[currentImageIndex.value] ;
});

const hasOptions = computed(() => {
  return (props.product.colors && props.product.colors.length > 0) ||
         (props.product.sizes && props.product.sizes.length > 0);
});

const stockPercentage = computed(() => {
  if (!props.product.inStock) return 0;
  // Asumimos un stock máximo de 100 para el cálculo del porcentaje
  const maxStock = 100;
  return Math.min((props.product.stockQuantity / maxStock) * 100, 100);
});

// Métodos
const handleImageClick = (): void => {
  emit('imageClick', props.product);
};

const handleImageError = (event: Event): void => {
  const img = event.target as HTMLImageElement;
  img.src = 'src/assets/image/monturas/mujer/COD(0001).webp'; // Imagen por defecto
};

const handleImageLoad = (): void => {
  // Imagen cargada correctamente
};

const setCurrentImage = (index: number): void => {
  currentImageIndex.value = index;
};

const handleQuickView = (): void => {
  emit('quickView', props.product);
};

const handleWishlist = (): void => {
  emit('wishlist', props.product);
};

const handleProductClick = (): void => {
  emit('viewDetails', props.product);
};

const handleColorSelect = (color: string): void => {
  selectedColor.value = color;
  emit('colorSelect', color);
};

const handleSizeSelect = (size: string): void => {
  selectedSize.value = size;
  emit('sizeSelect', size);
};

const handleAddToCart = async (): Promise<void> => {
  isAddingToCart.value = true;
  
  try {
    const options = {
      selectedColor: selectedColor.value,
      selectedSize: selectedSize.value
    };
    
    emit('addToCart', props.product, options);
    
    // Simular delay de agregado
    await new Promise(resolve => setTimeout(resolve, 1000));
  } catch (error) {
    console.error('Error adding to cart:', error);
  } finally {
    isAddingToCart.value = false;
  }
};

const handleViewDetails = (): void => {
  emit('viewDetails', props.product);
};

const handleNotifyStock = (): void => {
  emit('notifyStock', props.product);
};

const truncateDescription = (description: string): string => {
  const maxLength = props.variant === 'compact' ? 60 : 120;
  return description.length > maxLength 
    ? description.substring(0, maxLength) + '...'
    : description;
};

const getCategoryName = (categoryId: string): string => {
  const categories = {
    'monturas': 'Monturas',
    'lentes': 'Lentes',
    'gafas-sol': 'Gafas de Sol',
    'accesorios': 'Accesorios'
  };
  return categories[categoryId as keyof typeof categories] || categoryId;
};

const getColorValue = (colorName: string): string => {
  const colorMap = {
    'Negro': '#000000',
    'Blanco': '#FFFFFF',
    'Dorado': '#FFD700',
    'Plateado': '#C0C0C0',
    'Marrón': '#8B4513',
    'Azul': '#0000FF',
    'Rojo': '#FF0000',
    'Verde': '#008000',
    'Rosa': '#FFC0CB',
    'Naranja': '#FFA500'
  };
  return colorMap[colorName as keyof typeof colorMap] || '#CCCCCC';
};

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('es-CO', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
};
</script>

<style scoped>
.product-card {
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: var(--border-radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-normal);
  position: relative;
  height: 100%;
}

.product-card:hover {
  box-shadow: var(--shadow-xl);
  transform: translateY(-4px);
}

.card-featured {
  border: 2px solid var(--primary-color);
}

.card-out-of-stock {
  opacity: 0.7;
}

/* Badges */
.product-badges {
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
}

.badge-discount {
  background: var(--error-color);
}

.badge-new {
  background: var(--secondary-color);
}

.badge-featured {
  background: var(--accent-color);
}

.badge-stock {
  background: var(--gray-600);
}

/* Imagen del producto */
.product-image {
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
  cursor: pointer;
  background: var(--gray-100);
}

.product-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-normal);
}

.product-card:hover .product-img {
  transform: scale(1.05);
}

.image-indicators {
  position: absolute;
  bottom: var(--spacing-sm);
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: var(--spacing-xs);
}

.indicator-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  border: none;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.dot-active {
  background: white;
  transform: scale(1.2);
}

.product-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity var(--transition-normal);
}

.product-card:hover .product-overlay {
  opacity: 1;
}

.overlay-actions {
  display: flex;
  gap: var(--spacing-sm);
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: all var(--transition-fast);
  box-shadow: var(--shadow-md);
}

.action-btn:hover {
  background: var(--primary-color);
  color: white;
  transform: scale(1.1);
}

/* Información del producto */
.product-info {
  padding: var(--spacing-lg);
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.product-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.product-brand {
  font-size: var(--font-size-sm);
  color: var(--primary-color);
  font-weight: var(--font-weight-semibold);
}

.product-category {
  font-size: var(--font-size-xs);
  color: var(--gray-500);
  background: var(--gray-100);
  padding: 2px var(--spacing-xs);
  border-radius: var(--border-radius-sm);
}

.product-name {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--gray-900);
  line-height: 1.3;
  margin: 0;
  cursor: pointer;
  transition: color var(--transition-fast);
}

.product-name:hover {
  color: var(--primary-color);
}

.product-description {
  font-size: var(--font-size-sm);
  color: var(--gray-600);
  line-height: 1.4;
  margin: 0;
}

/* Rating */
.product-rating {
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

/* Opciones del producto */
.product-options {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.color-options,
.size-options {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.options-label {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  color: var(--gray-600);
  min-width: 50px;
}

.color-swatches {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.color-swatch {
  width: 20px;
  height: 20px;
  border: 2px solid transparent;
  border-radius: 50%;
  cursor: pointer;
  transition: all var(--transition-fast);
  background: none;
  padding: 2px;
}

.swatch-selected {
  border-color: var(--primary-color);
}

.color-indicator {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 1px solid var(--gray-300);
}

.size-buttons {
  display: flex;
  gap: var(--spacing-xs);
  align-items: center;
}

.size-button {
  padding: var(--spacing-xs) var(--spacing-sm);
  border: 1px solid var(--gray-300);
  background: white;
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-xs);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.size-button:hover,
.size-selected {
  border-color: var(--primary-color);
  background: var(--primary-color);
  color: white;
}

.more-colors,
.more-sizes {
  font-size: var(--font-size-xs);
  color: var(--gray-500);
}

/* Características */
.product-features {
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
  align-items: center;
  gap: var(--spacing-xs);
}

.feature-icon {
  color: var(--secondary-color);
  font-size: var(--font-size-xs);
  font-weight: bold;
}

.feature-text {
  font-size: var(--font-size-xs);
  color: var(--gray-600);
}

/* Precios */
.product-pricing {
  margin: var(--spacing-md) 0;
}

.price-display {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-xs);
}

.price-original {
  font-size: var(--font-size-base);
  color: var(--gray-500);
  text-decoration: line-through;
}

.price-current {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--gray-900);
}

.savings {
  font-size: var(--font-size-xs);
  color: var(--secondary-color);
  font-weight: var(--font-weight-medium);
}

/* Stock indicator */
.stock-indicator {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.stock-bar {
  height: 4px;
  background: var(--gray-200);
  border-radius: 2px;
  overflow: hidden;
}

.stock-fill {
  height: 100%;
  transition: width var(--transition-normal);
  border-radius: 2px;
}

.stock-low {
  background: var(--error-color);
}

.stock-medium {
  background: var(--warning-color);
}

.stock-good {
  background: var(--secondary-color);
}

.stock-text {
  font-size: var(--font-size-xs);
  color: var(--gray-600);
}

/* Acciones del producto */
.product-actions {
  padding: var(--spacing-lg);
  padding-top: 0;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  margin-top: auto;
}

.add-to-cart,
.notify-btn,
.details-btn {
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
  .product-info {
    padding: var(--spacing-md);
  }

  .product-actions {
    padding: var(--spacing-md);
    padding-top: 0;
  }

  .overlay-actions {
    display: none;
  }

  .product-overlay {
    display: none;
  }
}
</style>
