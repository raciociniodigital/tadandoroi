
import React from 'react';
import { 
  Header, 
  Hero, 
  Features, 
  CallToAction, 
  Footer 
} from '@/components/landing';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Hero />
      <Features />
      <CallToAction />
      <Footer />
    </div>
  );
};

export default Index;
