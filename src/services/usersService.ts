/**
 * Servicio de Usuarios - Optivisión 4K
 * Extiende WebServicesBase siguiendo principios SOLID
 * Implementa todas las operaciones relacionadas con usuarios
 */

import { WebServicesBase } from './webServicesBase';
import type { ApiResponse, PaginatedResponse } from './webServicesBase';

// Interfaces específicas para usuarios
export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address?: string;
  faceShape?: 'ovalado' | 'cuadrado' | 'corazon' | 'diamante';
  preferredStyle?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserRegistration {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  address?: string;
  faceShape?: string;
  preferredStyle?: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface UserProfile {
  fullName: string;
  phone: string;
  address?: string;
  faceShape?: string;
  preferredStyle?: string;
}

export interface UserFilters {
  search?: string;
  faceShape?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

class UsersService extends WebServicesBase {
  private readonly endpoint = '/users';

  constructor() {
    super();
  }

  /**
   * Obtener todos los usuarios con filtros opcionales
   */
  public async getUsers(filters: UserFilters = {}): Promise<PaginatedResponse<User>> {
    const queryParams = new URLSearchParams();
    
    if (filters.search) queryParams.append('search', filters.search);
    if (filters.faceShape) queryParams.append('faceShape', filters.faceShape);
    if (filters.isActive !== undefined) queryParams.append('isActive', filters.isActive.toString());
    if (filters.page) queryParams.append('page', filters.page.toString());
    if (filters.limit) queryParams.append('limit', filters.limit.toString());

    const url = queryParams.toString() ? `${this.endpoint}?${queryParams}` : this.endpoint;
    // Cast the response to PaginatedResponse since we know the API returns pagination info
    return this.get<User[]>(url) as Promise<PaginatedResponse<User>>;
  }

  /**
   * Obtener usuario por ID
   */
  public async getUserById(id: string): Promise<ApiResponse<User>> {
    return this.get<User>(`${this.endpoint}/${id}`);
  }

  /**
   * Obtener usuario por email
   */
  public async getUserByEmail(email: string): Promise<ApiResponse<User>> {
    return this.get<User>(`${this.endpoint}/email/${encodeURIComponent(email)}`);
  }

  /**
   * Registrar nuevo usuario
   */
  public async registerUser(userData: UserRegistration): Promise<ApiResponse<User>> {
    return this.post<User>(`${this.endpoint}/register`, userData);
  }

  /**
   * Iniciar sesión
   */
  public async loginUser(credentials: UserLogin): Promise<ApiResponse<{user: User, token: string}>> {
    return this.post<{user: User, token: string}>(`${this.endpoint}/login`, credentials);
  }

  /**
   * Actualizar perfil de usuario
   */
  public async updateUserProfile(id: string, profileData: UserProfile): Promise<ApiResponse<User>> {
    return this.put<User>(`${this.endpoint}/${id}/profile`, profileData);
  }

  /**
   * Actualizar usuario completo (admin)
   */
  public async updateUser(id: string, userData: Partial<User>): Promise<ApiResponse<User>> {
    return this.put<User>(`${this.endpoint}/${id}`, userData);
  }

  /**
   * Activar/Desactivar usuario
   */
  public async toggleUserStatus(id: string): Promise<ApiResponse<User>> {
    return this.patch<User>(`${this.endpoint}/${id}/toggle-status`);
  }

  /**
   * Eliminar usuario
   */
  public async deleteUser(id: string): Promise<ApiResponse<void>> {
    return this.delete<void>(`${this.endpoint}/${id}`);
  }

  /**
   * Cambiar contraseña
   */
  public async changePassword(id: string, oldPassword: string, newPassword: string): Promise<ApiResponse<void>> {
    return this.patch<void>(`${this.endpoint}/${id}/change-password`, {
      oldPassword,
      newPassword
    });
  }

  /**
   * Solicitar recuperación de contraseña
   */
  public async requestPasswordReset(email: string): Promise<ApiResponse<void>> {
    return this.post<void>(`${this.endpoint}/password-reset/request`, { email });
  }

  /**
   * Resetear contraseña con token
   */
  public async resetPassword(token: string, newPassword: string): Promise<ApiResponse<void>> {
    return this.post<void>(`${this.endpoint}/password-reset/confirm`, {
      token,
      newPassword
    });
  }

  /**
   * Verificar token de autenticación
   */
  public async verifyToken(token: string): Promise<ApiResponse<User>> {
    return this.get<User>(`${this.endpoint}/verify-token`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  /**
   * Cerrar sesión
   */
  public async logout(): Promise<ApiResponse<void>> {
    return this.post<void>(`${this.endpoint}/logout`);
  }

  /**
   * Obtener estadísticas de usuarios (admin)
   */
  public async getUserStats(): Promise<ApiResponse<{
    total: number;
    active: number;
    byFaceShape: Record<string, number>;
    byPreferredStyle: Record<string, number>;
    recentRegistrations: number;
  }>> {
    return this.get<any>(`${this.endpoint}/stats`);
  }
}

// Instancia singleton
export const usersService = new UsersService();
