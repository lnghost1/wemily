import React from 'react';
import Hero from '../components/Hero';
import About from '../components/About';
import Services from '../components/Services';

const LandingPage: React.FC = () => {
  return (
    <>
      <Hero />
      <About />
      <Services />
    </>
  );
};

export default LandingPage;
