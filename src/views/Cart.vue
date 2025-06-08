<!--
  Vista Carrito de Compras
  Muestra y gestiona los productos en el carrito
-->

<template>
  <div class="cart-page">
    <div class="container">
      <!-- Header del carrito -->
      <div class="cart-header">
        <h1 class="page-title">
          <span class="title-icon">🛒</span>
          <span class="title-text">Carrito de Compras</span>
        </h1>
        <div v-if="!isEmpty" class="cart-summary-badge">
          {{ itemCount }} {{ itemCount === 1 ? 'producto' : 'productos' }}
        </div>
      </div>

      <!-- Carrito vacío -->
      <div v-if="isEmpty" class="empty-cart">
        <div class="empty-cart-illustration">
          <div class="empty-cart-icon">🛒</div>
          <div class="empty-message">Tu carrito está vacío</div>
        </div>
        
        <div class="empty-cart-content">
          <h2 class="empty-title">¡Comienza a comprar!</h2>
          <p class="empty-description">
            Explora nuestro catálogo de productos y encuentra las mejores gafas, 
            lentes y accesorios para el cuidado de tu visión.
          </p>
          
          <div class="empty-actions">
            <router-link to="/productos" class="btn btn-primary btn-lg">
              <span class="btn-icon">👓</span>
              <span class="btn-text">Ver Productos</span>
            </router-link>
            
            <router-link to="/servicios" class="btn btn-outline btn-lg">
              <span class="btn-icon">⚕️</span>
              <span class="btn-text">Nuestros Servicios</span>
            </router-link>
          </div>
        </div>
      </div>

      <!-- Carrito con productos -->
      <div v-else class="cart-content">
        <div class="cart-main">
          <!-- Lista de productos -->
          <div class="cart-items">
            <div class="cart-section-header">
              <h2 class="section-title">Productos en tu carrito</h2>
              <button @click="handleClearCart" class="clear-cart-btn">
                <span class="btn-icon">🗑️</span>
                <span class="btn-text">Limpiar carrito</span>
              </button>
            </div>

            <div class="items-list">
              <div
                v-for="item in items"
                :key="item.id"
                class="cart-item"
              >
                <!-- Imagen del producto -->
                <div class="item-image">
                  <img 
                    :src="item.product.images[0] || '/placeholder-product.jpg'" 
                    :alt="item.product.name"
                  />
                </div>

                <!-- Información del producto -->
                <div class="item-info">
                  <h3 class="item-name">{{ item.product.name }}</h3>
                  <p class="item-brand">{{ item.product.brand }}</p>
                  
                  <div class="item-options">
                    <span v-if="item.selectedColor" class="option-tag">
                      Color: {{ item.selectedColor }}
                    </span>
                    
                  </div>

                  <div class="item-price">
                    <span class="current-price">${{ formatPrice(item.product.price) }}</span>
                    <span v-if="item.product.originalPrice > item.product.price" class="original-price">
                      ${{ formatPrice(item.product.originalPrice) }}
                    </span>
                  </div>
                </div>

                <!-- Controles de cantidad -->
                <div class="item-quantity">
                  <label class="quantity-label">Cantidad:</label>
                  <div class="quantity-controls">
                    <button 
                      @click="decreaseQuantity(item.id)"
                      :disabled="item.quantity <= 1"
                      class="quantity-btn"
                    >
                      −
                    </button>
                    <span class="quantity-display">{{ item.quantity }}</span>
                    <button 
                      @click="increaseQuantity(item.id)"
                      :disabled="item.quantity >= item.product.stockQuantity"
                      class="quantity-btn"
                    >
                      +
                    </button>
                  </div>
                  <p class="stock-info">
                    Stock disponible: {{ item.product.stockQuantity }}
                  </p>
                </div>

                <!-- Subtotal y acciones -->
                <div class="item-actions">
                  <div class="item-subtotal">
                    ${{ formatPrice(item.product.price * item.quantity) }}
                  </div>
                  <button 
                    @click="removeItem(item.id)"
                    class="remove-item-btn"
                    title="Remover producto"
                  >
                    <span class="btn-icon">❌</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Resumen del carrito -->
        <div class="cart-sidebar">
          <div class="cart-summary">
            <h2 class="summary-title">Resumen del pedido</h2>
            
            <div class="summary-details">
              <div class="summary-row">
                <span class="summary-label">Subtotal ({{ itemCount }} productos):</span>
                <span class="summary-value">${{ formatPrice(cartSummary.subtotal) }}</span>
              </div>

              <div v-if="cartSummary.discount > 0" class="summary-row discount-row">
                <span class="summary-label">Descuentos:</span>
                <span class="summary-value discount-value">
                  -${{ formatPrice(cartSummary.discount) }}
                </span>
              </div>

              <div class="summary-row">
                <span class="summary-label">Envío:</span>
                <span class="summary-value">
                  {{ cartSummary.shipping === 0 ? 'GRATIS' : `$${formatPrice(cartSummary.shipping)}` }}
                </span>
              </div>

              <div class="summary-row">
                <span class="summary-label">IVA (19%):</span>
                <span class="summary-value">${{ formatPrice(cartSummary.tax) }}</span>
              </div>

              <div class="summary-divider"></div>

              <div class="summary-row total-row">
                <span class="summary-label">Total:</span>
                <span class="summary-value total-value">
                  ${{ formatPrice(cartSummary.total) }}
                </span>
              </div>
            </div>

            <!-- Información de envío gratis -->
            <div v-if="cartSummary.shipping > 0" class="shipping-info">
              <p class="shipping-message">
                💡 Agrega ${{ formatPrice(200000 - cartSummary.subtotal) }} más 
                para obtener <strong>envío gratis</strong>
              </p>
            </div>

            <!-- Botones de acción -->
            <div class="summary-actions">
              <button 
                @click="handleCheckout"
                class="btn btn-primary btn-lg checkout-btn"
              >
                <span class="btn-icon">🛍️</span>
                <span class="btn-text">Finalizar Compra</span>
              </button>

              <router-link to="/productos" class="btn btn-outline btn-lg">
                <span class="btn-icon">🔙</span>
                <span class="btn-text">Seguir Comprando</span>
              </router-link>
            </div>

            <!-- Métodos de pago aceptados -->
            <div class="payment-methods">
              <h4 class="payment-title">Métodos de pago aceptados:</h4>
              <div class="payment-icons">
                <span class="payment-icon" title="Efectivo">💵</span>
                <span class="payment-icon" title="Tarjeta de Débito">💳</span>
                <span class="payment-icon" title="Tarjeta de Crédito">💳</span>
                <span class="payment-icon" title="Transferencia">🏦</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Productos recomendados -->
      <div v-if="!isEmpty" class="recommended-products">
        <h2 class="section-title">También te puede interesar</h2>
        <div class="products-grid">
          <!-- Aquí se cargarían productos recomendados -->
          <div class="recommendation-placeholder">
            <p>Cargando productos recomendados...</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useShoppingCart } from '@/composables/useShoppingCart';
