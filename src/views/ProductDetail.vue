<!--
  Vista Detalle de Producto
  Muestra información detallada de un producto específico
-->

<template>
  <div class="product-detail-page">
    <div class="container">
      <div v-if="isLoading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Cargando producto...</p>
      </div>

      <div v-else-if="!product" class="error-state">
        <h1>Producto no encontrado</h1>
        <p>El producto que buscas no existe o ha sido eliminado.</p>
        <router-link to="/productos" class="btn btn-primary">
          Ver Todos los Productos
        </router-link>
      </div>

      <div v-else class="product-detail-content">
        <!-- Breadcrumb -->
        <nav class="breadcrumb">
          <router-link to="/">Inicio</router-link>
          <span class="separator">›</span>
          <router-link to="/productos">Productos</router-link>
          <span class="separator">›</span>
          <span class="current">{{ product.name }}</span>
        </nav>

        <!-- Contenido del producto -->
        <div class="product-detail-main">
          <!-- Imágenes del producto -->
          <div class="product-images">
            <div class="main-image">
              <img :src="currentImage" :alt="product.name" />
            </div>
            <div v-if="product.images.length > 1" class="image-thumbnails">
              <button
                v-for="(image, index) in product.images"
                :key="index"
                @click="currentImage = image"
                :class="{ active: currentImage === image }"
                class="thumbnail"
              >
                <img :src="image" :alt="`${product.name} - imagen ${index + 1}`" />
              </button>
            </div>
          </div>

          <!-- Información del producto -->
          <div class="product-info">
            <h1 class="product-title">{{ product.name }}</h1>
            <p class="product-brand">{{ product.brand }}</p>
            
            <div class="product-pricing">
              <span class="current-price">${{ formatPrice(product.price) }}</span>
              <span v-if="product.originalPrice > product.price" class="original-price">
                ${{ formatPrice(product.originalPrice) }}
              </span>
              <span v-if="product.discount > 0" class="discount-badge">
                -{{ product.discount }}%
              </span>
            </div>

            <div class="product-description">
              <p>{{ product.description }}</p>
            </div>

            <!-- Opciones del producto -->
            <div class="product-options">
              <div v-if="product.colors && product.colors.length > 0" class="option-group">
                <label class="option-label">Color:</label>
                <div class="color-options">
                  <button
                    v-for="color in product.colors"
                    :key="color"
                    @click="selectedColor = color"
                    :class="{ active: selectedColor === color }"
                    class="color-option"
                  >
                    {{ color }}
                  </button>
                </div>
              </div>

              
            </div>

            <!-- Acciones del producto -->
            <div class="product-actions">
              <button
                @click="handleAddToCart"
                :disabled="!product.inStock"
                class="btn btn-primary btn-lg add-to-cart-btn"
              >
                <span class="btn-icon">🛒</span>
                <span class="btn-text">
                  {{ product.inStock ? 'Agregar al Carrito' : 'Agotado' }}
                </span>
              </button>
              
              <button @click="handleWishlist" class="btn btn-outline btn-lg">
                <span class="btn-icon">❤️</span>
                <span class="btn-text">Favoritos</span>
              </button>
            </div>

            <!-- Información adicional -->
            <div class="product-features">
              <h3>Características:</h3>
              <ul>
                <li v-for="feature in product.features" :key="feature">
                  {{ feature }}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Renderizador 3D -->
        <div class="product-3d-renderer">
          <h2>Renderizador 3D</h2>
          <p>Estamos trabajando en esta funcionalidad.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useShoppingCart } from '@/composables/useShoppingCart';
import { useNotifications } from '@/composables/useNotifications';
import { productsService, type Product } from '@/services/productsService';

const route = useRoute();
const { addToCart } = useShoppingCart();
const { showSuccess, showError } = useNotifications();

// Estado reactivo
const isLoading = ref(true);
const product = ref<Product | null>(null);
const currentImage = ref('');
const selectedColor = ref('');
const selectedSize = ref('');

// Computed
const productId = computed(() => route.params.id as string);

// Métodos
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('es-CO').format(price);
};

