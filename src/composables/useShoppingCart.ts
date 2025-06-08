/**
 * Shopping Cart Composable
 * Maneja el estado del carrito de compras siguiendo principios SOLID
 * Utiliza Vue 3 Composition API
 */

import { ref, computed, watch, reactive } from 'vue';
import type { Product } from '@/services/productsService';

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
  prescription?: {
    sphere: number;
    cylinder: number;
    axis: number;
    add?: number;
  };
  addOns?: string[];
  notes?: string;
}

export interface CartSummary {
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  itemCount: number;
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
  lastUpdated: Date;
}

// Estado reactivo global del carrito
const cartState = reactive<CartState>({
  items: [],
  isOpen: false,
  lastUpdated: new Date()
});

// Configuración del carrito
const CART_CONFIG = {
  maxItems: 20,
  taxRate: 0.19, // 19% IVA
  freeShippingThreshold: 200000, // Envío gratis sobre $200,000
  shippingCost: 15000, // Costo de envío estándar
  localStorageKey: 'optica-cart'
};

/**
 * Composable para manejo del carrito de compras
 */
export function useShoppingCart() {
  /**
   * Carga el carrito desde localStorage
   */
  const loadCartFromStorage = (): void => {
    try {
      const savedCart = localStorage.getItem(CART_CONFIG.localStorageKey);
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        cartState.items = parsedCart.items || [];
        cartState.lastUpdated = new Date(parsedCart.lastUpdated || Date.now());
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      cartState.items = [];
    }
  };

  /**
   * Guarda el carrito en localStorage
   */
  const saveCartToStorage = (): void => {
    try {
      const cartData = {
        items: cartState.items,
        lastUpdated: cartState.lastUpdated
      };
      localStorage.setItem(CART_CONFIG.localStorageKey, JSON.stringify(cartData));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  };

  /**
   * Actualiza el timestamp del carrito
   */
  const updateTimestamp = (): void => {
    cartState.lastUpdated = new Date();
  };

  /**
   * Agrega un producto al carrito
   */
  const addToCart = (
    product: Product,
    quantity: number = 1,
    options: Partial<Omit<CartItem, 'id' | 'product' | 'quantity'>> = {}
  ): boolean => {
    try {
      // Verificar límite de items
      if (cartState.items.length >= CART_CONFIG.maxItems) {
        throw new Error(`No puedes agregar más de ${CART_CONFIG.maxItems} productos al carrito`);
      }

      // Verificar stock disponible
      if (!product.inStock || product.stockQuantity < quantity) {
        throw new Error('Producto agotado o cantidad no disponible');
      }

      // Generar ID único para el item del carrito
      const itemId = `${product.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Verificar si ya existe un item similar (mismo producto y opciones)
      const existingItemIndex = cartState.items.findIndex(item => 
        item.product.id === product.id &&
        item.selectedColor === options.selectedColor &&
        item.selectedSize === options.selectedSize
      );

      if (existingItemIndex > -1) {
        // Actualizar cantidad del item existente
        const newQuantity = cartState.items[existingItemIndex].quantity + quantity;
        if (newQuantity > product.stockQuantity) {
          throw new Error('Cantidad solicitada excede el stock disponible');
        }
        cartState.items[existingItemIndex].quantity = newQuantity;
      } else {
        // Agregar nuevo item
        const newItem: CartItem = {
          id: itemId,
          product,
          quantity,
          selectedColor: options.selectedColor,
          selectedSize: options.selectedSize,
          prescription: options.prescription,
          addOns: options.addOns || [],
          notes: options.notes
        };
        cartState.items.push(newItem);
      }

      updateTimestamp();
      return true;
    } catch (error) {
      console.error('Error adding to cart:', error);
      return false;
    }
  };

  /**
   * Remueve un item del carrito
   */
  const removeFromCart = (itemId: string): boolean => {
    try {
      const itemIndex = cartState.items.findIndex(item => item.id === itemId);
      if (itemIndex > -1) {
        cartState.items.splice(itemIndex, 1);
        updateTimestamp();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error removing from cart:', error);
      return false;
    }
  };

  /**
   * Actualiza la cantidad de un item
   */
  const updateQuantity = (itemId: string, quantity: number): boolean => {
    try {
      if (quantity <= 0) {
        return removeFromCart(itemId);
      }

      const item = cartState.items.find(item => item.id === itemId);
      if (!item) {
        return false;
      }

      // Verificar stock disponible
      if (quantity > item.product.stockQuantity) {
        throw new Error('Cantidad solicitada excede el stock disponible');
      }

      item.quantity = quantity;
      updateTimestamp();
      return true;
    } catch (error) {
      console.error('Error updating quantity:', error);
      return false;
    }
  };

  /**
   * Limpia todo el carrito
   */
  const clearCart = (): void => {
    cartState.items = [];
    updateTimestamp();
  };

  /**
   * Abre/cierra el carrito
   */
  const toggleCart = (): void => {
    cartState.isOpen = !cartState.isOpen;
  };

  const openCart = (): void => {
    cartState.isOpen = true;
  };

  const closeCart = (): void => {
    cartState.isOpen = false;
  };

  // Computed properties para resumen del carrito
  const cartSummary = computed<CartSummary>(() => {
    const subtotal = cartState.items.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity);
    }, 0);

    const itemCount = cartState.items.reduce((sum, item) => sum + item.quantity, 0);
    
    const tax = subtotal * CART_CONFIG.taxRate;
    
    const shipping = subtotal >= CART_CONFIG.freeShippingThreshold ? 0 : CART_CONFIG.shippingCost;
    
    const discount = cartState.items.reduce((sum, item) => {
      if (item.product.discount > 0) {
        const originalPrice = item.product.originalPrice || item.product.price;
        const discountAmount = (originalPrice - item.product.price) * item.quantity;
        return sum + discountAmount;
      }
      return sum;
    }, 0);

    const total = subtotal + tax + shipping;

    return {
      subtotal,
      tax,
      shipping,
      discount,
      total,
      itemCount
    };
  });

  const isEmpty = computed<boolean>(() => cartState.items.length === 0);

  const itemCount = computed<number>(() => cartSummary.value.itemCount);

  const totalPrice = computed<number>(() => cartSummary.value.total);

  /**
   * Encuentra un item por ID
   */
  const findItem = (itemId: string): CartItem | undefined => {
    return cartState.items.find(item => item.id === itemId);
  };

  /**
   * Verifica si un producto está en el carrito
   */
  const isInCart = (productId: string): boolean => {
    return cartState.items.some(item => item.product.id === productId);
  };

  /**
   * Obtiene la cantidad total de un producto en el carrito
   */
  const getProductQuantity = (productId: string): number => {
    return cartState.items
      .filter(item => item.product.id === productId)
      .reduce((sum, item) => sum + item.quantity, 0);
  };

  /**
   * Valida el carrito antes del checkout
   */
  const validateCart = (): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (cartState.items.length === 0) {
      errors.push('El carrito está vacío');
    }

    // Verificar stock de cada item
    for (const item of cartState.items) {
      if (!item.product.inStock) {
        errors.push(`${item.product.name} ya no está disponible`);
      } else if (item.quantity > item.product.stockQuantity) {
        errors.push(`${item.product.name}: solo hay ${item.product.stockQuantity} unidades disponibles`);
      }
    }

    // Verificar que productos que requieren prescripción la tengan
    for (const item of cartState.items) {
      if (item.product.prescriptionRequired && !item.prescription) {
        errors.push(`${item.product.name} requiere prescripción médica`);
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  };

  // Watcher para guardar automáticamente en localStorage
  watch(
    () => cartState.items,
    () => {
      saveCartToStorage();
    },
    { deep: true }
  );

  // Cargar carrito al inicializar
  if (typeof window !== 'undefined') {
    loadCartFromStorage();
  }

  return {
    // Estado
    items: computed(() => cartState.items),
    isOpen: computed(() => cartState.isOpen),
    lastUpdated: computed(() => cartState.lastUpdated),
    
    // Computed
    cartSummary,
    isEmpty,
    itemCount,
    totalPrice,
    
    // Acciones
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    toggleCart,
    openCart,
    closeCart,
    
    // Utilidades
    findItem,
    isInCart,
    getProductQuantity,
    validateCart,
    loadCartFromStorage,
    saveCartToStorage
  };
}
