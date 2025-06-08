/**
 * Base WebSockets Class - Optivisión 4K
 * Implementa principios SOLID y Clean Architecture
 * Single Responsibility: Manejo de conexiones WebSocket en tiempo real
 * Open/Closed: Extensible para diferentes tipos de mensajes y eventos
 * Liskov Substitution: Puede ser extendido por servicios WebSocket específicos
 * Interface Segregation: Interfaces separadas para diferentes tipos de eventos
 * Dependency Inversion: Abstracción sobre WebSocket nativo del navegador
 */

export interface WebSocketMessage<T = any> {
  type: string;
  data: T;
  timestamp: number;
  id?: string;
}

export interface WebSocketConfig {
  reconnectAttempts: number;
  reconnectInterval: number;
  pingInterval: number;
  pongTimeout: number;
  protocols?: string[];
}

export type WebSocketEventHandler<T = any> = (message: WebSocketMessage<T>) => void;
export type WebSocketErrorHandler = (error: Event) => void;
export type WebSocketStateHandler = () => void;

// Desactivar WebSockets
export class WebSocketsBase {
  private baseUrl: string;
  private socket: WebSocket | null = null;
  private config: WebSocketConfig;
  private eventHandlers: Map<string, WebSocketEventHandler[]> = new Map();
  private reconnectTimer: number | null = null;
  private pingTimer: number | null = null;
  private reconnectAttempts = 0;
  private isReconnecting = false;

  constructor(baseUrl: string = import.meta.env.VITE_WS_BASE_URL || 'ws://localhost:3000') {
    this.baseUrl = baseUrl;
    this.config = {
      reconnectAttempts: 5,
      reconnectInterval: 3000, // 3 segundos
      pingInterval: 30000, // 30 segundos
      pongTimeout: 5000, // 5 segundos
    };

    console.warn('WebSockets preparados para backend futuro - Optivisión 4K');
  }

  /**
   * Configura las opciones de WebSocket
   */
  public setConfig(config: Partial<WebSocketConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Configura la URL base
   */
  public setBaseUrl(url: string): void {
    this.baseUrl = url;
  }

  /**
   * Conecta al WebSocket (Preparado para implementación futura)
   */
  public async connect(endpoint: string = '', protocols?: string[]): Promise<void> {
    // TODO: Implementar cuando el backend esté listo
    console.log('Conexión WebSocket preparada para:', `${this.baseUrl}${endpoint}`);
    return Promise.resolve();
  }

  /**
   * Envía un mensaje por WebSocket (Preparado para implementación futura)
   */
  public send<T>(type: string, data: T): void {
    // TODO: Implementar cuando el backend esté listo
    console.log('Mensaje WebSocket preparado:', { type, data });
  }

  /**
   * Desconecta el WebSocket
   */
  public disconnect(): void {
    console.log('Desconexión WebSocket - Optivisión 4K');
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.stopPing();
    this.clearReconnectTimer();
    this.isReconnecting = false;
    this.reconnectAttempts = 0;
  }

  /**
   * Registra un handler para un tipo de mensaje específico
   */
  public on<T>(type: string, handler: WebSocketEventHandler<T>): void {
    if (!this.eventHandlers.has(type)) {
      this.eventHandlers.set(type, []);
    }
    this.eventHandlers.get(type)!.push(handler);
  }

  /**
   * Desregistra un handler para un tipo de mensaje específico
   */
  public off<T>(type: string, handler: WebSocketEventHandler<T>): void {
    const handlers = this.eventHandlers.get(type);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  /**
   * Verifica si el WebSocket está conectado
   */
  public isConnected(): boolean {
    return this.socket !== null && this.socket.readyState === WebSocket.OPEN;
  }

  /**
   * Obtiene el estado actual del WebSocket
   */
  public getState(): number {
    return this.socket ? this.socket.readyState : WebSocket.CLOSED;
  }

  /**
   * Programa una reconexión automática
   */
  private scheduleReconnect(endpoint: string, protocols?: string[]): void {
    if (this.isReconnecting) return;

    this.isReconnecting = true;
    this.reconnectAttempts++;

    console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.config.reconnectAttempts})`);

    this.reconnectTimer = window.setTimeout(() => {
      this.connect(endpoint, protocols).catch(() => {
        // Si falla la reconexión, intentar nuevamente
        if (this.reconnectAttempts < this.config.reconnectAttempts) {
          this.scheduleReconnect(endpoint, protocols);
        } else {
          console.error('Max reconnection attempts reached');
          this.isReconnecting = false;
        }
      });
    }, this.config.reconnectInterval);
  }

  /**
   * Limpia el timer de reconexión
   */
  private clearReconnectTimer(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  /**
   * Inicia el ping periódico para mantener la conexión viva
   */
  private startPing(): void {
    this.stopPing();
    this.pingTimer = window.setInterval(() => {
      if (this.isConnected()) {
        this.send('ping', {});
      }
    }, this.config.pingInterval);
  }

  /**
   * Detiene el ping periódico
   */
  private stopPing(): void {
    if (this.pingTimer) {
      clearInterval(this.pingTimer);
      this.pingTimer = null;
    }
  }
}

// Instancia singleton para uso global
export const webSocketInstance = new WebSocketsBase();
