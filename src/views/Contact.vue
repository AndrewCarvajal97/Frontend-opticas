<!--
  Vista Contact - Página de Contacto
  Implementa principios SOLID y Clean Architecture
  Formulario de contacto integrado con información adicional
-->

<template>
  <div class="contact-page">
    <!-- Header de la página -->
    <section class="page-header">
      <div class="container">
        <div class="header-content">
          <h1 class="page-title gradient-text">Contáctanos</h1>
          <p class="page-description">
            Estamos aquí para ayudarte con todas tus necesidades de cuidado visual
          </p>
          <div class="header-stats">
            <div class="stat-item">
              <span class="stat-number">⏰ 24h</span>
              <span class="stat-label">Tiempo de respuesta</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">⭐ 4.9</span>
              <span class="stat-label">Calificación promedio</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">🏠 100%</span>
              <span class="stat-label">Servicio a domicilio</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Formulario de contacto y información -->
    <section class="contact-section section">
      <div class="container">
        <div class="contact-layout">
          <!-- Formulario principal -->
          <div class="contact-form-area">
            <ContactForm
              :form-title="formTitle"
              :form-description="formDescription"
              :show-address="needsAddress"
              :show-date-time="needsDateTime"
              :show-service-type="true"
              :show-additional-info="true"
              :service-types="serviceTypes"
              @submit="handleFormSubmit"
              @privacy-click="handlePrivacyClick"
              @reset="handleFormReset"
            />
          </div>

          <!-- Información de contacto -->
          <div class="contact-info-area">
            <div class="info-section">
              <h3 class="info-title">
                <span class="title-icon">📞</span>
                Información de Contacto
              </h3>
              
              <div class="contact-methods">
                <div class="contact-method">
                  <div class="method-icon">📱</div>
                  <div class="method-content">
                    <h4 class="method-title">Teléfono / WhatsApp</h4>
                    <p class="method-value">{{ companyInfo.phone }}</p>
                    <p class="method-description">Disponible 24/7 para emergencias</p>
                    <button class="method-btn" @click="handleCallPhone">
                      <span class="btn-icon">📞</span>
                      <span class="btn-text">Llamar</span>
                    </button>
                  </div>
                </div>

                <div class="contact-method">
                  <div class="method-icon">✉️</div>
                  <div class="method-content">
                    <h4 class="method-title">Correo Electrónico</h4>
                    <p class="method-value">{{ companyInfo.email }}</p>
                    <p class="method-description">Respuesta en 24 horas</p>
                    <button class="method-btn" @click="handleSendEmail">
                      <span class="btn-icon">📧</span>
                      <span class="btn-text">Enviar Email</span>
                    </button>
                  </div>
                </div>

                <div class="contact-method">
                  <div class="method-icon">📍</div>
                  <div class="method-content">
                    <h4 class="method-title">Dirección</h4>
                    <p class="method-value">{{ companyInfo.address }}</p>
                    <p class="method-description">Abierto {{ companyInfo.workingHours }}</p>
                    <button class="method-btn" @click="handleOpenMaps">
                      <span class="btn-icon">🗺️</span>
                      <span class="btn-text">Ver en Mapa</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Horarios de atención -->
            <div class="info-section">
              <h3 class="info-title">
                <span class="title-icon">🕒</span>
                Horarios de Atención
              </h3>
              
              <div class="schedule-list">
                <div class="schedule-item">
                  <span class="schedule-day">Lunes - Viernes</span>
                  <span class="schedule-time">8:00 AM - 6:00 PM</span>
                </div>
                <div class="schedule-item">
                  <span class="schedule-day">Sábados</span>
                  <span class="schedule-time">9:00 AM - 4:00 PM</span>
                </div>
                <div class="schedule-item">
                  <span class="schedule-day">Domingos</span>
                  <span class="schedule-time">Cerrado</span>
                </div>
              </div>

              <div class="emergency-info">
                <div class="emergency-icon">🚨</div>
                <div class="emergency-content">
                  <h4 class="emergency-title">Servicio de Emergencia</h4>
                  <p class="emergency-description">
                    Disponible 24/7 con recargo del 50% sobre tarifa normal
                  </p>
                </div>
              </div>
            </div>

            <!-- Redes sociales -->
            <div class="info-section">
              <h3 class="info-title">
                <span class="title-icon">📱</span>
                Síguenos en Redes
              </h3>
              
              <div class="social-links">
                <a
                  v-for="(url, platform) in socialMedia"
                  :key="platform"
                  :href="url"
                  class="social-link"
                  :class="`social-${platform}`"
                  target="_blank"
                  rel="noopener noreferrer"
                  @click="handleSocialClick(platform)"
                >
                  <span class="social-icon">{{ getSocialIcon(platform) }}</span>
                  <span class="social-label">{{ getSocialLabel(platform) }}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Mapa (simulado) -->
    <section class="map-section">
      <div class="container">
        <div class="map-container">
          <div class="map-placeholder">
            <div class="map-content">
              <div class="map-icon">📍</div>
              <h3 class="map-title">Nuestra Ubicación</h3>
              <p class="map-address">{{ companyInfo.address }}</p>
              <button class="btn btn-primary" @click="handleOpenMaps">
                <span class="btn-icon">🗺️</span>
                <span class="btn-text">Abrir en Google Maps</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ de contacto -->
    <section class="faq-contact section bg-gray-50">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Preguntas Frecuentes</h2>
          <p class="section-description">
            Resuelve tus dudas antes de contactarnos
          </p>
        </div>

        <div class="faq-grid">
          <div
            v-for="(faq, index) in contactFaqs"
            :key="index"
            class="faq-item"
            :class="{ 'faq-open': openFaq === index }"
          >
            <button
              class="faq-question"
              @click="toggleFaq(index)"
            >
              <span class="question-icon">{{ faq.icon }}</span>
              <span class="question-text">{{ faq.question }}</span>
              <span class="question-toggle">{{ openFaq === index ? '−' : '+' }}</span>
            </button>
            <div class="faq-answer">
              <p class="answer-text">{{ faq.answer }}</p>
              <div v-if="faq.action" class="answer-action">
                <button
                  class="btn btn-sm btn-primary"
                  @click="handleFaqAction(faq.action)"
                >
                  {{ faq.actionText }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Call to Action alternativo -->
    <section class="cta-alternative section">
      <div class="container">
        <div class="cta-content">
          <div class="cta-text">
            <h2 class="cta-title">¿Prefieres que te llamemos nosotros?</h2>
            <p class="cta-description">
              Déjanos tu número y uno de nuestros especialistas se comunicará contigo 
              en los próximos 30 minutos.
            </p>
          </div>
          
          <div class="callback-form">
            <div class="callback-input-group">
              <input
                v-model="callbackPhone"
                type="tel"
                class="callback-input"
                placeholder="Tu número de teléfono"
                :class="{ 'input-error': callbackError }"
              />
              <button
                class="callback-btn"
                @click="handleCallbackRequest"
                :disabled="isRequestingCallback"
              >
                <span v-if="!isRequestingCallback" class="btn-icon">📞</span>
                <span v-else class="btn-icon loading">⏳</span>
                <span class="btn-text">Solicitar Llamada</span>
              </button>
            </div>
            <p v-if="callbackError" class="callback-error">{{ callbackError }}</p>
            <p class="callback-disclaimer">
              Te llamaremos en horario comercial. Sin costo ni compromiso.
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import ContactForm from '@/components/ContactForm.vue';
import { useNotifications } from '@/composables/useNotifications';
import { generalService } from '@/services/generalService';

// Route y composables
const route = useRoute();
const { showSuccess, showError, showInfo } = useNotifications();

// Estado reactivo
const isLoading = ref(true);
const companyInfo = ref<any>({});
const socialMedia = ref<any>({});
const openFaq = ref<number | null>(null);
const callbackPhone = ref('');
const callbackError = ref('');
const isRequestingCallback = ref(false);

// Computed properties para el formulario
const selectedService = computed(() => route.query.service as string || '');
const requestType = computed(() => route.query.type as string || '');

const formTitle = computed(() => {
  if (selectedService.value === 'examen-domicilio') {
    return 'Agendar Examen a Domicilio';
  }
  return 'Contáctanos';
});

const formDescription = computed(() => {
  if (selectedService.value === 'examen-domicilio') {
    return 'Programa tu examen óptico a domicilio de forma rápida y fácil';
  }
  return 'Completa el formulario y nos pondremos en contacto contigo en 24 horas';
});

const needsAddress = computed(() => {
  return selectedService.value === 'examen-domicilio' || requestType.value === 'booking';
});

const needsDateTime = computed(() => {
  return selectedService.value === 'examen-domicilio' || requestType.value === 'booking';
});

// Datos estáticos
const serviceTypes = [
  { value: 'examen-domicilio', label: 'Examen Óptico a Domicilio' },
  { value: 'productos', label: 'Consulta sobre Productos' },
  { value: 'montaje-express', label: 'Montaje Express' },
  { value: 'reparacion', label: 'Reparación de Gafas' },
  { value: 'asesoria', label: 'Asesoría Personalizada' },
  { value: 'garantia', label: 'Garantía o Cambios' },
  { value: 'otros', label: 'Otros Servicios' }
];

const contactFaqs = [
  {
    icon: '⏰',
    question: '¿En cuánto tiempo me contactan?',
    answer: 'Respondemos todos los mensajes en un máximo de 24 horas. Para citas de examen a domicilio, te contactamos el mismo día para confirmar disponibilidad.',
    action: null,
    actionText: ''
  },
  {
    icon: '🏠',
    question: '¿Cómo funciona el servicio a domicilio?',
    answer: 'Agenda tu cita, llegamos a tu hogar con todos los equipos necesarios y realizamos el examen completo. Si decides comprar lentes, el examen es completamente gratuito.',
    action: 'book-home-exam',
    actionText: 'Agendar Examen'
  },
  {
    icon: '💰',
    question: '¿Cuáles son los costos de los servicios?',
    answer: 'El examen a domicilio cuesta $50,000 pero es gratis al comprar lentes. Otros servicios como reparaciones tienen diagnóstico gratuito. Te enviamos presupuesto antes de cualquier trabajo.',
    action: 'view-prices',
    actionText: 'Ver Precios'
  },
  {
    icon: '📱',
    question: '¿Puedo contactarlos por WhatsApp?',
    answer: 'Sí, WhatsApp es una de nuestras formas de contacto preferidas. Puedes enviarnos un mensaje y te responderemos rápidamente en horario comercial.',
    action: 'whatsapp',
    actionText: 'Enviar WhatsApp'
  },
  {
    icon: '🚨',
    question: '¿Tienen servicio de emergencia?',
    answer: 'Sí, ofrecemos servicio de emergencia 24/7 para casos urgentes. Aplica un recargo del 50% sobre la tarifa normal, pero estamos disponibles cuando nos necesites.',
    action: 'emergency-contact',
    actionText: 'Contacto Emergencia'
  }
];

// Métodos
const loadContactData = async (): Promise<void> => {
  try {
    isLoading.value = true;
    
    const generalResponse = await generalService.getGeneralContent();
    companyInfo.value = generalResponse.data.general;
    
    const socialResponse = await generalService.getSocialMedia();
    socialMedia.value = socialResponse.data;
    
  } catch (error) {
    console.error('Error loading contact data:', error);
    showError('Error', 'No se pudo cargar la información de contacto');
  } finally {
    isLoading.value = false;
  }
};

const handleFormSubmit = async (formData: any): Promise<void> => {
  try {
    const response = await generalService.submitContactForm({
      ...formData,
      serviceType: selectedService.value || formData.serviceType
    });
    
    showSuccess(
      '¡Mensaje Enviado!',
      `Hemos recibido tu solicitud. Referencia: ${response.data.contactId}`
    );
    
  } catch (error) {
    showError('Error', 'No se pudo enviar el mensaje. Intenta nuevamente.');
  }
};

const handlePrivacyClick = (): void => {
  showInfo(
    'Política de Privacidad',
    'Tus datos están protegidos según nuestra política de privacidad. Solo los usamos para contactarte sobre tu solicitud.'
  );
};

const handleFormReset = (): void => {
  showInfo('Formulario', 'El formulario ha sido limpiado');
};

const handleCallPhone = (): void => {
  window.open(`tel:${companyInfo.value.phone}`, '_self');
};

const handleSendEmail = (): void => {
  window.open(`mailto:${companyInfo.value.email}`, '_self');
};

const handleOpenMaps = (): void => {
  const address = encodeURIComponent(companyInfo.value.address);
  window.open(`https://maps.google.com/?q=${address}`, '_blank');
};

const handleSocialClick = (platform: string): void => {
  showInfo('Redes Sociales', `Abriendo ${getSocialLabel(platform)}`);
};

const getSocialIcon = (platform: string): string => {
  const icons = {
    facebook: '📘',
    instagram: '📸',
    whatsapp: '💬',
    twitter: '🐦'
  };
  return icons[platform as keyof typeof icons] || '🔗';
};

const getSocialLabel = (platform: string): string => {
  const labels = {
    facebook: 'Facebook',
    instagram: 'Instagram',
    whatsapp: 'WhatsApp',
    twitter: 'Twitter'
  };
  return labels[platform as keyof typeof labels] || platform;
};

const toggleFaq = (index: number): void => {
  openFaq.value = openFaq.value === index ? null : index;
};

const handleFaqAction = (action: string): void => {
  switch (action) {
    case 'book-home-exam':
      // Scroll al formulario y preseleccionar servicio
      selectedService.value = 'examen-domicilio';
      document.querySelector('.contact-form-area')?.scrollIntoView({ behavior: 'smooth' });
      break;
    case 'view-prices':
      showInfo('Precios', 'Consulta nuestros precios directamente o solicita un presupuesto personalizado');
      break;
    case 'whatsapp':
      window.open(`https://wa.me/${companyInfo.value.phone.replace(/\D/g, '')}`, '_blank');
      break;
    case 'emergency-contact':
      showInfo(
        'Emergencias',
        `Para emergencias llama al ${companyInfo.value.phone}. Disponible 24/7 con recargo del 50%.`
      );
      break;
  }
};

const handleCallbackRequest = async (): Promise<void> => {
  callbackError.value = '';
  
  if (!callbackPhone.value.trim()) {
    callbackError.value = 'Por favor ingresa tu número de teléfono';
    return;
  }
  
  const phoneRegex = /^(\+57|57)?[0-9]{10}$/;
  const cleanPhone = callbackPhone.value.replace(/[\s\-\(\)]/g, '');
  
  if (!phoneRegex.test(cleanPhone)) {
    callbackError.value = 'Número de teléfono inválido';
    return;
  }
  
  isRequestingCallback.value = true;
  
  try {
    // Simular solicitud de callback
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    showSuccess(
      '¡Solicitud Enviada!',
      'Te llamaremos en los próximos 30 minutos'
    );
    
    callbackPhone.value = '';
    
  } catch (error) {
    showError('Error', 'No se pudo procesar tu solicitud');
  } finally {
    isRequestingCallback.value = false;
  }
};

// Lifecycle hooks
onMounted(() => {
  loadContactData();
});
</script>

<style scoped>
.contact-page {
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

.header-stats {
  display: flex;
  justify-content: center;
  gap: var(--spacing-xl);
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs);
  background: rgba(255, 255, 255, 0.1);
  padding: var(--spacing-lg);
  border-radius: var(--border-radius-xl);
  backdrop-filter: blur(10px);
  min-width: 150px;
}

.stat-number {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
}

.stat-label {
  font-size: var(--font-size-sm);
  opacity: 0.9;
}

/* Contact Section */
.section {
  padding: var(--spacing-4xl) 0;
}

.contact-layout {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--spacing-4xl);
  align-items: start;
}

