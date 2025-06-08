<!--
  Componente Contact Form
  Formulario de contacto reutilizable
  Implementa principios SOLID y Clean Architecture
-->

<template>
  <div class="contact-form-container">
    <form class="contact-form" @submit.prevent="handleSubmit">
      <!-- Header del formulario -->
      <div class="form-header">
        <h3 class="form-title">
          <span class="title-icon">📞</span>
          {{ formTitle }}
        </h3>
        <p v-if="formDescription" class="form-description">
          {{ formDescription }}
        </p>
      </div>

      <!-- Campos del formulario -->
      <div class="form-fields">
        <!-- Nombre completo -->
        <div class="form-group">
          <label for="fullName" class="form-label">
            <span class="label-text">Nombre Completo</span>
            <span class="label-required">*</span>
          </label>
          <input
            id="fullName"
            v-model="formData.fullName"
            type="text"
            class="form-input"
            :class="{ 'input-error': hasError('fullName') }"
            placeholder="Ingresa tu nombre completo"
            @blur="touchField('fullName')"
            @input="validateField('fullName')"
            required
          />
          <span v-if="hasError('fullName')" class="error-message">
            {{ getError('fullName') }}
          </span>
        </div>

        <!-- Teléfono -->
        <div class="form-group">
          <label for="phone" class="form-label">
            <span class="label-text">Teléfono/Celular</span>
            <span class="label-required">*</span>
          </label>
          <input
            id="phone"
            v-model="formData.phone"
            type="tel"
            class="form-input"
            :class="{ 'input-error': hasError('phone') }"
            placeholder="300 123 4567"
            @blur="touchField('phone')"
            @input="validateField('phone')"
            required
          />
          <span v-if="hasError('phone')" class="error-message">
            {{ getError('phone') }}
          </span>
        </div>

        <!-- Email -->
        <div class="form-group">
          <label for="email" class="form-label">
            <span class="label-text">Correo Electrónico</span>
            <span class="label-required">*</span>
          </label>
          <input
            id="email"
            v-model="formData.email"
            type="email"
            class="form-input"
            :class="{ 'input-error': hasError('email') }"
            placeholder="tucorreo@email.com"
            @blur="touchField('email')"
            @input="validateField('email')"
            required
          />
          <span v-if="hasError('email')" class="error-message">
            {{ getError('email') }}
          </span>
        </div>

        <!-- Dirección (condicional) -->
        <div v-if="showAddress" class="form-group">
          <label for="address" class="form-label">
            <span class="label-text">Dirección</span>
            <span class="label-required">*</span>
          </label>
          <input
            id="address"
            v-model="formData.address"
            type="text"
            class="form-input"
            :class="{ 'input-error': hasError('address') }"
            placeholder="Dirección completa para la visita"
            @blur="touchField('address')"
            @input="validateField('address')"
            :required="showAddress"
          />
          <span v-if="hasError('address')" class="error-message">
            {{ getError('address') }}
          </span>
        </div>

        <!-- Fecha y hora (condicional) -->
        <div v-if="showDateTime" class="form-group form-group-split">
          <div class="split-field">
            <label for="preferredDate" class="form-label">
              <span class="label-text">Fecha Preferida</span>
              <span class="label-required">*</span>
            </label>
            <input
              id="preferredDate"
              v-model="formData.preferredDate"
              type="date"
              class="form-input"
              :class="{ 'input-error': hasError('preferredDate') }"
              :min="minDate"
              @blur="touchField('preferredDate')"
              @change="validateField('preferredDate')"
              :required="showDateTime"
            />
            <span v-if="hasError('preferredDate')" class="error-message">
              {{ getError('preferredDate') }}
            </span>
          </div>

          <div class="split-field">
            <label for="preferredTime" class="form-label">
              <span class="label-text">Hora Preferida</span>
              <span class="label-required">*</span>
            </label>
            <select
              id="preferredTime"
              v-model="formData.preferredTime"
              class="form-input form-select"
              :class="{ 'input-error': hasError('preferredTime') }"
              @blur="touchField('preferredTime')"
              @change="validateField('preferredTime')"
              :required="showDateTime"
            >
              <option value="">Selecciona una hora</option>
              <option
                v-for="slot in availableTimeSlots"
                :key="slot.value"
                :value="slot.value"
                :disabled="!slot.available"
              >
                {{ slot.label }} {{ !slot.available ? '(No disponible)' : '' }}
              </option>
            </select>
            <span v-if="hasError('preferredTime')" class="error-message">
              {{ getError('preferredTime') }}
            </span>
          </div>
        </div>

        <!-- Tipo de servicio (condicional) -->
        <div v-if="showServiceType" class="form-group">
          <label for="serviceType" class="form-label">
            <span class="label-text">Tipo de Servicio</span>
          </label>
          <select
            id="serviceType"
            v-model="formData.serviceType"
            class="form-input form-select"
            @blur="touchField('serviceType')"
            @change="validateField('serviceType')"
          >
            <option value="">Selecciona un servicio</option>
            <option
              v-for="service in serviceTypes"
              :key="service.value"
              :value="service.value"
            >
              {{ service.label }}
            </option>
          </select>
        </div>

        <!-- Mensaje -->
        <div class="form-group">
          <label for="message" class="form-label">
            <span class="label-text">Mensaje Adicional</span>
            <span v-if="!showServiceType" class="label-optional">(Opcional)</span>
          </label>
          <textarea
            id="message"
            v-model="formData.message"
            class="form-input form-textarea"
            :class="{ 'input-error': hasError('message') }"
            placeholder="¿Alguna solicitud especial o información adicional?"
            rows="4"
            maxlength="500"
            @blur="touchField('message')"
            @input="validateField('message')"
          ></textarea>
          <div class="textarea-footer">
            <span v-if="hasError('message')" class="error-message">
              {{ getError('message') }}
            </span>
            <span class="character-count">
              {{ formData.message.length }}/500
            </span>
          </div>
        </div>
      </div>

      <!-- Información adicional -->
      <div v-if="showAdditionalInfo" class="form-info">
        <div class="info-card">
          <div class="info-header">
            <span class="info-icon">ℹ️</span>
            <h4 class="info-title">Información Importante</h4>
          </div>
          <ul class="info-list">
            <li class="info-item">
              <span class="item-icon">⏰</span>
              <span class="item-text">Responderemos en las próximas 24 horas</span>
            </li>
            <li class="info-item">
              <span class="item-icon">🏠</span>
              <span class="item-text">Servicio a domicilio disponible en toda la región</span>
            </li>
            <li class="info-item">
              <span class="item-icon">💰</span>
              <span class="item-text">Examen gratis al comprar tus lentes</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Botones de acción -->
      <div class="form-actions">
        <button
          type="submit"
          class="btn btn-primary btn-lg submit-btn"
          :disabled="!isFormValid || isSubmitting"
        >
          <span v-if="!isSubmitting" class="btn-icon">📧</span>
          <span v-else class="btn-icon loading">⏳</span>
          <span class="btn-text">
            {{ isSubmitting ? 'Enviando...' : submitButtonText }}
          </span>
        </button>

        <button
          v-if="showResetButton"
          type="button"
          class="btn btn-outline reset-btn"
          @click="handleReset"
          :disabled="isSubmitting"
        >
          <span class="btn-icon">🔄</span>
          <span class="btn-text">Limpiar Formulario</span>
        </button>
      </div>

      <!-- Progreso del formulario -->
      <div v-if="showProgress" class="form-progress">
        <div class="progress-bar">
          <div 
            class="progress-fill"
            :style="{ width: `${formProgress}%` }"
          ></div>
        </div>
        <span class="progress-text">
          Completado: {{ Math.round(formProgress) }}%
        </span>
      </div>

      <!-- Política de privacidad -->
      <div class="form-privacy">
        <p class="privacy-text">
          Al enviar este formulario, aceptas nuestra 
          <a href="#" @click.prevent="handlePrivacyClick" class="privacy-link">
            Política de Privacidad
          </a>
          y el tratamiento de tus datos personales.
        </p>
      </div>
    </form>

    <!-- Estado de envío -->
    <div v-if="submitStatus" class="submit-status" :class="`status-${submitStatus.type}`">
      <div class="status-content">
        <span class="status-icon">
          {{ submitStatus.type === 'success' ? '✅' : submitStatus.type === 'error' ? '❌' : 'ℹ️' }}
        </span>
        <div class="status-text">
          <h4 class="status-title">{{ submitStatus.title }}</h4>
          <p class="status-message">{{ submitStatus.message }}</p>
          <p v-if="submitStatus.contactId" class="status-reference">
            Número de referencia: {{ submitStatus.contactId }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useContactForm } from '@/composables/useFormValidation';

