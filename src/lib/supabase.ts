import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://oyaddcvpllgppxeyyqqu.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95YWRkY3ZwbGxncHB4ZXl5cXF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0MTM4ODksImV4cCI6MjA2Mjk4OTg4OX0.QSMxd81BNWfW-Wd-x9zHt-Cs6B8o0bWn0qb6E-k5GXM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Database types
export interface Professional {
  id: string;
  user_id: string;
  nome: string;
  especialidade: string;
  preco_hora: number;
  avaliacao_media: number;
  foto_perfil?: string;
  cidade: string;
  estado: string;
  descricao: string;
  telefone?: string;
  email?: string;
  instagram?: string;
  youtube?: string;
  experiencia_anos?: number;
  servicos_oferecidos?: string[];
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  contratante_id: string;
  titulo: string;
  descricao: string;
  data_evento: string;
  horario_inicio: string;
  horario_fim: string;
  local: string;
  cidade: string;
  estado: string;
  orcamento: number;
  status: 'ativo' | 'cancelado' | 'concluido';
  tipo_evento: string;
  observacoes?: string;
  created_at: string;
  updated_at: string;
}

export interface Application {
  id: string;
  evento_id: string;
  profissional_id: string;
  status: 'pendente' | 'aceita' | 'rejeitada';
  proposta: string;
  preco_proposto: number;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  titulo: string;
  mensagem: string;
  tipo: string;
  lida: boolean;
  data_relacionada?: any;
  created_at: string;
}

export interface PortfolioItem {
  id: string;
  profissional_id: string;
  titulo: string;
  descricao: string;
  url_midia: string;
  tipo_midia: 'imagem' | 'video';
  created_at: string;
}