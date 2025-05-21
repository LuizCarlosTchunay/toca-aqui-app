
import React from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Register: React.FC = () => {
  return (
    <div className="min-h-screen bg-toca-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <Card className="w-full max-w-md bg-toca-card border-toca-border">
          <CardHeader>
            <CardTitle className="text-white">Cadastro</CardTitle>
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

export default Register;