// Interfaces para tipado
interface TimeSlot {
  value: string;
  label: string;
  available: boolean;
}

interface ServiceType {
  value: string;
  label: string;
}

interface SubmitStatus {
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
  contactId?: string;
}

// Props del componente
interface Props {
  formTitle?: string;
  formDescription?: string;
  submitButtonText?: string;
  showAddress?: boolean;
  showDateTime?: boolean;
  showServiceType?: boolean;
  showAdditionalInfo?: boolean;
  showResetButton?: boolean;
  showProgress?: boolean;
  serviceTypes?: ServiceType[];
}

const props = withDefaults(defineProps<Props>(), {
  formTitle: 'Contáctanos',
  formDescription: 'Completa el formulario y nos pondremos en contacto contigo.',
  submitButtonText: 'Enviar Mensaje',
  showAddress: false,
  showDateTime: false,
  showServiceType: false,
  showAdditionalInfo: true,
  showResetButton: true,
  showProgress: false,
  serviceTypes: () => [
    { value: 'examen-domicilio', label: 'Examen Óptico a Domicilio' },
    { value: 'productos', label: 'Consulta sobre Productos' },
    { value: 'reparacion', label: 'Reparación de Gafas' },
    { value: 'otros', label: 'Otros Servicios' }
  ]
});

