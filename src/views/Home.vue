<!--
  Vista Home - Página Principal
  Implementa principios SOLID y Clean Architecture
  Combina múltiples componentes para crear la experiencia principal
-->

<template>
  <div class="home-page">
    <!-- Hero Section -->
    <HeroSection
      :hero-content="heroContent"
      @primary-action="handlePrimaryAction"
      @secondary-action="handleSecondaryAction"
      @offer-action="handleOfferAction"
      @scroll-down="handleScrollDown"
    />

    <!-- Sección About/Por qué elegirnos -->
    <section id="about" class="about-section section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title gradient-text">{{ aboutContent.title }}</h2>
          <p class="section-description">{{ aboutContent.description }}</p>
        </div>

        <div class="features-grid">
          <div
            v-for="(feature, index) in aboutContent.features"
            :key="index"
            class="feature-card animate-slideInUp"
            :style="{ animationDelay: `${index * 100}ms` }"
          >
            <div class="feature-icon">
              <span class="icon-display">{{ feature.icon }}</span>
            </div>
            <div class="feature-content">
              <h3 class="feature-title">{{ feature.title }}</h3>
              <p class="feature-description">{{ feature.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Sección Servicios Destacados -->
    <section class="featured-services section bg-gray-50">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Nuestros Servicios Principales</h2>
          <p class="section-description">
            Descubre la gama completa de servicios ópticos que ofrecemos
          </p>
        </div>

        <div class="services-grid">
          <ServiceCard
            v-for="service in featuredServices"
            :key="service.id"
            :service="service"
            :show-includes="false"
            :show-benefits="false"
            :max-features="2"
            @book-service="handleBookService"
            @request-service="handleRequestService"
            @view-details="handleServiceDetails"
          />
        </div>

        <div class="section-cta">
          <router-link to="/servicios" class="btn btn-primary btn-lg">
            <span class="btn-icon">⚕️</span>
            <span class="btn-text">Ver Todos los Servicios</span>
          </router-link>
        </div>
      </div>
    </section>

    <!-- Sección Productos Destacados -->
    <section class="featured-products section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Productos Destacados</h2>
          <p class="section-description">
            Los productos más populares y mejor valorados por nuestros clientes
          </p>
        </div>

        <!-- Filtros de productos -->
        <div class="products-filters">
          <button
            v-for="category in productCategories"
            :key="category.id"
            class="filter-btn"
            :class="{ 'filter-active': activeCategory === category.id }"
            @click="setActiveCategory(category.id)"
          >
            <span class="filter-icon">{{ category.icon }}</span>
            <span class="filter-text">{{ category.name }}</span>
          </button>
        </div>

        <div class="products-grid">
          <ProductCard
            v-for="product in filteredProducts"
            :key="product.id"
            :product="product"
            :featured="featuredProductIds.includes(product.id)"
            :on-sale="product.discount > 0"
            :show-features="false"
            @add-to-cart="handleAddToCart"
            @view-details="handleProductDetails"
            @quick-view="handleQuickView"
            @wishlist="handleWishlist"
          />
        </div>

        <div class="section-cta">
          <router-link to="/productos" class="btn btn-outline btn-lg">
            <span class="btn-icon">👓</span>
            <span class="btn-text">Ver Todos los Productos</span>
          </router-link>
        </div>
      </div>
    </section>

    <!-- Sección Call to Action Principal -->
    <section class="main-cta section">
      <div class="container">
        <div class="cta-content">
          <div class="cta-text">
            <h2 class="cta-title">¿Listo para mejorar tu visión?</h2>
            <p class="cta-description">
              Agenda tu examen óptico a domicilio hoy mismo y descubre la diferencia 
              de un servicio personalizado y profesional.
            </p>
            <div class="cta-features">
              <div class="cta-feature">
                <span class="feature-icon">🏠</span>
                <span class="feature-text">Examen en tu hogar</span>
              </div>
              <div class="cta-feature">
                <span class="feature-icon">👨‍⚕️</span>
                <span class="feature-text">Profesionales certificados</span>
              </div>
              <div class="cta-feature">
                <span class="feature-icon">💰</span>
                <span class="feature-text">Gratis con compra de lentes</span>
              </div>
            </div>
          </div>
          
          <div class="cta-actions">
            <button class="btn btn-primary btn-xl cta-primary" @click="handleBookExam">
              <span class="btn-icon">📞</span>
              <span class="btn-text">Agendar Examen</span>
            </button>
            
            <button class="btn btn-outline btn-xl cta-secondary" @click="handleWhatsApp">
              <span class="btn-icon">💬</span>
              <span class="btn-text">WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonios -->
    <section class="testimonials section bg-gray-50">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Lo que dicen nuestros clientes</h2>
          <p class="section-description">
            Miles de familias confían en nosotros para el cuidado de su visión
          </p>
        </div>

        <div class="testimonials-grid">
          <div
            v-for="(testimonial, index) in testimonials"
            :key="index"
            class="testimonial-card"
          >
            <div class="testimonial-content">
              <div class="testimonial-rating">
                <span v-for="star in 5" :key="star" class="star">⭐</span>
              </div>
              <p class="testimonial-text">"{{ testimonial.text }}"</p>
            </div>
            <div class="testimonial-author">
              <div class="author-avatar">
                <span class="avatar-text">{{ testimonial.author[0] }}</span>
              </div>
              <div class="author-info">
                <h4 class="author-name">{{ testimonial.author }}</h4>
                <p class="author-location">{{ testimonial.location }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Sección FAQ -->
    <section class="faq-section section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Preguntas Frecuentes</h2>
          <p class="section-description">
            Resolvemos las dudas más comunes sobre nuestros servicios
          </p>
        </div>

        <div class="faq-list">
          <div
            v-for="(faq, index) in faqs"
            :key="index"
            class="faq-item"
            :class="{ 'faq-open': openFaq === index }"
          >
            <button
              class="faq-question"
              @click="toggleFaq(index)"
            >
              <span class="question-text">{{ faq.question }}</span>
              <span class="question-icon">{{ openFaq === index ? '−' : '+' }}</span>
            </button>
            <div class="faq-answer">
              <p class="answer-text">{{ faq.answer }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Newsletter -->
    <section class="newsletter-section section">
      <div class="container">
        <div class="newsletter-content">
          <div class="newsletter-text">
            <h2 class="newsletter-title">¡Mantente al día!</h2>
            <p class="newsletter-description">
              Recibe promociones exclusivas, consejos para el cuidado visual y novedades directamente en tu email.
            </p>
          </div>
          
          <form class="newsletter-form" @submit.prevent="handleNewsletterSubmit">
            <div class="newsletter-input-group">
              <input
                v-model="newsletterEmail"
                type="email"
                class="newsletter-input"
                placeholder="Tu email aquí..."
                required
              />
              <button
                type="submit"
                class="newsletter-btn"
                :disabled="isSubmittingNewsletter"
              >
                <span v-if="!isSubmittingNewsletter" class="btn-icon">📧</span>
                <span v-else class="btn-icon loading">⏳</span>
                <span class="btn-text">Suscribirse</span>
              </button>
            </div>
            <p class="newsletter-disclaimer">
              No spam. Puedes cancelar la suscripción en cualquier momento.
            </p>
          </form>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import HeroSection from '@/components/HeroSection.vue';
import ServiceCard from '@/components/ServiceCard.vue';
import ProductCard from '@/components/ProductCard.vue';
import { useShoppingCart } from '@/composables/useShoppingCart';
import { useNotifications } from '@/composables/useNotifications';
import { generalService } from '@/services/generalService';
import { servicesService } from '@/services/servicesService';
import { productsService } from '@/services/productsService';
import type { OpticalService } from '@/services/servicesService';
import type { Product } from '@/services/productsService';

// Router y composables
const router = useRouter();
const { addToCart } = useShoppingCart();
const { showSuccess, showError } = useNotifications();

// Estado reactivo
const isLoading = ref(true);
const heroContent = ref<any>({});
const aboutContent = ref<any>({});
const featuredServices = ref<OpticalService[]>([]);
const featuredProducts = ref<Product[]>([]);
const productCategories = ref<any[]>([]);
const activeCategory = ref('todos');
const openFaq = ref<number | null>(null);
const newsletterEmail = ref('');
const isSubmittingNewsletter = ref(false);

// Datos estáticos
const featuredProductIds = ['mont-001', 'lent-003', 'sol-003'];

const testimonials = [
  {
    text: "El examen a domicilio fue increíble. Muy profesional y cómodo. ¡Definitivamente lo recomiendo!",
    author: "María González",
    location: "Pedraza, Magdalena"
  },
  {
    text: "Excelente atención y productos de calidad. Las gafas que compré son perfectas y llegaron súper rápido.",
    author: "Carlos Pérez",
    location: "Santa Marta, Magdalena"
  },
  {
    text: "El servicio de reparación fue rápido y económico. Mi montura favorita quedó como nueva.",
    author: "Ana Rodríguez",
    location: "Barranquilla, Atlántico"
  }
];

const faqs = [
  {
    question: "¿Cómo funciona el examen óptico a domicilio?",
    answer: "Nuestro optometrista certificado va a tu hogar con todo el equipo necesario para realizar un examen completo. El proceso toma entre 45-60 minutos y es completamente gratuito si compras tus lentes con nosotros."
  },
  {
    question: "¿Qué zonas cubren para el servicio a domicilio?",
    answer: "Cubrimos todo Pedraza y municipios cercanos. Para zonas más alejadas, consulta disponibilidad y posibles costos adicionales de transporte."
  },
  {
    question: "¿Cuánto tiempo tardan en entregar las gafas?",
    answer: "El tiempo de entrega depende del tipo de lentes. Para lentes simples: 3-5 días hábiles. Para lentes especiales o progresivos: 7-10 días hábiles."
  },
  {
    question: "¿Ofrecen garantía en sus productos?",
    answer: "Sí, todos nuestros productos tienen garantía. Las monturas tienen 1 año de garantía por defectos de fabricación y los lentes 6 meses. Además, ofrecemos planes de garantía extendida."
  },
  {
    question: "¿Puedo cambiar mis lentes si no me adapto?",
    answer: "Absolutamente. Ofrecemos un período de adaptación de 30 días. Si no te adaptas a tus nuevos lentes, los cambiamos sin costo adicional."
  }
];

// Computed properties
const filteredProducts = computed(() => {
  if (activeCategory.value === 'todos') {
    return featuredProducts.value;
  }
  return featuredProducts.value.filter(product => product.category === activeCategory.value);
});

// Métodos
const loadPageData = async (): Promise<void> => {
  try {
    isLoading.value = true;

    // Cargar contenido general
    const generalResponse = await generalService.getGeneralContent();
    heroContent.value = generalResponse.data.hero;
    aboutContent.value = generalResponse.data.about;

    // Cargar servicios destacados
    const servicesResponse = await servicesService.getFeaturedServices();
    featuredServices.value = servicesResponse.data.slice(0, 3);

    // Cargar productos destacados
    const productsResponse = await productsService.getFeaturedProducts();
    featuredProducts.value = productsResponse.data;

    // Cargar categorías de productos
    const categoriesResponse = await productsService.getCategories();
    productCategories.value = [
      { id: 'todos', name: 'Todos', icon: '🔍' },
      ...categoriesResponse.data
    ];

  } catch (error) {
    console.error('Error loading page data:', error);
    showError('Error', 'No se pudo cargar el contenido de la página');
  } finally {
    isLoading.value = false;
  }
};

const handlePrimaryAction = (): void => {
  router.push('/contacto');
};

const handleSecondaryAction = (): void => {
  router.push('/productos');
};

const handleOfferAction = (): void => {
  router.push('/contacto?service=examen-domicilio');
};

const handleScrollDown = (): void => {
  const aboutSection = document.getElementById('about');
  if (aboutSection) {
    aboutSection.scrollIntoView({ behavior: 'smooth' });
  }
};

const handleBookService = (service: OpticalService): void => {
  router.push(`/contacto?service=${service.id}`);
};

const handleRequestService = (service: OpticalService): void => {
  router.push(`/contacto?service=${service.id}`);
};

const handleServiceDetails = (service: OpticalService): void => {
  router.push(`/servicios/${service.id}`);
};

const handleAddToCart = (product: Product, options: any): void => {
  const success = addToCart(product, 1, options);
  if (success) {
    showSuccess('¡Agregado!', `${product.name} se agregó al carrito`);
  } else {
    showError('Error', 'No se pudo agregar el producto al carrito');
  }
};

const handleProductDetails = (product: Product): void => {
  router.push(`/productos/${product.id}`);
};

const handleQuickView = (product: Product): void => {
  // Implementar modal de vista rápida
  console.log('Quick view:', product);
};

const handleWishlist = (product: Product): void => {
  showSuccess('❤️ Agregado', `${product.name} se agregó a favoritos`);
};

const setActiveCategory = (categoryId: string): void => {
  activeCategory.value = categoryId;
};

const toggleFaq = (index: number): void => {
  openFaq.value = openFaq.value === index ? null : index;
};

const handleBookExam = (): void => {
  router.push('/contacto?service=examen-domicilio');
};

const handleWhatsApp = (): void => {
  window.open('https://wa.me/573001234567', '_blank');
};

const handleNewsletterSubmit = async (): Promise<void> => {
  if (!newsletterEmail.value.trim()) return;

  isSubmittingNewsletter.value = true;
  
  try {
    await generalService.subscribeNewsletter({ email: newsletterEmail.value });
    showSuccess('¡Suscrito!', 'Te has suscrito exitosamente a nuestro newsletter');
    newsletterEmail.value = '';
  } catch (error) {
    showError('Error', 'No se pudo completar la suscripción');
  } finally {
    isSubmittingNewsletter.value = false;
  }
};

// Lifecycle hooks
onMounted(() => {
  loadPageData();
});
</script>

<style scoped>
.home-page {
  min-height: 100vh;
}

/* Secciones generales */
.section {
  padding: var(--spacing-4xl) 0;
}

.section-header {
  text-align: center;
  margin-bottom: var(--spacing-3xl);
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.section-title {
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-extrabold);
  margin-bottom: var(--spacing-lg);
  line-height: 1.2;
}

.section-description {
  font-size: var(--font-size-lg);
  color: var(--gray-600);
  line-height: 1.6;
  margin: 0;
}

.section-cta {
  text-align: center;
  margin-top: var(--spacing-3xl);
}

/* About Section */
.about-section {
  background: linear-gradient(135deg, var(--gray-50) 0%, white 100%);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-xl);
}

.feature-card {
  display: flex;
  gap: var(--spacing-lg);
  padding: var(--spacing-xl);
  background: white;
  border-radius: var(--border-radius-xl);
  box-shadow: var(--shadow-md);
  transition: all var(--transition-normal);
  opacity: 0;
  animation: slideInUp 0.6s ease-out forwards;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
}

.feature-icon {
  flex-shrink: 0;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--gradient-primary);
  border-radius: var(--border-radius-xl);
  box-shadow: var(--shadow-lg);
}

.icon-display {
  font-size: 2.5rem;
  filter: grayscale(100%) brightness(0) invert(1);
}

.feature-content {
  flex: 1;
}

.feature-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--gray-900);
  margin: 0 0 var(--spacing-sm) 0;
}

