import React from 'react';
import Layout from '../layouts/Main';

const PrivacyPolicy = () => {
  return (
    <Layout>
      <div className="container mx-auto py-16 px-4">
        <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
        
        <div className="prose max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
            <p>When you visit Smile Fashion Brand, we collect certain information about your device, your interaction with the website, and information necessary to process your purchases.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Process your orders and maintain your account</li>
              <li>Communicate with you about your orders and provide customer support</li>
              <li>Improve our website and customer experience</li>
              <li>Send you marketing communications (with your consent)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Information Sharing</h2>
            <p>We share your information with our payment processors, shipping partners, and other service providers necessary to provide our services.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Withdraw consent for marketing communications</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Contact Us</h2>
            <p>For any privacy-related questions or concerns, please contact us at [Your Contact Information].</p>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default PrivacyPolicy;
