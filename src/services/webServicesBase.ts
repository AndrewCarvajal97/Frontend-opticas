/**
 * Base Web Services Class
 * Implementa principios SOLID - Single Responsibility Principle
 * Maneja todas las conexiones HTTP REST API de forma centralizada
 */

export interface ApiResponse<T = any> {
  data: T;
  status: number;
  message: string;
  success: boolean;
}

export interface RequestConfig {
  headers?: Record<string, string>;
  timeout?: number;
  retries?: number;
}

export class WebServicesBase {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;
  private timeout: number;

  constructor(baseUrl: string = (import.meta as any).env.VUE_APP_API_BASE_URL || 'http://localhost:3000/api') {
    this.baseUrl = baseUrl;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    this.timeout = 10000; // 10 segundos por defecto
  }

  /**
   * Configura headers por defecto
   */
  public setDefaultHeaders(headers: Record<string, string>): void {
    this.defaultHeaders = { ...this.defaultHeaders, ...headers };
  }

  /**
   * Configura la URL base
   */
  public setBaseUrl(url: string): void {
    this.baseUrl = url;
  }

  /**
   * Construye la URL completa
   */
  private buildUrl(endpoint: string): string {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    const cleanBaseUrl = this.baseUrl.endsWith('/') ? this.baseUrl.slice(0, -1) : this.baseUrl;
    return `${cleanBaseUrl}/${cleanEndpoint}`;
  }

  /**
   * Maneja errores de respuesta HTTP
   */
  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const contentType = response.headers.get('content-type');
    let data: any;

    try {
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }
    } catch (error) {
      data = null;
    }

    const apiResponse: ApiResponse<T> = {
      data,
      status: response.status,
      message: response.statusText,
      success: response.ok
    };

    if (!response.ok) {
      throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
    }

    return apiResponse;
  }

  /**
   * Ejecuta request HTTP genérico
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint);
    const headers = { ...this.defaultHeaders, ...config.headers };
    
    const requestOptions: RequestInit = {
      ...options,
      headers,
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), config.timeout || this.timeout);

      const response = await fetch(url, {
        ...requestOptions,
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      return await this.handleResponse<T>(response);
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timeout');
        }
        throw error;
      }
      throw new Error('Unknown error occurred');
    }
  }

  /**
   * GET Request
   */
  public async get<T>(endpoint: string, config: RequestConfig = {}): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' }, config);
  }

  /**
   * POST Request
   */
  public async post<T>(
    endpoint: string,
    data?: any,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(
      endpoint,
      {
        method: 'POST',
        body: data ? JSON.stringify(data) : undefined,
      },
      config
    );
  }

  /**
   * PUT Request
   */
  public async put<T>(
    endpoint: string,
    data?: any,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(
      endpoint,
      {
        method: 'PUT',
        body: data ? JSON.stringify(data) : undefined,
      },
      config
    );
  }

  /**
   * PATCH Request
   */
  public async patch<T>(
    endpoint: string,
    data?: any,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(
      endpoint,
      {
        method: 'PATCH',
        body: data ? JSON.stringify(data) : undefined,
      },
      config
    );
  }

  /**
   * DELETE Request
   */
  public async delete<T>(endpoint: string, config: RequestConfig = {}): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' }, config);
  }

  /**
   * Upload de archivos
   */
  public async uploadFile<T>(
    endpoint: string,
    file: File,
    additionalData: Record<string, any> = {},
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);
    
    Object.keys(additionalData).forEach(key => {
      formData.append(key, String(additionalData[key]));
    });

    const headers = { ...config.headers };
    // Removemos Content-Type para que el navegador lo configure automáticamente con boundary
    delete headers['Content-Type'];

    return this.request<T>(
      endpoint,
      {
        method: 'POST',
        body: formData,
      },
      { ...config, headers }
    );
  }
}

// Instancia singleton para uso global
export const webServicesInstance = new WebServicesBase();
