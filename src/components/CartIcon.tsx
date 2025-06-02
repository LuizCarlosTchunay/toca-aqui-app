
import React from "react";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/useCart";
import { useNavigate } from "react-router-dom";

const CartIcon = () => {
  const { cart } = useCart();
  const navigate = useNavigate();
  
  const itemCount = cart?.items?.length || 0;

  const handleCartClick = () => {
    navigate("/carrinho");
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className="relative text-white hover:text-toca-accent"
      onClick={handleCartClick}
    >
      <ShoppingCart size={20} />
      {itemCount > 0 && (
        <Badge
          variant="destructive"
          className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-toca-accent"
        >
          {itemCount}
        </Badge>
      )}
    </Button>
  );
};

export default CartIcon;
