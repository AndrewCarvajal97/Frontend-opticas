/**
 * General Service
 * Maneja el contenido general del sitio y funcionalidades de contacto
 * Extiende de WebServicesBase siguiendo principios SOLID
 */

import { WebServicesBase, type ApiResponse } from './webServicesBase';

// Interfaces para tipado fuerte
export interface GeneralContent {
  general: {
    companyName: string;
    tagline: string;
    description: string;
    phone: string;
    email: string;
    address: string;
    workingHours: string;
    socialMedia: {
      facebook: string;
      instagram: string;
      whatsapp: string;
      twitter: string;
    };
  };
  hero: {
    title: string;
    subtitle: string;
    description: string;
    ctaText: string;
    features: string[];
    pricing: {
      homeExam: number;
      discount: string;
      description: string;
    };
  };
  about: {
    title: string;
    description: string;
    features: Array<{
      icon: string;
      title: string;
      description: string;
    }>;
  };
  contact: {
    title: string;
    subtitle: string;
    description: string;
    form: {
      title: string;
      fields: Array<{
        name: string;
        label: string;
        type: string;
        required: boolean;
        placeholder?: string;
      }>;
    };
  };
}

export interface ContactForm {
  fullName: string;
  phone: string;
  email: string;
  address?: string;
  preferredDate?: string;
  preferredTime?: string;
  message?: string;
  serviceType?: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
  contactId: string;
  estimatedResponse: string;
}

export interface NewsletterSubscription {
  email: string;
  name?: string;
  interests?: string[];
}

class GeneralService extends WebServicesBase {
  constructor() {
    super();
  }

  /**
   * Obtiene el contenido general del sitio
   */
  async getGeneralContent(): Promise<ApiResponse<GeneralContent>> {
    try {
      // Simulación de datos locales (en desarrollo futuro será una llamada real a la API)
      const response = await import('@/data/general.json');
      return {
        data: response.default,
        status: 200,
        message: 'General content fetched successfully',
        success: true
      };
    } catch (error) {
      throw new Error('Error fetching general content');
    }
  }

  /**
   * Obtiene información de la empresa
   */
  async getCompanyInfo(): Promise<ApiResponse<GeneralContent['general']>> {
    const generalContent = await this.getGeneralContent();
    
    return {
      data: generalContent.data.general,
      status: 200,
      message: 'Company info fetched successfully',
      success: true
    };
  }

  /**
   * Obtiene contenido del hero/banner principal
   */
  async getHeroContent(): Promise<ApiResponse<GeneralContent['hero']>> {
    const generalContent = await this.getGeneralContent();
    
    return {
      data: generalContent.data.hero,
      status: 200,
      message: 'Hero content fetched successfully',
      success: true
    };
  }

  /**
   * Obtiene contenido de la sección "Acerca de"
   */
  async getAboutContent(): Promise<ApiResponse<GeneralContent['about']>> {
    const generalContent = await this.getGeneralContent();
    
    return {
      data: generalContent.data.about,
      status: 200,
      message: 'About content fetched successfully',
      success: true
    };
  }

  /**
   * Obtiene contenido de la sección de contacto
   */
  async getContactContent(): Promise<ApiResponse<GeneralContent['contact']>> {
    const generalContent = await this.getGeneralContent();
    
    return {
      data: generalContent.data.contact,
      status: 200,
      message: 'Contact content fetched successfully',
      success: true
    };
  }

  /**
   * Envía formulario de contacto
   */
  async submitContactForm(formData: ContactForm): Promise<ApiResponse<ContactResponse>> {
    try {
      // Validar datos requeridos
      if (!formData.fullName || !formData.phone || !formData.email) {
        return {
          data: null as any,
          status: 400,
          message: 'Required fields are missing',
          success: false
        };
      }

      // Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        return {
          data: null as any,
          status: 400,
          message: 'Invalid email format',
          success: false
        };
      }

      // En un entorno real, esto enviaría el formulario al servidor
      // Por ahora, simulamos el procesamiento
      