import { useNotifications } from '@/composables/useNotifications';

const router = useRouter();
const { 
  items, 
  isEmpty, 
  itemCount, 
  cartSummary, 
  updateQuantity, 
  removeFromCart, 
  clearCart 
} = useShoppingCart();
const { showSuccess, showError, showWarning } = useNotifications();

// Métodos
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('es-CO').format(price);
};

const increaseQuantity = (itemId: string): void => {
  const item = items.value.find(item => item.id === itemId);
  if (item) {
    const newQuantity = item.quantity + 1;
    if (newQuantity <= item.product.stockQuantity) {
      updateQuantity(itemId, newQuantity);
      showSuccess('Actualizado', 'Cantidad actualizada');
    } else {
      showWarning('Stock limitado', 'No hay más unidades disponibles');
    }
  }
};

const decreaseQuantity = (itemId: string): void => {
  const item = items.value.find(item => item.id === itemId);
  if (item && item.quantity > 1) {
    updateQuantity(itemId, item.quantity - 1);
    showSuccess('Actualizado', 'Cantidad actualizada');
  }
};

const removeItem = (itemId: string): void => {
  const item = items.value.find(item => item.id === itemId);
  if (item) {
    removeFromCart(itemId);
    showSuccess('Producto removido', `${item.product.name} fue removido del carrito`);
  }
};

const handleClearCart = (): void => {
  if (window.confirm('¿Estás seguro de que quieres limpiar todo el carrito?')) {
    clearCart();
    showSuccess('Carrito limpio', 'Todos los productos fueron removidos');
  }
};

const handleCheckout = (): void => {
  // Validar carrito antes de proceder
  const validation = validateCart();
  if (validation.valid) {
    router.push('/checkout');
  } else {
    showError('Error en el carrito', validation.errors.join(', '));
  }
};

const validateCart = () => {
  const errors: string[] = [];
  
  // Verificar que todos los productos estén en stock
  for (const item of items.value) {
    if (!item.product.inStock) {
      errors.push(`${item.product.name} ya no está disponible`);
    } else if (item.quantity > item.product.stockQuantity) {
      errors.push(`${item.product.name}: solo hay ${item.product.stockQuantity} unidades disponibles`);
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};
</script>

<style scoped>
.cart-page {
  padding: var(--spacing-2xl) 0;
  min-height: 100vh;
}

/* Header del carrito */
.cart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-2xl);
  flex-wrap: wrap;
  gap: var(--spacing-lg);
}

.page-title {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--gray-900);
  margin: 0;
}

.title-icon {
  font-size: 2.5rem;
}

.cart-summary-badge {
  background: var(--primary-color);
  color: white;
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: var(--border-radius-full);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

/* Carrito vacío */
.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
  gap: var(--spacing-2xl);
}

.empty-cart-illustration {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-lg);
}

.empty-cart-icon {
  font-size: 6rem;
  opacity: 0.3;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.empty-message {
  font-size: var(--font-size-xl);
  color: var(--gray-500);
  font-weight: var(--font-weight-medium);
}

.empty-title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--gray-900);
  margin: 0;
}