const loadProduct = async (): Promise<void> => {
  try {
    isLoading.value = true;
    const response = await productsService.getProductById(productId.value);
    
    if (response.success && response.data) {
      product.value = response.data;
      currentImage.value = response.data.images[0] || '/placeholder-product.jpg';
      
      // Seleccionar opciones por defecto
      if (response.data.colors && response.data.colors.length > 0) {
        selectedColor.value = response.data.colors[0];
      }
      if (response.data.sizes && response.data.sizes.length > 0) {
        selectedSize.value = response.data.sizes[0];
      }
    } else {
      product.value = null;
    }
  } catch (error) {
    console.error('Error loading product:', error);
    showError('Error', 'No se pudo cargar el producto');
    product.value = null;
  } finally {
    isLoading.value = false;
  }
};

const handleAddToCart = (): void => {
  if (!product.value) return;

  const options = {
    selectedColor: selectedColor.value,
    selectedSize: selectedSize.value
  };

  const success = addToCart(product.value, 1, options);
  
  if (success) {
    showSuccess('¡Agregado!', `${product.value.name} se agregó al carrito`);
  } else {
    showError('Error', 'No se pudo agregar el producto al carrito');
  }
};

const handleWishlist = (): void => {
  if (!product.value) return;
  showSuccess('❤️ Agregado', `${product.value.name} se agregó a favoritos`);
};

// Lifecycle
onMounted(() => {
  loadProduct();
});
</script>

<style scoped>
.product-detail-page {
  padding: var(--spacing-2xl) 0;
  min-height: 100vh;
}

.loading-state,
.error-state {
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
}

.product-detail-main {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-3xl);
  align-items: start;
}

/* Imágenes del producto */
.product-images {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.main-image img {
  width: 100%;
  height: 500px;
  object-fit: cover;
  border-radius: var(--border-radius-xl);
  box-shadow: var(--shadow-lg);
}

.image-thumbnails {
  display: flex;
  gap: var(--spacing-sm);
  overflow-x: auto;
}

.thumbnail {
  width: 80px;
  height: 80px;
  border: 2px solid transparent;
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  cursor: pointer;
  transition: all var(--transition-fast);
  background: none;
  padding: 0;
}

.thumbnail:hover,
.thumbnail.active {
  border-color: var(--primary-color);
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Información del producto */
.product-info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.product-title {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--gray-900);
  margin: 0;
}

.product-brand {
  font-size: var(--font-size-lg);
  color: var(--gray-600);
  font-weight: var(--font-weight-medium);
  margin: 0;
}

.product-pricing {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.current-price {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--primary-color);
}

.original-price {
  font-size: var(--font-size-lg);
  color: var(--gray-500);
  text-decoration: line-through;
}

.discount-badge {
  background: var(--error-color);
  color: white;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-md);
}

.product-description {
  font-size: var(--font-size-base);
  line-height: 1.6;
  color: var(--gray-700);
}

/* Opciones del producto */
.product-options {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.option-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.option-label {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--gray-800);
}

.color-options,
.size-options {
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

.color-option,
.size-option {
  padding: var(--spacing-sm) var(--spacing-md);
  border: 2px solid var(--gray-300);
  border-radius: var(--border-radius-lg);
  background: white;
  color: var(--gray-700);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.color-option:hover,
.size-option:hover,
.color-option.active,
.size-option.active {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

/* Acciones del producto */
.product-actions {
  display: flex;
  gap: var(--spacing-md);
}

.add-to-cart-btn {
  flex: 1;
}

/* Características */
.product-features h3 {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--gray-800);
  margin: 0 0 var(--spacing-sm) 0;
}

.product-features ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.product-features li {
  padding: var(--spacing-xs) 0;
  color: var(--gray-700);
  position: relative;
  padding-left: var(--spacing-lg);
}

.product-features li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: var(--success-color);
  font-weight: var(--font-weight-bold);
}

/* Renderizador 3D */
.product-3d-renderer {
  margin-top: 2rem;
  text-align: center;
  padding: 1rem;
  background-color: #f9f9f9;
}

/* Responsive */
@media (max-width: 768px) {
  .product-detail-main {
    grid-template-columns: 1fr;
    gap: var(--spacing-xl);
  }

  .main-image img {
    height: 300px;
  }

  .product-actions {
    flex-direction: column;
  }

  .breadcrumb {
    font-size: var(--font-size-xs);
    overflow-x: auto;
    white-space: nowrap;
  }

  .product-title {
    font-size: var(--font-size-2xl);
  }
}
</style>
