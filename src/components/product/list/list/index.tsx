import type { Product } from "@/types/product";

import ProductCard from "@/components/product/card";
import { motion } from "framer-motion";

interface ProductListProps {
  products: Product[];
}

const List: React.FC<ProductListProps> = ({ products }) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.05
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }
  };

  return (
    <motion.section className="products-list" variants={container} initial="hidden" animate="show">
      {products.map((p) => (
        <motion.div key={p.id} variants={item}>
          <ProductCard 
            {...p}
            price={p.price}
            discount={p.discount}
          />
        </motion.div>
      ))}
    </motion.section>
  );
};

export default List;
