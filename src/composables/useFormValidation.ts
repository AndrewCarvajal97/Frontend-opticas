/**
 * Form Validation Composable
 * Sistema de validación de formularios reutilizable
 * Utiliza Vue 3 Composition API siguiendo principios SOLID
 */

import { ref, reactive, computed, watch, readonly } from 'vue';

export type ValidationRule = {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  email?: boolean;
  phone?: boolean;
  date?: boolean;
  custom?: (value: any) => string | null;
  message?: string;
};

export type FieldValidation = {
  value: any;
  rules: ValidationRule[];
  error: string | null;
  touched: boolean;
  valid: boolean;
};

export type FormValidation = {
  [key: string]: FieldValidation;
};

/**
 * Composable para validación de formularios
 */
export function useFormValidation() {
  const formData = reactive<Record<string, any>>({});
  const validations = reactive<FormValidation>({});
  const isSubmitting = ref(false);
  const hasBeenSubmitted = ref(false);

  /**
   * Registra un campo en el formulario
   */
  const registerField = (
    fieldName: string,
    initialValue: any = '',
    rules: ValidationRule[] = []
  ): void => {
    formData[fieldName] = initialValue;
    validations[fieldName] = {
      value: initialValue,
      rules,
      error: null,
      touched: false,
      valid: true
    };

    // Watcher para validación automática
    watch(
      () => formData[fieldName],
      (newValue) => {
        validations[fieldName].value = newValue;
        if (validations[fieldName].touched || hasBeenSubmitted.value) {
          validateField(fieldName);
        }
      }
    );
  };

  /**
   * Valida un campo específico
   */
  const validateField = (fieldName: string): boolean => {
    const field = validations[fieldName];
    if (!field) return true;

    const value = formData[fieldName];
    let error: string | null = null;

    for (const rule of field.rules) {
      // Validación requerida
      if (rule.required && (!value || value.toString().trim() === '')) {
        error = rule.message || `${fieldName} es requerido`;
        break;
      }

      // Si el campo está vacío y no es requerido, no validar otras reglas
      if (!value || value.toString().trim() === '') {
        continue;
      }

      // Validación de longitud mínima
      if (rule.minLength && value.toString().length < rule.minLength) {
        error = rule.message || `Mínimo ${rule.minLength} caracteres`;
        break;
      }

      // Validación de longitud máxima
      if (rule.maxLength && value.toString().length > rule.maxLength) {
        error = rule.message || `Máximo ${rule.maxLength} caracteres`;
        break;
      }

      // Validación de patrón/regex
      if (rule.pattern && !rule.pattern.test(value.toString())) {
        error = rule.message || 'Formato inválido';
        break;
      }

      // Validación de email
      if (rule.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value.toString())) {
          error = rule.message || 'Email inválido';
          break;
        }
      }

      // Validación de teléfono colombiano
      if (rule.phone) {
        const phoneRegex = /^(\+57|57)?[0-9]{10}$/;
        const cleanPhone = value.toString().replace(/[\s\-\(\)]/g, '');
        if (!phoneRegex.test(cleanPhone)) {
          error = rule.message || 'Número de teléfono inválido';
          break;
        }
      }

      // Validación de fecha
      if (rule.date) {
        const dateValue = new Date(value);
        if (isNaN(dateValue.getTime())) {
          error = rule.message || 'Fecha inválida';
          break;
        }
      }

      // Validación personalizada
      if (rule.custom) {
        const customError = rule.custom(value);
        if (customError) {
          error = customError;
          break;
        }
      }
    }

    field.error = error;
    field.valid = error === null;
    
    return field.valid;
  };

  /**
   * Marca un campo como tocado
   */
  const touchField = (fieldName: string): void => {
    if (validations[fieldName]) {
      validations[fieldName].touched = true;
      validateField(fieldName);
    }
  };

  /**
   * Valida todo el formulario
   */
  const validateForm = (): boolean => {
    let isValid = true;
    
    for (const fieldName in validations) {
      validations[fieldName].touched = true;
      if (!validateField(fieldName)) {
        isValid = false;
      }
    }
    
    return isValid;
  };

  /**
   * Resetea la validación de un campo
   */
  const resetField = (fieldName: string): void => {
    if (validations[fieldName]) {
      validations[fieldName].error = null;
      validations[fieldName].touched = false;
      validations[fieldName].valid = true;
    }
  };

  /**
   * Resetea todo el formulario
   */
  const resetForm = (): void => {
    hasBeenSubmitted.value = false;
    isSubmitting.value = false;
    
    for (const fieldName in validations) {
      resetField(fieldName);
      formData[fieldName] = '';
    }
  };

  /**
   * Establece errores externos (del servidor)
   */
  const setErrors = (errors: Record<string, string>): void => {
    for (const fieldName in errors) {
      if (validations[fieldName]) {
        validations[fieldName].error = errors[fieldName];
        validations[fieldName].valid = false;
        validations[fieldName].touched = true;
      }
    }
  };

  /**
   * Obtiene todos los errores del formulario
   */
  const getErrors = (): Record<string, string> => {
    const errors: Record<string, string> = {};
    
    for (const fieldName in validations) {
      if (validations[fieldName].error) {
        errors[fieldName] = validations[fieldName].error;
      }
    }
    
    return errors;
  };

  /**
   * Actualiza el valor de un campo
   */
  const updateField = (fieldName: string, value: any): void => {
    formData[fieldName] = value;
  };

  /**
   * Obtiene el valor de un campo
   */
  const getFieldValue = (fieldName: string): any => {
    return formData[fieldName];
  };

  /**
   * Verifica si un campo tiene error
   */
  const hasError = (fieldName: string): boolean => {
    return validations[fieldName]?.error !== null;
  };

  /**
   * Obtiene el error de un campo
   */
  const getError = (fieldName: string): string | null => {
    return validations[fieldName]?.error || null;
  };

  /**
   * Verifica si un campo ha sido tocado
   */
  const isTouched = (fieldName: string): boolean => {
    return validations[fieldName]?.touched || false;
  };

  /**
   * Verifica si un campo es válido
   */
  const isValid = (fieldName: string): boolean => {
    return validations[fieldName]?.valid || false;
  };

  // Computed properties
  const isFormValid = computed(() => {
    return Object.values(validations).every(field => field.valid);
  });

  const hasErrors = computed(() => {
    return Object.values(validations).some(field => field.error !== null);
  });

  const touchedFields = computed(() => {
    return Object.keys(validations).filter(key => validations[key].touched);
  });

  const invalidFields = computed(() => {
    return Object.keys(validations).filter(key => !validations[key].valid);
  });

  const formProgress = computed(() => {
    const totalFields = Object.keys(validations).length;
    if (totalFields === 0) return 0;
    
    const validFields = Object.values(validations).filter(field => field.valid).length;
    return (validFields / totalFields) * 100;
  });

  /**
   * Manejo de envío del formulario
   */
  const handleSubmit = async (submitFunction: (data: Record<string, any>) => Promise<any>): Promise<any> => {
    hasBeenSubmitted.value = true;
    
    if (!validateForm()) {
      throw new Error('Formulario inválido');
    }
    
    isSubmitting.value = true;
    
    try {
      const result = await submitFunction(formData);
      return result;
    } catch (error) {
      throw error;
    } finally {
      isSubmitting.value = false;
    }
  };

  return {
    // Estado
    formData: readonly(formData),
    isSubmitting: readonly(isSubmitting),
    hasBeenSubmitted: readonly(hasBeenSubmitted),
    
    // Computed
    isFormValid,
    hasErrors,
    touchedFields,
    invalidFields,
    formProgress,
    
    // Métodos de registro
    registerField,
    
    // Métodos de validación
    validateField,
    validateForm,
    touchField,
    
    // Métodos de control
    resetField,
    resetForm,
    setErrors,
    getErrors,
    
    // Métodos de acceso a campos
    updateField,
    getFieldValue,
    hasError,
    getError,
    isTouched,
    isValid,
    
    // Manejo de envío
    handleSubmit
  };
}

