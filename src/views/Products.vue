<!--
  Vista Products - Página de Productos
  Implementa principios SOLID y Clean Architecture
  Permite filtrar, buscar y explorar productos
-->

<template>
  <div class="products-page">
    <!-- Header de la página -->
    <section class="page-header">
      <div class="container">
        <div class="header-content">
          <h1 class="page-title gradient-text">Nuestros Productos</h1>
          <p class="page-description">
            Descubre nuestra amplia gama de monturas, lentes y accesorios de la más alta calidad
          </p>
        </div>
      </div>
    </section>

    <!-- Sección de categorías y productos -->
    <section v-for="category in categories" :key="category.id" class="category-section">
      <div class="container">
        <div class="category-header">
          <h2 class="category-title">{{ category.name }} {{ category.icon }}</h2>
          <p class="category-description">{{ category.description }}</p>
        </div>
        
        <div class="products-carousel">
          <button class="carousel-btn prev" @click="scroll(category.id, 'left')">&lt;</button>
          <div :id="category.id" class="products-list">
            <div v-for="product in getProductsByCategory(category.id)" 
                 :key="product.id" 
                 class="product-card">
              <div class="discount-badge" v-if="product.discount">
                -{{ product.discount }}%
              </div>
              <img :src="defaultImage" :alt="product.name" class="product-image" />
              <div class="product-info">
                <h3 class="product-name">{{ product.name }}</h3>
                <div class="price-container">
                  <p class="product-price">
                    ${{ formatPrice(product.price) }}
                  </p>
                  <p class="original-price" v-if="product.originalPrice">
                    ${{ formatPrice(product.originalPrice) }}
                  </p>
                </div>
                <router-link :to="`/productos/${product.id}`" class="btn btn-primary">
                  Ver Detalle
                </router-link>
              </div>
            </div>
          </div>
          <button class="carousel-btn next" @click="scroll(category.id, 'right')">&gt;</button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import productsData from '../data/products.json';

const defaultImage = 'src/assets/image/monturas/mujer/COD(0001).webp';
const categories = ref(productsData.categories);
const products = ref(productsData.products);

const getProductsByCategory = (categoryId) => {
  return products.value.filter(product => product.category === categoryId);
};

const formatPrice = (price) => {
  return new Intl.NumberFormat('es-CO').format(price);
};

const scroll = (categoryId, direction) => {
  const container = document.getElementById(categoryId);
  const scrollAmount = 300;
  if (container) {
    if (direction === 'left') {
      container.scrollLeft -= scrollAmount;
    } else {
      container.scrollLeft += scrollAmount;
    }
  }
};
</script>

<style scoped>
.products-page {
  display: flex;
  flex-direction: column;
  gap: 3rem;
  padding: 2rem 0;
}

.page-header {
  text-align: center;
  margin-bottom: 2rem;
}

.category-section {
  margin-bottom: 3rem;
}

.category-header {
  text-align: center;
  margin-bottom: 2rem;
}

.category-title {
  font-size: 2rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.category-description {
  color: #666;
}

.products-carousel {
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0 1rem;
}

.products-list {
  display: flex;
  gap: 1.5rem;
  overflow-x: scroll;
  scroll-behavior: smooth;
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding: 1rem 0;
}

.products-list::-webkit-scrollbar {
  display: none;
}

.carousel-btn {
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s;
  z-index: 2;
}

.carousel-btn:hover {
  background: rgba(0, 0, 0, 0.7);
}

.product-card {
  flex: 0 0 280px;
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 1rem;
  text-align: center;
  background: white;
  position: relative;
  transition: transform 0.3s, box-shadow 0.3s;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.discount-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #ff4444;
  color: white;
  padding: 0.5rem;
  border-radius: 4px;
  font-weight: bold;
}

.product-image {
  max-width: 200px;
  height: auto;
  aspect-ratio: auto 577 / 866;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.product-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.product-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
}

.price-container {
  display: flex;
  justify-content: center;
  gap: 1rem;
  align-items: center;
}

.product-price {
  font-size: 1.2rem;
  font-weight: bold;
  color: #2c3e50;
}

.original-price {
  color: #999;
  text-decoration: line-through;
  font-size: 0.9rem;
}

.btn-primary {
  background: #42b883;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  text-decoration: none;
  transition: background 0.3s;
}

.btn-primary:hover {
  background: #3aa876;
}

@media (max-width: 768px) {
  .product-card {
    flex: 0 0 240px;
  }
  
  .category-title {
    font-size: 1.5rem;
  }
}
</style>
