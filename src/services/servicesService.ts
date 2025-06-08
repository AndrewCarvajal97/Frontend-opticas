/**
 * Services Service
 * Maneja todas las operaciones relacionadas con servicios de la óptica
 * Extiende de WebServicesBase siguiendo principios SOLID
 */

import { WebServicesBase, type ApiResponse } from './webServicesBase';

// Interfaces para tipado fuerte
export interface OpticalService {
  id: string;
  name: string;
  category: string;
  icon: string;
  price: number;
  originalPrice: number;
  discount?: number;
  freeWithPurchase?: boolean;
  description: string;
  features: string[];
  duration: string;
  includes: string[];
  benefits: string[];
  coverage?: string;
  bookingRequired: boolean;
  rating: number;
  reviews: number;
  featured?: boolean;
  free?: boolean;
  corporate?: boolean;
  subscription?: boolean;
  warranty?: boolean;
}

export interface ServicesResponse {
  services: OpticalService[];
  popularServices: string[];
  premiumServices: string[];
  freeServices: string[];
  workingHours: Record<string, string>;
  emergencyService: {
    available: boolean;
    phone: string;
    additionalCost: number;
    description: string;
  };
}

export interface ServiceBooking {
  serviceId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  preferredDate: string;
  preferredTime: string;
  address?: string;
  notes?: string;
}

export interface ServiceFilters {
  category?: string;
  priceMin?: number;
  priceMax?: number;
  free?: boolean;
  featured?: boolean;
  bookingRequired?: boolean;
  sortBy?: 'price' | 'rating' | 'name' | 'popularity';
  sortOrder?: 'asc' | 'desc';
}

class ServicesService extends WebServicesBase {
  constructor() {
    super();
  }

  /**
   * Obtiene todos los servicios
   */
  async getAllServices(): Promise<ApiResponse<ServicesResponse>> {
    try {
      // Simulación de datos locales (en desarrollo futuro será una llamada real a la API)
      const response = await import('@/data/services.json');
      return {
        data: response.default,
        status: 200,
        message: 'Services fetched successfully',
        success: true
      };
    } catch (error) {
      throw new Error('Error fetching services');
    }
  }

  /**
   * Obtiene servicios por categoría
   */
  async getServicesByCategory(category: string): Promise<ApiResponse<OpticalService[]>> {
    const allServicesResponse = await this.getAllServices();
    const filteredServices = allServicesResponse.data.services.filter(
      service => service.category.toLowerCase() === category.toLowerCase()
    );

    return {
      data: filteredServices,
      status: 200,
      message: 'Services by category fetched successfully',
      success: true
    };
  }

  /**
   * Obtiene un servicio por ID
   */
  async getServiceById(serviceId: string): Promise<ApiResponse<OpticalService | null>> {
    const allServicesResponse = await this.getAllServices();
    const service = allServicesResponse.data.services.find(
      service => service.id === serviceId
    );

    return {
      data: service || null,
      status: service ? 200 : 404,
      message: service ? 'Service found' : 'Service not found',
      success: !!service
    };
  }

  /**
   * Busca servicios con filtros
   */
  async searchServices(filters: ServiceFilters): Promise<ApiResponse<OpticalService[]>> {
    const allServicesResponse = await this.getAllServices();
    let services = [...allServicesResponse.data.services];

    // Aplicar filtros
    if (filters.category) {
      services = services.filter(service => 
        service.category.toLowerCase().includes(filters.category!.toLowerCase())
      );
    }

    if (filters.priceMin !== undefined) {
      services = services.filter(service => service.price >= filters.priceMin!);
    }

    if (filters.priceMax !== undefined) {
      services = services.filter(service => service.price <= filters.priceMax!);
    }

    if (filters.free !== undefined) {
      services = services.filter(service => 
        filters.free ? service.price === 0 || service.free : service.price > 0
      );
    }

    if (filters.featured !== undefined) {
      services = services.filter(service => service.featured === filters.featured);
    }

    if (filters.bookingRequired !== undefined) {
      services = services.filter(service => service.bookingRequired === filters.bookingRequired);
    }

    // Aplicar ordenamiento
    if (filters.sortBy) {
      services.sort((a, b) => {
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
          case 'popularity':
            comparison = a.reviews - b.reviews;
            break;
        }

        return filters.sortOrder === 'desc' ? -comparison : comparison;
      });
    }

