import MainLayout from '@/layouts/Main';
import Footer from '@/components/footer';
import { useTheme } from '@/contexts/ThemeContext';

const AboutUsPage = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <MainLayout title="About Us">
      <section className={`about-us${isDark ? ' about-us--dark' : ''}`}>
        <div className="container about-us__container">
          <h1 className="about-us__title">About Smile Fashion Brand</h1>
          <div className="about-us__content">
            <p>
              Smile Fashion Brand is dedicated to bringing you the latest trends in fashion with a focus on quality, sustainability, and customer satisfaction. Our mission is to empower individuals to express themselves confidently through style.
            </p>
            <p>
              Founded in 2020, we have grown into a community of fashion lovers who value creativity, inclusivity, and ethical practices. From everyday essentials to statement pieces, our collections are designed to inspire and delight.
            </p>
            <p>
              Thank you for being part of our journey. We look forward to helping you shine, one outfit at a time!
            </p>
          </div>
        </div>
      </section>
      <Footer />
      <style jsx>{`
        .about-us {
          padding: 60px 0;
          background: #fff9f3;
          transition: background 0.3s;
        }
        .about-us--dark {
          background: #18181b;
        }
        .about-us__container {
          max-width: 800px;
          margin: 0 auto;
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.07);
          padding: 40px 32px;
          transition: background 0.3s, color 0.3s;
        }
        .about-us--dark .about-us__container {
          background: #23232a;
        }
        .about-us__title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #f7b731;
          margin-bottom: 24px;
          text-align: center;
        }
        .about-us__content p {
          font-size: 1.15rem;
          color: #444;
          line-height: 1.7;
          margin-bottom: 18px;
          text-align: center;
        }
        .about-us--dark .about-us__content p {
          color: #e2e8f0;
        }
      `}</style>
    </MainLayout>
  );
};

export default AboutUsPage;
