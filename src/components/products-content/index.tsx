import { useMemo, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/router";

import List from "./list";

import type { Product } from "@/types/product";

interface ProductsContentProps {
  products: Product[];
}


const ProductsContent: React.FC<ProductsContentProps> = ({ products }) => {
  const [orderProductsOpen, setOrderProductsOpen] = useState(false);
  const router = useRouter();

  const appliedFilters = useMemo(() => {
    const { type, size, color, price } = router.query as Record<string, string>;
    const entries: Array<{ key: string; label: string; value: string }> = [];
    if (type) type.split(",").forEach((v) => entries.push({ key: "type", label: "Type", value: v }));
    if (size) size.split(",").forEach((v) => entries.push({ key: "size", label: "Size", value: v }));
    if (color) color.split(",").forEach((v) => entries.push({ key: "color", label: "Color", value: v }));
    if (price) entries.push({ key: "price", label: "Price", value: price });
    return entries;
  }, [router.query]);

  const removeFilter = useCallback((key: string, value?: string) => {
    const q = { ...(router.query as Record<string, string>) };
    if (!q[key]) return;
    if (key === "price") {
      delete q[key];
    } else {
      const parts = q[key].split(",").filter((p) => (value ? p !== value : true));
      if (parts.length === 0) delete q[key];
      else q[key] = parts.join(",");
    }
    router.push({ pathname: router.pathname, query: q }, undefined, { shallow: true });
  }, [router]);

  const headerVariants = useMemo(() => ({
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
  }), []);

  return (
    <section className="products-content">
      <motion.div
        className="products-content__intro"
        initial="hidden"
        animate="show"
        variants={headerVariants}
      >
        <h2>
          Men's Tops <span>({products.length})</span>
        </h2>
        <div className="products-content__filters-applied">
          {appliedFilters.map((f, idx) => (
            <span key={`${f.key}-${f.value}-${idx}`} className="filter-tag">
              {f.label}: {f.value}
              <button
                type="button"
                className="remove-filter"
                onClick={() => removeFilter(f.key, f.key === "price" ? undefined : f.value)}
                aria-label={`Remove ${f.label} ${f.value}`}
              >
                ×
              </button>
            </span>
          ))}
          {appliedFilters.length > 0 && (
            <button type="button" className="products-filter__clear" onClick={() => router.push(router.pathname)}>
              Clear all
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={() => setOrderProductsOpen(!orderProductsOpen)}
          className="products-filter-btn"
        >
          <i className="icon-filters" />
        </button>
        <form
          className={`products-content__filter ${orderProductsOpen ? "products-order-open" : ""}`}
        >
          <div className="products__filter__select">
            <h4>Show products: </h4>
            <div className="select-wrapper">
              <select>
                <option>Popular</option>
              </select>
            </div>
          </div>
          <div className="products__filter__select">
            <h4>Sort by: </h4>
            <div className="select-wrapper">
              <select>
                <option>Popular</option>
              </select>
            </div>
          </div>
        </form>
      </motion.div>

      {products.length === 0 ? (
        <div className="products-content__empty">
          <div className="products-content__empty-icon">😕</div>
          <h3 className="products-content__empty-title">No products found</h3>
          <p className="products-content__empty-message">Try adjusting your filters or clear them to see more results.</p>
          <div className="products-content__empty-actions">
            <button className="btn btn--primary" type="button" onClick={() => router.push(router.pathname)}>
              Clear filters
            </button>
          </div>
        </div>
      ) : (
        <List products={products} />
      )}
    </section>
  );
};

export default ProductsContent;
