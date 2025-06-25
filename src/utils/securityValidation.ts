
// Security validation utilities

// Sanitize text input to prevent XSS
export const sanitizeText = (text: string, maxLength: number = 500): string => {
  if (!text) return '';
  
  // Remove potential script tags and other dangerous content
  const sanitized = text
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();
    
  return sanitized.substring(0, maxLength);
};

// Validate email format
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate phone number (Brazilian format)
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^\(?[1-9]{2}\)?\s?9?\d{4}-?\d{4}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

// Validate URL format
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Rate limiting for user actions (simple in-memory implementation)
const actionLog = new Map<string, { count: number; lastAction: number }>();

export const isRateLimited = (userId: string, action: string, maxActions: number = 5, windowMs: number = 60000): boolean => {
  const key = `${userId}:${action}`;
  const now = Date.now();
  const userActions = actionLog.get(key) || { count: 0, lastAction: 0 };
  
  // Reset if window has passed
  if (now - userActions.lastAction > windowMs) {
    userActions.count = 0;
  }
  
  userActions.count++;
  userActions.lastAction = now;
  actionLog.set(key, userActions);
  
  return userActions.count > maxActions;
};

// Validate professional profile data
export const validateProfessionalProfile = (data: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!data.nome_artistico || data.nome_artistico.length < 2 || data.nome_artistico.length > 100) {
    errors.push('Nome artístico deve ter entre 2 e 100 caracteres');
  }
  
  if (!data.tipo_profissional) {
    errors.push('Tipo profissional é obrigatório');
  }
  
  if (data.bio && data.bio.length > 1000) {
    errors.push('Bio deve ter no máximo 1000 caracteres');
  }
  
  if (data.cache_hora && (data.cache_hora < 0 || data.cache_hora > 10000)) {
    errors.push('Cache por hora deve estar entre R$ 0 e R$ 10.000');
  }
  
  if (data.cache_evento && (data.cache_evento < 0 || data.cache_evento > 100000)) {
    errors.push('Cache por evento deve estar entre R$ 0 e R$ 100.000');
  }
  
  if (data.instagram_url && !isValidUrl(data.instagram_url)) {
    errors.push('URL do Instagram inválida');
  }
  
  if (data.youtube_url && !isValidUrl(data.youtube_url)) {
    errors.push('URL do YouTube inválida');
  }
  
  return { isValid: errors.length === 0, errors };
};

// Validate event data
export const validateEventData = (data: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!data.titulo || data.titulo.length < 3 || data.titulo.length > 200) {
    errors.push('Título deve ter entre 3 e 200 caracteres');
  }
  
  if (data.descricao && data.descricao.length > 1000) {
    errors.push('Descrição deve ter no máximo 1000 caracteres');
  }
  
  if (!data.data) {
    errors.push('Data do evento é obrigatória');
  } else {
    const eventDate = new Date(data.data);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (eventDate < today) {
      errors.push('Data do evento não pode ser no passado');
    }
  }
  
  if (!data.local || data.local.length < 3 || data.local.length > 200) {
    errors.push('Local deve ter entre 3 e 200 caracteres');
  }
  
  return { isValid: errors.length === 0, errors };
};

// Log security events (for monitoring)
export const logSecurityEvent = (event: string, userId?: string, details?: any) => {
  console.warn(`[SECURITY] ${event}`, {
    userId,
    timestamp: new Date().toISOString(),
    details
  });
  
  // In a production environment, this would send to a security monitoring service
};
