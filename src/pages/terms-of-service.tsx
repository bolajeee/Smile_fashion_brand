import React from 'react';
import Layout from '../layouts/Main';

const TermsOfService = () => {
  return (
    <Layout>
      <div className="container mx-auto py-16 px-4">
        <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
        
        <div className="prose max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Agreement to Terms</h2>
            <p>By accessing and using Smile Fashion Brand's website, you agree to be bound by these Terms of Service and all applicable laws and regulations.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Use License</h2>
            <p>Permission is granted to temporarily access and view the materials on our website for personal, non-commercial use only.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Product Information and Pricing</h2>
            <p>We strive to display accurate product information and pricing. However, we reserve the right to correct any errors and modify prices without prior notice.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Order Acceptance and Shipping</h2>
            <p>We reserve the right to refuse any order. Once an order is placed, we will provide shipping information and estimated delivery dates.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Returns and Refunds</h2>
            <p>Please refer to our Returns Policy for information about returns, exchanges, and refunds.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Disclaimer</h2>
            <p>The materials on our website are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim all other warranties.</p>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default TermsOfService;