.feature-description {
  font-size: var(--font-size-base);
  color: var(--gray-600);
  line-height: 1.6;
  margin: 0;
}

/* Services Grid */
.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: var(--spacing-xl);
}

/* Products Section */
.products-filters {
  display: flex;
  justify-content: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-3xl);
  flex-wrap: wrap;
}

.filter-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-lg);
  background: white;
  border: 2px solid var(--gray-300);
  border-radius: var(--border-radius-full);
  cursor: pointer;
  transition: all var(--transition-fast);
  font-weight: var(--font-weight-medium);
  color: var(--gray-700);
}

.filter-btn:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.filter-active {
  background: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
}

.filter-icon {
  font-size: var(--font-size-base);
}

.filter-text {
  font-size: var(--font-size-sm);
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--spacing-xl);
}

/* Main CTA Section */
.main-cta {
  background: var(--gradient-hero);
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
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-extrabold);
  margin: 0 0 var(--spacing-lg) 0;
  line-height: 1.2;
}

.cta-description {
  font-size: var(--font-size-lg);
  line-height: 1.6;
  margin: 0 0 var(--spacing-xl) 0;
  opacity: 0.95;
}

.cta-features {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.cta-feature {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.cta-feature .feature-icon {
  font-size: var(--font-size-lg);
}

.cta-feature .feature-text {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
}

.cta-actions {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  min-width: 250px;
}

.cta-primary,
.cta-secondary {
  justify-content: center;
  gap: var(--spacing-sm);
  font-weight: var(--font-weight-semibold);
}

/* Testimonials */
.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-xl);
}

