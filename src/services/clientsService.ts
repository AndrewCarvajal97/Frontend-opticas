/**
 * Servicio de Clientes - Optivisión 4K
 * Extiende WebServicesBase siguiendo principios SOLID
 * Maneja todas las operaciones relacionadas con clientes y sus pedidos
 */

import { WebServicesBase, ApiResponse, PaginatedResponse } from './webServicesBase';

// Interfaces específicas para clientes
export interface Client {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  whatsapp?: string;
  address: string;
  neighborhood?: string;
  city: string;
  faceShape?: 'ovalado' | 'cuadrado' | 'corazon' | 'diamante';
  preferredStyle?: string;
  visualFormula?: string;
  isActive: boolean;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate?: Date;
  notes?: string;
  source: 'web' | 'whatsapp' | 'referral' | 'social_media';
  createdAt: Date;
  updatedAt: Date;
}

export interface ClientRegistration {
  fullName: string;
  email?: string;
  phone: string;
  whatsapp?: string;
  address: string;
  neighborhood?: string;
  city: string;
  faceShape?: string;
  preferredStyle?: string;
  visualFormula?: string;
  source: string;
  notes?: string;
}

export interface ClientFilters {
  search?: string;
  city?: string;
  faceShape?: string;
  preferredStyle?: string;
  source?: string;
  isActive?: boolean;
  hasOrders?: boolean;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

export interface Order {
  id: string;
  clientId: string;
  orderNumber: string;
  status: 'pending' | 'reserved' | 'in_preparation' | 'ready' | 'delivered' | 'cancelled';
  selectedFrames: SelectedFrame[];
  finalFrameId?: string;
  totalAmount: number;
  reserveAmount: number;
  finalAmount: number;
  paymentStatus: 'pending' | 'partial' | 'completed';
  deliveryAddress: string;
  deliveryDate?: Date;
  deliveryNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SelectedFrame {
  frameId: string;
  frameName: string;
  frameCode: string;
  price: number;
  selected: boolean;
  triedOn: boolean;
  clientRating?: number;
  clientNotes?: string;
}

export interface ClientOrder {
  clientId: string;
  selectedFrames: {
    frameId: string;
    frameCode: string;
  }[];
  deliveryAddress: string;
  deliveryDate?: string;
  notes?: string;
}

class ClientsService extends WebServicesBase {
  private readonly endpoint = '/clients';

  constructor() {
    super();
  }

  /**
   * Obtener todos los clientes con filtros
   */
  public async getClients(filters: ClientFilters = {}): Promise<PaginatedResponse<Client>> {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });

    const url = queryParams.toString() ? `${this.endpoint}?${queryParams}` : this.endpoint;
    return this.get<Client[]>(url);
  }

  /**
   * Obtener cliente por ID
   */
  public async getClientById(id: string): Promise<ApiResponse<Client>> {
    return this.get<Client>(`${this.endpoint}/${id}`);
  }

  /**
   * Obtener cliente por teléfono
   */
  public async getClientByPhone(phone: string): Promise<ApiResponse<Client>> {
    return this.get<Client>(`${this.endpoint}/phone/${encodeURIComponent(phone)}`);
  }

  /**
   * Registrar nuevo cliente
   */
  public async registerClient(clientData: ClientRegistration): Promise<ApiResponse<Client>> {
    return this.post<Client>(this.endpoint, clientData);
  }

  /**
   * Actualizar cliente
   */
  public async updateClient(id: string, clientData: Partial<Client>): Promise<ApiResponse<Client>> {
    return this.put<Client>(`${this.endpoint}/${id}`, clientData);
  }

  /**
   * Activar/Desactivar cliente
   */
  public async toggleClientStatus(id: string): Promise<ApiResponse<Client>> {
    return this.patch<Client>(`${this.endpoint}/${id}/toggle-status`);
  }

  /**
   * Eliminar cliente
   */
  public async deleteClient(id: string): Promise<ApiResponse<void>> {
    return this.delete<void>(`${this.endpoint}/${id}`);
  }

  /**
   * Crear orden para cliente
   */
  public async createOrder(orderData: ClientOrder): Promise<ApiResponse<Order>> {
    return this.post<Order>(`${this.endpoint}/${orderData.clientId}/orders`, orderData);
  }

