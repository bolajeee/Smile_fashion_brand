import MainLayout from '@/layouts/Main';
import Footer from '@/components/footer';
import { useTheme } from '@/contexts/ThemeContext';
import { useState } from 'react';

const ContactUsPage = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitted(false);
    // Simulate API call
    if (!form.name || !form.email || !form.message) {
      setError('Please fill in all fields.');
      return;
    }
    setTimeout(() => {
      setSubmitted(true);
      setForm({ name: '', email: '', message: '' });
    }, 800);
  };

  return (
    <MainLayout title="Contact Us">
      <section className={`contact-us${isDark ? ' contact-us--dark' : ''}`}>
        <div className="container contact-us__container">
          <h1 className="contact-us__title">Contact Us</h1>
          <p className="contact-us__subtitle">We'd love to hear from you! Fill out the form below and our team will get back to you soon.</p>
          <form className="contact-form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={form.name}
              onChange={handleChange}
              className="contact-form__input"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={form.email}
              onChange={handleChange}
              className="contact-form__input"
              required
            />
            <textarea
              name="message"
              placeholder="Your Message"
              value={form.message}
              onChange={handleChange}
              className="contact-form__textarea"
              rows={5}
              required
            />
            {error && <div className="contact-form__error">{error}</div>}
            {submitted && <div className="contact-form__success">Thank you for reaching out! We'll get back to you soon.</div>}
            <button type="submit" className="btn btn--rounded btn--yellow contact-form__submit">Send Message</button>
          </form>
        </div>
      </section>
      <Footer />
      <style jsx>{`
        .contact-us {
          padding: 60px 0;
          background: #fff9f3;
          transition: background 0.3s;
        }
        .contact-us--dark {
          background: #18181b;
        }
        .contact-us__container {
          max-width: 500px;
          margin: 0 auto;
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.07);
          padding: 40px 32px;
          transition: background 0.3s, color 0.3s;
        }
        .contact-us--dark .contact-us__container {
          background: #23232a;
        }
        .contact-us__title {
          font-size: 2.2rem;
          font-weight: 700;
          color: #f7b731;
          margin-bottom: 12px;
          text-align: center;
        }
        .contact-us__subtitle {
          font-size: 1.1rem;
          color: #888;
          margin-bottom: 28px;
          text-align: center;
        }
        .contact-us--dark .contact-us__subtitle {
          color: #bdbdbd;
        }
        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }
        .contact-form__input,
        .contact-form__textarea {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 1rem;
          background: #fafafa;
          color: #222;
          transition: border 0.2s, background 0.2s;
        }
        .contact-form__input:focus,
        .contact-form__textarea:focus {
          border-color: #f7b731;
          background: #fff;
          outline: none;
        }
        .contact-us--dark .contact-form__input,
        .contact-us--dark .contact-form__textarea {
          background: #23232a;
          color: #e2e8f0;
          border: 1px solid #444;
        }
        .contact-form__submit {
          margin-top: 8px;
        }
        .contact-form__error {
          color: #e74c3c;
          text-align: center;
        }
        .contact-form__success {
          color: #27ae60;
          text-align: center;
        }
      `}</style>
    </MainLayout>
  );
};

export default ContactUsPage;
