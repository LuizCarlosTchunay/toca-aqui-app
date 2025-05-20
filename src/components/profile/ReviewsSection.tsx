
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Star } from "lucide-react";

interface Review {
  id: string;
  nota: number;
  comentario: string;
  contratante_id: string;
  data_avaliacao: string;
  contratante_nome?: string;
}

interface ReviewsSectionProps {
  professionalId?: string;
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({ professionalId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!professionalId) return;
      
      setIsLoading(true);
      try {
        // Fetch reviews from the database
        const { data, error } = await supabase
          .from('avaliacoes')
          .select(`
            id,
            nota,
            comentario,
            contratante_id,
            data_avaliacao
          `)
          .eq('profissional_id', professionalId)
          .order('data_avaliacao', { ascending: false });
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          // Fetch contratante names
          const reviewsWithNames = await Promise.all(
            data.map(async (review) => {
              const { data: userData } = await supabase
                .from('users')
                .select('nome')
                .eq('id', review.contratante_id)
                .single();
              
              return {
                ...review,
                contratante_nome: userData?.nome || 'Usuário'
              };
            })
          );
          
          setReviews(reviewsWithNames);
        } else {
          setReviews([]);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchReviews();
  }, [professionalId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  // Render stars for rating
  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star
        key={i}
        size={16}
        className={i < rating ? "fill-yellow-500 text-yellow-500" : "text-gray-300"}
      />
    ));
  };

  return (
    <Card className="bg-toca-card border-toca-border">
      <CardHeader>
        <CardTitle>Avaliações</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-4">
            <div className="w-6 h-6 border-2 border-toca-accent border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="border-b border-toca-border pb-4 last:border-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div className="flex mr-2">
                      {renderStars(review.nota)}
                    </div>
                    <span className="font-medium text-white">{review.contratante_nome}</span>
                  </div>
                  <span className="text-sm text-toca-text-secondary">
                    {formatDate(review.data_avaliacao)}
                  </span>
                </div>
                {review.comentario && (
                  <p className="text-toca-text-primary">
                    "{review.comentario}"
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-toca-text-secondary py-6">
            Este profissional ainda não possui avaliações.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default ReviewsSection;
