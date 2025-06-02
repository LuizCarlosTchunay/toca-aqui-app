
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export interface CartItem {
  id: string;
  professional_id: string;
  professional_name: string;
  professional_type: string;
  booking_type: "event" | "hourly";
  hours?: number;
  price: number;
  event_details?: {
    name?: string;
    date?: string;
    location?: string;
  };
}

export interface Cart {
  id: string;
  items: CartItem[];
  total: number;
  fee: number;
  finalTotal: number;
}

export const useCart = () => {
  const { user } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch existing cart
  const fetchCart = useCallback(async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      
      // Get or create active cart
      let { data: cartData, error: cartError } = await supabase
        .from("carrinhos")
        .select("*")
        .eq("contratante_id", user.id)
        .eq("status", "rascunho")
        .single();

      if (cartError && cartError.code !== 'PGRST116') {
        console.error("Error fetching cart:", cartError);
        return;
      }

      // Create cart if it doesn't exist
      if (!cartData) {
        const { data: newCart, error: createError } = await supabase
          .from("carrinhos")
          .insert({
            contratante_id: user.id,
            status: "rascunho"
          })
          .select()
          .single();

        if (createError) {
          console.error("Error creating cart:", createError);
          return;
        }
        cartData = newCart;
      }

      // Fetch cart items with professional details
      const { data: itemsData, error: itemsError } = await supabase
        .from("carrinho_itens")
        .select(`
          *,
          profissionais!inner(
            id,
            nome_artistico,
            tipo_profissional,
            cache_hora,
            cache_evento
          )
        `)
        .eq("carrinho_id", cartData.id);

      if (itemsError) {
        console.error("Error fetching cart items:", itemsError);
        return;
      }

      // Transform data to match CartItem interface
      const cartItems: CartItem[] = (itemsData || []).map((item: any) => ({
        id: item.id,
        professional_id: item.profissional_id,
        professional_name: item.profissionais.nome_artistico || "Profissional",
        professional_type: item.profissionais.tipo_profissional || "Músico",
        booking_type: item.tipo_contratacao as "event" | "hourly",
        hours: item.horas,
        price: item.preco || 0,
        event_details: item.detalhes_evento || {}
      }));

      const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);
      const fee = subtotal * 0.0998; // 9.98% platform fee
      const finalTotal = subtotal + fee;

      setCart({
        id: cartData.id,
        items: cartItems,
        total: subtotal,
        fee,
        finalTotal
      });
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Add item to cart
  const addToCart = useCallback(async (
    professionalId: string,
    bookingType: "event" | "hourly",
    hours: number = 4,
    eventDetails: any = {}
  ) => {
    if (!user || !cart) {
      toast.error("Erro ao adicionar ao carrinho");
      return false;
    }

    try {
      // Fetch professional data to calculate price
      const { data: professional, error: profError } = await supabase
        .from("profissionais")
        .select("nome_artistico, tipo_profissional, cache_hora, cache_evento")
        .eq("id", professionalId)
        .single();

      if (profError || !professional) {
        toast.error("Profissional não encontrado");
        return false;
      }

      const price = bookingType === "event" 
        ? professional.cache_evento 
        : professional.cache_hora * hours;

      // Check if professional is already in cart
      const existingItem = cart.items.find(item => item.professional_id === professionalId);
      if (existingItem) {
        toast.error("Este profissional já está no seu carrinho");
        return false;
      }

      // Add to database
      const { error } = await supabase
        .from("carrinho_itens")
        .insert({
          carrinho_id: cart.id,
          profissional_id: professionalId,
          tipo_contratacao: bookingType,
          horas: hours,
          preco: price,
          detalhes_evento: eventDetails,
          data_evento: eventDetails.date,
          local_evento: eventDetails.location
        });

      if (error) {
        console.error("Error adding to cart:", error);
        toast.error("Erro ao adicionar ao carrinho");
        return false;
      }

      // Refresh cart
      await fetchCart();
      toast.success("Profissional adicionado ao carrinho!");
      return true;
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Erro ao adicionar ao carrinho");
      return false;
    }
  }, [user, cart, fetchCart]);

  // Remove item from cart
  const removeFromCart = useCallback(async (itemId: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from("carrinho_itens")
        .delete()
        .eq("id", itemId);

      if (error) {
        console.error("Error removing from cart:", error);
        toast.error("Erro ao remover do carrinho");
        return false;
      }

      await fetchCart();
      toast.success("Item removido do carrinho");
      return true;
    } catch (error) {
      console.error("Error removing from cart:", error);
      toast.error("Erro ao remover do carrinho");
      return false;
    }
  }, [user, fetchCart]);

  // Clear cart
  const clearCart = useCallback(async () => {
    if (!user || !cart) return false;

    try {
      const { error } = await supabase
        .from("carrinho_itens")
        .delete()
        .eq("carrinho_id", cart.id);

      if (error) {
        console.error("Error clearing cart:", error);
        toast.error("Erro ao limpar carrinho");
        return false;
      }

      await fetchCart();
      toast.success("Carrinho limpo");
      return true;
    } catch (error) {
      console.error("Error clearing cart:", error);
      toast.error("Erro ao limpar carrinho");
      return false;
    }
  }, [user, cart, fetchCart]);

  // Update cart status (for checkout)
  const updateCartStatus = useCallback(async (status: string) => {
    if (!user || !cart) return false;

    try {
      const { error } = await supabase
        .from("carrinhos")
        .update({ status })
        .eq("id", cart.id);

      if (error) {
        console.error("Error updating cart status:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error updating cart status:", error);
      return false;
    }
  }, [user, cart]);

  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, [user, fetchCart]);

  return {
    cart,
    isLoading,
    addToCart,
    removeFromCart,
    clearCart,
    updateCartStatus,
    refreshCart: fetchCart
  };
};
