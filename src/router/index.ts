/**
 * Vue Router Configuration
 * Configuración del enrutador siguiendo principios SOLID y Clean Architecture
 * Compatible con Vue 3 Composition API
 */

import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

// Lazy loading de vistas para mejor performance
const Home = () => import('@/views/Home.vue');
const Products = () => import('@/views/Products.vue');
const Services = () => import('@/views/Services.vue');
const Contact = () => import('@/views/Contact.vue');

// Vista 404 Not Found
const NotFound = () => import('@/views/NotFound.vue');

/**
 * Definición de rutas de la aplicación
 */
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: 'Inicio - Óptica Visión Plus',
      description: 'Examen óptico a domicilio y productos de calidad para el cuidado de tu visión',
      requiresAuth: false
    }
  },
  {
    path: '/productos',
    name: 'Products',
    component: Products,
    meta: {
      title: 'Productos - Óptica Visión Plus',
      description: 'Amplio catálogo de monturas, lentes y gafas de sol de alta calidad',
      requiresAuth: false
    }
  },
  {
    path: '/productos/:id',
    name: 'ProductDetail',
    component: () => import('@/views/ProductDetail.vue'),
    meta: {
      title: 'Detalle del Producto - Óptica Visión Plus',
      description: 'Información detallada del producto seleccionado',
      requiresAuth: false
    },
    props: true
  },
  {
    path: '/servicios',
    name: 'Services',
    component: Services,
    meta: {
      title: 'Servicios - Óptica Visión Plus',
      description: 'Examen óptico a domicilio, reparaciones y más servicios profesionales',
      requiresAuth: false
    }
  },
  {
    path: '/servicios/:id',
    name: 'ServiceDetail',
    component: () => import('@/views/ServiceDetail.vue'),
    meta: {
      title: 'Detalle del Servicio - Óptica Visión Plus',
      description: 'Información detallada del servicio seleccionado',
      requiresAuth: false
    },
    props: true
  },
  {
    path: '/contacto',
    name: 'Contact',
    component: Contact,
    meta: {
      title: 'Contacto - Óptica Visión Plus',
      description: 'Agenda tu examen óptico a domicilio o contáctanos para más información',
      requiresAuth: false
    }
  },
  {
    path: '/carrito',
    name: 'Cart',
    component: () => import('@/views/Cart.vue'),
    meta: {
      title: 'Carrito de Compras - Óptica Visión Plus',
      description: 'Revisa y finaliza tu compra',
      requiresAuth: false
    }
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: () => import('@/views/Checkout.vue'),
    meta: {
      title: 'Finalizar Compra - Óptica Visión Plus',
      description: 'Completa tu pedido',
      requiresAuth: false
    }
  },
  // Redirecciones útiles
  {
    path: '/inicio',
    redirect: '/'
  },
  {
    path: '/home',
    redirect: '/'
  },
  // Ruta 404 - debe estar al final
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
    meta: {
      title: '404 - Página No Encontrada',
      description: 'La página que buscas no existe',
      requiresAuth: false
    }
  }
];

/**
 * Crear instancia del router
 */
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, _from, savedPosition) {
    // Comportamiento de scroll personalizado
    if (savedPosition) {
      return savedPosition;
    } else if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth'
      };
    } else {
      return { top: 0, left: 0, behavior: 'smooth' };
    }
  }
});

/**
 * Guard global de navegación - Before Each
 * Ejecuta lógica antes de cada navegación
 */
router.beforeEach((to, _from, next) => {
  // Actualizar título de la página
  if (to.meta?.title) {
    document.title = to.meta.title as string;
  }

  // Actualizar meta description
  if (to.meta?.description) {
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', to.meta.description as string);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = to.meta.description as string;
      document.head.appendChild(meta);
    }
  }

  // Verificar autenticación si es requerida (futuro desarrollo)
  if (to.meta?.requiresAuth) {
    // Aquí se puede agregar lógica de autenticación
    // Por ahora permitimos el acceso
    next();
  } else {
    next();
  }
});

/**
 * Guard global de navegación - After Each
 * Ejecuta lógica después de cada navegación
 */
router.afterEach((to, from) => {
  const fromName = from.name ? String(from.name) : 'unknown';
  const toName = to.name ? String(to.name) : 'unknown';
  console.log(`Navegación completada: ${fromName} → ${toName}`);
  
  // Cerrar modales o overlays que puedan estar abiertos
  // Esto se puede conectar con un store global en el futuro
});

/**
 * Manejar errores de navegación
 */
router.onError((error) => {
  console.error('Error de navegación:', error);
  // Aquí se puede agregar lógica de manejo de errores
  // como mostrar un toast de error o redirigir a una página de error
});

export default router;

/**
 * Tipo para rutas tipadas (utilidad para componentes)
 */
export type AppRouteNames = 
  | 'Home'
  | 'Products'
  | 'ProductDetail'
  | 'Services'
  | 'ServiceDetail'
  | 'Contact'
  | 'Cart'
  | 'Checkout'
  | 'NotFound';

/**
 * Utilidad para navegación tipada
 */
export const navigateTo = (name: AppRouteNames, params?: Record<string, any>) => {
  return router.push({ name, params });
};
