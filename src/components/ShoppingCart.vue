<!--
  Componente Shopping Cart
  Panel lateral deslizante para mostrar y gestionar el carrito
  Implementa principios SOLID y Clean Architecture
-->

<template>
  <!-- Overlay -->
  <div 
    v-if="isOpen"
    class="cart-overlay"
    @click="handleClose"
  ></div>

  <!-- Panel del carrito -->
  <div 
    class="cart-panel"
    :class="{ 'cart-open': isOpen }"
  >
    <!-- Header del carrito -->
    <div class="cart-header">
      <div class="cart-title">
        <h3 class="title-text">
          <span class="title-icon">🛒</span>
          Mi Carrito
          <span v-if="itemCount > 0" class="item-count">({{ itemCount }})</span>
        </h3>
      </div>
      
      <button 
        class="close-button"
        @click="handleClose"
        aria-label="Cerrar carrito"
      >
        <span class="close-icon">✕</span>
      </button>
    </div>

    <!-- Contenido del carrito -->
    <div class="cart-content">
      <!-- Carrito vacío -->
      <div v-if="isEmpty" class="cart-empty">
        <div class="empty-illustration">
          <span class="empty-icon">🛒</span>
          <div class="empty-lines">
            <div class="empty-line"></div>
            <div class="empty-line"></div>
            <div class="empty-line"></div>
          </div>
        </div>
        
        <h4 class="empty-title">Tu carrito está vacío</h4>
        <p class="empty-description">
          ¡Descubre nuestros increíbles productos y servicios!
        </p>
        
        <button 
          class="btn btn-primary empty-cta"
          @click="handleShopNow"
        >
          <span class="btn-icon">👓</span>
          <span class="btn-text">Ver Productos</span>
        </button>
      </div>

      <!-- Items del carrito -->
      <div v-else class="cart-items">
        <div class="items-list">
          <div 
            v-for="item in items"
            :key="item.id"
            class="cart-item"
            :class="{ 'item-removing': removingItems.includes(item.id) }"
          >
            <!-- Imagen del producto -->
            <div class="item-image">
              <img 
                :src="item.product.images[0] "
                :alt="item.product.name"
                class="product-image"
                @error="handleImageError"
              />
            </div>

            <!-- Información del item -->
            <div class="item-info">
              <h4 class="item-name">{{ item.product.name }}</h4>
              <p class="item-brand">{{ item.product.brand }}</p>
              
             

              <!-- Prescripción si aplica -->
              <div v-if="item.prescription" class="item-prescription">
                <span class="prescription-icon">👁️</span>
                <span class="prescription-text">Con prescripción médica</span>
              </div>

              <!-- Notas adicionales -->
              <p v-if="item.notes" class="item-notes">
                <span class="notes-icon">📝</span>
                {{ item.notes }}
              </p>
            </div>

            <!-- Controles del item -->
            <div class="item-controls">
              <!-- Precio -->
              <div class="item-pricing">
                <span v-if="item.product.discount > 0" class="price-original">
                  ${{ formatPrice(item.product.originalPrice || item.product.price) }}
                </span>
                <span class="price-current">
                  ${{ formatPrice(item.product.price) }}
                </span>
                <span v-if="item.product.discount > 0" class="discount-badge">
                  -{{ item.product.discount }}%
                </span>
              </div>

              <!-- Control de cantidad -->
              <div class="quantity-control">
                <button 
                  class="quantity-btn quantity-decrease"
                  @click="handleDecreaseQuantity(item.id)"
                  :disabled="item.quantity <= 1 || isUpdating"
                >
                  <span class="btn-icon">−</span>
                </button>
                
                <span class="quantity-display">{{ item.quantity }}</span>
                
                <button 
                  class="quantity-btn quantity-increase"
                  @click="handleIncreaseQuantity(item.id)"
                  :disabled="item.quantity >= item.product.stockQuantity || isUpdating"
                >
                  <span class="btn-icon">+</span>
                </button>
              </div>

              <!-- Botón eliminar -->
              <button 
                class="remove-btn"
                @click="handleRemoveItem(item.id)"
                :disabled="isUpdating"
                aria-label="Eliminar producto"
              >
                <span class="remove-icon">🗑️</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Resumen del carrito -->
        <div class="cart-summary">
          <div class="summary-section">
            <div class="summary-line">
              <span class="summary-label">Subtotal</span>
              <span class="summary-value">${{ formatPrice(cartSummary.subtotal) }}</span>
            </div>
            
            <div v-if="cartSummary.discount > 0" class="summary-line summary-discount">
              <span class="summary-label">
                <span class="discount-icon">🎉</span>
                Descuentos
              </span>
              <span class="summary-value">-${{ formatPrice(cartSummary.discount) }}</span>
            </div>
            
            <div class="summary-line">
              <span class="summary-label">Impuestos (IVA)</span>
              <span class="summary-value">${{ formatPrice(cartSummary.tax) }}</span>
            </div>
            
            <div class="summary-line">
              <span class="summary-label">
                Envío
                <span v-if="cartSummary.shipping === 0" class="free-badge">GRATIS</span>
              </span>
              <span class="summary-value">
                ${{ formatPrice(cartSummary.shipping) }}
              </span>
            </div>
            
            <div class="summary-line summary-total">
              <span class="summary-label">Total</span>
              <span class="summary-value">${{ formatPrice(cartSummary.total) }}</span>
            </div>
          </div>

          <!-- Botones de acción -->
          <div class="cart-actions">
            <button 
              class="btn btn-outline btn-lg continue-shopping"
              @click="handleContinueShopping"
            >
              <span class="btn-icon">🔄</span>
              <span class="btn-text">Seguir Comprando</span>
            </button>
            
            <button 
              class="btn btn-primary btn-lg checkout-btn"
              @click="handleCheckout"
              :disabled="!isValidCart || isProcessing"
            >
              <span v-if="!isProcessing" class="btn-icon">💳</span>
              <span v-else class="btn-icon loading">⏳</span>
              <span class="btn-text">
                {{ isProcessing ? 'Procesando...' : 'Finalizar Compra' }}
              </span>
            </button>
          </div>

          <!-- Información adicional -->
          <div class="cart-info">
            <div class="info-item">
              <span class="info-icon">🚚</span>
              <span class="info-text">
                Envío gratis en compras superiores a $200,000
              </span>
            </div>
            
            <div class="info-item">
              <span class="info-icon">🛡️</span>
              <span class="info-text">
                Compra 100% segura y protegida
              </span>
            </div>
            
            <div class="info-item">
              <span class="info-icon">↩️</span>
              <span class="info-text">
                30 días para cambios y devoluciones
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { CartItem, CartSummary } from '@/composables/useShoppingCart';

