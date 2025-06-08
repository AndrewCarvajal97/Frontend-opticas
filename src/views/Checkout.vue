<!--
  Vista Checkout - Finalizar Compra
  Formulario para completar el pedido
-->

<template>
  <div class="checkout-page">
    <div class="container">
      <!-- Header del checkout -->
      <div class="checkout-header">
        <h1 class="page-title">
          <span class="title-icon">🛍️</span>
          <span class="title-text">Finalizar Compra</span>
        </h1>
        
        <!-- Pasos del checkout -->
        <div class="checkout-steps">
          <div class="step" :class="{ active: currentStep >= 1, completed: currentStep > 1 }">
            <span class="step-number">1</span>
            <span class="step-label">Información</span>
          </div>
          <div class="step-divider"></div>
          <div class="step" :class="{ active: currentStep >= 2, completed: currentStep > 2 }">
            <span class="step-number">2</span>
            <span class="step-label">Entrega</span>
          </div>
          <div class="step-divider"></div>
          <div class="step" :class="{ active: currentStep >= 3 }">
            <span class="step-number">3</span>
            <span class="step-label">Pago</span>
          </div>
        </div>
      </div>

      <!-- Contenido principal del checkout -->
      <div class="checkout-content">
        <div class="checkout-main">
          <!-- Paso 1: Información del cliente -->
          <div v-if="currentStep === 1" class="checkout-step">
            <h2 class="step-title">Información de Contacto</h2>
            
            <form @submit.prevent="nextStep" class="checkout-form">
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label" for="firstName">Nombre *</label>
                  <input
                    id="firstName"
                    v-model="customerInfo.firstName"
                    type="text"
                    class="form-input"
                    placeholder="Tu nombre"
                    required
                  />
                </div>
                
                <div class="form-group">
                  <label class="form-label" for="lastName">Apellidos *</label>
                  <input
                    id="lastName"
                    v-model="customerInfo.lastName"
                    type="text"
                    class="form-input"
                    placeholder="Tus apellidos"
                    required
                  />
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label" for="email">Email *</label>
                  <input
                    id="email"
                    v-model="customerInfo.email"
                    type="email"
                    class="form-input"
                    placeholder="tu@email.com"
                    required
                  />
                </div>
                
                <div class="form-group">
                  <label class="form-label" for="phone">Teléfono *</label>
                  <input
                    id="phone"
                    v-model="customerInfo.phone"
                    type="tel"
                    class="form-input"
                    placeholder="300 123 4567"
                    required
                  />
                </div>
              </div>

              <div class="form-group">
                <label class="form-label" for="idNumber">Cédula de Identidad *</label>
                <input
                  id="idNumber"
                  v-model="customerInfo.idNumber"
                  type="text"
                  class="form-input"
                  placeholder="12345678"
                  required
                />
              </div>

              <div class="step-actions">
                <button type="submit" class="btn btn-primary btn-lg">
                  <span class="btn-text">Continuar</span>
                  <span class="btn-icon">→</span>
                </button>
              </div>
            </form>
          </div>

          <!-- Paso 2: Información de entrega -->
          <div v-if="currentStep === 2" class="checkout-step">
            <h2 class="step-title">Información de Entrega</h2>
            
            <form @submit.prevent="nextStep" class="checkout-form">
              <div class="delivery-options">
                <div class="option-card" :class="{ selected: deliveryMethod === 'pickup' }">
                  <label class="option-label">
                    <input 
                      v-model="deliveryMethod" 
                      type="radio" 
                      value="pickup"
                      class="option-radio"
                    />
                    <div class="option-content">
                      <div class="option-header">
                        <span class="option-icon">🏪</span>
                        <span class="option-title">Recoger en tienda</span>
                        <span class="option-price">GRATIS</span>
                      </div>
                      <p class="option-description">
                        Recoge tu pedido en nuestra óptica. Listo en 2-3 días hábiles.
                      </p>
                    </div>
                  </label>
                </div>

                <div class="option-card" :class="{ selected: deliveryMethod === 'delivery' }">
                  <label class="option-label">
                    <input 
                      v-model="deliveryMethod" 
                      type="radio" 
                      value="delivery"
                      class="option-radio"
                    />
                    <div class="option-content">
                      <div class="option-header">
                        <span class="option-icon">🚚</span>
                        <span class="option-title">Entrega a domicilio</span>
                        <span class="option-price">
                          {{ cartSummary.shipping === 0 ? 'GRATIS' : `$${formatPrice(cartSummary.shipping)}` }}
                        </span>
                      </div>
                      <p class="option-description">
                        Entrega en tu dirección. {{ cartSummary.shipping === 0 ? 'Envío gratis por compra superior a $200,000' : 'Tiempo estimado: 3-5 días hábiles' }}
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              <!-- Dirección de entrega (solo si es delivery) -->
              <div v-if="deliveryMethod === 'delivery'" class="delivery-address">
                <h3 class="address-title">Dirección de Entrega</h3>
                
                <div class="form-group">
                  <label class="form-label" for="address">Dirección completa *</label>
                  <input
                    id="address"
                    v-model="deliveryInfo.address"
                    type="text"
                    class="form-input"
                    placeholder="Calle 123 #45-67"
                    required
                  />
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label" for="city">Ciudad *</label>
                    <input
                      id="city"
                      v-model="deliveryInfo.city"
                      type="text"
                      class="form-input"
                      placeholder="Pedraza"
                      required
                    />
                  </div>
                  
                  <div class="form-group">
                    <label class="form-label" for="department">Departamento *</label>
                    <input
                      id="department"
                      v-model="deliveryInfo.department"
                      type="text"
                      class="form-input"
                      placeholder="Magdalena"
                      required
                    />
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label" for="notes">Notas adicionales</label>
                  <textarea
                    id="notes"
                    v-model="deliveryInfo.notes"
                    class="form-input form-textarea"
                    placeholder="Indicaciones especiales para la entrega..."
                    rows="3"
                  ></textarea>
                </div>
              </div>

              <div class="step-actions">
                <button type="button" @click="previousStep" class="btn btn-outline btn-lg">
                  <span class="btn-icon">←</span>
                  <span class="btn-text">Atrás</span>
                </button>
                <button type="submit" class="btn btn-primary btn-lg">
                  <span class="btn-text">Continuar</span>
                  <span class="btn-icon">→</span>
                </button>
              </div>
            </form>
          </div>

          <!-- Paso 3: Método de pago -->
          <div v-if="currentStep === 3" class="checkout-step">
            <h2 class="step-title">Método de Pago</h2>
            
            <form @submit.prevent="completeOrder" class="checkout-form">
              <div class="payment-methods">
                <div class="payment-option" :class="{ selected: paymentMethod === 'cash' }">
                  <label class="option-label">
                    <input 
                      v-model="paymentMethod" 
                      type="radio" 
                      value="cash"
                      class="option-radio"
                    />
                    <div class="option-content">
                      <span class="option-icon">💵</span>
                      <span class="option-title">Pago en Efectivo</span>
                      <p class="option-description">
                        {{ deliveryMethod === 'pickup' ? 'Paga al recoger en tienda' : 'Paga contra entrega' }}
                      </p>
                    </div>
                  </label>
                </div>

                <div class="payment-option" :class="{ selected: paymentMethod === 'transfer' }">
                  <label class="option-label">
                    <input 
                      v-model="paymentMethod" 
                      type="radio" 
                      value="transfer"
                      class="option-radio"
                    />
                    <div class="option-content">
                      <span class="option-icon">🏦</span>
                      <span class="option-title">Transferencia Bancaria</span>
                      <p class="option-description">
                        Te enviaremos los datos bancarios por WhatsApp
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              <!-- Información adicional del pedido -->
              <div class="order-notes">
                <h3 class="notes-title">Comentarios adicionales</h3>
                <textarea
                  v-model="orderNotes"
                  class="form-input form-textarea"
                  placeholder="¿Alguna solicitud especial? Cuéntanos aquí..."
                  rows="3"
                ></textarea>
              </div>

              <div class="step-actions">
                <button type="button" @click="previousStep" class="btn btn-outline btn-lg">
                  <span class="btn-icon">←</span>
                  <span class="btn-text">Atrás</span>
                </button>
                <button 
                  type="submit" 
                  :disabled="isProcessing"
                  class="btn btn-primary btn-lg complete-order-btn"
                >
                  <span v-if="!isProcessing" class="btn-icon">✅</span>
                  <span v-else class="btn-icon loading">⏳</span>
                  <span class="btn-text">
                    {{ isProcessing ? 'Procesando...' : 'Confirmar Pedido' }}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Resumen del pedido -->
        <div class="order-summary">
          <div class="summary-card">
            <h3 class="summary-title">Resumen del Pedido</h3>
            
            <!-- Productos -->
            <div class="summary-items">
              <div v-for="item in items" :key="item.id" class="summary-item">
                <div class="item-image">
                  <img :src="item.product.images[0] || '/placeholder-product.jpg'" :alt="item.product.name" />
                </div>
                <div class="item-details">
                  <h4 class="item-name">{{ item.product.name }}</h4>
                  <p class="item-options">
                    <span v-if="item.selectedColor">{{ item.selectedColor }}</span>
                    <span v-if="item.selectedSize">{{ item.selectedSize }}</span>
                  </p>
                  <p class="item-quantity">Cantidad: {{ item.quantity }}</p>
                </div>
                <div class="item-price">
                  ${{ formatPrice(item.product.price * item.quantity) }}
                </div>
              </div>
            </div>

            <!-- Totales -->
            <div class="summary-totals">
              <div class="total-row">
                <span class="total-label">Subtotal:</span>
                <span class="total-value">${{ formatPrice(cartSummary.subtotal) }}</span>
              </div>
              
              <div v-if="cartSummary.discount > 0" class="total-row discount">
                <span class="total-label">Descuentos:</span>
                <span class="total-value">-${{ formatPrice(cartSummary.discount) }}</span>
              </div>
              
              <div class="total-row">
                <span class="total-label">
                  {{ deliveryMethod === 'pickup' ? 'Recoger en tienda:' : 'Envío:' }}
                </span>
                <span class="total-value">
                  {{ (deliveryMethod === 'pickup' || cartSummary.shipping === 0) ? 'GRATIS' : `$${formatPrice(cartSummary.shipping)}` }}
                </span>
              </div>
              
              <div class="total-row">
                <span class="total-label">IVA (19%):</span>
                <span class="total-value">${{ formatPrice(cartSummary.tax) }}</span>
              </div>
              
              <div class="total-divider"></div>
              
              <div class="total-row final-total">
                <span class="total-label">Total a pagar:</span>
                <span class="total-value">${{ formatPrice(finalTotal) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useShoppingCart } from '@/composables/useShoppingCart';
import { useNotifications } from '@/composables/useNotifications';

const router = useRouter();
const { items, cartSummary, clearCart } = useShoppingCart();
const { showSuccess, showError } = useNotifications();

// Estado del checkout
const currentStep = ref(1);
const isProcessing = ref(false);

// Información del cliente
const customerInfo = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  idNumber: ''
});