.testimonial-card {
  background: white;
  padding: var(--spacing-xl);
  border-radius: var(--border-radius-xl);
  box-shadow: var(--shadow-md);
  transition: transform var(--transition-normal);
}

.testimonial-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.testimonial-rating {
  margin-bottom: var(--spacing-md);
}

.testimonial-rating .star {
  font-size: var(--font-size-sm);
  margin-right: 2px;
}

.testimonial-text {
  font-size: var(--font-size-base);
  line-height: 1.6;
  color: var(--gray-700);
  margin: 0 0 var(--spacing-lg) 0;
  font-style: italic;
}

.testimonial-author {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.author-avatar {
  width: 50px;
  height: 50px;
  background: var(--primary-color);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.avatar-text {
  color: white;
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-lg);
}

.author-name {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--gray-900);
  margin: 0;
}

.author-location {
  font-size: var(--font-size-sm);
  color: var(--gray-600);
  margin: 0;
}

/* FAQ Section */
.faq-list {
  max-width: 800px;
  margin: 0 auto;
}

.faq-item {
  border: 1px solid var(--gray-200);
  border-radius: var(--border-radius-lg);
  margin-bottom: var(--spacing-md);
  overflow: hidden;
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
  justify-content: space-between;
  align-items: center;
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
  font-weight: var(--font-weight-bold);
  color: var(--primary-color);
  transition: transform var(--transition-fast);
}

