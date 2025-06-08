/**
 * Servicio de Notificaciones - Optivisión 4K
 * Extiende WebServicesBase siguiendo principios SOLID
 * Maneja todas las operaciones relacionadas con notificaciones push, email y SMS
 */

import { WebServicesBase, ApiResponse, PaginatedResponse } from './webServicesBase';

// Interfaces específicas para notificaciones
export interface Notification {
  id: string;
  type: 'system' | 'order' | 'promotion' | 'reminder' | 'welcome' | 'birthday';
  channel: 'email' | 'sms' | 'whatsapp' | 'push' | 'in_app';
  title: string;
  message: string;
  template?: string;
  recipientId?: string;
  recipientEmail?: string;
  recipientPhone?: string;
  metadata?: Record<string, any>;
  status: 'pending' | 'sent' | 'delivered' | 'failed' | 'cancelled';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  scheduledAt?: Date;
  sentAt?: Date;
  deliveredAt?: Date;
  readAt?: Date;
  errorMessage?: string;
  retryCount: number;
  maxRetries: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationTemplate {
  id: string;
  name: string;
  type: Notification['type'];
  channel: Notification['channel'];
  subject?: string;
  htmlContent?: string;
  textContent: string;
  variables: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface BulkNotification {
  id: string;
  campaignName: string;
  type: Notification['type'];
  channel: Notification['channel'];
  templateId: string;
  targetAudience: 'all' | 'segment' | 'individual';
  audienceFilter?: Record<string, any>;
  totalRecipients: number;
  sentCount: number;
  deliveredCount: number;
  failedCount: number;
  status: 'draft' | 'scheduled' | 'sending' | 'completed' | 'cancelled';
  scheduledAt?: Date;
  startedAt?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationFilters {
  type?: string;
  channel?: string;
  status?: string;
  priority?: string;
  recipientId?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

export interface SendNotificationRequest {
  type: Notification['type'];
  channel: Notification['channel'];
  title: string;
  message: string;
  recipientId?: string;
  recipientEmail?: string;
  recipientPhone?: string;
  templateId?: string;
  templateVariables?: Record<string, any>;
  priority?: Notification['priority'];
  scheduledAt?: string;
  metadata?: Record<string, any>;
}

export interface NotificationStats {
  total: number;
  sent: number;
  delivered: number;
  failed: number;
  byChannel: Record<string, number>;
  byType: Record<string, number>;
  deliveryRate: number;
  averageDeliveryTime: number;
  recentActivity: Notification[];
}

class NotificationsService extends WebServicesBase {
  private readonly endpoint = '/notifications';

  constructor() {
    super();
  }

  /**
   * Obtener todas las notificaciones con filtros
   */
  public async getNotifications(filters: NotificationFilters = {}): Promise<PaginatedResponse<Notification>> {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });

    const url = queryParams.toString() ? `${this.endpoint}?${queryParams}` : this.endpoint;
    return this.get<Notification[]>(url);
  }

  /**
   * Obtener notificación por ID
   */
  public async getNotificationById(id: string): Promise<ApiResponse<Notification>> {
    return this.get<Notification>(`${this.endpoint}/${id}`);
  }

  /**
   * Enviar notificación individual
   */
  public async sendNotification(request: SendNotificationRequest): Promise<ApiResponse<Notification>> {
    return this.post<Notification>(`${this.endpoint}/send`, request);
  }

  /**
   * Enviar notificación de bienvenida
   */
  public async sendWelcomeNotification(clientId: string, clientName: string, clientEmail: string): Promise<ApiResponse<Notification>> {
    return this.post<Notification>(`${this.endpoint}/welcome`, {
      clientId,
      clientName,
      clientEmail
    });
  }

  /**
   * Enviar notificación de confirmación de pedido
   */
  public async sendOrderConfirmation(orderId: string, clientId: string): Promise<ApiResponse<Notification>> {
    return this.post<Notification>(`${this.endpoint}/order-confirmation`, {
      orderId,
      clientId
    });
  }

  /**
   * Enviar notificación de estado de pedido
   */
  public async sendOrderStatusUpdate(orderId: string, status: string, clientId: string): Promise<ApiResponse<Notification>> {
    return this.post<Notification>(`${this.endpoint}/order-status`, {
      orderId,
      status,
      clientId
    });
  }

  /**
   * Enviar recordatorio de entrega
   */
  public async sendDeliveryReminder(orderId: string, deliveryDate: string, clientId: string): Promise<ApiResponse<Notification>> {
    return this.post<Notification>(`${this.endpoint}/delivery-reminder`, {
      orderId,
      deliveryDate,
      clientId
    });
  }

  /**
   * Enviar notificación promocional
   */
  public async sendPromotionalNotification(promotionId: string, recipientIds: string[]): Promise<ApiResponse<Notification[]>> {
    return this.post<Notification[]>(`${this.endpoint}/promotional`, {
      promotionId,
      recipientIds
    });
  }

  /**
   * Programar notificación
   */
  public async scheduleNotification(request: SendNotificationRequest): Promise<ApiResponse<Notification>> {
    return this.post<Notification>(`${this.endpoint}/schedule`, request);
  }

  /**
   * Cancelar notificación programada
   */
  public async cancelNotification(id: string): Promise<ApiResponse<Notification>> {
    return this.patch<Notification>(`${this.endpoint}/${id}/cancel`);
  }

  /**
   * Marcar notificación como leída
   */
  public async markAsRead(id: string): Promise<ApiResponse<Notification>> {
    return this.patch<Notification>(`${this.endpoint}/${id}/read`);
  }

  /**
   * Reintentar notificación fallida
   */
  public async retryNotification(id: string): Promise<ApiResponse<Notification>> {
    return this.post<Notification>(`${this.endpoint}/${id}/retry`);
  }

  /**
   * Obtener notificaciones del usuario
   */
  public async getUserNotifications(userId: string, page = 1, limit = 20): Promise<PaginatedResponse<Notification>> {
    return this.get<Notification[]>(`${this.endpoint}/user/${userId}?page=${page}&limit=${limit}`);
  }

  /**
   * Obtener notificaciones no leídas
   */
  public async getUnreadNotifications(userId: string): Promise<ApiResponse<Notification[]>> {
    return this.get<Notification[]>(`${this.endpoint}/user/${userId}/unread`);
  }

  /**
   * Marcar todas las notificaciones como leídas
   */
  public async markAllAsRead(userId: string): Promise<ApiResponse<void>> {
    return this.patch<void>(`${this.endpoint}/user/${userId}/mark-all-read`);
  }

  // === GESTIÓN DE PLANTILLAS ===

  /**
   * Obtener todas las plantillas
   */
  public async getTemplates(): Promise<ApiResponse<NotificationTemplate[]>> {
    return this.get<NotificationTemplate[]>(`${this.endpoint}/templates`);
  }

  /**
   * Obtener plantilla por ID
   */
  public async getTemplateById(id: string): Promise<ApiResponse<NotificationTemplate>> {
    return this.get<NotificationTemplate>(`${this.endpoint}/templates/${id}`);
  }

  /**
   * Crear nueva plantilla
   */
  public async createTemplate(templateData: Omit<NotificationTemplate, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<NotificationTemplate>> {
    return this.post<NotificationTemplate>(`${this.endpoint}/templates`, templateData);
  }

  /**
   * Actualizar plantilla
   */
  public async updateTemplate(id: string, templateData: Partial<NotificationTemplate>): Promise<ApiResponse<NotificationTemplate>> {
    return this.put<NotificationTemplate>(`${this.endpoint}/templates/${id}`, templateData);
  }

  /**
   * Eliminar plantilla
   */
  public async deleteTemplate(id: string): Promise<ApiResponse<void>> {
    return this.delete<void>(`${this.endpoint}/templates/${id}`);
  }

  /**
   * Vista previa de plantilla
   */
  public async previewTemplate(id: string, variables: Record<string, any>): Promise<ApiResponse<{
    subject?: string;
    htmlContent?: string;
    textContent: string;
  }>> {
    return this.post<any>(`${this.endpoint}/templates/${id}/preview`, { variables });
  }

  // === NOTIFICACIONES MASIVAS ===

  /**
   * Crear campaña de notificaciones masivas
   */
  public async createBulkCampaign(campaignData: {
    campaignName: string;
    type: Notification['type'];
    channel: Notification['channel'];
    templateId: string;
    targetAudience: 'all' | 'segment' | 'individual';
    audienceFilter?: Record<string, any>;
    recipientIds?: string[];
    scheduledAt?: string;
  }): Promise<ApiResponse<BulkNotification>> {
    return this.post<BulkNotification>(`${this.endpoint}/bulk/campaigns`, campaignData);
  }

  /**
   * Obtener campañas masivas
   */
  public async getBulkCampaigns(): Promise<ApiResponse<BulkNotification[]>> {
    return this.get<BulkNotification[]>(`${this.endpoint}/bulk/campaigns`);
  }

  /**
   * Iniciar campaña masiva
   */
  public async startBulkCampaign(campaignId: string): Promise<ApiResponse<BulkNotification>> {
    return this.post<BulkNotification>(`${this.endpoint}/bulk/campaigns/${campaignId}/start`);
  }

  /**
   * Cancelar campaña masiva
   */
  public async cancelBulkCampaign(campaignId: string): Promise<ApiResponse<BulkNotification>> {
    return this.patch<BulkNotification>(`${this.endpoint}/bulk/campaigns/${campaignId}/cancel`);
  }

  /**
   * Obtener estadísticas de notificaciones
   */
  public async getNotificationStats(): Promise<ApiResponse<NotificationStats>> {
    return this.get<NotificationStats>(`${this.endpoint}/stats`);
  }

  /**
   * Obtener configuración de notificaciones del usuario
   */
  public async getUserPreferences(userId: string): Promise<ApiResponse<{
    email: boolean;
    sms: boolean;
    whatsapp: boolean;
    push: boolean;
    orderUpdates: boolean;
    promotions: boolean;
    reminders: boolean;
  }>> {
    return this.get<any>(`${this.endpoint}/users/${userId}/preferences`);
  }

  /**
   * Actualizar preferencias de notificaciones
   */
  public async updateUserPreferences(userId: string, preferences: Record<string, boolean>): Promise<ApiResponse<void>> {
    return this.put<void>(`${this.endpoint}/users/${userId}/preferences`, preferences);
  }

  /**
   * Validar configuración de canales
   */
  public async validateChannelConfig(): Promise<ApiResponse<{
    email: boolean;
    sms: boolean;
    whatsapp: boolean;
    push: boolean;
    errors: string[];
  }>> {
    return this.get<any>(`${this.endpoint}/validate-config`);
  }
}

// Instancia singleton
export const notificationsService = new NotificationsService();
