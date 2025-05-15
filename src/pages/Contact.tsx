
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { Contact as ContactIcon, ChevronLeft, Mail, Send, CheckCircle } from "lucide-react";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      toast({
        title: "Mensagem enviada!",
        description: "Entraremos em contato em breve.",
      });
      
      // Reset form
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      
      // Reset submission state after a while
      setTimeout(() => setIsSubmitted(false), 3000);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-toca-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-6">
            <Button 
              variant="ghost" 
              size="sm" 
              asChild 
              className="text-toca-text-secondary mr-4"
            >
              <Link to="/"><ChevronLeft size={16} /> Voltar</Link>
            </Button>
            
            <div className="flex items-center text-white">
              <ContactIcon className="mr-2 h-6 w-6 text-toca-accent" />
              <h1 className="text-2xl font-bold">Contato</h1>
            </div>
          </div>
          
          <Separator className="mb-6 bg-toca-border" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-toca-card rounded-lg border border-toca-border p-6 text-toca-text-secondary h-fit">
              <h2 className="text-xl font-semibold text-white mb-4">Informações de Contato</h2>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-toca-accent mr-3" />
                  <div>
                    <p className="text-white">Email</p>
                    <a 
                      href="mailto:contato@tocaaqui.app.br" 
                      className="text-toca-accent hover:underline"
                    >
                      contato@tocaaqui.app.br
                    </a>
                  </div>
                </div>
                
                <div className="border-t border-toca-border my-4" />
                
                <div>
                  <p className="mb-2">
                    Se preferir, preencha o formulário ao lado e entraremos em contato em breve.
                  </p>
                  <p>
                    Nossa equipe está disponível para atendê-lo de segunda a sexta, das 9h às 18h.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-toca-card rounded-lg border border-toca-border p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Envie uma mensagem</h2>
              
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block mb-1 text-sm text-toca-text-secondary">
                      Nome
                    </label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-toca-background border-toca-border text-white"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block mb-1 text-sm text-toca-text-secondary">
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-toca-background border-toca-border text-white"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block mb-1 text-sm text-toca-text-secondary">
                      Assunto
                    </label>
                    <Input
                      id="subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="bg-toca-background border-toca-border text-white"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block mb-1 text-sm text-toca-text-secondary">
                      Mensagem
                    </label>
                    <Textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="bg-toca-background border-toca-border text-white min-h-[120px]"
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-toca-accent hover:bg-toca-accent-hover"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Enviando...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Send className="mr-2 h-4 w-4" /> Enviar mensagem
                      </span>
                    )}
                  </Button>
                </form>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <CheckCircle className="h-16 w-16 text-toca-accent mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Mensagem enviada!
                  </h3>
                  <p className="text-toca-text-secondary">
                    Obrigado por entrar em contato. Responderemos em breve.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