.faq-open .question-icon {
  transform: rotate(180deg);
}

.faq-answer {
  max-height: 0;
  overflow: hidden;
  transition: max-height var(--transition-normal);
}

.faq-open .faq-answer {
  max-height: 200px;
}

.answer-text {
  padding: 0 var(--spacing-lg) var(--spacing-lg);
  font-size: var(--font-size-base);
  line-height: 1.6;
  color: var(--gray-600);
  margin: 0;
}

/* Newsletter Section */
.newsletter-section {
  background: var(--gradient-primary);
  color: white;
}

.newsletter-content {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: var(--spacing-3xl);
  align-items: center;
  max-width: 900px;
  margin: 0 auto;
}

.newsletter-title {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  margin: 0 0 var(--spacing-md) 0;
}

.newsletter-description {
  font-size: var(--font-size-lg);
  line-height: 1.6;
  margin: 0;
  opacity: 0.95;
}

.newsletter-form {
  min-width: 350px;
}

.newsletter-input-group {
  display: flex;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-sm);
}

.newsletter-input {
  flex: 1;
  padding: var(--spacing-sm) var(--spacing-md);
  border: none;
  border-radius: var(--border-radius-lg);
  font-size: var(--font-size-base);
}

.newsletter-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-lg);
  background: white;
  color: var(--primary-color);
  border: none;
  border-radius: var(--border-radius-lg);
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  transition: all var(--transition-fast);
  white-space: nowrap;
}

