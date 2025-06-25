export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      avaliacoes: {
        Row: {
          comentario: string | null
          contratante_id: string | null
          data_avaliacao: string | null
          evento_id: string | null
          id: string
          nota: number | null
          profissional_id: string | null
        }
        Insert: {
          comentario?: string | null
          contratante_id?: string | null
          data_avaliacao?: string | null
          evento_id?: string | null
          id?: string
          nota?: number | null
          profissional_id?: string | null
        }
        Update: {
          comentario?: string | null
          contratante_id?: string | null
          data_avaliacao?: string | null
          evento_id?: string | null
          id?: string
          nota?: number | null
          profissional_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "avaliacoes_evento_id_fkey"
            columns: ["evento_id"]
            isOneToOne: false
            referencedRelation: "eventos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "avaliacoes_profissional_id_fkey"
            columns: ["profissional_id"]
            isOneToOne: false
            referencedRelation: "profissionais"
            referencedColumns: ["id"]
          },
        ]
      }
      candidaturas: {
        Row: {
          data_candidatura: string | null
          evento_id: string | null
          id: string
          mensagem: string | null
          profissional_id: string | null
          status: string | null
        }
        Insert: {
          data_candidatura?: string | null
          evento_id?: string | null
          id?: string
          mensagem?: string | null
          profissional_id?: string | null
          status?: string | null
        }
        Update: {
          data_candidatura?: string | null
          evento_id?: string | null
          id?: string
          mensagem?: string | null
          profissional_id?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "candidaturas_evento_id_fkey"
            columns: ["evento_id"]
            isOneToOne: false
            referencedRelation: "eventos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "candidaturas_profissional_id_fkey"
            columns: ["profissional_id"]
            isOneToOne: false
            referencedRelation: "profissionais"
            referencedColumns: ["id"]
          },
        ]
      }
      carrinho_itens: {
        Row: {
          carrinho_id: string | null
          created_at: string | null
          data_evento: string | null
          detalhes_evento: Json | null
          horas: number | null
          id: string
          local_evento: string | null
          preco: number | null
          profissional_id: string | null
          servico: string | null
          tipo_contratacao: string | null
        }
        Insert: {
          carrinho_id?: string | null
          created_at?: string | null
          data_evento?: string | null
          detalhes_evento?: Json | null
          horas?: number | null
          id?: string
          local_evento?: string | null
          preco?: number | null
          profissional_id?: string | null
          servico?: string | null
          tipo_contratacao?: string | null
        }
        Update: {
          carrinho_id?: string | null
          created_at?: string | null
          data_evento?: string | null
          detalhes_evento?: Json | null
          horas?: number | null
          id?: string
          local_evento?: string | null
          preco?: number | null
          profissional_id?: string | null
          servico?: string | null
          tipo_contratacao?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "carrinho_itens_carrinho_id_fkey"
            columns: ["carrinho_id"]
            isOneToOne: false
            referencedRelation: "carrinhos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "carrinho_itens_profissional_id_fkey"
            columns: ["profissional_id"]
            isOneToOne: false
            referencedRelation: "profissionais"
            referencedColumns: ["id"]
          },
        ]
      }
      carrinhos: {
        Row: {
          contratante_id: string | null
          created_at: string | null
          data_atualizacao: string | null
          id: string
          status: string | null
        }
        Insert: {
          contratante_id?: string | null
          created_at?: string | null
          data_atualizacao?: string | null
          id?: string
          status?: string | null
        }
        Update: {
          contratante_id?: string | null
          created_at?: string | null
          data_atualizacao?: string | null
          id?: string
          status?: string | null
        }
        Relationships: []
      }
      eventos: {
        Row: {
          contratante_id: string | null
          data: string | null
          descricao: string | null
          id: string
          imagem_url: string | null
          local: string | null
          servicos_requeridos: string[] | null
          status: string | null
          titulo: string | null
        }
        Insert: {
          contratante_id?: string | null
          data?: string | null
          descricao?: string | null
          id?: string
          imagem_url?: string | null
          local?: string | null
          servicos_requeridos?: string[] | null
          status?: string | null
          titulo?: string | null
        }
        Update: {
          contratante_id?: string | null
          data?: string | null
          descricao?: string | null
          id?: string
          imagem_url?: string | null
          local?: string | null
          servicos_requeridos?: string[] | null
          status?: string | null
          titulo?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          action_url: string | null
          created_at: string
          id: string
          message: string
          read: boolean
          title: string
          type: string
          user_id: string
        }
        Insert: {
          action_url?: string | null
          created_at?: string
          id?: string
          message: string
          read?: boolean
          title: string
          type: string
          user_id: string
        }
        Update: {
          action_url?: string | null
          created_at?: string
          id?: string
          message?: string
          read?: boolean
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      pagamentos: {
        Row: {
          comprovante_url: string | null
          data_pagamento: string | null
          id: string
          metodo: string | null
          reserva_id: string | null
          status: string | null
          valor_total: number | null
        }
        Insert: {
          comprovante_url?: string | null
          data_pagamento?: string | null
          id?: string
          metodo?: string | null
          reserva_id?: string | null
          status?: string | null
          valor_total?: number | null
        }
        Update: {
          comprovante_url?: string | null
          data_pagamento?: string | null
          id?: string
          metodo?: string | null
          reserva_id?: string | null
          status?: string | null
          valor_total?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "pagamentos_reserva_id_fkey"
            columns: ["reserva_id"]
            isOneToOne: false
            referencedRelation: "reservas"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolio: {
        Row: {
          descricao: string | null
          id: string
          profissional_id: string | null
          tipo: string | null
          url: string | null
        }
        Insert: {
          descricao?: string | null
          id?: string
          profissional_id?: string | null
          tipo?: string | null
          url?: string | null
        }
        Update: {
          descricao?: string | null
          id?: string
          profissional_id?: string | null
          tipo?: string | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_profissional_id_fkey"
            columns: ["profissional_id"]
            isOneToOne: false
            referencedRelation: "profissionais"
            referencedColumns: ["id"]
          },
        ]
      }
      profissionais: {
        Row: {
          bio: string | null
          cache_evento: number | null
          cache_hora: number | null
          cidade: string | null
          estado: string | null
          id: string
          instagram_url: string | null
          instrumentos: string[] | null
          nome_artistico: string | null
          servicos: string[] | null
          status: string | null
          subgeneros: string[] | null
          tipo_profissional: string | null
          user_id: string | null
          youtube_url: string | null
        }
        Insert: {
          bio?: string | null
          cache_evento?: number | null
          cache_hora?: number | null
          cidade?: string | null
          estado?: string | null
          id?: string
          instagram_url?: string | null
          instrumentos?: string[] | null
          nome_artistico?: string | null
          servicos?: string[] | null
          status?: string | null
          subgeneros?: string[] | null
          tipo_profissional?: string | null
          user_id?: string | null
          youtube_url?: string | null
        }
        Update: {
          bio?: string | null
          cache_evento?: number | null
          cache_hora?: number | null
          cidade?: string | null
          estado?: string | null
          id?: string
          instagram_url?: string | null
          instrumentos?: string[] | null
          nome_artistico?: string | null
          servicos?: string[] | null
          status?: string | null
          subgeneros?: string[] | null
          tipo_profissional?: string | null
          user_id?: string | null
          youtube_url?: string | null
        }
        Relationships: []
      }
      reservas: {
        Row: {
          contratante_id: string | null
          data_reserva: string | null
          evento_id: string | null
          id: string
          profissional_id: string | null
          status: string | null
        }
        Insert: {
          contratante_id?: string | null
          data_reserva?: string | null
          evento_id?: string | null
          id?: string
          profissional_id?: string | null
          status?: string | null
        }
        Update: {
          contratante_id?: string | null
          data_reserva?: string | null
          evento_id?: string | null
          id?: string
          profissional_id?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reservas_evento_id_fkey"
            columns: ["evento_id"]
            isOneToOne: false
            referencedRelation: "eventos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservas_profissional_id_fkey"
            columns: ["profissional_id"]
            isOneToOne: false
            referencedRelation: "profissionais"
            referencedColumns: ["id"]
          },
        ]
      }
      user_settings: {
        Row: {
          created_at: string
          id: string
          settings: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          settings?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          settings?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          data_cadastro: string | null
          email: string | null
          id: string
          nome: string | null
          senha_hash: string | null
          telefone: string | null
          tem_perfil_profissional: boolean | null
          tipo_inicial: string | null
        }
        Insert: {
          data_cadastro?: string | null
          email?: string | null
          id?: string
          nome?: string | null
          senha_hash?: string | null
          telefone?: string | null
          tem_perfil_profissional?: boolean | null
          tipo_inicial?: string | null
        }
        Update: {
          data_cadastro?: string | null
          email?: string | null
          id?: string
          nome?: string | null
          senha_hash?: string | null
          telefone?: string | null
          tem_perfil_profissional?: boolean | null
          tipo_inicial?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_current_user_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
