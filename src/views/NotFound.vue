<!--
  Vista 404 - Página No Encontrada
  Diseño atractivo y útil para cuando el usuario accede a una ruta que no existe
-->

<template>
  <div class="not-found-page">
    <div class="container">
      <div class="not-found-content">
        <!-- Ilustración 404 -->
        <div class="not-found-illustration">
          <div class="glasses-icon">
            <div class="glasses-frame">
              <div class="lens left-lens"></div>
              <div class="bridge"></div>
              <div class="lens right-lens"></div>
              <div class="temple left-temple"></div>
              <div class="temple right-temple"></div>
            </div>
            <div class="crack-line"></div>
          </div>
          <div class="error-number">404</div>
        </div>

        <!-- Contenido de error -->
        <div class="not-found-text">
          <h1 class="error-title">¡Oops! Página no encontrada</h1>
          <p class="error-description">
            La página que buscas parece haberse perdido como unas gafas sin su estuche. 
            Pero no te preocupes, te ayudamos a encontrar lo que necesitas.
          </p>

          <!-- Sugerencias útiles -->
          <div class="helpful-links">
            <h3 class="suggestions-title">¿Qué tal si intentas con estas opciones?</h3>
            <div class="link-grid">
              <router-link to="/" class="suggestion-card">
                <div class="suggestion-icon">🏠</div>
                <div class="suggestion-content">
                  <h4 class="suggestion-title">Ir al Inicio</h4>
                  <p class="suggestion-desc">Vuelve a la página principal</p>
                </div>
              </router-link>

              <router-link to="/productos" class="suggestion-card">
                <div class="suggestion-icon">👓</div>
                <div class="suggestion-content">
                  <h4 class="suggestion-title">Ver Productos</h4>
                  <p class="suggestion-desc">Explora nuestro catálogo</p>
                </div>
              </router-link>

              <router-link to="/servicios" class="suggestion-card">
                <div class="suggestion-icon">⚕️</div>
                <div class="suggestion-content">
                  <h4 class="suggestion-title">Nuestros Servicios</h4>
                  <p class="suggestion-desc">Examen a domicilio y más</p>
                </div>
              </router-link>

              <router-link to="/contacto" class="suggestion-card">
                <div class="suggestion-icon">📞</div>
                <div class="suggestion-content">
                  <h4 class="suggestion-title">Contáctanos</h4>
                  <p class="suggestion-desc">¿Necesitas ayuda?</p>
                </div>
              </router-link>
            </div>
          </div>

          <!-- Acciones principales -->
          <div class="action-buttons">
            <button @click="goBack" class="btn btn-outline btn-lg">
              <span class="btn-icon">↶</span>
              <span class="btn-text">Volver Atrás</span>
            </button>
            <router-link to="/" class="btn btn-primary btn-lg">
              <span class="btn-icon">🏠</span>
              <span class="btn-text">Ir al Inicio</span>
            </router-link>
          </div>

          <!-- Información de contacto rápido -->
          <div class="quick-contact">
            <p class="contact-text">¿No encuentras lo que buscas?</p>
            <div class="contact-options">
              <a href="tel:+573001234567" class="contact-option">
                <span class="contact-icon">📞</span>
                <span class="contact-label">Llamar</span>
              </a>
              <a href="https://wa.me/573001234567" target="_blank" class="contact-option">
                <span class="contact-icon">💬</span>
                <span class="contact-label">WhatsApp</span>
              </a>
              <a href="mailto:info@opticavisionplus.com" class="contact-option">
                <span class="contact-icon">✉️</span>
                <span class="contact-label">Email</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';

const router = useRouter();

/**
 * Volver a la página anterior
 */
const goBack = (): void => {
  if (window.history.length > 1) {
    router.go(-1);
  } else {
    router.push('/');
  }
};

/**
 * Lifecycle: configurar página al montar
 */
onMounted(() => {
  // Se podría agregar analytics o tracking aquí
  console.log('404 page visited');
});
</script>

<style scoped>
.not-found-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--gray-50) 0%, white 100%);
  padding: var(--spacing-lg) 0;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 var(--spacing-md);
}

.not-found-content {
  text-align: center;
  display: grid;
  gap: var(--spacing-3xl);
  align-items: center;
}

/* Ilustración de gafas rotas */
.not-found-illustration {
  position: relative;
  margin: 0 auto var(--spacing-xl);
}

.glasses-icon {
  position: relative;
  display: inline-block;
  margin-bottom: var(--spacing-lg);
}

.glasses-frame {
  position: relative;
  width: 200px;
  height: 80px;
  margin: 0 auto;
}

.lens {
  position: absolute;
  width: 70px;
  height: 70px;
  border: 4px solid var(--primary-color);
  border-radius: 50%;
  background: rgba(99, 102, 241, 0.1);
}

.left-lens {
  left: 0;
  top: 0;
}

.right-lens {
  right: 0;
  top: 0;
}

.bridge {
  position: absolute;
  width: 30px;
  height: 4px;
  background: var(--primary-color);
  top: 35px;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 2px;
}