.newsletter-btn:hover:not(:disabled) {
  background: var(--gray-100);
}

.newsletter-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.newsletter-disclaimer {
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
  .cta-content,
  .newsletter-content {
    grid-template-columns: 1fr;
    gap: var(--spacing-2xl);
    text-align: center;
  }

  .cta-actions {
    align-self: center;
    min-width: auto;
    max-width: 300px;
    margin: 0 auto;
  }

  .newsletter-form {
    min-width: auto;
    max-width: 400px;
    margin: 0 auto;
  }
}

@media (max-width: 768px) {
  .section {
    padding: var(--spacing-2xl) 0;
  }

  .features-grid,
  .services-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-lg);
  }

  .feature-card {
    flex-direction: column;
    text-align: center;
  }

  .products-filters {
    gap: var(--spacing-sm);
  }

  .filter-btn {
    padding: var(--spacing-xs) var(--spacing-md);
  }

  .products-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: var(--spacing-lg);
  }

  .newsletter-input-group {
    flex-direction: column;
  }

  .newsletter-btn {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .section-title {
    font-size: var(--font-size-3xl);
  }

  .cta-title {
    font-size: var(--font-size-3xl);
  }

  .newsletter-title {
    font-size: var(--font-size-2xl);
  }

  .cta-actions {
    width: 100%;
  }

  .cta-primary,
  .cta-secondary {
    width: 100%;
  }
}
</style>
