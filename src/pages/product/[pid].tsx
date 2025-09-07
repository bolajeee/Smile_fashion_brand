import type { GetStaticPaths, GetStaticProps } from "next";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";

import Breadcrumb from "@/components/breadcrumb";
import Footer from "@/components/footer";
import Gallery from "@/components/product/details/gallery";
import { Tabs } from "./Tabs";
import ProductDetails from "@/components/product/details/content";
import type { Product } from "@/types/product";
import Layout from "@/layouts/Main";
import { server } from "@/utils/server";

// Unused: Description, Reviews (now handled in ProductTabs inside ProductDetails)
// Remove these imports if not needed elsewhere
// const Description = dynamic(() => import("@/components/product/details/description"));
// const Reviews = dynamic(() => import("@/components/product/details/reviews"));
const ProductsFeatured = dynamic(() => import("@/components/products-featured"));

type ProductPageProps = {
  product: Product;
  title: string;
  limit: number;
  excludeIds?: string[];
};

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const res = await fetch(`${server}/api/products`);
    const products: Array<{ id: string }> = await res.json();
    const paths = products.map((p) => ({ params: { pid: String(p.id) } }));
    return { paths, fallback: 'blocking' };
  } catch {
    return { paths: [], fallback: 'blocking' };
  }
};

export const getStaticProps: GetStaticProps<ProductPageProps> = async ({ params }) => {
  const pid = params?.pid as string;
  try {
    const res = await fetch(`${server}/api/product/${pid}`);
    if (!res.ok) return { notFound: true, revalidate: 60 };
    const product = await res.json();
    return { 
      props: { 
        product,
        title: product.name || '',
        limit: 4
      }, 
      revalidate: 60 
    };
  } catch {
    return { notFound: true, revalidate: 60 };
  }
};

const Product = ({ product }: ProductPageProps) => {
  // Removed unused activeTab state

  return (
    <Layout>
      <Breadcrumb />

      <motion.section 
        className="product-details"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
  <div className="container">
    {/* ...rest of the content... */}
  </div>
            <div className="container product-details__container">
              <div className="product-details__main-grid">
                <div className="product-details__gallery-col">
                  <Gallery images={product.images || []} />
                </div>
                <div className="product-details__content-col">
                  <ProductDetails product={product} />
                </div>
              </div>
              <div className="product-details__info-row">
                <motion.div 
                  className="product-details__info"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <Tabs product={product} />
                </motion.div>
              </div>
            </div>
      </motion.section>

      <motion.section 
        className="product-recommendations"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <div className="container">
          <h2 className="section-title">You May Also Like</h2>
          <ProductsFeatured
            // excludeIds prop removed as it is not valid for this component
            // limit prop removed as it is not valid for this component

          />
        </div>
      </motion.section>

      <Footer />
    </Layout>
  );
};

export default Product;
