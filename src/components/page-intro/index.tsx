import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, EffectFade, Autoplay } from 'swiper/modules';
import Link from "next/link";
import { useRef } from "react";
import { motion } from "framer-motion";


const PageIntro = () => {
  const navigationPrevRef = useRef<HTMLButtonElement>(null);
  const navigationNextRef = useRef<HTMLButtonElement>(null);

  const slides = [
    {
      image: "/images/slide-1.jpg",
      title: "Define Your Style. Own Your Moment.",
      buttonText: "Explore New Arrivals",
      link: "/products?category=new",
    },
    {
      image: "/images/slide-2.jpg",
      title: "Beyond the Trend. Beyond Compare.",
      buttonText: "Discover The Collection",
      link: "/products",
    },
  ];

  return (
    <section className="page-intro">
      <Swiper
        modules={[Navigation, EffectFade, Autoplay]}
        navigation={{
          prevEl: '.js-intro-prev',
          nextEl: '.js-intro-next',
        }}
        effect="fade"
        loop={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        speed={1000}
        className="swiper-wrapper"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div
              className="page-intro__slide"
              style={{ backgroundImage: `url('${slide.image}')` }}
            >
              <div className="container">
                <motion.div className="page-intro__slide__content" initial={{ opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}>
                  <h2>{slide.title}</h2>
                  <Link
                    href={slide.link}
                    className="btn btn--primary btn--large"
                  >
                    {slide.buttonText} <i className="icon-right" />
                  </Link>
                </motion.div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="shop-data-wrapper">
        <div className="shop-data">
          <ul className="shop-data__items">
            <li>
              <i className="icon-shipping" />
              <div className="data-item__content">
                <h4>Free Shipping</h4>
                <p>On purchases over $199</p>
              </div>
            </li>
            <li>
              <i className="icon-happy" />
              <div className="data-item__content">
                <h4>99% Satisfied Customers</h4>
                <p>Our clients' opinions speak for themselves</p>
              </div>
            </li>
            <li>
              <i className="icon-cash" />
              <div className="data-item__content">
                <h4>Originality Guaranteed</h4>
                <p>30 days warranty for each product</p>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div className="page-intro__navigation">
        <button ref={navigationPrevRef} className="nav-btn nav-btn--prev js-intro-prev" aria-label="Previous slide">
          <i className="icon-left" />
        </button>
        <button ref={navigationNextRef} className="nav-btn nav-btn--next js-intro-next" aria-label="Next slide">
          <i className="icon-right" />
        </button>
      </div>
    </section>
  );
};

export default PageIntro;
