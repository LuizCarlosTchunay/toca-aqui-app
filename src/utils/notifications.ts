
import { supabase } from "@/integrations/supabase/client";

// Type definition for a notification
export type Notification = {
  id: string;
  type: "booking" | "application" | "payment" | "review" | "system";
  title: string;
  message: string;
  time: string;
  read: boolean;
  actionUrl: string;
  created_at: string;
  user_id: string;
};

// Generate mock notifications for development
export const getMockNotifications = (userId: string): Notification[] => {
  return [
    {
      id: "1",
      type: "booking",
      title: "Nova reserva confirmada",
      message: "Sua reserva para o evento 'Casamento Silva' foi confirmada.",
      time: "há 2 horas",
      read: false,
      actionUrl: "/reservas/1",
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      user_id: userId
    },
    {
      id: "2",
      type: "application",
      title: "Candidatura aprovada",
      message: "Sua candidatura para o evento 'Festival de Verão' foi aprovada.",
      time: "há 1 dia",
      read: true,
      actionUrl: "/eventos/1",
      created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      user_id: userId
    },
    {
      id: "3",
      type: "payment",
      title: "Pagamento recebido",
      message: "Você recebeu um pagamento de R$1.500,00 referente ao evento 'Aniversário Empresarial'.",
      time: "há 2 dias",
      read: true,
      actionUrl: "/pagamentos/3",
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      user_id: userId
    },
    {
      id: "4",
      type: "review",
      title: "Nova avaliação recebida",
      message: "Maria Oliveira deixou uma avaliação de 5 estrelas para você.",
      time: "há 3 dias",
      read: true,
      actionUrl: "/perfil-profissional",
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      user_id: userId
    }
  ];
};

// Format relative time (e.g. "2 hours ago")
export const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.round(diffMs / 60000);
  const diffHours = Math.round(diffMs / 3600000);
  const diffDays = Math.round(diffMs / 86400000);
  
  if (diffMins < 60) {
    return `há ${diffMins} ${diffMins === 1 ? 'minuto' : 'minutos'}`;
  } else if (diffHours < 24) {
    return `há ${diffHours} ${diffHours === 1 ? 'hora' : 'horas'}`;
  } else {
    return `há ${diffDays} ${diffDays === 1 ? 'dia' : 'dias'}`;
  }
};