.contact-form-area {
  background: white;
  border-radius: var(--border-radius-2xl);
  box-shadow: var(--shadow-xl);
}

.contact-info-area {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2xl);
}

/* Info Sections */
.info-section {
  background: white;
  border-radius: var(--border-radius-xl);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-md);
}

.info-title {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--gray-900);
  margin-bottom: var(--spacing-lg);
}

.title-icon {
  font-size: var(--font-size-lg);
}

/* Contact Methods */
.contact-methods {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.contact-method {
  display: flex;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  background: var(--gray-50);
  border-radius: var(--border-radius-lg);
  transition: all var(--transition-normal);
}

.contact-method:hover {
  background: var(--gray-100);
  transform: translateY(-2px);
}

.method-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.method-content {
  flex: 1;
}

.method-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--gray-900);
  margin-bottom: var(--spacing-xs);
}

.method-value {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  color: var(--primary-color);
  margin-bottom: var(--spacing-xs);
}

.method-description {
  font-size: var(--font-size-sm);
  color: var(--gray-600);
  margin-bottom: var(--spacing-md);
}

.method-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-md);
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.method-btn:hover {
  background: var(--primary-dark);
  transform: translateY(-1px);
}

/* Schedule */
.schedule-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-lg);
}

.schedule-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-sm) 0;
  border-bottom: 1px solid var(--gray-200);
}