// Información de entrega
const deliveryMethod = ref('pickup');
const deliveryInfo = ref({
  address: '',
  city: 'Pedraza',
  department: 'Magdalena',
  notes: ''
});

// Información de pago
const paymentMethod = ref('cash');
const orderNotes = ref('');

// Computed
const finalTotal = computed(() => {
  let total = cartSummary.value.total;
  if (deliveryMethod.value === 'pickup') {
    total -= cartSummary.value.shipping; // Sin costo de envío si recoge en tienda
  }
  return total;
});

// Métodos
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('es-CO').format(price);
};

const nextStep = (): void => {
  if (validateCurrentStep()) {
    currentStep.value++;
  }
};

const previousStep = (): void => {
  currentStep.value--;
};

const validateCurrentStep = (): boolean => {
  switch (currentStep.value) {
    case 1:
      return validateCustomerInfo();
    case 2:
      return validateDeliveryInfo();
    case 3:
      return validatePaymentInfo();
    default:
      return true;
  }
};

const validateCustomerInfo = (): boolean => {
  const { firstName, lastName, email, phone, idNumber } = customerInfo.value;
  
  if (!firstName.trim() || !lastName.trim() || !email.trim() || !phone.trim() || !idNumber.trim()) {
    showError('Campos requeridos', 'Por favor completa todos los campos obligatorios');
    return false;
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showError('Email inválido', 'Por favor ingresa un email válido');
    return false;
  }
  
  return true;
};