.empty-description {
  font-size: var(--font-size-lg);
  color: var(--gray-600);
  max-width: 500px;
  line-height: 1.6;
  margin: 0;
}

.empty-actions {
  display: flex;
  gap: var(--spacing-lg);
  flex-wrap: wrap;
  justify-content: center;
}

/* Carrito con contenido */
.cart-content {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: var(--spacing-3xl);
  align-items: start;
}

.cart-main {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.cart-section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
}

.section-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--gray-900);
  margin: 0;
}

.clear-cart-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  background: none;
  border: none;
  color: var(--error-color);
  cursor: pointer;
  font-size: var(--font-size-sm);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-md);
  transition: background var(--transition-fast);
}

.clear-cart-btn:hover {
  background: rgba(239, 68, 68, 0.1);
}

/* Items del carrito */
.items-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.cart-item {
  display: grid;
  grid-template-columns: 100px 1fr auto auto;
  gap: var(--spacing-lg);
  padding: var(--spacing-lg);
  background: white;
  border: 1px solid var(--gray-200);
  border-radius: var(--border-radius-xl);
  align-items: center;
  transition: all var(--transition-normal);
}

.cart-item:hover {
  box-shadow: var(--shadow-md);
}

.item-image {
  width: 100px;
  height: 100px;
  border-radius: var(--border-radius-lg);
  overflow: hidden;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.item-name {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--gray-900);
  margin: 0;
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
  background: var(--gray-100);
  color: var(--gray-700);
  font-size: var(--font-size-xs);
  padding: 2px var(--spacing-xs);
  border-radius: var(--border-radius-sm);
}

.item-price {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.current-price {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--primary-color);
}

.original-price {
  font-size: var(--font-size-sm);
  color: var(--gray-500);
  text-decoration: line-through;
}

/* Controles de cantidad */
.item-quantity {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs);
}

.quantity-label {
  font-size: var(--font-size-xs);
  color: var(--gray-600);
  font-weight: var(--font-weight-medium);
}

.quantity-controls {
  display: flex;
  align-items: center;
  background: var(--gray-100);
  border-radius: var(--border-radius-lg);
  overflow: hidden;
}

.quantity-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border: none;
  cursor: pointer;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  transition: background var(--transition-fast);
}

.quantity-btn:hover:not(:disabled) {
  background: var(--gray-50);
}

.quantity-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity-display {
  min-width: 40px;
  text-align: center;
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-base);
}

.stock-info {
  font-size: var(--font-size-xs);
  color: var(--gray-500);
  margin: 0;
  text-align: center;
}

/* Acciones del item */
.item-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
}

.item-subtotal {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--gray-900);
}

.remove-item-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--spacing-xs);
  border-radius: var(--border-radius-md);
  transition: all var(--transition-fast);
  opacity: 0.7;
}

.remove-item-btn:hover {
  opacity: 1;
  background: rgba(239, 68, 68, 0.1);
}

/* Sidebar del carrito */
.cart-sidebar {
  position: sticky;
  top: var(--spacing-xl);
}

.cart-summary {
  background: white;
  border: 1px solid var(--gray-200);
  border-radius: var(--border-radius-xl);
  padding: var(--spacing-xl);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.summary-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--gray-900);
  margin: 0;
}

.summary-details {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.summary-label {
  font-size: var(--font-size-base);
  color: var(--gray-700);
}

.summary-value {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  color: var(--gray-900);
}

.discount-row .summary-value {
  color: var(--success-color);
}

.summary-divider {
  height: 1px;
  background: var(--gray-200);
  margin: var(--spacing-sm) 0;
}

.total-row {
  padding-top: var(--spacing-sm);
}

.total-row .summary-label {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--gray-900);
}

.total-value {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--primary-color);
}

.shipping-info {
  background: var(--info-color);
  color: white;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-lg);
  font-size: var(--font-size-sm);
}

.shipping-message {
  margin: 0;
  text-align: center;
}

.summary-actions {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.checkout-btn {
  width: 100%;
}

.payment-methods {
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--gray-200);
}

.payment-title {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--gray-700);
  margin: 0 0 var(--spacing-sm) 0;
}

.payment-icons {
  display: flex;
  gap: var(--spacing-sm);
  justify-content: center;
}

.payment-icon {
  font-size: var(--font-size-lg);
  opacity: 0.7;
}

/* Responsive */
@media (max-width: 1024px) {
  .cart-content {
    grid-template-columns: 1fr;
    gap: var(--spacing-2xl);
  }

  .cart-sidebar {
    position: static;
  }
}

@media (max-width: 768px) {
  .cart-item {
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
    text-align: center;
  }

  .item-quantity {
    flex-direction: row;
    justify-content: center;
  }

  .item-actions {
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
  }

  .empty-actions {
    flex-direction: column;
    width: 100%;
    max-width: 300px;
  }

  .cart-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-md);
  }
}
</style>
