/**
 * Products Service
 * Maneja todas las operaciones relacionadas con productos
 * Extiende de WebServicesBase siguiendo principios SOLID
 */

import { WebServicesBase, type ApiResponse } from './webServicesBase';

// Interfaces para tipado fuerte
export interface Product {
  id: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  originalPrice: number;
  discount: number;
  description: string;
  features: string[];
  images: string[];
  colors?: string[];
  sizes?: string[];
  inStock: boolean;
  stockQuantity: number;
  rating: number;
  reviews: number;
  prescriptionRequired?: boolean;
}

export interface ProductCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface ProductsResponse {
  categories: ProductCategory[];
  products: Product[];
  bestsellers: string[];
  newArrivals: string[];
  onSale: string[];
}

export interface ProductFilters {
  category?: string;
  brand?: string;
  priceMin?: number;
  priceMax?: number;
  inStock?: boolean;
  sortBy?: 'price' | 'rating' | 'name' | 'discount';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

class ProductsService extends WebServicesBase {
  constructor() {
    super();
  }

  /**
   * Obtiene todos los productos
   */
  async getAllProducts(): Promise<ApiResponse<ProductsResponse>> {
    // En un entorno real, esto haría una llamada a la API
    // Por ahora, simulamos leyendo el archivo JSON local
    try {
      // Simulación de datos locales (en desarrollo futuro será una llamada real a la API)
      const response = await import('@/data/products.json');
      return {
        data: response.default,
        status: 200,
        message: 'Products fetched successfully',
        success: true
      };
    } catch (error) {
      throw new Error('Error fetching products');
    }
  }

  /**
   * Obtiene productos por categoría
   */
  async getProductsByCategory(categoryId: string): Promise<ApiResponse<Product[]>> {
    const allProductsResponse = await this.getAllProducts();
    const filteredProducts = allProductsResponse.data.products.filter(
      product => product.category === categoryId
    );

    return {
      data: filteredProducts,
      status: 200,
      message: 'Products by category fetched successfully',
      success: true
    };
  }

  /**
   * Obtiene un producto por ID
   */
  async getProductById(productId: string): Promise<ApiResponse<Product | null>> {
    const allProductsResponse = await this.getAllProducts();
    const product = allProductsResponse.data.products.find(
      product => product.id === productId
    );

    return {
      data: product || null,
      status: product ? 200 : 404,
      message: product ? 'Product found' : 'Product not found',
      success: !!product
    };
  }

  /**
   * Busca productos con filtros
   */
  async searchProducts(filters: ProductFilters): Promise<ApiResponse<Product[]>> {
    const allProductsResponse = await this.getAllProducts();
    let products = [...allProductsResponse.data.products];

    // Aplicar filtros
    if (filters.category) {
      products = products.filter(product => product.category === filters.category);
    }

    if (filters.brand) {
      products = products.filter(product => 
        product.brand.toLowerCase().includes(filters.brand!.toLowerCase())
      );
    }

    if (filters.priceMin !== undefined) {
      products = products.filter(product => product.price >= filters.priceMin!);
    }

    if (filters.priceMax !== undefined) {
      products = products.filter(product => product.price <= filters.priceMax!);
    }

    if (filters.inStock !== undefined) {
      products = products.filter(product => product.inStock === filters.inStock);
    }

    // Aplicar ordenamiento
    if (filters.sortBy) {
      products.sort((a, b) => {
        let comparison = 0;
        
        switch (filters.sortBy) {
          case 'price':
            comparison = a.price - b.price;
            break;
          case 'rating':
            comparison = a.rating - b.rating;
            break;
          case 'name':
            comparison = a.name.localeCompare(b.name);
            break;
          case 'discount':
            comparison = a.discount - b.discount;
            break;
        }

        return filters.sortOrder === 'desc' ? -comparison : comparison;
      });
    }

    // Aplicar paginación
    const page = filters.page || 1;
    const limit = filters.limit || 12;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    const paginatedProducts = products.slice(startIndex, endIndex);

    return {
      data: paginatedProducts,
      status: 200,
      message: 'Products search completed',
      success: true
    };
  }

  /**
   * Obtiene productos destacados
   */
  async getFeaturedProducts(): Promise<ApiResponse<Product[]>> {
    const allProductsResponse = await this.getAllProducts();
    const { bestsellers, products } = allProductsResponse.data;
    
    const featuredProducts = products.filter(product => 
      bestsellers.includes(product.id)
    );

    return {
      data: featuredProducts,
      status: 200,
      message: 'Featured products fetched successfully',
      success: true
    };
  }

  /**
   * Obtiene productos en oferta
   */
  async getOnSaleProducts(): Promise<ApiResponse<Product[]>> {
    const allProductsResponse = await this.getAllProducts();
    const { onSale, products } = allProductsResponse.data;
    
    const saleProducts = products.filter(product => 
      onSale.includes(product.id) || product.discount > 0
    );

    return {
      data: saleProducts,
      status: 200,
      message: 'On sale products fetched successfully',
      success: true
    };
  }

  /**
   * Obtiene productos nuevos
   */
  async getNewArrivals(): Promise<ApiResponse<Product[]>> {
    const allProductsResponse = await this.getAllProducts();
    const { newArrivals, products } = allProductsResponse.data;
    
    const newProducts = products.filter(product => 
      newArrivals.includes(product.id)
    );

    return {
      data: newProducts,
      status: 200,
      message: 'New arrivals fetched successfully',
      success: true
    };
  }

  /**
   * Obtiene categorías de productos
   */
  async getCategories(): Promise<ApiResponse<ProductCategory[]>> {
    const allProductsResponse = await this.getAllProducts();
    
    return {
      data: allProductsResponse.data.categories,
      status: 200,
      message: 'Categories fetched successfully',
      success: true
    };
  }

  /**
   * Obtiene productos relacionados
   */
  async getRelatedProducts(productId: string, limit: number = 4): Promise<ApiResponse<Product[]>> {
    const productResponse = await this.getProductById(productId);
    
    if (!productResponse.data) {
      return {
        data: [],
        status: 404,
        message: 'Product not found',
        success: false
      };
    }

    const currentProduct = productResponse.data;
    const categoryProducts = await this.getProductsByCategory(currentProduct.category);
    
    const relatedProducts = categoryProducts.data
      .filter(product => product.id !== productId)
      .slice(0, limit);

    return {
      data: relatedProducts,
      status: 200,
      message: 'Related products fetched successfully',
      success: true
    };
  }

  /**
   * Verifica disponibilidad de stock
   */
  async checkStock(productId: string, quantity: number = 1): Promise<ApiResponse<boolean>> {
    const productResponse = await this.getProductById(productId);
    
    if (!productResponse.data) {
      return {
        data: false,
        status: 404,
        message: 'Product not found',
        success: false
      };
    }

    const isAvailable = productResponse.data.inStock && 
                       productResponse.data.stockQuantity >= quantity;

    return {
      data: isAvailable,
      status: 200,
      message: isAvailable ? 'Product available' : 'Insufficient stock',
      success: true
    };
  }
}

// Instancia singleton del servicio
export const productsService = new ProductsService();

/**
 * Función para obtener un producto por su ID
 */
export async function getProductById(productId: string): Promise<ApiResponse<Product>> {
  const response = await fetch(`${process.env.VUE_APP_API_BASE_URL}/products/${productId}`);
  if (!response.ok) {
    throw new Error('Error al obtener el producto');
  }
  return response.json();
}
