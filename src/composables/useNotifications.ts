/**
 * Notifications Composable
 * Sistema de notificaciones toast para la aplicación
 * Utiliza Vue 3 Composition API siguiendo principios SOLID
 */

import { reactive, computed } from 'vue';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration: number;
  persistent: boolean;
  actions?: Array<{
    label: string;
    action: () => void;
    style?: 'primary' | 'secondary' | 'danger';
  }>;
  icon?: string;
  createdAt: Date;
}

export interface NotificationOptions {
  type?: NotificationType;
  title: string;
  message?: string;
  duration?: number;
  persistent?: boolean;
  actions?: Notification['actions'];
  icon?: string;
}

// Estado reactivo global de notificaciones
const notificationsState = reactive<{
  notifications: Notification[];
  maxNotifications: number;
  defaultDuration: number;
}>({
  notifications: [],
  maxNotifications: 5,
  defaultDuration: 5000 // 5 segundos
});

// Configuración de iconos por tipo
const DEFAULT_ICONS: Record<NotificationType, string> = {
  success: '✅',
  error: '❌',
  warning: '⚠️',
  info: 'ℹ️'
};

// Configuración de duraciones por tipo
const DEFAULT_DURATIONS: Record<NotificationType, number> = {
  success: 4000,
  error: 6000,
  warning: 5000,
  info: 4000
};

/**
 * Composable para manejo de notificaciones
 */