.temple {
  position: absolute;
  width: 60px;
  height: 4px;
  background: var(--primary-color);
  top: 35px;
  border-radius: 2px;
}

.left-temple {
  left: -55px;
  transform: rotate(-15deg);
  transform-origin: right center;
}

.right-temple {
  right: -55px;
  transform: rotate(15deg);
  transform-origin: left center;
}

.crack-line {
  position: absolute;
  width: 2px;
  height: 40px;
  background: var(--error-color);
  top: 20px;
  left: 50%;
  transform: translateX(-50%) rotate(15deg);
  opacity: 0.8;
}

.crack-line::before,
.crack-line::after {
  content: '';
  position: absolute;
  width: 2px;
  height: 20px;
  background: var(--error-color);
}

.crack-line::before {
  top: -10px;
  left: -5px;
  transform: rotate(-30deg);
}

.crack-line::after {
  bottom: -10px;
  right: -5px;
  transform: rotate(30deg);
}

.error-number {
  font-size: 8rem;
  font-weight: var(--font-weight-extrabold);
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  margin: var(--spacing-md) 0;
}

/* Contenido de texto */
.error-title {
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-bold);
  color: var(--gray-900);
  margin: 0 0 var(--spacing-lg) 0;
}

.error-description {
  font-size: var(--font-size-lg);
  color: var(--gray-600);
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto var(--spacing-2xl);
}

/* Sugerencias útiles */
.helpful-links {
  margin: var(--spacing-3xl) 0;
}

.suggestions-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--gray-800);
  margin: 0 0 var(--spacing-xl) 0;
}

.link-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-lg);
  max-width: 800px;
  margin: 0 auto;
}

.suggestion-card {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  background: white;
  border: 2px solid var(--gray-200);
  border-radius: var(--border-radius-xl);
  text-decoration: none;
  transition: all var(--transition-normal);
  box-shadow: var(--shadow-sm);
}

.suggestion-card:hover {
  border-color: var(--primary-color);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
  text-decoration: none;
}

.suggestion-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.suggestion-content {
  text-align: left;
  flex: 1;
}

.suggestion-title {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--gray-900);
  margin: 0 0 var(--spacing-xs) 0;
}

.suggestion-desc {
  font-size: var(--font-size-sm);
  color: var(--gray-600);
  margin: 0;
}

/* Botones de acción */
.action-buttons {
  display: flex;
  gap: var(--spacing-lg);
  justify-content: center;
  flex-wrap: wrap;
  margin: var(--spacing-3xl) 0;
}

/* Contacto rápido */
.quick-contact {
  margin-top: var(--spacing-3xl);
  padding: var(--spacing-xl);
  background: var(--gray-50);
  border-radius: var(--border-radius-xl);
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.contact-text {
  font-size: var(--font-size-base);
  color: var(--gray-700);
  margin: 0 0 var(--spacing-lg) 0;
  font-weight: var(--font-weight-medium);
}

.contact-options {
  display: flex;
  gap: var(--spacing-lg);
  justify-content: center;
  flex-wrap: wrap;
}

.contact-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-md);
  background: white;
  border-radius: var(--border-radius-lg);
  text-decoration: none;
  transition: all var(--transition-fast);
  box-shadow: var(--shadow-sm);
  min-width: 80px;
}

.contact-option:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  text-decoration: none;
}

.contact-icon {
  font-size: var(--font-size-xl);
}

.contact-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--gray-700);
}

/* Responsive */
@media (max-width: 768px) {
  .error-number {
    font-size: 6rem;
  }

  .error-title {
    font-size: var(--font-size-3xl);
  }

  .error-description {
    font-size: var(--font-size-base);
  }

  .link-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
  }

  .suggestion-card {
    padding: var(--spacing-md);
  }

  .action-buttons {
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-md);
  }

  .action-buttons .btn {
    width: 100%;
    max-width: 250px;
  }

  .contact-options {
    gap: var(--spacing-md);
  }

  .glasses-frame {
    width: 150px;
    height: 60px;
  }

  .lens {
    width: 50px;
    height: 50px;
  }

  .bridge {
    width: 20px;
    top: 25px;
  }

  .temple {
    width: 40px;
    top: 25px;
  }

  .left-temple {
    left: -35px;
  }

  .right-temple {
    right: -35px;
  }
}

@media (max-width: 480px) {
  .not-found-page {
    padding: var(--spacing-md) 0;
  }

  .error-number {
    font-size: 4rem;
  }

  .error-title {
    font-size: var(--font-size-2xl);
  }

  .quick-contact {
    margin-top: var(--spacing-2xl);
    padding: var(--spacing-lg);
  }
}

/* Animaciones */
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

.glasses-icon {
  animation: float 3s ease-in-out infinite;
}

.suggestion-card {
  animation: slideInUp 0.6s ease-out forwards;
  opacity: 0;
}

.suggestion-card:nth-child(1) { animation-delay: 0.1s; }
.suggestion-card:nth-child(2) { animation-delay: 0.2s; }
.suggestion-card:nth-child(3) { animation-delay: 0.3s; }
.suggestion-card:nth-child(4) { animation-delay: 0.4s; }

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