      const contactId = `CONT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Simular envío de email
      await this.sendEmail({
        to: 'info@opticavisionplus.com',
        subject: `Nueva consulta de ${formData.fullName}`,
        content: this.formatContactEmail(formData),
        type: 'contact'
      });

      // Enviar email de confirmación al cliente
      await this.sendEmail({
        to: formData.email,
        subject: 'Confirmación de contacto - Óptica Visión Plus',
        content: this.formatConfirmationEmail(formData, contactId),
        type: 'confirmation'
      });

      const response: ContactResponse = {
        success: true,
        message: 'Contact form submitted successfully',
        contactId,
        estimatedResponse: '24 horas'
      };

      return {
        data: response,
        status: 201,
        message: 'Contact form submitted successfully',
        success: true
      };
    } catch (error) {
      throw new Error('Error submitting contact form');
    }
  }

  /**
   * Suscribe al newsletter
   */
  async subscribeNewsletter(subscription: NewsletterSubscription): Promise<ApiResponse<boolean>> {
    try {
      // Validar email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(subscription.email)) {
        return {
          data: false,
          status: 400,
          message: 'Invalid email format',
          success: false
        };
      }

      // En un entorno real, esto agregaría el email a la lista de newsletter
      console.log('Newsletter subscription:', subscription);

      // Enviar email de bienvenida
      await this.sendEmail({
        to: subscription.email,
        subject: 'Bienvenido a Óptica Visión Plus',
        content: this.formatWelcomeEmail(subscription),
        type: 'newsletter'
      });

      return {
        data: true,
        status: 201,
        message: 'Newsletter subscription successful',
        success: true
      };
    } catch (error) {
      throw new Error('Error subscribing to newsletter');
    }
  }

  /**
   * Obtiene información de redes sociales
   */
  async getSocialMedia(): Promise<ApiResponse<GeneralContent['general']['socialMedia']>> {
    const companyInfo = await this.getCompanyInfo();
    
    return {
      data: companyInfo.data.socialMedia,
      status: 200,
      message: 'Social media links fetched successfully',
      success: true
    };
  }

  /**
   * Envía email (simulación)
   */
  private async sendEmail(emailData: {
    to: string;
    subject: string;
    content: string;
    type: 'contact' | 'confirmation' | 'newsletter';
  }): Promise<void> {
    // En un entorno real, esto utilizaría un servicio de email como SendGrid, Mailgun, etc.
    console.log('Email sent:', emailData);
    
    // Simular delay de envío
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  /**
   * Formatea email de contacto
   */
  private formatContactEmail(formData: ContactForm): string {
    return `
      <h2>Nueva consulta recibida</h2>
      <p><strong>Nombre:</strong> ${formData.fullName}</p>
      <p><strong>Teléfono:</strong> ${formData.phone}</p>
      <p><strong>Email:</strong> ${formData.email}</p>
      ${formData.address ? `<p><strong>Dirección:</strong> ${formData.address}</p>` : ''}
      ${formData.preferredDate ? `<p><strong>Fecha preferida:</strong> ${formData.preferredDate}</p>` : ''}
      ${formData.preferredTime ? `<p><strong>Hora preferida:</strong> ${formData.preferredTime}</p>` : ''}
      ${formData.serviceType ? `<p><strong>Tipo de servicio:</strong> ${formData.serviceType}</p>` : ''}
      ${formData.message ? `<p><strong>Mensaje:</strong><br>${formData.message}</p>` : ''}
      <p><em>Enviado desde el sitio web de Óptica Visión Plus</em></p>
    `;
  }

  /**
   * Formatea email de confirmación
   */
  private formatConfirmationEmail(formData: ContactForm, contactId: string): string {
    return `
      <h2>¡Gracias por contactarnos!</h2>
      <p>Hola ${formData.fullName},</p>
      <p>Hemos recibido tu consulta y nos pondremos en contacto contigo en las próximas 24 horas.</p>
      <p><strong>Número de referencia:</strong> ${contactId}</p>
      <p>Mientras tanto, puedes seguirnos en nuestras redes sociales para estar al día con nuestras promociones y novedades.</p>
      <p>¡Gracias por confiar en Óptica Visión Plus!</p>
      <p><em>El equipo de Óptica Visión Plus</em></p>
    `;
  }

  /**
   * Formatea email de bienvenida al newsletter
   */
  private formatWelcomeEmail(subscription: NewsletterSubscription): string {
    return `
      <h2>¡Bienvenido a nuestra comunidad!</h2>
      <p>Hola${subscription.name ? ` ${subscription.name}` : ''},</p>
      <p>¡Gracias por suscribirte a nuestro newsletter!</p>
      <p>Ahora recibirás las últimas novedades, promociones exclusivas y consejos para el cuidado de tu visión.</p>
      <p>Como regalo de bienvenida, tienes un <strong>10% de descuento</strong> en tu primera compra. Usa el código: <strong>BIENVENIDO10</strong></p>
      <p>¡Esperamos verte pronto!</p>
      <p><em>El equipo de Óptica Visión Plus</em></p>
    `;
  }

  /**
   * Obtiene configuración de la aplicación
   */
  async getAppConfig(): Promise<ApiResponse<any>> {
    try {
      const config = {
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        features: {
          newsletter: true,
          onlineBooking: true,
          cart: true,
          socialLogin: false,
          chat: false
        },
        limits: {
          maxCartItems: 20,
          maxImageSize: 5242880, // 5MB
          sessionTimeout: 3600000 // 1 hora
        }
      };

      return {
        data: config,
        status: 200,
        message: 'App config fetched successfully',
        success: true
      };
    } catch (error) {
      throw new Error('Error fetching app config');
    }
  }

  /**
   * Reporta un error o problema
   */
  async reportIssue(issue: {
    type: 'bug' | 'feature' | 'content' | 'other';
    description: string;
    userEmail?: string;
    priority: 'low' | 'medium' | 'high';
    browserInfo?: string;
  }): Promise<ApiResponse<{ ticketId: string }>> {
    try {
      const ticketId = `TICKET-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
      
      // En un entorno real, esto crearía un ticket en el sistema de soporte
      console.log('Issue reported:', { ...issue, ticketId });

      return {
        data: { ticketId },
        status: 201,
        message: 'Issue reported successfully',
        success: true
      };
    } catch (error) {
      throw new Error('Error reporting issue');
    }
  }
}

// Instancia singleton del servicio
export const generalService = new GeneralService();
