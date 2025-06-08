/**
 * Servicio de Promociones - Optivisión 4K
 * Extiende WebServicesBase siguiendo principios SOLID
 * Maneja todas las operaciones relacionadas con promociones y descuentos
 */

import { WebServicesBase } from './webServicesBase';
import type { ApiResponse, PaginatedResponse } from './webServicesBase';

// Interfaces específicas para promociones
export interface Promotion {
  id: string;
  code: string;
  name: string;
  description: string;
  type: 'percentage' | 'fixed' | 'buy_one_get_one' | 'free_shipping';
  value: number;
  minimumAmount?: number;
  maximumAmount?: number;
  applicableProducts?: string[];
  applicableCategories?: string[];
  excludedProducts?: string[];
  usageLimit?: number;
  usageCount: number;
  perUserLimit?: number;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  isPublic: boolean;
  terms?: string;
  bannerImage?: string;
  priority: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PromotionUsage {
  id: string;
  promotionId: string;
  clientId: string;
  orderId: string;
  discountAmount: number;
  usedAt: Date;
}

export interface PromotionFilters {
  search?: string;
  type?: string;
  isActive?: boolean;
  isPublic?: boolean;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface ApplyPromotionRequest {
  code: string;
  clientId?: string;
  cartItems: {
    productId: string;
    quantity: number;
    price: number;
  }[];
  subtotal: number;
}

export interface ApplyPromotionResponse {
  valid: boolean;
  promotion?: Promotion;
  discountAmount: number;
  finalAmount: number;
  message: string;
}

class PromotionsService extends WebServicesBase {
  private readonly endpoint = '/promotions';

  constructor() {
    super();
  }

  /**
   * Obtener todas las promociones con filtros
   */
  public async getPromotions(filters: PromotionFilters = {}): Promise<PaginatedResponse<Promotion>> {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });

    const url = queryParams.toString() ? `${this.endpoint}?${queryParams}` : this.endpoint;
    // Cast the response to PaginatedResponse since we know the API returns pagination info
    return this.get<Promotion[]>(url) as Promise<PaginatedResponse<Promotion>>;
  }

  /**
   * Obtener promoción por ID
   */
  public async getPromotionById(id: string): Promise<ApiResponse<Promotion>> {
    return this.get<Promotion>(`${this.endpoint}/${id}`);
  }

  /**
   * Obtener promoción por código
   */
  public async getPromotionByCode(code: string): Promise<ApiResponse<Promotion>> {
    return this.get<Promotion>(`${this.endpoint}/code/${encodeURIComponent(code)}`);
  }

  /**
   * Crear nueva promoción
   */
  public async createPromotion(promotionData: Omit<Promotion, 'id' | 'usageCount' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Promotion>> {
    return this.post<Promotion>(this.endpoint, promotionData);
  }

  /**
   * Actualizar promoción
   */
  public async updatePromotion(id: string, promotionData: Partial<Promotion>): Promise<ApiResponse<Promotion>> {
    return this.put<Promotion>(`${this.endpoint}/${id}`, promotionData);
  }

  /**
   * Activar/Desactivar promoción
   */
  public async togglePromotionStatus(id: string): Promise<ApiResponse<Promotion>> {
    return this.patch<Promotion>(`${this.endpoint}/${id}/toggle-status`);
  }

  /**
   * Eliminar promoción
   */
  public async deletePromotion(id: string): Promise<ApiResponse<void>> {
    return this.delete<void>(`${this.endpoint}/${id}`);
  }

  /**
   * Aplicar promoción a carrito
   */
  public async applyPromotion(request: ApplyPromotionRequest): Promise<ApiResponse<ApplyPromotionResponse>> {
    return this.post<ApplyPromotionResponse>(`${this.endpoint}/apply`, request);
  }

  /**
   * Validar código de promoción
   */
  public async validatePromotionCode(code: string, clientId?: string): Promise<ApiResponse<{
    valid: boolean;
    promotion?: Promotion;
    message: string;
  }>> {
    const body = { code, clientId };
    return this.post<any>(`${this.endpoint}/validate`, body);
  }

  /**
   * Obtener promociones activas públicas
   */
  public async getActivePromotions(): Promise<ApiResponse<Promotion[]>> {
    return this.get<Promotion[]>(`${this.endpoint}/active`);
  }

  /**
   * Obtener promociones destacadas para mostrar en el banner
   */
  public async getFeaturedPromotions(): Promise<ApiResponse<Promotion[]>> {
    return this.get<Promotion[]>(`${this.endpoint}/featured`);
  }

  /**
   * Obtener historial de uso de una promoción
   */
  public async getPromotionUsage(promotionId: string, page = 1, limit = 20): Promise<PaginatedResponse<PromotionUsage>> {
    // Cast the response to PaginatedResponse since we know the API returns pagination info
    return this.get<PromotionUsage[]>(`${this.endpoint}/${promotionId}/usage?page=${page}&limit=${limit}`) as Promise<PaginatedResponse<PromotionUsage>>;
  }

  /**
   * Generar código único para promoción
   */
  public async generateUniqueCode(prefix?: string): Promise<ApiResponse<{ code: string }>> {
    return this.post<{ code: string }>(`${this.endpoint}/generate-code`, { prefix });
  }

  /**
   * Duplicar promoción existente
   */
  public async duplicatePromotion(id: string, newName?: string): Promise<ApiResponse<Promotion>> {
    return this.post<Promotion>(`${this.endpoint}/${id}/duplicate`, { newName });
  }

  /**
   * Obtener estadísticas de promociones
   */
  public async getPromotionStats(): Promise<ApiResponse<{
    total: number;
    active: number;
    expired: number;
    upcoming: number;
    totalUsage: number;
    totalDiscountGiven: number;
    byType: Record<string, number>;
    topPerforming: Promotion[];
    recentUsage: PromotionUsage[];
  }>> {
    return this.get<any>(`${this.endpoint}/stats`);
  }

  /**
   * Programar activación/desactivación automática
   */
  public async schedulePromotion(id: string, startDate: string, endDate: string): Promise<ApiResponse<Promotion>> {
    return this.patch<Promotion>(`${this.endpoint}/${id}/schedule`, {
      startDate,
      endDate
    });
  }

  /**
   * Exportar promociones a CSV
   */
  public async exportPromotions(filters?: PromotionFilters): Promise<ApiResponse<string>> {
    const queryParams = new URLSearchParams(filters as any);
    const url = queryParams.toString() ? `${this.endpoint}/export?${queryParams}` : `${this.endpoint}/export`;
    return this.get<string>(url);
  }

  /**
   * Crear promoción automática basada en reglas
   */
  public async createAutoPromotion(rules: {
    triggerType: 'first_purchase' | 'birthday' | 'loyalty' | 'cart_abandonment';
    targetAudience: 'all' | 'new_customers' | 'vip_customers';
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    validityDays: number;
  }): Promise<ApiResponse<Promotion>> {
    return this.post<Promotion>(`${this.endpoint}/auto-create`, rules);
  }
}

// Instancia singleton
export const promotionsService = new PromotionsService();
