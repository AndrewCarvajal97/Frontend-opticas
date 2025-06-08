/**
 * Punto de entrada principal de la aplicación Vue 3
 * Configuración de router, estilos y plugins
 */

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './styles/main.css';

// Crear instancia de la aplicación
const app = createApp(App);

// Configurar router
app.use(router);

// Configurar propiedades globales
app.config.globalProperties.$appName = 'Óptica Visión Plus';
app.config.globalProperties.$appVersion = '1.0.0';

// Manejo de errores globales
app.config.errorHandler = (error, instance, info) => {
  console.error('Error global capturado:', error);
  console.error('Información del componente:', info);
  
  // Aquí se puede enviar el error a un servicio de logging
  // como Sentry, LogRocket, etc.
};

// Configurar warnings (solo en desarrollo)
if (import.meta.env.DEV) {
  app.config.warnHandler = (msg, instance, trace) => {
    console.warn('Warning de Vue:', msg);
    console.warn('Trace:', trace);
  };
}

// Montar la aplicación
app.mount('#app');

// Configuraciones adicionales para producción
if (import.meta.env.PROD) {
  // Configurar service worker (PWA) en el futuro
  // Configurar analytics
  console.log('Aplicación en modo producción');
}
