/**
 * Base WebSockets Class
 * Implementa principios SOLID - Single Responsibility Principle
 * Maneja todas las conexiones WebSocket de forma centralizada
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

  constructor(baseUrl: string = process.env.VUE_APP_WS_BASE_URL || 'ws://localhost:3000') {
    this.baseUrl = baseUrl;
    this.config = {
      reconnectAttempts: 5,
      reconnectInterval: 3000, // 3 segundos
      pingInterval: 30000, // 30 segundos
      pongTimeout: 5000, // 5 segundos
    };

    console.warn('WebSockets desactivados: el backend aún no está implementado.');
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
   * Desconecta el WebSocket
   */
  public disconnect(): void {
    console.warn('Desconexión bloqueada: el backend aún no está implementado.');
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