// Eventos que emite el componente
const emit = defineEmits<{
  submit: [formData: any];
  privacyClick: [];
  reset: [];
}>();

// Composable de validación
const {
  formData,
  isSubmitting,
  isFormValid,
  formProgress,
  hasError,
  getError,
  touchField,
  validateField,
  resetForm,
  handleSubmit: handleFormSubmit
} = useContactForm();

// Estado reactivo local
const submitStatus = ref<SubmitStatus | null>(null);
const availableTimeSlots = ref<TimeSlot[]>([]);

// Computed properties
const minDate = computed(() => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
});

// Métodos
const handleSubmit = async (): Promise<void> => {
  try {
    submitStatus.value = null;
    
    const result = await handleFormSubmit(async (data) => {
      emit('submit', data);
      
      // Simular respuesta del servidor
      return {
        success: true,
        contactId: `CONT-${Date.now()}`,
        message: 'Formulario enviado correctamente'
      };
    });

    submitStatus.value = {
      type: 'success',
      title: '¡Mensaje Enviado!',
      message: 'Hemos recibido tu mensaje. Nos pondremos en contacto contigo en las próximas 24 horas.',
      contactId: result.contactId
    };

    // Auto-ocultar mensaje de éxito después de 5 segundos
    setTimeout(() => {
      submitStatus.value = null;
    }, 5000);

  } catch (error) {
    submitStatus.value = {
      type: 'error',
      title: 'Error al Enviar',
      message: 'Hubo un problema al enviar tu mensaje. Por favor, inténtalo nuevamente.'
    };
  }
};

const handleReset = (): void => {
  resetForm();
  submitStatus.value = null;
  emit('reset');
};

const handlePrivacyClick = (): void => {
  emit('privacyClick');
};

const generateTimeSlots = (): void => {
  const slots: TimeSlot[] = [];
  const startHour = 8;
  const endHour = 18;
  
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeValue = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      const timeLabel = new Date(`2000-01-01 ${timeValue}`).toLocaleTimeString('es-CO', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
      
      // Simular disponibilidad (en producción vendría del servidor)
      const available = Math.random() > 0.3; // 70% de disponibilidad
      
      slots.push({
        value: timeValue,
        label: timeLabel,
        available
      });
    }
  }
  
  availableTimeSlots.value = slots;
};

// Watchers
watch(() => formData.preferredDate, (newDate) => {
  if (newDate) {
    // En producción, aquí se consultarían los slots disponibles para la fecha seleccionada
    generateTimeSlots();
  }
});

// Lifecycle hooks
onMounted(() => {
  if (props.showDateTime) {
    generateTimeSlots();
  }
});
</script>

<style scoped>
.contact-form-container {
  max-width: 600px;
  margin: 0 auto;
}

.contact-form {
  background: white;
  border-radius: var(--border-radius-xl);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
}

/* Header del formulario */
.form-header {
  padding: var(--spacing-xl);
  background: var(--gradient-primary);
  color: white;
  text-align: center;
}

.form-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  margin: 0 0 var(--spacing-md) 0;
}

.title-icon {
  font-size: var(--font-size-xl);
}

.form-description {
  font-size: var(--font-size-base);
  opacity: 0.9;
  margin: 0;
  line-height: 1.5;
}

/* Campos del formulario */
.form-fields {
  padding: var(--spacing-xl);
}

.form-group {
  margin-bottom: var(--spacing-lg);
}

.form-group-split {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-md);
}

.split-field {
  display: flex;
  flex-direction: column;
}

.form-label {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-xs);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--gray-700);
}

.label-text {
  flex: 1;
}

.label-required {
  color: var(--error-color);
  font-weight: var(--font-weight-bold);
}

.label-optional {
  color: var(--gray-500);
  font-size: var(--font-size-xs);
  font-style: italic;
}

