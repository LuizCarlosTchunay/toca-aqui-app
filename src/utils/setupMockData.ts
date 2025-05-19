
import { supabase } from "@/integrations/supabase/client";

// This is a helper function to add mock notifications for development
// You can call this in development to set up some test data
export const setupMockNotifications = async (userId: string) => {
  // This assumes you've created a notifications table
  // This is only for reference - uncomment and use when you create the table
  
  /*
  const notifications = [
    {
      user_id: userId,
      type: "booking",
      title: "Nova reserva confirmada",
      message: "Sua reserva para o evento 'Casamento Silva' foi confirmada.",
      read: false,
      action_url: "/reservas/1",
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    },
    {
      user_id: userId,
      type: "application",
      title: "Candidatura aprovada",
      message: "Sua candidatura para o evento 'Festival de Verão' foi aprovada.",
      read: true,
      action_url: "/eventos/1",
      created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    },
    {
      user_id: userId,
      type: "payment",
      title: "Pagamento recebido",
      message: "Você recebeu um pagamento de R$1.500,00 referente ao evento 'Aniversário Empresarial'.",
      read: true,
      action_url: "/pagamentos/3",
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      user_id: userId,
      type: "review",
      title: "Nova avaliação recebida",
      message: "Maria Oliveira deixou uma avaliação de 5 estrelas para você.",
      read: true,
      action_url: "/perfil-profissional",
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  for (const notification of notifications) {
    await supabase.from('notifications').insert(notification);
  }
  */
};