const validateDeliveryInfo = (): boolean => {
  if (deliveryMethod.value === 'delivery') {
    const { address, city, department } = deliveryInfo.value;
    if (!address.trim() || !city.trim() || !department.trim()) {
      showError('Dirección requerida', 'Por favor completa la información de entrega');
      return false;
    }
  }
  return true;
};

const validatePaymentInfo = (): boolean => {
  if (!paymentMethod.value) {
    showError('Método de pago requerido', 'Por favor selecciona un método de pago');
    return false;
  }
  return true;
};

const completeOrder = async (): Promise<void> => {
  if (!validateCurrentStep()) return;

  isProcessing.value = true;

  try {
    // Simular procesamiento del pedido
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Crear objeto del pedido
    const order = {
      id: `ORDER-${Date.now()}`,
      customer: customerInfo.value,
      delivery: {
        method: deliveryMethod.value,
        info: deliveryMethod.value === 'delivery' ? deliveryInfo.value : null
      },
      payment: {
        method: paymentMethod.value
      },
      items: items.value,
      totals: {
        subtotal: cartSummary.value.subtotal,
        discount: cartSummary.value.discount,
        shipping: deliveryMethod.value === 'pickup' ? 0 : cartSummary.value.shipping,
        tax: cartSummary.value.tax,
        total: finalTotal.value
      },
      notes: orderNotes.value,
      timestamp: new Date().toISOString()
    };

    console.log('Pedido creado:', order);

    // Limpiar carrito
    clearCart();

    // Mostrar mensaje de éxito
    showSuccess(
      '¡Pedido confirmado!', 
      `Tu pedido ${order.id} ha sido creado exitosamente. Te contactaremos pronto.`
    );

    // Redirigir a página de confirmación o inicio
    setTimeout(() => {
      router.push('/');
    }, 3000);

  } catch (error) {
    console.error('Error procesando pedido:', error);
    showError('Error', 'No se pudo procesar tu pedido. Inténtalo nuevamente.');
  } finally {
    isProcessing.value = false;
  }
};
</script>

