import React from 'react';
import Layout from '../layouts/Main';

const Accessibility = () => {
  return (
    <Layout>
      <div className="container mx-auto py-16 px-4">
        <h1 className="text-3xl font-bold mb-8">Accessibility Statement</h1>
        
        <div className="prose max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Our Commitment</h2>
            <p>Smile Fashion Brand is committed to ensuring digital accessibility for people of all abilities. We continually improve the user experience for everyone and apply the relevant accessibility standards.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Accessibility Features</h2>
            <ul className="list-disc pl-6 mb-4">
              <li>Clear navigation and consistent layout</li>
              <li>Alternative text for images</li>
              <li>Keyboard navigation support</li>
              <li>Readable font sizes and color contrast</li>
              <li>ARIA landmarks and headings</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Compatibility</h2>
            <p>We aim to support the following:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Latest versions of major screen readers</li>
              <li>Browser zoom up to 200%</li>
              <li>Keyboard-only navigation</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p>If you encounter any accessibility issues or have suggestions for improvement, please contact us. We value your feedback and are committed to providing an accessible shopping experience for all users.</p>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default Accessibility;
