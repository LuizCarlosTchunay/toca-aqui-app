
// Security validation utilities

// Sanitize text input to prevent XSS
export const sanitizeText = (text: string, maxLength: number = 500): string => {
  if (!text || typeof text !== 'string') return '';
  
  // Remove potential script tags and other dangerous content
  const sanitized = text
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/data:/gi, '')
    .trim();
    
  return sanitized.substring(0, maxLength);
};

// Validate email format
export const isValidEmail = (email: string): boolean => {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 320; // RFC 5321 limit
};

// Validate phone number (Brazilian format)
export const isValidPhone = (phone: string): boolean => {
  if (!phone || typeof phone !== 'string') return false;
  const cleanPhone = phone.replace(/\D/g, '');
  // Brazilian phone: 10 or 11 digits
  return cleanPhone.length >= 10 && cleanPhone.length <= 11;
};

// Validate URL format
export const isValidUrl = (url: string): boolean => {
  if (!url || typeof url !== 'string') return false;
  try {
    const urlObj = new URL(url);
    return ['http:', 'https:'].includes(urlObj.protocol);
  } catch {
    return false;
  }
};

// Rate limiting for user actions (simple in-memory implementation)
const actionLog = new Map<string, { count: number; lastAction: number; resetTime: number }>();

export const isRateLimited = (
  userId: string, 
  action: string, 
  maxActions: number = 5, 
  windowMs: number = 60000
): boolean => {
  if (!userId || !action) return true;
  
  const key = `${userId}:${action}`;
  const now = Date.now();
  const userActions = actionLog.get(key) || { count: 0, lastAction: 0, resetTime: now + windowMs };
  
  // Reset if window has passed
  if (now >= userActions.resetTime) {
    userActions.count = 0;
    userActions.resetTime = now + windowMs;
  }
  
  userActions.count++;
  userActions.lastAction = now;
  actionLog.set(key, userActions);
  
  return userActions.count > maxActions;
};

// Clean up old rate limiting entries (call periodically)
export const cleanupRateLimit = (): void => {
  const now = Date.now();
  for (const [key, data] of actionLog.entries()) {
    if (now >= data.resetTime && data.count === 0) {
      actionLog.delete(key);
    }
  }
};

// Validate professional profile data
export const validateProfessionalProfile = (data: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!data || typeof data !== 'object') {
    errors.push('Dados do perfil são obrigatórios');
    return { isValid: false, errors };
  }
  
  if (!data.nome_artistico || typeof data.nome_artistico !== 'string' || 
      data.nome_artistico.trim().length < 2 || data.nome_artistico.length > 100) {
    errors.push('Nome artístico deve ter entre 2 e 100 caracteres');
  }
  
  if (!data.tipo_profissional || typeof data.tipo_profissional !== 'string') {
    errors.push('Tipo profissional é obrigatório');
  }
  
  if (data.bio && (typeof data.bio !== 'string' || data.bio.length > 1000)) {
    errors.push('Bio deve ter no máximo 1000 caracteres');
  }
  
  if (data.cache_hora !== undefined && 
      (typeof data.cache_hora !== 'number' || data.cache_hora < 0 || data.cache_hora > 10000)) {
    errors.push('Cache por hora deve estar entre R$ 0 e R$ 10.000');
  }
  
  if (data.cache_evento !== undefined && 
      (typeof data.cache_evento !== 'number' || data.cache_evento < 0 || data.cache_evento > 100000)) {
    errors.push('Cache por evento deve estar entre R$ 0 e R$ 100.000');
  }
  
  if (data.instagram_url && !isValidUrl(data.instagram_url)) {
    errors.push('URL do Instagram inválida');
  }
  
  if (data.youtube_url && !isValidUrl(data.youtube_url)) {
    errors.push('URL do YouTube inválida');
  }
  
  if (data.cidade && (typeof data.cidade !== 'string' || data.cidade.length > 100)) {
    errors.push('Cidade deve ter no máximo 100 caracteres');
  }
  
  if (data.estado && (typeof data.estado !== 'string' || data.estado.length > 50)) {
    errors.push('Estado deve ter no máximo 50 caracteres');
  }
  
  return { isValid: errors.length === 0, errors };
};

// Validate event data
export const validateEventData = (data: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!data || typeof data !== 'object') {
    errors.push('Dados do evento são obrigatórios');
    return { isValid: false, errors };
  }
  
  if (!data.titulo || typeof data.titulo !== 'string' || 
      data.titulo.trim().length < 3 || data.titulo.length > 200) {
    errors.push('Título deve ter entre 3 e 200 caracteres');
  }
  
  if (data.descricao && (typeof data.descricao !== 'string' || data.descricao.length > 1000)) {
    errors.push('Descrição deve ter no máximo 1000 caracteres');
  }
  
  if (!data.data) {
    errors.push('Data do evento é obrigatória');
  } else {
    const eventDate = new Date(data.data);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (isNaN(eventDate.getTime()) || eventDate < today) {
      errors.push('Data do evento deve ser futura e válida');
    }
  }
  
  if (!data.local || typeof data.local !== 'string' || 
      data.local.trim().length < 3 || data.local.length > 200) {
    errors.push('Local deve ter entre 3 e 200 caracteres');
  }
  
  return { isValid: errors.length === 0, errors };
};

// Validate notification data
export const validateNotificationData = (data: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!data || typeof data !== 'object') {
    errors.push('Dados da notificação são obrigatórios');
    return { isValid: false, errors };
  }
  
  if (!data.title || typeof data.title !== 'string' || data.title.trim().length === 0) {
    errors.push('Título da notificação é obrigatório');
  }
  
  if (!data.message || typeof data.message !== 'string' || data.message.trim().length === 0) {
    errors.push('Mensagem da notificação é obrigatória');
  }
  
  if (!data.type || typeof data.type !== 'string' || 
      !['booking', 'application', 'payment', 'review', 'system'].includes(data.type)) {
    errors.push('Tipo de notificação inválido');
  }
  
  return { isValid: errors.length === 0, errors };
};

// Log security events (for monitoring)
export const logSecurityEvent = (event: string, userId?: string, details?: any) => {
  const sanitizedEvent = sanitizeText(event, 100);
  const timestamp = new Date().toISOString();
  
  console.warn(`[SECURITY] ${sanitizedEvent}`, {
    userId: userId ? sanitizeText(userId, 50) : undefined,
    timestamp,
    details: details ? JSON.stringify(details).substring(0, 500) : undefined
  });
  
  // In a production environment, this would send to a security monitoring service
};

// Clean up expired rate limit entries every 5 minutes
if (typeof window !== 'undefined') {
  setInterval(cleanupRateLimit, 5 * 60 * 1000);
}
