# Documentación de Componentes Sociales

## Actualización de Iconos y Logo en AppFooter.vue

### Descripción General

Este documento detalla las modificaciones realizadas al componente `AppFooter.vue` para unificar la experiencia visual con el componente `SocialSidePanel.vue`, siguiendo los principios SOLID y Clean Architecture. 

### Modificaciones Realizadas

1. **Actualización del Logo**
   - Se reemplazó el emoji por el logo oficial `LOGOOPTIVISIÓN4K.webp`
   - Se implementaron estilos responsivos para adaptarse a diferentes tamaños de pantalla
   - Se añadió soporte para carga diferida (lazy loading) mejorando el rendimiento

2. **Actualización de Iconos de Redes Sociales**
   - Se sustituyeron los emojis por imágenes reales importadas desde assets
   - Se implementó el mismo sistema de iconos usado en `SocialSidePanel.vue`
   - Se corrigió la referencia de Twitter a TikTok para mantener la consistencia

3. **Mejoras en el Código**
   - Se implementaron importaciones adecuadas siguiendo Vue 3 Composition API
   - Se mejoró la tipificación TypeScript para una mayor seguridad
   - Se creó un mapa de iconos centralizando las referencias a imágenes

4. **Mejoras en los Estilos**
   - Se actualizaron los estilos para una visualización adecuada de los iconos
   - Se añadieron efectos de hover mejorados para mejor feedback visual
   - Se implementaron media queries para experiencia responsiva

### Implementación Técnica

#### Importación de Recursos

```typescript
// Importar imágenes correctamente para Vite
import facebookIcon from '@/assets/image/logos/facebook.png';
import instagramIcon from '@/assets/image/logos/instagram (1).png';
import whatsappIcon from '@/assets/image/logos/whatsapp.png';
import tiktokIcon from '@/assets/image/logos/tik-tok.png';
```

#### Implementación del Mapa de Iconos

```typescript
// Mapa de iconos importados correctamente
const socialIcons: Record<string, string> = {
  facebook: facebookIcon,
  instagram: instagramIcon,
  whatsapp: whatsappIcon,
  twitter: tiktokIcon,
};

const getSocialIcon = (platform: string): string => {
  return socialIcons[platform] || '';
};
```

#### Corrección de Etiquetas

```typescript
const getSocialLabel = (platform: string): string => {
  const labels = {
    facebook: 'Facebook',
    instagram: 'Instagram',
    whatsapp: 'WhatsApp',
    twitter: 'TikTok'
  };
  return labels[platform as keyof typeof labels] || platform;
};
```

### Beneficios de las Modificaciones

1. **Consistencia Visual**: La experiencia visual es ahora consistente entre el panel lateral y el footer
2. **Mejor Rendimiento**: Uso de lazy loading y optimización de recursos
3. **Mantenibilidad Mejorada**: Código más limpio y fácil de mantener 
4. **Responsividad**: Experiencia mejorada en distintos dispositivos
5. **Profesionalismo**: Imagen corporativa reforzada con elementos visuales consistentes

### Mejores Prácticas Implementadas

1. **Principio de Responsabilidad Única (SRP)**: Cada función tiene un único propósito
2. **Principio Open/Closed (OCP)**: Los componentes están abiertos para extensión pero cerrados para modificación
3. **Reactividad Vue 3**: Uso adecuado de las APIs de composición
4. **TypeScript**: Tipado estricto para mayor seguridad
5. **Optimización de Recursos**: Carga diferida y reutilización

### Recomendaciones Futuras

1. **Implementar SVG**: Considerar migrar de PNG a SVG para mejor escalabilidad
2. **Componente Compartido**: Refactorizar a un componente compartido para redes sociales
3. **Sistema de Iconos**: Evaluar el uso de una biblioteca como FontAwesome o Material Icons
4. **Personalización por Tema**: Permitir cambios de color según tema claro/oscuro
5. **Animaciones Avanzadas**: Incorporar animaciones más elaboradas para mejor UX

### Conclusión

Las modificaciones implementadas mejoran la consistencia visual, rendimiento y mantenibilidad del código, siguiendo las mejores prácticas de Vue 3 y los principios SOLID. Se ha logrado unificar la experiencia visual entre componentes, fortaleciendo la identidad de la marca Optivisión 4K.

## Mejora de Diseño Responsivo en SocialSidePanel.vue

### Descripción General

Se ha actualizado el componente `SocialSidePanel.vue` para mejorar su comportamiento en dispositivos móviles, implementando un despliegue individual de botones hacia arriba y mejorando los estilos tanto en estado desplegado como retraído.

### Modificaciones Realizadas

