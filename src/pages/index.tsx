import Footer from "@/components/footer";
import PageIntro from "@/components/page-intro";
import ProductsFeatured from "@/components/product/featured";
import Subscribe from "@/components/subscribe";
import { motion } from "framer-motion";
import Layout from "../layouts/Main";
import Link from "next/link";

const IndexPage = () => {
  return (
    <Layout>
      <PageIntro />

      <motion.section 
        className="featured-showcase"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.15
            }
          }
        }}
      >
        <div className="container">
          <div className="featured-showcase-grid">
            <motion.article
              style={{ backgroundImage: "url(/images/featured-1.jpg)" }}
              className="showcase-item showcase-item--primary"
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { 
                  opacity: 1, 
                  y: 0,
                  transition: {
                    duration: 0.8,
                    ease: [0.22, 1, 0.36, 1]
                  }
                }
              }}
            >
              <div className="showcase-item__overlay"></div>
              <div className="showcase-item__content">
                <motion.h3
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { 
                      opacity: 1, 
                      y: 0,
                      transition: { delay: 0.2, duration: 0.6 }
                    }
                  }}
                  className="showcase-item__title"
                >
                  New Collection
                </motion.h3>
                <motion.p
                  variants={{
                    hidden: { opacity: 0 },
                    visible: { 
                      opacity: 1,
                      transition: { delay: 0.3, duration: 0.6 }
                    }
                  }}
                  className="showcase-item__subtitle"
                >
                  Discover our latest arrivals
                </motion.p>
                <motion.a
                  href="/products"
                  className="showcase-item__link"
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { 
                      opacity: 1, 
                      y: 0,
                      transition: { delay: 0.4, duration: 0.6 }
                    }
                  }}
                  whileHover={{ x: 5 }}
                >
                  Explore Collection <i className="icon-right" />
                </motion.a>
              </div>
            </motion.article>

            <motion.article
              style={{ backgroundImage: "url(/images/featured-2.jpg)" }}
              className="showcase-item showcase-item--secondary"
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.8,
                    ease: [0.22, 1, 0.36, 1],
                  },
                },
              }}
            >
              <div className="showcase-item__overlay"></div>
              <div className="showcase-item__content">
                <motion.h3
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { delay: 0.2, duration: 0.6 },
                    },
                  }}
                  className="showcase-item__title"
                >
                  Curated Selection
                </motion.h3>
                <motion.p
                  variants={{
                    hidden: { opacity: 0 },
                    visible: { 
                      opacity: 1,
                      transition: { delay: 0.3, duration: 0.6 }
                    }
                  }}
                  className="showcase-item__subtitle"
                >
                  Handpicked for you
                </motion.p>
                <motion.a
                  href="/products"
                  className="showcase-item__link"
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { delay: 0.4, duration: 0.6 },
                    },
                  }}
                  whileHover={{ x: 5 }}
                >
                  View Selection <i className="icon-right" />
                </motion.a>
              </div>
            </motion.article>
          </div>
        </div>
      </motion.section>

      <motion.section 
        className="values-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
      >
        <div className="container">
          <motion.header 
            className="values-header"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { 
                opacity: 1, 
                y: 0,
                transition: { duration: 0.6 }
              }
            }}
          >
            <h2 className="values-title">Why Choose Smile</h2>
            <p className="values-subtitle">Crafted for those who appreciate quality and authenticity</p>
          </motion.header>

          <motion.ul 
            className="values-grid" 
            variants={{ 
              hidden: { opacity: 0 }, 
              visible: { 
                opacity: 1, 
                transition: { staggerChildren: 0.1, delayChildren: 0.1 } 
              } 
            }}
          >
            <motion.li 
              className="value-item"
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            >
              <div className="value-item__icon">
                <i className="icon-shipping" />
              </div>
              <h4 className="value-item__title">Complimentary Shipping</h4>
              <p className="value-item__text">
                Free shipping on all orders over $199 with expedited delivery options available.
              </p>
            </motion.li>

            <motion.li 
              className="value-item"
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            >
              <div className="value-item__icon">
                <i className="icon-payment" />
              </div>
              <h4 className="value-item__title">Secure Checkout</h4>
              <p className="value-item__text">
                All transactions are processed with industry-leading security protocols.
              </p>
            </motion.li>

            <motion.li 
              className="value-item"
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            >
              <div className="value-item__icon">
                <i className="icon-cash" />
              </div>
              <h4 className="value-item__title">Satisfaction Guarantee</h4>
              <p className="value-item__text">
                Full refund within 30 days if you're not completely satisfied with your purchase.
              </p>
            </motion.li>

            <motion.li 
              className="value-item"
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            >
              <div className="value-item__icon">
                <i className="icon-materials" />
              </div>
              <h4 className="value-item__title">Premium Quality</h4>
              <p className="value-item__text">
                Every piece is made with the finest materials and meticulous craftsmanship.
              </p>
            </motion.li>
          </motion.ul>
        </div>
      </motion.section>

      <ProductsFeatured />
      <Subscribe />
      <Footer />
    </Layout>
  );
};

export default IndexPage;