.schedule-day {
  font-weight: var(--font-weight-medium);
  color: var(--gray-700);
}

.schedule-time {
  font-weight: var(--font-weight-semibold);
  color: var(--primary-color);
}

.emergency-info {
  display: flex;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: var(--error-color);
  color: white;
  border-radius: var(--border-radius-lg);
}

.emergency-icon {
  font-size: var(--font-size-xl);
  flex-shrink: 0;
}

.emergency-title {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--spacing-xs);
}

.emergency-description {
  font-size: var(--font-size-sm);
  opacity: 0.9;
  margin: 0;
}

/* Social Links */
.social-links {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-md);
}

.social-link {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  background: var(--gray-50);
  color: var(--gray-700);
  text-decoration: none;
  border-radius: var(--border-radius-lg);
  transition: all var(--transition-fast);
}

.social-link:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.social-facebook:hover { background: #1877f2; color: white; }
.social-instagram:hover { background: linear-gradient(45deg, #f09433, #e6683c); color: white; }
.social-whatsapp:hover { background: #25d366; color: white; }
.social-twitter:hover { background: #1da1f2; color: white; }

.social-icon {
  font-size: var(--font-size-lg);
}

.social-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

/* Map Section */
.map-section {
  background: var(--gray-100);
  padding: var(--spacing-2xl) 0;
}

.map-container {
  background: white;
  border-radius: var(--border-radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-lg);
}

.map-placeholder {
  height: 300px;
  background: linear-gradient(135deg, var(--gray-200) 0%, var(--gray-300) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.map-content {
  text-align: center;
  color: var(--gray-700);
}

.map-icon {
  font-size: 3rem;
  margin-bottom: var(--spacing-lg);
}

.map-title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--spacing-md);
}

.map-address {
  font-size: var(--font-size-lg);
  margin-bottom: var(--spacing-xl);
}

/* FAQ Contact */
.faq-contact {
  background: var(--gray-50);
}

.section-header {
  text-align: center;
  margin-bottom: var(--spacing-3xl);
}

.section-title {
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-extrabold);
  color: var(--gray-900);
  margin-bottom: var(--spacing-lg);
}

.section-description {
  font-size: var(--font-size-lg);
  color: var(--gray-600);
  max-width: 600px;
  margin: 0 auto;
}

.faq-grid {
  max-width: 800px;
  margin: 0 auto;
}

.faq-item {
  background: white;
  border-radius: var(--border-radius-xl);
  margin-bottom: var(--spacing-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-normal);
}

.faq-item:hover {
  box-shadow: var(--shadow-md);
}

.faq-question {
  width: 100%;
  padding: var(--spacing-lg);
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--gray-900);
  transition: background var(--transition-fast);
}

.faq-question:hover {
  background: var(--gray-50);
}

.question-icon {
  font-size: var(--font-size-xl);
  flex-shrink: 0;
}

.question-text {
  flex: 1;
}

.question-toggle {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--primary-color);
  transition: transform var(--transition-fast);
}

.faq-open .question-toggle {
  transform: rotate(180deg);
}

.faq-answer {
  max-height: 0;
  overflow: hidden;
  transition: max-height var(--transition-normal);
}

.faq-open .faq-answer {
  max-height: 300px;
}

.answer-text {
  padding: 0 var(--spacing-lg) var(--spacing-md);
  color: var(--gray-600);
  line-height: 1.6;
  margin: 0;
}

.answer-action {
  padding: 0 var(--spacing-lg) var(--spacing-lg);
}

/* CTA Alternative */
.cta-alternative {
  background: var(--gradient-secondary);
  color: white;
}

.cta-content {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: var(--spacing-3xl);
  align-items: center;
  max-width: 1000px;
  margin: 0 auto;
}

.cta-title {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--spacing-md);
}

.cta-description {
  font-size: var(--font-size-lg);
  opacity: 0.95;
  line-height: 1.6;
  margin: 0;
}

.callback-form {
  min-width: 350px;
}

.callback-input-group {
  display: flex;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-sm);
}