    return {
      data: services,
      status: 200,
      message: 'Services search completed',
      success: true
    };
  }

  /**
   * Obtiene servicios populares
   */
  async getPopularServices(): Promise<ApiResponse<OpticalService[]>> {
    const allServicesResponse = await this.getAllServices();
    const { popularServices, services } = allServicesResponse.data;
    
    const popularServicesList = services.filter(service => 
      popularServices.includes(service.id)
    );

    return {
      data: popularServicesList,
      status: 200,
      message: 'Popular services fetched successfully',
      success: true
    };
  }

  /**
   * Obtiene servicios premium
   */
  async getPremiumServices(): Promise<ApiResponse<OpticalService[]>> {
    const allServicesResponse = await this.getAllServices();
    const { premiumServices, services } = allServicesResponse.data;
    
    const premiumServicesList = services.filter(service => 
      premiumServices.includes(service.id)
    );

    return {
      data: premiumServicesList,
      status: 200,
      message: 'Premium services fetched successfully',
      success: true
    };
  }

  /**
   * Obtiene servicios gratuitos
   */
  async getFreeServices(): Promise<ApiResponse<OpticalService[]>> {
    const allServicesResponse = await this.getAllServices();
    const { freeServices, services } = allServicesResponse.data;
    
    const freeServicesList = services.filter(service => 
      freeServices.includes(service.id) || service.free || service.price === 0
    );

    return {
      data: freeServicesList,
      status: 200,
      message: 'Free services fetched successfully',
      success: true
    };
  }

  /**
   * Obtiene servicios destacados
   */
  async getFeaturedServices(): Promise<ApiResponse<OpticalService[]>> {
    const allServicesResponse = await this.getAllServices();
    const featuredServices = allServicesResponse.data.services.filter(
      service => service.featured
    );

    return {
      data: featuredServices,
      status: 200,
      message: 'Featured services fetched successfully',
      success: true
    };
  }

  /**
   * Obtiene horarios de trabajo
   */
  async getWorkingHours(): Promise<ApiResponse<Record<string, string>>> {
    const allServicesResponse = await this.getAllServices();
    
    return {
      data: allServicesResponse.data.workingHours,
      status: 200,
      message: 'Working hours fetched successfully',
      success: true
    };
  }

  /**
   * Obtiene información del servicio de emergencia
   */
  async getEmergencyService(): Promise<ApiResponse<any>> {
    const allServicesResponse = await this.getAllServices();
    
    return {
      data: allServicesResponse.data.emergencyService,
      status: 200,
      message: 'Emergency service info fetched successfully',
      success: true
    };
  }

  /**
   * Agenda una cita para un servicio
   */
  async bookService(booking: ServiceBooking): Promise<ApiResponse<{ bookingId: string; confirmationNumber: string }>> {
    try {
      // En un entorno real, esto enviaría los datos al servidor
      // Por ahora, simulamos el procesamiento
      
      // Validar que el servicio existe
      const serviceResponse = await this.getServiceById(booking.serviceId);
      if (!serviceResponse.data) {
        return {
          data: null as any,
          status: 404,
          message: 'Service not found',
          success: false
        };
      }

      // Generar ID de reserva y número de confirmación
      const bookingId = `BK-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const confirmationNumber = `CONF-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;

      // En un entorno real, aquí se enviaría el email de confirmación
      console.log('Booking details:', { ...booking, bookingId, confirmationNumber });

      return {
        data: { bookingId, confirmationNumber },
        status: 201,
        message: 'Service booked successfully',
        success: true
      };
    } catch (error) {
      throw new Error('Error booking service');
    }
  }

  /**
   * Cancela una reserva
   */
  async cancelBooking(bookingId: string): Promise<ApiResponse<boolean>> {
    try {
      // En un entorno real, esto cancelaría la reserva en el servidor
      console.log('Cancelling booking:', bookingId);

      return {
        data: true,
        status: 200,
        message: 'Booking cancelled successfully',
        success: true
      };
    } catch (error) {
      throw new Error('Error cancelling booking');
    }
  }

  /**
   * Obtiene las categorías de servicios disponibles
   */
  async getServiceCategories(): Promise<ApiResponse<string[]>> {
    const allServicesResponse = await this.getAllServices();
    const categories = [...new Set(allServicesResponse.data.services.map(service => service.category))];

    return {
      data: categories,
      status: 200,
      message: 'Service categories fetched successfully',
      success: true
    };
  }

  /**
   * Verifica disponibilidad para una fecha y hora específica
   */
  async checkAvailability(date: string, time: string): Promise<ApiResponse<boolean>> {
    try {
      // En un entorno real, esto verificaría la disponibilidad en el servidor
      // Por ahora, simulamos que siempre hay disponibilidad
      
      const requestedDateTime = new Date(`${date} ${time}`);
      const now = new Date();
      
      // Verificar que la fecha no sea en el pasado
      const isAvailable = requestedDateTime > now;

      return {
        data: isAvailable,
        status: 200,
        message: isAvailable ? 'Time slot available' : 'Time slot not available',
        success: true
      };
    } catch (error) {
      throw new Error('Error checking availability');
    }
  }

  /**
   * Obtiene slots de tiempo disponibles para una fecha
   */
  async getAvailableTimeSlots(date: string): Promise<ApiResponse<string[]>> {
    try {
      // En un entorno real, esto obtendría los slots disponibles del servidor
      // Por ahora, simulamos slots típicos de trabajo
      
      const timeSlots = [
        '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
        '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
        '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
        '17:00', '17:30'
      ];

      const selectedDate = new Date(date);
      const dayOfWeek = selectedDate.getDay();
      
      // Ajustar horarios según el día (sábado tiene horario reducido)
      const availableSlots = dayOfWeek === 6 
        ? timeSlots.filter(time => time <= '16:00')  // Sábado hasta 4 PM
        : dayOfWeek === 0 
        ? []  // Domingo cerrado
        : timeSlots;  // Lunes a viernes horario completo

      return {
        data: availableSlots,
        status: 200,
        message: 'Available time slots fetched successfully',
        success: true
      };
    } catch (error) {
      throw new Error('Error fetching available time slots');
    }
  }
}

// Instancia singleton del servicio
export const servicesService = new ServicesService();
