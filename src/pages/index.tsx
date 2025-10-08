import Footer from "@/components/footer";
import PageIntro from "@/components/page-intro";
import ProductsFeatured from "@/components/product/featured";
import Subscribe from "@/components/subscribe";
import { motion } from "framer-motion";
import Layout from "../layouts/Main";
import ButterflyScanner from "@/components/features/ButterflyScanner";

const IndexPage = () => {
  return (
    <Layout>
      <PageIntro />

        <motion.section 
          className="featured" 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.2
              }
            }
          }}
        >
          <div className="container">
            <motion.article
              style={{ backgroundImage: "url(/images/featured-1.jpg)" }}
              className="featured-item featured-item--A"
              variants={{
                hidden: { opacity: 0, y: 30 },
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
              <div className="featured-item__content">
                <motion.h3
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { 
                      opacity: 1, 
                      y: 0,
                      transition: { delay: 0.2, duration: 0.6 }
                    }
                  }}
                >
                  New arrivals are now in!
                </motion.h3>
                <motion.a
                  href="/products"
                  className="btn btn--rounded"
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { 
                      opacity: 1, 
                      y: 0,
                      transition: { delay: 0.3, duration: 0.6 }
                    }
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Show Collection
                </motion.a>
              </div>
            </motion.article>

            <motion.article
              style={{ backgroundImage: "url(/images/featured-2.jpg)" }}
              className="featured-item featured-item--B"
              variants={{
                hidden: { opacity: 0, y: 30 },
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
              <div className="featured-item__content">
                <motion.h3
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { delay: 0.2, duration: 0.6 },
                    },
                  }}
                >
                  Shirts $29,99
                </motion.h3>
                <motion.a
                  href="/products"
                  className="btn btn--rounded"
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { delay: 0.3, duration: 0.6 },
                    },
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  More details
                </motion.a>
              </div>
            </motion.article>

            {/* <motion.article
              style={{ backgroundImage: "url(/images/featured-3.jpg)" }}
              className="featured-item featured-item--C"
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.8,
                    ease: [0.22, 1, 0.36, 1],
                  },
                }
              }}
            >
              <div className="featured-item__content">
                <motion.h3
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { delay: 0.2, duration: 0.6 },
                    },
                  }}
                >
                  Summer Sale is Live!
                </motion.h3>
                <motion.a
                  href="/products"
                  className="btn btn--rounded"
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { delay: 0.3, duration: 0.6 },
                    },
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  VIEW ALL
                </motion.a>
              </div>
            </motion.article> */}
          </div>
        </motion.section>


 
        <ButterflyScanner />
        <div className="container">
          <header className="section__intro">
            <motion.h4
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="section__title"
            >
              Why should you choose us?
            </motion.h4>
          </header>

          <motion.ul className="shop-data-items" initial="hidden" whileInView="show" viewport={{ once: true }}
            variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.05 } } }}>
            <motion.li variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}>
              <i className="icon-shipping" />
              <div className="data-item__content">
                <h4>Free Shipping</h4>
                <p>
                  All purchases over $199 are eligible for free shipping via
                  USPS First Class Mail.
                </p>
              </div>
            </motion.li>

            <motion.li variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}>
              <i className="icon-payment" />
              <div className="data-item__content">
                <h4>Easy Payments</h4>
                <p>
                  All payments are processed instantly over a secure payment
                  protocol.
                </p>
              </div>
            </motion.li>

            <motion.li variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}>
              <i className="icon-cash" />
              <div className="data-item__content">
                <h4>Money-Back Guarantee</h4>
                <p>
                  If an item arrived damaged, you
                  can send it back for a full refund.
                </p>
              </div>
            </motion.li>

            <motion.li variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}>
              <i className="icon-materials" />
              <div className="data-item__content">
                <h4>Finest Quality</h4>
                <p>
                  Designed to last, each of our products has been crafted with
                  the finest materials.
                </p>
              </div>
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