  /**
   * Obtener órdenes de un cliente
   */
  public async getClientOrders(clientId: string): Promise<ApiResponse<Order[]>> {
    return this.get<Order[]>(`${this.endpoint}/${clientId}/orders`);
  }

  /**
   * Obtener orden específica
   */
  public async getOrder(clientId: string, orderId: string): Promise<ApiResponse<Order>> {
    return this.get<Order>(`${this.endpoint}/${clientId}/orders/${orderId}`);
  }

  /**
   * Actualizar estado de orden
   */
  public async updateOrderStatus(
    clientId: string, 
    orderId: string, 
    status: Order['status'],
    notes?: string
  ): Promise<ApiResponse<Order>> {
    return this.patch<Order>(`${this.endpoint}/${clientId}/orders/${orderId}/status`, {
      status,
      notes
    });
  }

  /**
   * Confirmar frame seleccionado por el cliente
   */
  public async confirmSelectedFrame(
    clientId: string,
    orderId: string,
    frameId: string,
    rating?: number,
    notes?: string
  ): Promise<ApiResponse<Order>> {
    return this.patch<Order>(`${this.endpoint}/${clientId}/orders/${orderId}/confirm-frame`, {
      frameId,
      rating,
      notes
    });
  }

  /**
   * Procesar pago de reserva
   */
  public async processReservePayment(
    clientId: string,
    orderId: string,
    paymentMethod: string,
    amount: number
  ): Promise<ApiResponse<Order>> {
    return this.post<Order>(`${this.endpoint}/${clientId}/orders/${orderId}/payments/reserve`, {
      paymentMethod,
      amount
    });
  }

  /**
   * Procesar pago final
   */
  public async processFinalPayment(
    clientId: string,
    orderId: string,
    paymentMethod: string,
    amount: number
  ): Promise<ApiResponse<Order>> {
    return this.post<Order>(`${this.endpoint}/${clientId}/orders/${orderId}/payments/final`, {
      paymentMethod,
      amount
    });
  }

  /**
   * Programar entrega
   */
  public async scheduleDelivery(
    clientId: string,
    orderId: string,
    deliveryDate: string,
    deliveryAddress?: string,
    notes?: string
  ): Promise<ApiResponse<Order>> {
    return this.patch<Order>(`${this.endpoint}/${clientId}/orders/${orderId}/delivery`, {
      deliveryDate,
      deliveryAddress,
      notes
    });
  }

  /**
   * Confirmar entrega
   */
  public async confirmDelivery(
    clientId: string,
    orderId: string
  ): Promise<ApiResponse<Order>> {
    return this.patch<Order>(`${this.endpoint}/${clientId}/orders/${orderId}/delivered`);
  }

  /**
   * Obtener historial de interacciones del cliente
   */
  public async getClientHistory(clientId: string): Promise<ApiResponse<any[]>> {
    return this.get<any[]>(`${this.endpoint}/${clientId}/history`);
  }

  /**
   * Agregar nota al cliente
   */
  public async addClientNote(clientId: string, note: string): Promise<ApiResponse<Client>> {
    return this.post<Client>(`${this.endpoint}/${clientId}/notes`, { note });
  }

  /**
   * Obtener estadísticas de clientes
   */
  public async getClientStats(): Promise<ApiResponse<{
    total: number;
    active: number;
    withOrders: number;
    byCity: Record<string, number>;
    byFaceShape: Record<string, number>;
    bySource: Record<string, number>;
    averageOrderValue: number;
    topClients: Client[];
  }>> {
    return this.get<any>(`${this.endpoint}/stats`);
  }

  /**
   * Buscar clientes por múltiples criterios
   */
  public async searchClients(searchTerm: string): Promise<ApiResponse<Client[]>> {
    return this.get<Client[]>(`${this.endpoint}/search?q=${encodeURIComponent(searchTerm)}`);
  }

  /**
   * Exportar clientes a CSV
   */
  public async exportClients(filters?: ClientFilters): Promise<ApiResponse<string>> {
    const queryParams = new URLSearchParams(filters as any);
    const url = queryParams.toString() ? `${this.endpoint}/export?${queryParams}` : `${this.endpoint}/export`;
    return this.get<string>(url);
  }
}

// Instancia singleton
export const clientsService = new ClientsService();