<style scoped>
.checkout-page {
  padding: var(--spacing-2xl) 0;
  min-height: 100vh;
  background: var(--gray-50);
}

/* Header */
.checkout-header {
  background: white;
  padding: var(--spacing-xl);
  border-radius: var(--border-radius-xl);
  margin-bottom: var(--spacing-2xl);
  box-shadow: var(--shadow-sm);
}

.page-title {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--gray-900);
  margin: 0 0 var(--spacing-xl) 0;
}

.title-icon {
  font-size: 2rem;
}

/* Pasos del checkout */
.checkout-steps {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-md);
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs);
}

.step-number {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--gray-200);
  color: var(--gray-600);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: var(--font-weight-bold);
  transition: all var(--transition-fast);
}

.step.active .step-number {
  background: var(--primary-color);
  color: white;
}

.step.completed .step-number {
  background: var(--success-color);
  color: white;
}

.step-label {
  font-size: var(--font-size-sm);
  color: var(--gray-600);
  font-weight: var(--font-weight-medium);
}

.step.active .step-label {
  color: var(--primary-color);
}

.step-divider {
  width: 60px;
  height: 2px;
  background: var(--gray-200);
}

/* Contenido principal */
.checkout-content {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: var(--spacing-2xl);
  align-items: start;
}

.checkout-main {
  background: white;
  border-radius: var(--border-radius-xl);
  padding: var(--spacing-2xl);
  box-shadow: var(--shadow-sm);
}

.step-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--gray-900);
  margin: 0 0 var(--spacing-xl) 0;
}

/* Formularios */
.checkout-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-lg);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.form-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--gray-700);
}

.form-input {
  padding: var(--spacing-sm) var(--spacing-md);
  border: 2px solid var(--gray-300);
  border-radius: var(--border-radius-lg);
  font-size: var(--font-size-base);
  transition: border-color var(--transition-fast);
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-color);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

/* Opciones de entrega */
.delivery-options {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.option-card {
  border: 2px solid var(--gray-200);
  border-radius: var(--border-radius-lg);
  transition: all var(--transition-fast);
  overflow: hidden;
}

.option-card:hover {
  border-color: var(--primary-color);
}

.option-card.selected {
  border-color: var(--primary-color);
  background: rgba(99, 102, 241, 0.05);
}

.option-label {
  display: block;
  cursor: pointer;
}

.option-radio {
  display: none;
}

.option-content {
  padding: var(--spacing-lg);
}

.option-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-sm);
}

