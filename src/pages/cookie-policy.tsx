import React from 'react';
import Layout from '../layouts/Main';

const CookiePolicy = () => {
  return (
    <Layout>
      <div className="container mx-auto py-16 px-4">
        <h1 className="text-3xl font-bold mb-8">Cookie Policy</h1>
        
        <div className="prose max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. What Are Cookies</h2>
            <p>Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better browsing experience and allow certain functionality.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. How We Use Cookies</h2>
            <p>We use cookies for:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Essential website functionality (such as shopping cart and checkout)</li>
              <li>Remembering your preferences</li>
              <li>Analytics to improve our website</li>
              <li>Marketing and personalization (with your consent)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Types of Cookies We Use</h2>
            <ul className="list-disc pl-6 mb-4">
              <li>Essential cookies: Required for basic site functionality</li>
              <li>Functional cookies: Remember your preferences</li>
              <li>Analytics cookies: Help us understand how visitors use our site</li>
              <li>Marketing cookies: Used to deliver relevant advertisements</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Managing Cookies</h2>
            <p>You can control and manage cookies through your browser settings. Please note that removing or blocking cookies may impact your user experience.</p>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default CookiePolicy;