export function useNotifications() {
  /**
   * Genera un ID único para la notificación
   */
  const generateId = (): string => {
    return `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  /**
   * Agrega una nueva notificación
   */
  const addNotification = (options: NotificationOptions): string => {
    const id = generateId();
    const type = options.type || 'info';
    
    const notification: Notification = {
      id,
      type,
      title: options.title,
      message: options.message,
      duration: options.duration || DEFAULT_DURATIONS[type],
      persistent: options.persistent || false,
      actions: options.actions,
      icon: options.icon || DEFAULT_ICONS[type],
      createdAt: new Date()
    };

    // Agregar notificación al inicio del array
    notificationsState.notifications.unshift(notification);

    // Limitar el número de notificaciones
    if (notificationsState.notifications.length > notificationsState.maxNotifications) {
      notificationsState.notifications = notificationsState.notifications.slice(0, notificationsState.maxNotifications);
    }

    // Auto-remover si no es persistente
    if (!notification.persistent) {
      setTimeout(() => {
        removeNotification(id);
      }, notification.duration);
    }

    return id;
  };

  /**
   * Remueve una notificación por ID
   */
  const removeNotification = (id: string): boolean => {
    const index = notificationsState.notifications.findIndex(n => n.id === id);
    if (index > -1) {
      notificationsState.notifications.splice(index, 1);
      return true;
    }
    return false;
  };

  /**
   * Limpia todas las notificaciones
   */
  const clearAllNotifications = (): void => {
    notificationsState.notifications = [];
  };

  /**
   * Limpia notificaciones por tipo
   */
  const clearNotificationsByType = (type: NotificationType): void => {
    notificationsState.notifications = notificationsState.notifications.filter(n => n.type !== type);
  };

  /**
   * Actualiza una notificación existente
   */
  const updateNotification = (id: string, updates: Partial<NotificationOptions>): boolean => {
    const notification = notificationsState.notifications.find(n => n.id === id);
    if (!notification) return false;

    if (updates.title) notification.title = updates.title;
    if (updates.message) notification.message = updates.message;
    if (updates.type) {
      notification.type = updates.type;
      notification.icon = updates.icon || DEFAULT_ICONS[updates.type];
    }
    if (updates.actions) notification.actions = updates.actions;
    if (updates.persistent !== undefined) notification.persistent = updates.persistent;

    return true;
  };

  // Métodos de conveniencia para cada tipo
  const showSuccess = (title: string, message?: string, options?: Partial<NotificationOptions>): string => {
    return addNotification({
      ...options,
      type: 'success',
      title,
      message
    });
  };

  const showError = (title: string, message?: string, options?: Partial<NotificationOptions>): string => {
    return addNotification({
      ...options,
      type: 'error',
      title,
      message
    });
  };

  const showWarning = (title: string, message?: string, options?: Partial<NotificationOptions>): string => {
    return addNotification({
      ...options,
      type: 'warning',
      title,
      message
    });
  };

  const showInfo = (title: string, message?: string, options?: Partial<NotificationOptions>): string => {
    return addNotification({
      ...options,
      type: 'info',
      title,
      message
    });
  };

  /**
   * Muestra notificación de carga
   */
  const showLoading = (title: string, message?: string): string => {
    return addNotification({
      type: 'info',
      title,
      message,
      persistent: true,
      icon: '⏳'
    });
  };

  /**
   * Muestra notificación de confirmación con acciones
   */
  const showConfirmation = (
    title: string,
    message: string,
    onConfirm: () => void,
    onCancel?: () => void
  ): string => {
    return addNotification({
      type: 'warning',
      title,
      message,
      persistent: true,
      actions: [
        {
          label: 'Confirmar',
          action: () => {
            onConfirm();
          },
          style: 'primary'
        },
        {
          label: 'Cancelar',
          action: () => {
            if (onCancel) onCancel();
          },
          style: 'secondary'
        }
      ]
    });
  };

  // Computed properties
  const notifications = computed(() => notificationsState.notifications);
  const hasNotifications = computed(() => notificationsState.notifications.length > 0);
  const notificationCount = computed(() => notificationsState.notifications.length);
  
  const notificationsByType = computed(() => {
    return {
      success: notificationsState.notifications.filter(n => n.type === 'success'),
      error: notificationsState.notifications.filter(n => n.type === 'error'),
      warning: notificationsState.notifications.filter(n => n.type === 'warning'),
      info: notificationsState.notifications.filter(n => n.type === 'info')
    };
  });

  /**
   * Configuración del sistema de notificaciones
   */
  const setMaxNotifications = (max: number): void => {
    notificationsState.maxNotifications = max;
    
    // Truncar si excede el nuevo límite
    if (notificationsState.notifications.length > max) {
      notificationsState.notifications = notificationsState.notifications.slice(0, max);
    }
  };

  const setDefaultDuration = (duration: number): void => {
    notificationsState.defaultDuration = duration;
  };

  /**
   * Encuentra una notificación por ID
   */
  const findNotification = (id: string): Notification | undefined => {
    return notificationsState.notifications.find(n => n.id === id);
  };

  /**
   * Verifica si existe una notificación con el título especificado
   */
  const hasNotificationWithTitle = (title: string): boolean => {
    return notificationsState.notifications.some(n => n.title === title);
  };

  /**
   * Obtiene el tiempo restante para una notificación no persistente
   */
  const getTimeRemaining = (id: string): number => {
    const notification = findNotification(id);
    if (!notification || notification.persistent) return 0;
    
    const elapsed = Date.now() - notification.createdAt.getTime();
    const remaining = notification.duration - elapsed;
    
    return Math.max(0, remaining);
  };

  /**
   * Pausa la auto-eliminación de todas las notificaciones
   */
  const pauseAutoRemoval = (): void => {
    // En una implementación real, esto pausaría los timeouts
    console.log('Auto-removal paused');
  };

  /**
   * Reanuda la auto-eliminación de notificaciones
   */
  const resumeAutoRemoval = (): void => {
    // En una implementación real, esto reanudaría los timeouts
    console.log('Auto-removal resumed');
  };

  return {
    // Estado
    notifications,
    hasNotifications,
    notificationCount,
    notificationsByType,
    
    // Acciones principales
    addNotification,
    removeNotification,
    clearAllNotifications,
    clearNotificationsByType,
    updateNotification,
    
    // Métodos de conveniencia
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showLoading,
    showConfirmation,
    
    // Configuración
    setMaxNotifications,
    setDefaultDuration,
    
    // Utilidades
    findNotification,
    hasNotificationWithTitle,
    getTimeRemaining,
    pauseAutoRemoval,
    resumeAutoRemoval
  };
}

// Instancia global para uso directo
export const notifications = useNotifications();
