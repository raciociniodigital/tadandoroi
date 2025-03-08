
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Header = () => {
  return (
    <header className="border-b border-border/40 backdrop-blur-sm bg-background/80 fixed top-0 w-full z-50">
      <div className="container mx-auto flex items-center justify-between p-4">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold tracking-tight">
            Tá Dando <span className="text-primary">ROI</span>
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <Link to="/login">
            <Button variant="ghost">Login</Button>
          </Link>
          <Link to="/plans">
            <Button>Ver Planos</Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