// Props del componente
interface Props {
  isOpen: boolean;
  items: CartItem[];
  cartSummary: CartSummary;
  isUpdating?: boolean;
  isProcessing?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isUpdating: false,
  isProcessing: false
});

// Eventos que emite el componente
const emit = defineEmits<{
  close: [];
  removeItem: [itemId: string];
  updateQuantity: [itemId: string, quantity: number];
  checkout: [];
  continueShopping: [];
  shopNow: [];
}>();

// Estado reactivo local
const removingItems = ref<string[]>([]);

// Computed properties
const isEmpty = computed(() => props.items.length === 0);
const itemCount = computed(() => props.cartSummary.itemCount);
const isValidCart = computed(() => props.items.length > 0 && !props.isUpdating);

// Métodos
const handleClose = (): void => {
  emit('close');
};

const handleRemoveItem = (itemId: string): void => {
  removingItems.value.push(itemId);
  
  // Simular animación de eliminación
  setTimeout(() => {
    emit('removeItem', itemId);
    removingItems.value = removingItems.value.filter(id => id !== itemId);
  }, 300);
};

const handleIncreaseQuantity = (itemId: string): void => {
  const item = props.items.find(item => item.id === itemId);
  if (item) {
    emit('updateQuantity', itemId, item.quantity + 1);
  }
};

const handleDecreaseQuantity = (itemId: string): void => {
  const item = props.items.find(item => item.id === itemId);
  if (item && item.quantity > 1) {
    emit('updateQuantity', itemId, item.quantity - 1);
  }
};

const handleCheckout = (): void => {
  emit('checkout');
};

const handleContinueShopping = (): void => {
  emit('continueShopping');
};

const handleShopNow = (): void => {
  emit('shopNow');
};

// Import the fallback image
import fallbackImage from '@/assets/image/monturas/mujer/COD(0001).webp';

const handleImageError = (event: Event): void => {
  const img = event.target as HTMLImageElement;
  img.src = fallbackImage; // Ruta de imagen por defecto
};

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('es-CO', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
};
</script>

<style scoped>
.cart-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: var(--z-modal-backdrop);
  backdrop-filter: blur(2px);
}

.cart-panel {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 450px;
  max-width: 90vw;
  background: white;
  z-index: var(--z-modal);
  transform: translateX(100%);
  transition: transform var(--transition-normal);
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-2xl);
}

.cart-open {
  transform: translateX(0);
}

/* Header */
.cart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--gray-200);
  background: var(--gray-50);
}

.cart-title {
  flex: 1;
}

.title-text {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin: 0;
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--gray-900);
}

.title-icon {
  font-size: var(--font-size-lg);
}

.item-count {
  color: var(--primary-color);
  font-size: var(--font-size-base);
}

.close-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: none;
  border: none;
  border-radius: var(--border-radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
  color: var(--gray-600);
}

.close-button:hover {
  background: var(--gray-200);
  color: var(--gray-900);
}

.close-icon {
  font-size: var(--font-size-lg);
  font-weight: bold;
}

/* Contenido */
.cart-content {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

/* Carrito vacío */
.cart-empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-3xl) var(--spacing-lg);
  text-align: center;
}

.empty-illustration {
  position: relative;
  margin-bottom: var(--spacing-xl);
}

.empty-icon {
  font-size: 4rem;
  opacity: 0.3;
  display: block;
}

.empty-lines {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.empty-line {
  width: 20px;
  height: 2px;
  background: var(--gray-300);
  border-radius: 1px;
}

.empty-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--gray-700);
  margin: 0 0 var(--spacing-sm) 0;
}