.form-input {
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  border: 2px solid var(--gray-300);
  border-radius: var(--border-radius-lg);
  font-size: var(--font-size-base);
  transition: all var(--transition-fast);
  background: white;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.form-input.input-error {
  border-color: var(--error-color);
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.form-select {
  cursor: pointer;
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
}

.textarea-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: var(--spacing-xs);
}

.character-count {
  font-size: var(--font-size-xs);
  color: var(--gray-500);
}

.error-message {
  font-size: var(--font-size-xs);
  color: var(--error-color);
  font-weight: var(--font-weight-medium);
  margin-top: var(--spacing-xs);
  display: block;
}

/* Información adicional */
.form-info {
  padding: 0 var(--spacing-xl) var(--spacing-xl);
}

.info-card {
  background: var(--gray-50);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  border: 1px solid var(--gray-200);
}

.info-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}

.info-icon {
  font-size: var(--font-size-lg);
}

.info-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--gray-900);
  margin: 0;
}

.info-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.info-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.item-icon {
  font-size: var(--font-size-base);
  color: var(--primary-color);
  flex-shrink: 0;
}

.item-text {
  font-size: var(--font-size-sm);
  color: var(--gray-700);
  line-height: 1.4;
}

/* Acciones del formulario */
.form-actions {
  padding: 0 var(--spacing-xl) var(--spacing-xl);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.submit-btn,
.reset-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  font-weight: var(--font-weight-semibold);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-icon.loading {
  animation: pulse 1s infinite;
}

/* Progreso del formulario */
.form-progress {
  padding: 0 var(--spacing-xl) var(--spacing-md);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.progress-bar {
  height: 6px;
  background: var(--gray-200);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--gradient-primary);
  border-radius: 3px;
  transition: width var(--transition-normal);
}

.progress-text {
  font-size: var(--font-size-xs);
  color: var(--gray-600);
  text-align: center;
}

/* Política de privacidad */
.form-privacy {
  padding: var(--spacing-lg) var(--spacing-xl);
  background: var(--gray-50);
  border-top: 1px solid var(--gray-200);
}

.privacy-text {
  font-size: var(--font-size-xs);
  color: var(--gray-600);
  text-align: center;
  margin: 0;
  line-height: 1.4;
}

.privacy-link {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: var(--font-weight-medium);
  transition: color var(--transition-fast);
}

.privacy-link:hover {
  color: var(--primary-dark);
  text-decoration: underline;
}

/* Estado de envío */
.submit-status {
  margin-top: var(--spacing-lg);
  padding: var(--spacing-lg);
  border-radius: var(--border-radius-lg);
  border: 1px solid;
}

.status-success {
  background: rgba(16, 185, 129, 0.1);
  border-color: var(--secondary-color);
}

.status-error {
  background: rgba(239, 68, 68, 0.1);
  border-color: var(--error-color);
}

.status-info {
  background: rgba(59, 130, 246, 0.1);
  border-color: var(--info-color);
}

.status-content {
  display: flex;
  gap: var(--spacing-md);
}

.status-icon {
  font-size: var(--font-size-xl);
  flex-shrink: 0;
}

.status-text {
  flex: 1;
}

.status-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  margin: 0 0 var(--spacing-xs) 0;
}

.status-success .status-title {
  color: var(--secondary-color);
}

.status-error .status-title {
  color: var(--error-color);
}

.status-info .status-title {
  color: var(--info-color);
}

.status-message {
  font-size: var(--font-size-base);
  color: var(--gray-700);
  margin: 0 0 var(--spacing-xs) 0;
  line-height: 1.5;
}

.status-reference {
  font-size: var(--font-size-sm);
  color: var(--gray-600);
  font-family: var(--font-family-mono);
  margin: 0;
  padding: var(--spacing-xs) var(--spacing-sm);
  background: rgba(0, 0, 0, 0.05);
  border-radius: var(--border-radius-sm);
  display: inline-block;
}

/* Responsive */
@media (max-width: 768px) {
  .form-fields,
  .form-info,
  .form-actions,
  .form-privacy {
    padding-left: var(--spacing-lg);
    padding-right: var(--spacing-lg);
  }

  .form-header {
    padding: var(--spacing-lg);
  }

  .form-group-split {
    grid-template-columns: 1fr;
    gap: var(--spacing-lg);
  }

  .form-actions {
    gap: var(--spacing-sm);
  }

  .submit-btn,
  .reset-btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .contact-form-container {
    margin: 0 var(--spacing-sm);
  }

  .form-fields,
  .form-info,
  .form-actions,
  .form-privacy {
    padding-left: var(--spacing-md);
    padding-right: var(--spacing-md);
  }

  .form-header {
    padding: var(--spacing-md);
  }

  .form-title {
    font-size: var(--font-size-xl);
  }
}
</style>