.option-icon {
  font-size: 1.5rem;
}

.option-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--gray-900);
  flex: 1;
}

.option-price {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-bold);
  color: var(--primary-color);
}

.option-description {
  font-size: var(--font-size-sm);
  color: var(--gray-600);
  margin: 0;
  line-height: 1.5;
}

/* Dirección de entrega */
.delivery-address {
  margin-top: var(--spacing-xl);
  padding: var(--spacing-lg);
  background: var(--gray-50);
  border-radius: var(--border-radius-lg);
}

.address-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--gray-900);
  margin: 0 0 var(--spacing-lg) 0;
}

/* Métodos de pago */
.payment-methods {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.payment-option {
  border: 2px solid var(--gray-200);
  border-radius: var(--border-radius-lg);
  transition: all var(--transition-fast);
}

.payment-option:hover {
  border-color: var(--primary-color);
}

.payment-option.selected {
  border-color: var(--primary-color);
  background: rgba(99, 102, 241, 0.05);
}

/* Notas del pedido */
.order-notes {
  margin-top: var(--spacing-lg);
}

.notes-title {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--gray-900);
  margin: 0 0 var(--spacing-sm) 0;
}

/* Acciones de paso */
.step-actions {
  display: flex;
  justify-content: space-between;
  gap: var(--spacing-lg);
  margin-top: var(--spacing-xl);
  padding-top: var(--spacing-xl);
  border-top: 1px solid var(--gray-200);
}

.complete-order-btn {
  flex: 1;
  max-width: 250px;
  margin-left: auto;
}

.btn-icon.loading {
  animation: pulse 1s infinite;
}

/* Resumen del pedido */
.order-summary {
  position: sticky;
  top: var(--spacing-xl);
}

.summary-card {
  background: white;
  border-radius: var(--border-radius-xl);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-sm);
}

.summary-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--gray-900);
  margin: 0 0 var(--spacing-lg) 0;
}

/* Items del resumen */
.summary-items {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.summary-item {
  display: flex;
  gap: var(--spacing-sm);
  align-items: center;
}

.summary-item .item-image {
  width: 50px;
  height: 50px;
  border-radius: var(--border-radius-md);
  overflow: hidden;
  flex-shrink: 0;
}

.summary-item .item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-details {
  flex: 1;
}

.item-name {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--gray-900);
  margin: 0;
}

.item-options {
  font-size: var(--font-size-xs);
  color: var(--gray-600);
  margin: 0;
}

.item-quantity {
  font-size: var(--font-size-xs);
  color: var(--gray-500);
  margin: 0;
}

.summary-item .item-price {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--gray-900);
}

/* Totales */
.summary-totals {
  border-top: 1px solid var(--gray-200);
  padding-top: var(--spacing-lg);
}

.total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-sm);
}

.total-label {
  font-size: var(--font-size-sm);
  color: var(--gray-700);
}

.total-value {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--gray-900);
}

.total-row.discount .total-value {
  color: var(--success-color);
}

.total-divider {
  height: 1px;
  background: var(--gray-200);
  margin: var(--spacing-md) 0;
}

.final-total {
  padding-top: var(--spacing-sm);
}

.final-total .total-label {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-bold);
  color: var(--gray-900);
}

.final-total .total-value {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--primary-color);
}

/* Responsive */
@media (max-width: 1024px) {
  .checkout-content {
    grid-template-columns: 1fr;
    gap: var(--spacing-xl);
  }

  .order-summary {
    position: static;
    order: -1;
  }
}

@media (max-width: 768px) {
  .checkout-page {
    padding: var(--spacing-lg) 0;
  }

  .checkout-header {
    padding: var(--spacing-lg);
  }

  .checkout-main {
    padding: var(--spacing-lg);
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .step-actions {
    flex-direction: column;
  }

  .checkout-steps {
    overflow-x: auto;
    justify-content: flex-start;
    padding-bottom: var(--spacing-sm);
  }

  .step-divider {
    width: 40px;
  }
}
</style>
