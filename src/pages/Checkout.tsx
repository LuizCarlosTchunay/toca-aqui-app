
import React, { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { ChevronLeft, CreditCard, QrCode, CheckCircle2, Trash2, AlertTriangle, Loader2 } from "lucide-react";
import TermsAcceptanceDialog from "@/components/TermsAcceptanceDialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface CartItem {
  id: string;
  professional: string;
  type: string;
  event: string;
  date: string;
  price: number;
  professionalId: string;
}

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState<"credit" | "pix" | "debit">("credit");
  const [isPaymentComplete, setIsPaymentComplete] = useState(false);
  const [showTermsDialog, setShowTermsDialog] = useState(true);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  
  // Extract data from location state safely
  const professionalId = location.state?.professionalId;
  const bookingType = location.state?.bookingType || "event";
  const hours = location.state?.hours || 4;
  const bookingDetails = location.state?.bookingDetails || {};

  const handleGoBack = useCallback(() => {
    try {
      navigate(-1);
    } catch (error) {
      console.error("Navigation error:", error);
      window.history.back();
    }
  }, [navigate]);

  const handleViewReservation = useCallback(() => {
    try {
      navigate("/dashboard");
      toast({
        title: "Reserva confirmada",
        description: "Você receberá um e-mail com os detalhes.",
      });
    } catch (error) {
      console.error("Navigation error:", error);
      window.location.href = "/dashboard";
    }
  }, [navigate]);

  const handleRemoveItem = useCallback((id: string) => {
    setCartItems(prev => {
      const newItems = prev.filter(item => item.id !== id);
      
      if (newItems.length === 0) {
        // Use timeout to prevent immediate navigation issues
        setTimeout(() => {
          try {
            navigate(-1);
            toast({
              title: "Carrinho vazio",
              description: "Todos os itens foram removidos do carrinho.",
            });
          } catch (error) {
            console.error("Navigation error:", error);
            window.history.back();
          }
        }, 100);
      }
      
      return newItems;
    });
  }, [navigate]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    if (!termsAccepted) {
      setShowTermsDialog(true);
      toast({
        title: "Atenção",
        description: "Você precisa aceitar os termos de serviço para continuar.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Simulate payment processing
      setIsPaymentComplete(true);
      toast({
        title: "Sucesso",
        description: "Pagamento processado com sucesso!",
      });
    } catch (error) {
      console.error("Payment error:", error);
      toast({
        title: "Erro",
        description: "Erro ao processar pagamento. Tente novamente.",
        variant: "destructive",
      });
    }
  }, [termsAccepted]);

  const handleAcceptTerms = useCallback(() => {
    setTermsAccepted(true);
    setShowTermsDialog(false);
  }, []);

  // Fetch professional data with better error handling
  useEffect(() => {
    let isMounted = true;
    
    const fetchProfessionalData = async () => {
      try {
        if (!isMounted) return;
        
        // Validate professional ID
        if (!professionalId) {
          const pathParts = window.location.pathname.split('/');
          const possibleId = pathParts[pathParts.length - 1];
          
          if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(possibleId)) {
            if (isMounted) {
              setError("ID do profissional inválido.");
              setIsLoading(false);
            }
            return;
          }
        }
        
        const idToUse = professionalId || window.location.pathname.split('/').pop();
        
        if (!isMounted) return;
        
        setIsLoading(true);
        setError(null);
        
        const { data, error: fetchError } = await supabase
          .from("profissionais")
          .select(`
            id,
            nome_artistico,
            tipo_profissional,
            cache_hora,
            cache_evento
          `)
          .eq("id", idToUse)
          .single();
        
        if (!isMounted) return;
        
        if (fetchError) {
          console.error("Error fetching professional:", fetchError);
          setError("Erro ao carregar dados do profissional.");
          setIsLoading(false);
          return;
        }
        
        if (!data) {
          setError("Profissional não encontrado.");
          setIsLoading(false);
          return;
        }
        
        // Calculate price based on booking type
        const price = bookingType === "event" 
          ? data.cache_evento 
          : data.cache_hora * hours;
        
        // Create cart item with professional data
        const newCartItem: CartItem = {
          id: data.id,
          professional: data.nome_artistico || "Profissional",
          type: data.tipo_profissional || "Músico",
          event: bookingDetails.eventName || "Evento",
          date: bookingDetails.date || "Data a definir",
          price: price || 0,
          professionalId: data.id
        };
        
        if (isMounted) {
          setCartItems([newCartItem]);
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        if (isMounted) {
          setError("Ocorreu um erro ao carregar os dados.");
          setIsLoading(false);
        }
      }
    };
    
    fetchProfessionalData();
    
    return () => {
      isMounted = false;
    };
  }, [professionalId, bookingType, hours, bookingDetails]);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);
  const fee = subtotal * 0.0998; // 9.98% platform fee
  const total = subtotal + fee;

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-toca-background">
        <Navbar isAuthenticated={false} />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-toca-text-secondary">Redirecionando para login...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-toca-background">
      <Navbar isAuthenticated={true} />
      
      <TermsAcceptanceDialog 
        open={showTermsDialog} 
        onOpenChange={setShowTermsDialog}
        onAccept={handleAcceptTerms}
      />
      
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          className="mb-6 text-toca-text-secondary hover:text-white"
          onClick={handleGoBack}
          disabled={isPaymentComplete}
        >
          <ChevronLeft size={18} className="mr-1" /> Voltar
        </Button>
        
        <h1 className="text-2xl font-bold mb-6 text-white">Checkout</h1>
        
        {isPaymentComplete ? (
          <Card className="bg-toca-card border-toca-border mb-6">
            <CardHeader>
              <CardTitle className="text-white">Pagamento Concluído</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center py-8">
                <CheckCircle2 size={64} className="text-green-500 mb-4" />
                <h2 className="text-xl font-semibold text-white mb-2">Pagamento Realizado com Sucesso!</h2>
                <p className="text-toca-text-secondary text-center mb-6">
                  Seu pagamento foi processado e sua reserva está confirmada. Os profissionais foram notificados.
                </p>
                <p className="text-toca-text-secondary text-center mb-8">
                  Um recibo foi enviado para seu e-mail.
                </p>
                <Button 
                  className="bg-toca-accent hover:bg-toca-accent-hover"
                  onClick={handleViewReservation}
                >
                  Ver Minhas Reservas
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="bg-toca-card border-toca-border mb-6">
                <CardHeader>
                  <CardTitle className="text-white">Resumo do Pedido</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-toca-accent" />
                      <span className="ml-2 text-white">Carregando dados do profissional...</span>
                    </div>
                  ) : error ? (
                    <div className="text-center py-8">
                      <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                      <p className="text-white">{error}</p>
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={handleGoBack}
                      >
                        Voltar para seleção
                      </Button>
                    </div>
                  ) : cartItems.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-white">Seu carrinho está vazio.</p>
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={handleGoBack}
                      >
                        Voltar para seleção
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex items-start justify-between border-b border-toca-border pb-4">
                          <div>
                            <h3 className="font-semibold text-white">{item.professional}</h3>
                            <p className="text-sm text-toca-text-secondary mb-1">{item.type}</p>
                            <div className="text-sm">
                              <span className="text-toca-text-secondary">Evento: </span>
                              <span className="text-white">{item.event}</span>
                            </div>
                            <div className="text-sm">
                              <span className="text-toca-text-secondary">Data: </span>
                              <span className="text-white">{item.date}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-white">{formatCurrency(item.price)}</div>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-red-400 p-0 h-auto mt-2"
                              onClick={() => handleRemoveItem(item.id)}
                            >
                              <Trash2 size={16} className="mr-1" /> Remover
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {!isLoading && !error && cartItems.length > 0 && (
                <Card className="bg-toca-card border-toca-border">
                  <CardHeader>
                    <CardTitle className="text-white">Método de Pagamento</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {!termsAccepted && (
                      <div className="mb-6 p-4 border border-amber-500 bg-amber-500/10 rounded-md flex items-start gap-3">
                        <AlertTriangle className="text-amber-500 mt-0.5" size={20} />
                        <div className="flex-1">
                          <p className="text-white text-sm">
                            É necessário aceitar os termos de serviço para prosseguir com o pagamento.
                          </p>
                          <Button 
                            variant="link" 
                            className="text-toca-accent p-0 h-auto text-sm mt-1"
                            onClick={() => setShowTermsDialog(true)}
                          >
                            Ler e aceitar os termos
                          </Button>
                        </div>
                      </div>
                    )}
                  
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <RadioGroup 
                        defaultValue="credit" 
                        onValueChange={(value) => setPaymentMethod(value as "credit" | "pix" | "debit")}
                        className="space-y-4"
                      >
                        <div className="flex items-center space-x-2 bg-toca-background p-3 rounded-md border border-toca-border">
                          <RadioGroupItem value="credit" id="credit" />
                          <Label htmlFor="credit" className="flex items-center gap-2 cursor-pointer flex-1 text-white">
                            <CreditCard size={20} />
                            Cartão de Crédito
                          </Label>
                        </div>
                        
                        <div className="flex items-center space-x-2 bg-toca-background p-3 rounded-md border border-toca-border">
                          <RadioGroupItem value="debit" id="debit" />
                          <Label htmlFor="debit" className="flex items-center gap-2 cursor-pointer flex-1 text-white">
                            <CreditCard size={20} />
                            Cartão de Débito
                          </Label>
                        </div>
                        
                        <div className="flex items-center space-x-2 bg-toca-background p-3 rounded-md border border-toca-border">
                          <RadioGroupItem value="pix" id="pix" />
                          <Label htmlFor="pix" className="flex items-center gap-2 cursor-pointer flex-1 text-white">
                            <QrCode size={20} />
                            Pix
                          </Label>
                        </div>
                      </RadioGroup>
                      
                      {paymentMethod !== "pix" && (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="cardName" className="text-white">Nome no Cartão</Label>
                            <Input 
                              id="cardName" 
                              placeholder="Nome impresso no cartão" 
                              className="bg-toca-background border-toca-border text-white"
                              required
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="cardNumber" className="text-white">Número do Cartão</Label>
                            <Input 
                              id="cardNumber" 
                              placeholder="0000 0000 0000 0000" 
                              className="bg-toca-background border-toca-border text-white"
                              required
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="expiry" className="text-white">Data de Validade</Label>
                              <Input 
                                id="expiry" 
                                placeholder="MM/AA" 
                                className="bg-toca-background border-toca-border text-white"
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="cvv" className="text-white">CVV</Label>
                              <Input 
                                id="cvv" 
                                placeholder="123" 
                                className="bg-toca-background border-toca-border text-white"
                                required
                              />
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {paymentMethod === "pix" && (
                        <div className="flex flex-col items-center py-4">
                          <div className="w-48 h-48 bg-white p-2 rounded-md mb-4 flex items-center justify-center">
                            <div className="text-black text-center">
                              [QR Code Pix]
                            </div>
                          </div>
                          <p className="text-sm text-toca-text-secondary text-center mb-4">
                            Escaneie o QR Code acima com o app do seu banco para pagar via Pix. 
                            O pagamento será confirmado automaticamente.
                          </p>
                          <Button 
                            variant="outline" 
                            className="border-toca-border text-toca-text-secondary"
                            onClick={() => toast({
                              title: "Copiado",
                              description: "Código Pix copiado para a área de transferência!"
                            })}
                          >
                            Copiar código Pix
                          </Button>
                        </div>
                      )}
                      
                      <div className="pt-4">
                        <Button 
                          type="submit"
                          className="w-full bg-toca-accent hover:bg-toca-accent-hover"
                          disabled={!termsAccepted || isLoading || !!error || cartItems.length === 0}
                        >
                          {paymentMethod === "pix" ? "Confirmar Pagamento" : "Pagar"}
                        </Button>
                        
                        {!termsAccepted && (
                          <p className="text-amber-400 text-xs text-center mt-2">
                            Você precisa aceitar os termos de serviço para continuar
                          </p>
                        )}
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}
            </div>
            
            {!isLoading && !error && cartItems.length > 0 && (
              <div>
                <Card className="bg-toca-card border-toca-border sticky top-24">
                  <CardHeader>
                    <CardTitle className="text-white">Resumo de Valores</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-toca-text-secondary">Subtotal:</span>
                        <span className="text-white">{formatCurrency(subtotal)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-toca-text-secondary">Taxa de serviço (9,98%):</span>
                        <span className="text-white">{formatCurrency(fee)}</span>
                      </div>
                      
                      <Separator className="bg-toca-border" />
                      
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-white">Total:</span>
                        <span className="text-toca-accent font-semibold text-lg">{formatCurrency(total)}</span>
                      </div>
                      
                      <div className="pt-4 text-xs text-toca-text-secondary">
                        <p>A taxa de serviço de 9,98% é aplicada para garantir:</p>
                        <ul className="list-disc pl-4 mt-1 space-y-0.5">
                          <li>Intermediação segura entre você e o profissional</li>
                          <li>Garantia de recebimento ao profissional</li>
                          <li>Garantia de reserva ao contratante</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;
