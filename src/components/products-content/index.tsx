import { useMemo, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/router";

import List from "./list";

import type { Product } from "@/types/product";

interface ProductsContentProps {
  products: Product[];
}

const ProductsContent: React.FC<ProductsContentProps> = ({ products: initialProducts }) => {
  // const [orderProductsOpen, setOrderProductsOpen] = useState(false);
  const [sortBy, setSortBy] = useState('popular');
  const router = useRouter();

  const products = useMemo(() => {
    let sortedProducts = [...initialProducts];
    
    switch (sortBy) {
      case 'newest':
        sortedProducts.sort((a, b) => 
          new Date(b.createdAt || new Date()).getTime() - new Date(a.createdAt || new Date()).getTime()
        );
        break;
      case 'price-low':
        sortedProducts.sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case 'price-high':
        sortedProducts.sort((a, b) => Number(b.price) - Number(a.price));
        break;
      case 'popular':
      default:
        // For popular, we could use a view count or sales count if available
        // For now, we'll keep the default order
        break;
    }
    
    return sortedProducts;
  }, [initialProducts, sortBy]);

  const appliedFilters = useMemo(() => {
    const { type, size, color, price } = router.query as Record<string, string>;
    const entries: Array<{ key: string; label: string; value: string }> = [];
    if (type) type.split(",").forEach((v) => entries.push({ key: "type", label: "Type", value: v }));
    if (size) size.split(",").forEach((v) => entries.push({ key: "size", label: "Size", value: v }));
    if (color) color.split(",").forEach((v) => entries.push({ key: "color", label: "Color", value: v }));
    if (price) {
      const [min, max] = price.split("-").map(Number);
      entries.push({ key: "price", label: "Price", value: `$${ min} - $${max}` });
    }
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
        <div className="products-content__header">
          <div className="products-content__header-left">
            <h2 className="products-content__title">
              All Products <span className="products-content__count">{products.length}</span>
            </h2>
          </div>
          <div className="products-content__header-right">
            <div className="products-content__sort">
              <label htmlFor="sort">Sort by:</label>
              <select 
                id="sort" 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="products-content__sort-select"
              >
                <option value="popular">Popular</option>
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
            <div className="products-content__view-toggle">
              <button 
                type="button" 
                className="active"
                aria-label="Grid view"
              >
                <i className="icon-grid " />Prev
              </button>
              <button 
                type="button"
                aria-label="List view"
              >
                <i className="icon-list" />Next
              </button>
            </div>
          </div>
        </div>
        
        {appliedFilters.length > 0 && (
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
          </div>
        )}
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
