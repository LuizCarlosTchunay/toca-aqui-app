
import React from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";
import { ChevronLeft, Trash2, ShoppingCart, Plus } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";

const Cart = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, isLoading, removeFromCart, clearCart } = useCart();

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-toca-background">
        <Navbar isAuthenticated={false} />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-toca-text-secondary">Você precisa estar logado para ver o carrinho.</p>
            <Button 
              className="mt-4 bg-toca-accent hover:bg-toca-accent-hover"
              onClick={() => navigate("/login")}
            >
              Fazer Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleCheckout = () => {
    if (!cart || cart.items.length === 0) return;
    
    // Navigate to checkout with cart data
    navigate("/checkout", {
      state: {
        cartData: cart
      }
    });
  };

  const handleContinueShopping = () => {
    navigate("/explorar");
  };

  return (
    <div className="min-h-screen flex flex-col bg-toca-background">
      <Navbar isAuthenticated={true} />
      
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          className="mb-6 text-toca-text-secondary hover:text-white"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft size={18} className="mr-1" /> Voltar
        </Button>
        
        <h1 className="text-2xl font-bold mb-6 text-white">Meu Carrinho</h1>
        
        {isLoading ? (
          <div className="text-center py-16">
            <div className="flex justify-center">
              <div className="w-8 h-8 border-2 border-toca-accent border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-toca-text-secondary mt-4">Carregando carrinho...</p>
          </div>
        ) : !cart || cart.items.length === 0 ? (
          <Card className="bg-toca-card border-toca-border">
            <CardContent className="py-16 text-center">
              <ShoppingCart size={64} className="mx-auto text-toca-text-secondary mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2">Seu carrinho está vazio</h2>
              <p className="text-toca-text-secondary mb-6">
                Adicione profissionais ao seu carrinho para continuar
              </p>
              <Button 
                className="bg-toca-accent hover:bg-toca-accent-hover"
                onClick={handleContinueShopping}
              >
                <Plus className="mr-2" size={16} />
                Explorar Profissionais
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <Card className="bg-toca-card border-toca-border">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-white">
                    Profissionais Selecionados ({cart.items.length})
                  </CardTitle>
                  {cart.items.length > 0 && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-red-400 border-red-400 hover:bg-red-400 hover:text-white"
                      onClick={clearCart}
                    >
                      <Trash2 size={16} className="mr-1" />
                      Limpar Carrinho
                    </Button>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {cart.items.map((item) => (
                      <div key={item.id} className="flex items-start justify-between border-b border-toca-border pb-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-white">{item.professional_name}</h3>
                          <p className="text-sm text-toca-text-secondary mb-1">{item.professional_type}</p>
                          <div className="text-sm">
                            <span className="text-toca-text-secondary">Tipo: </span>
                            <span className="text-white">
                              {item.booking_type === "event" ? "Evento completo" : `${item.hours}h`}
                            </span>
                          </div>
                          {item.event_details?.name && (
                            <div className="text-sm">
                              <span className="text-toca-text-secondary">Evento: </span>
                              <span className="text-white">{item.event_details.name}</span>
                            </div>
                          )}
                          {item.event_details?.date && (
                            <div className="text-sm">
                              <span className="text-toca-text-secondary">Data: </span>
                              <span className="text-white">{item.event_details.date}</span>
                            </div>
                          )}
                          {item.event_details?.location && (
                            <div className="text-sm">
                              <span className="text-toca-text-secondary">Local: </span>
                              <span className="text-white">{item.event_details.location}</span>
                            </div>
                          )}
                        </div>
                        <div className="text-right ml-4">
                          <div className="font-semibold text-white">{formatCurrency(item.price)}</div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-400 p-0 h-auto mt-2"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Trash2 size={16} className="mr-1" /> Remover
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={handleContinueShopping}
                    >
                      <Plus className="mr-2" size={16} />
                      Adicionar Mais Profissionais
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Cart Summary */}
            <div>
              <Card className="bg-toca-card border-toca-border sticky top-24">
                <CardHeader>
                  <CardTitle className="text-white">Resumo do Pedido</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-toca-text-secondary">Subtotal:</span>
                      <span className="text-white">{formatCurrency(cart.total)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-toca-text-secondary">Taxa de serviço (9,98%):</span>
                      <span className="text-white">{formatCurrency(cart.fee)}</span>
                    </div>
                    
                    <Separator className="bg-toca-border" />
                    
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-white">Total:</span>
                      <span className="text-toca-accent font-semibold text-lg">
                        {formatCurrency(cart.finalTotal)}
                      </span>
                    </div>
                    
                    <Button 
                      className="w-full bg-toca-accent hover:bg-toca-accent-hover mt-6"
                      onClick={handleCheckout}
                      disabled={cart.items.length === 0}
                    >
                      Finalizar Pedido
                    </Button>
                    
                    <div className="pt-4 text-xs text-toca-text-secondary">
                      <p>A taxa de serviço de 9,98% garante:</p>
                      <ul className="list-disc pl-4 mt-1 space-y-0.5">
                        <li>Intermediação segura</li>
                        <li>Garantia de pagamento aos profissionais</li>
                        <li>Suporte ao cliente</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