.callback-input {
  flex: 1;
  padding: var(--spacing-sm) var(--spacing-md);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: var(--border-radius-lg);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: var(--font-size-base);
  backdrop-filter: blur(10px);
}

.callback-input::placeholder {
  color: rgba(255, 255, 255, 0.7);
}

.callback-input:focus {
  outline: none;
  border-color: white;
  background: rgba(255, 255, 255, 0.2);
}

.callback-input.input-error {
  border-color: var(--error-color);
}

.callback-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-lg);
  background: white;
  color: var(--secondary-color);
  border: none;
  border-radius: var(--border-radius-lg);
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  transition: all var(--transition-fast);
  white-space: nowrap;
}

.callback-btn:hover:not(:disabled) {
  background: var(--gray-100);
  transform: translateY(-1px);
}

.callback-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.callback-error {
  color: var(--error-color);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  margin: 0 0 var(--spacing-sm) 0;
  background: rgba(255, 255, 255, 0.1);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-md);
}

.callback-disclaimer {
  font-size: var(--font-size-xs);
  opacity: 0.8;
  margin: 0;
  text-align: center;
}

.btn-icon.loading {
  animation: pulse 1s infinite;
}

/* Responsive */
@media (max-width: 1024px) {
  .contact-layout,
  .cta-content {
    grid-template-columns: 1fr;
    gap: var(--spacing-2xl);
  }

  .callback-form {
    min-width: auto;
    max-width: 400px;
    margin: 0 auto;
  }

  .cta-content {
    text-align: center;
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

  .header-stats {
    gap: var(--spacing-md);
  }

  .stat-item {
    min-width: 120px;
    padding: var(--spacing-md);
  }

  .social-links {
    grid-template-columns: 1fr;
  }

  .callback-input-group {
    flex-direction: column;
  }

  .callback-btn {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .header-stats {
    flex-direction: column;
    align-items: center;
  }

  .contact-method {
    flex-direction: column;
    text-align: center;
  }

  .method-icon {
    align-self: center;
  }
}
</style>