.empty-description {
  font-size: var(--font-size-base);
  color: var(--gray-500);
  margin: 0 0 var(--spacing-xl) 0;
  line-height: 1.5;
}

.empty-cta {
  gap: var(--spacing-sm);
}

/* Items del carrito */
.cart-items {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.items-list {
  flex: 1;
  padding: var(--spacing-lg);
}

.cart-item {
  display: flex;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  border: 1px solid var(--gray-200);
  border-radius: var(--border-radius-lg);
  margin-bottom: var(--spacing-md);
  transition: all var(--transition-normal);
  background: white;
}

.cart-item:hover {
  box-shadow: var(--shadow-md);
}

.item-removing {
  opacity: 0.5;
  transform: translateX(-10px);
}

.item-image {
  flex-shrink: 0;
  width: 80px;
  height: 80px;
  border-radius: var(--border-radius-md);
  overflow: hidden;
  background: var(--gray-100);
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.item-name {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--gray-900);
  margin: 0;
  line-height: 1.3;
}

.item-brand {
  font-size: var(--font-size-sm);
  color: var(--gray-600);
  margin: 0;
}

.item-options {
  display: flex;
  gap: var(--spacing-xs);
  flex-wrap: wrap;
}

.option-tag {
  display: flex;
  gap: var(--spacing-xs);
  font-size: var(--font-size-xs);
  background: var(--gray-100);
  padding: 2px var(--spacing-xs);
  border-radius: var(--border-radius-sm);
}

.option-label {
  color: var(--gray-600);
  font-weight: var(--font-weight-medium);
}

.option-value {
  color: var(--gray-900);
  font-weight: var(--font-weight-semibold);
}

.item-prescription,
.item-notes {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-size-xs);
  color: var(--gray-600);
  margin: 0;
}

.prescription-icon,
.notes-icon {
  font-size: var(--font-size-sm);
}

.item-controls {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: var(--spacing-sm);
}

.item-pricing {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: var(--spacing-xs);
}

.price-original {
  font-size: var(--font-size-sm);
  color: var(--gray-500);
  text-decoration: line-through;
}

.price-current {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--gray-900);
}

.discount-badge {
  font-size: var(--font-size-xs);
  background: var(--error-color);
  color: white;
  padding: 2px var(--spacing-xs);
  border-radius: var(--border-radius-sm);
  font-weight: var(--font-weight-bold);
}

.quantity-control {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  background: var(--gray-100);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-xs);
}

.quantity-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: white;
  border: 1px solid var(--gray-300);
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
  font-weight: var(--font-weight-bold);
}

.quantity-btn:hover:not(:disabled) {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.quantity-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity-display {
  min-width: 30px;
  text-align: center;
  font-weight: var(--font-weight-semibold);
  color: var(--gray-900);
}

.remove-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: none;
  border: none;
  border-radius: var(--border-radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
  color: var(--gray-500);
}

.remove-btn:hover:not(:disabled) {
  background: var(--error-color);
  color: white;
}

.remove-icon {
  font-size: var(--font-size-sm);
}

/* Resumen del carrito */
.cart-summary {
  border-top: 1px solid var(--gray-200);
  background: var(--gray-50);
  padding: var(--spacing-lg);
}

.summary-section {
  margin-bottom: var(--spacing-lg);
}

.summary-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-sm) 0;
}

.summary-line:not(:last-child) {
  border-bottom: 1px solid var(--gray-200);
}

.summary-total {
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-lg);
  color: var(--gray-900);
  background: white;
  margin: var(--spacing-sm) 0;
  padding: var(--spacing-md);
  border-radius: var(--border-radius-md);
}

.summary-discount {
  color: var(--secondary-color);
}

.summary-label {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-size-sm);
  color: var(--gray-600);
}

.summary-value {
  font-weight: var(--font-weight-semibold);
  color: var(--gray-900);
}

.free-badge {
  font-size: var(--font-size-xs);
  background: var(--secondary-color);
  color: white;
  padding: 2px var(--spacing-xs);
  border-radius: var(--border-radius-sm);
  font-weight: var(--font-weight-bold);
}

.discount-icon {
  font-size: var(--font-size-sm);
}

.cart-actions {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-lg);
}

.continue-shopping,
.checkout-btn {
  justify-content: center;
  gap: var(--spacing-sm);
}

.checkout-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-icon.loading {
  animation: pulse 1s infinite;
}

.cart-info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.info-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.info-icon {
  font-size: var(--font-size-sm);
  color: var(--primary-color);
  flex-shrink: 0;
}

.info-text {
  font-size: var(--font-size-xs);
  color: var(--gray-600);
  line-height: 1.4;
}

/* Responsive */
@media (max-width: 768px) {
  .cart-panel {
    width: 100vw;
    max-width: 100vw;
  }

  .cart-item {
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .item-image {
    align-self: center;
    width: 100px;
    height: 100px;
  }

  .item-controls {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .item-pricing {
    align-items: flex-start;
  }

  .quantity-control {
    order: 2;
  }

  .remove-btn {
    order: 3;
  }
}
</style>