1. **Diseño Compacto en Móviles**
   - Se ha transformado el panel en un pequeño botón flotante en pantallas móviles
   - El panel se coloca debajo del botón "volver arriba" para evitar superposición
   - Se añadió un botón de expansión/contracción para mostrar u ocultar los iconos sociales

2. **Animación Mejorada**
   - Ahora los iconos se despliegan individualmente hacia arriba con una animación escalonada
   - Se implementó un retardo incremental para cada botón social, creando un efecto en cascada
   - Se mejoró la transición visual con una animación suave de deslizamiento

3. **Mejora de Estilos**
   - Se eliminó el fondo blanco en el panel retraído en pantallas grandes
   - Se utilizan los colores específicos de cada red social en el estado móvil
   - Los iconos ahora aparecen en color blanco sobre el fondo de color de cada red social

4. **Lógica de Expansión**
   - Se implementó un estado reactivo `isExpanded` para controlar si el panel está expandido
   - Se añadió la función `toggleExpand` para alternar el estado
   - Los iconos sociales solo se muestran cuando el panel está expandido en móviles

### Implementación Técnica

#### Animación de Despliegue Individual

```css
/* Animación de despliegue individual */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.is-mobile .social-link {
  animation: slideUp 0.5s ease forwards;
}
```

#### Retardo de Animación por Índice

```html
<a
  v-for="(url, platform, index) in socialMedia"
  :key="platform"
  :href="url"
  :class="['social-link', `social-${platform}`]"
  :style="{ 'animation-delay': isMobile ? `${index * 0.1}s` : '0s' }"
  target="_blank"
  rel="noopener noreferrer"
  @click="handleClick(platform)"
  :aria-label="`Visitar nuestro ${getSocialLabel(platform)}`"
>
```

#### Estilos Específicos para Móvil

```css
.is-mobile .social-facebook {
  background: #1877f2;
  border-color: #1877f2;
}

.is-mobile .social-instagram {
  background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
  border-color: #e6683c;
}

.is-mobile .social-whatsapp {
  background: #25d366;
  border-color: #25d366;
}

.is-mobile .social-twitter {
  background: var(--optivision-black);
  border-color: var(--optivision-black);
}
```

## Actualización del Diseño Responsivo en HeroSection.vue

### Descripción General

Se ha mejorado el componente `HeroSection.vue` para optimizar su visualización en pantallas pequeñas, ajustando espaciado, tamaños de texto y distribución de elementos.

### Modificaciones Realizadas

1. **Ajustes de Espaciado**
   - Se redujo el padding y margin en elementos clave para maximizar el espacio utilizable
   - Se ajustaron los tamaños de los elementos para evitar desbordamientos

2. **Tamaños de Texto Responsivos**
   - Se implementaron unidades relativas (em, rem) en lugar de unidades fijas (px) para una mejor escalabilidad
   - Se ajustaron los tamaños de fuente en encabezados y párrafos para mejorar la legibilidad

3. **Distribución de Elementos**
   - Se revisó el uso de flexbox y grid para una distribución más eficiente en pantallas pequeñas
   - Se ocultaron elementos no esenciales en móviles para simplificar la interfaz

4. **Optimización de Imágenes y Recursos**
   - Se utilizaron imágenes de menor resolución para dispositivos móviles
   - Se implementó carga diferida (lazy loading) para imágenes fuera de pantalla

### Implementación Técnica

#### Ejemplo de Ajustes de Estilos CSS

```css
/* --- HeroSection.vue --- */
.hero-section {
  padding: 2rem;
  text-align: center;
}

.hero-title {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.hero-description {
  font-size: 1.2rem;
  margin-bottom: 2rem;
}

/* --- Media Queries --- */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }

  .hero-description {
    font-size: 1rem;
  }

  .hero-section {
    padding: 1rem;
  }
}
```

#### Ejemplo de Estructura HTML

```html
<section class="hero-section">
  <h1 class="hero-title">Bienvenido a Optivisión 4K</h1>
  <p class="hero-description">La mejor experiencia visual para tus ojos</p>
  <!-- Otros elementos como botones o enlaces -->
</section>
```

### Beneficios de las Mejoras

1. **Experiencia de Usuario Optimizada**: Navegación más fluida y contenido más accesible
2. **Mejor Rendimiento**: Menor tiempo de carga y uso eficiente de recursos
3. **Escalabilidad**: Diseño adaptable a diferentes tamaños de pantalla y resoluciones
4. **Mantenibilidad**: Código y estilos más limpios y fáciles de mantener

### Conclusión

Las mejoras implementadas en `SocialSidePanel.vue` y `HeroSection.vue` optimizan la experiencia del usuario en dispositivos móviles, asegurando una interfaz limpia, accesible y de alto rendimiento. Se sigue avanzando en la unificación y optimización de los componentes de la aplicación Optivisión 4K.