/**
 * Composable específico para formulario de contacto
 */
export function useContactForm() {
  const formValidation = useFormValidation();
  
  // Registrar campos del formulario de contacto
  formValidation.registerField('fullName', '', [
    { required: true, message: 'El nombre es requerido' },
    { minLength: 2, message: 'El nombre debe tener al menos 2 caracteres' },
    { maxLength: 100, message: 'El nombre no puede exceder 100 caracteres' }
  ]);
  
  formValidation.registerField('phone', '', [
    { required: true, message: 'El teléfono es requerido' },
    { phone: true, message: 'Formato de teléfono inválido (ej: 300 123 4567)' }
  ]);
  
  formValidation.registerField('email', '', [
    { required: true, message: 'El email es requerido' },
    { email: true, message: 'Formato de email inválido' }
  ]);
  
  formValidation.registerField('address', '', [
    { required: true, message: 'La dirección es requerida' },
    { minLength: 10, message: 'La dirección debe ser más específica' }
  ]);
  
  formValidation.registerField('preferredDate', '', [
    { required: true, message: 'Selecciona una fecha' },
    { 
      custom: (value) => {
        if (!value) return null;
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
          return 'No puedes seleccionar una fecha pasada';
        }
        return null;
      }
    }
  ]);
  
  formValidation.registerField('preferredTime', '', [
    { required: true, message: 'Selecciona una hora' }
  ]);
  
  formValidation.registerField('message', '', [
    { maxLength: 500, message: 'El mensaje no puede exceder 500 caracteres' }
  ]);

  return {
    ...formValidation,
    
    // Métodos específicos del formulario de contacto
    getContactData: () => ({
      fullName: formValidation.getFieldValue('fullName'),
      phone: formValidation.getFieldValue('phone'),
      email: formValidation.getFieldValue('email'),
      address: formValidation.getFieldValue('address'),
      preferredDate: formValidation.getFieldValue('preferredDate'),
      preferredTime: formValidation.getFieldValue('preferredTime'),
      message: formValidation.getFieldValue('message')
    })
  };
}
