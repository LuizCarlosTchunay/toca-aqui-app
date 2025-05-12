
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import { ChevronLeft, CreditCard, QrCode, CheckCircle2, Trash2 } from "lucide-react";

const Checkout = () => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<"credit" | "pix" | "debit">("credit");
  const [isPaymentComplete, setIsPaymentComplete] = useState(false);
  
  // Mock data for cart items
  const cartItems = [
    {
      id: "1",
      professional: "DJ Pulse",
      type: "DJ",
      event: "Casamento Silva",
      date: "15/06/2025",
      price: 1200
    }
  ];
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate payment processing
    setIsPaymentComplete(true);
    toast.success("Pagamento processado com sucesso!");
  };
  
  const handleViewReservation = () => {
    navigate("/dashboard");
    toast("Reserva confirmada! Você receberá um e-mail com os detalhes.");
  };
  
  const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);
  const fee = subtotal * 0.05; // 5% platform fee
  const total = subtotal + fee;

  return (
    <div className="min-h-screen flex flex-col bg-toca-background">
      <Navbar isAuthenticated={true} />
      
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          className="mb-6 text-toca-text-secondary hover:text-white"
          onClick={() => navigate(-1)}
          disabled={isPaymentComplete}
        >
          <ChevronLeft size={18} className="mr-1" /> Voltar
        </Button>
        
        <h1 className="text-2xl font-bold mb-6">Checkout</h1>
        
        {isPaymentComplete ? (
          <Card className="bg-toca-card border-toca-border mb-6">
            <CardHeader>
              <CardTitle>Pagamento Concluído</CardTitle>
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
                  <CardTitle>Resumo do Pedido</CardTitle>
                </CardHeader>
                <CardContent>
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
                          <Button variant="ghost" size="sm" className="text-red-400 p-0 h-auto mt-2">
                            <Trash2 size={16} className="mr-1" /> Remover
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-toca-card border-toca-border">
                <CardHeader>
                  <CardTitle>Método de Pagamento</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <RadioGroup 
                      defaultValue="credit" 
                      onValueChange={(value) => setPaymentMethod(value as "credit" | "pix" | "debit")}
                      className="space-y-4"
                    >
                      <div className="flex items-center space-x-2 bg-toca-background p-3 rounded-md border border-toca-border">
                        <RadioGroupItem value="credit" id="credit" />
                        <Label htmlFor="credit" className="flex items-center gap-2 cursor-pointer flex-1">
                          <CreditCard size={20} />
                          Cartão de Crédito
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2 bg-toca-background p-3 rounded-md border border-toca-border">
                        <RadioGroupItem value="debit" id="debit" />
                        <Label htmlFor="debit" className="flex items-center gap-2 cursor-pointer flex-1">
                          <CreditCard size={20} />
                          Cartão de Débito
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2 bg-toca-background p-3 rounded-md border border-toca-border">
                        <RadioGroupItem value="pix" id="pix" />
                        <Label htmlFor="pix" className="flex items-center gap-2 cursor-pointer flex-1">
                          <QrCode size={20} />
                          Pix
                        </Label>
                      </div>
                    </RadioGroup>
                    
                    {paymentMethod !== "pix" && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="cardName">Nome no Cartão</Label>
                          <Input 
                            id="cardName" 
                            placeholder="Nome impresso no cartão" 
                            className="bg-toca-background border-toca-border text-white"
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="cardNumber">Número do Cartão</Label>
                          <Input 
                            id="cardNumber" 
                            placeholder="0000 0000 0000 0000" 
                            className="bg-toca-background border-toca-border text-white"
                            required
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="expiry">Data de Validade</Label>
                            <Input 
                              id="expiry" 
                              placeholder="MM/AA" 
                              className="bg-toca-background border-toca-border text-white"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cvv">CVV</Label>
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
                          onClick={() => toast("Código Pix copiado!")}
                        >
                          Copiar código Pix
                        </Button>
                      </div>
                    )}
                    
                    <div className="pt-4">
                      <Button 
                        type="submit"
                        className="w-full bg-toca-accent hover:bg-toca-accent-hover"
                      >
                        {paymentMethod === "pix" ? "Confirmar Pagamento" : "Pagar"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card className="bg-toca-card border-toca-border sticky top-24">
                <CardHeader>
                  <CardTitle>Resumo de Valores</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-toca-text-secondary">Subtotal:</span>
                      <span className="text-white">{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-toca-text-secondary">Taxa de serviço:</span>
                      <span className="text-white">{formatCurrency(fee)}</span>
                    </div>
                    
                    <Separator className="bg-toca-border" />
                    
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Total:</span>
                      <span className="text-toca-accent font-semibold text-lg">{formatCurrency(total)}</span>
                    </div>
                    
                    <div className="pt-4 text-xs text-toca-text-secondary">
                      <p>A taxa de serviço ajuda a manter nossa plataforma e garantir segurança nas transações.</p>
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

export default Checkout;
