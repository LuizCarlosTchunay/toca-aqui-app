
import React from 'react';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Explore: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-toca-background">
      <Navbar isAuthenticated={!!user} />
      
      <div className="container mx-auto px-4 py-8">
        <Card className="bg-toca-card border-toca-border">
          <CardHeader>
            <CardTitle className="text-white">Explorar</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-toca-text-secondary">
              Esta página ainda está em desenvolvimento.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Explore;
