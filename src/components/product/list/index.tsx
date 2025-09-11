import { useMemo, useState } from "react";
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
        break;
    }
    return sortedProducts;
  }, [initialProducts, sortBy]);

  // Dynamically calculate max price
  const maxPrice = useMemo(() => {
    if (!products.length) return 5000;
    return Math.max(...products.map(p => Number(p.price) || 0), 5000);
  }, [products]);




  // Pagination logic
  const [page, setPage] = useState(1);
  const pageSize = 12;
  const totalPages = Math.ceil(products.length / pageSize);
  const paginatedProducts = products.slice((page - 1) * pageSize, page * pageSize);

  return (
    <section className="products-content products-content--centered">
      <div className="products-content__main products-content__main--centered">
        <div className="products-content__sort" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: '2.5rem', width: '100%', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <label htmlFor="sortBy">Sort by:</label>
            <select
              id="sortBy"
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="products-content__sort-select"
            >
              <option value="popular">Most Popular</option>
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
          {/* Price Range Filter */}
          <div
            className="products-content__sidebar-block"
            style={{
              maxWidth: 400,
              width: '100%',
              // background removed as requested
              ...(typeof window !== 'undefined' && document?.documentElement?.getAttribute('data-theme') === 'dark'
                ? { color: '#f3f4f6' }
                : {}),
            }}
          >
            <h4 style={{ textAlign: 'center', marginBottom: '0.7rem' }}>Price Range</h4>
            <div className="price-range-responsive">
              <div className="price-range-inputs">
                <input
                  type="number"
                  min="0"
                  max={String(router.query.priceMax || maxPrice)}
                  value={String(router.query.priceMin || 0)}
                  onChange={e => {
                    router.push({
                      pathname: router.pathname,
                      query: { ...router.query, priceMin: e.target.value },
                    }, undefined, { shallow: true });
                  }}
                  className="price-range-input"
                  aria-label="Minimum price"
                  style={typeof window !== 'undefined' && document?.documentElement?.getAttribute('data-theme') === 'dark' ? { background: '#23262a', color: '#f3f4f6', border: '1px solid #33363a' } : {}}
                />
                <span className="price-range-separator">-</span>
                <input
                  type="number"
                  min={String(router.query.priceMin || 0)}
                  max={String(maxPrice)}
                  value={String(router.query.priceMax || maxPrice)}
                  onChange={e => {
                    router.push({
                      pathname: router.pathname,
                      query: { ...router.query, priceMax: e.target.value },
                    }, undefined, { shallow: true });
                  }}
                  className="price-range-input"
                  aria-label="Maximum price"
                  style={typeof window !== 'undefined' && document?.documentElement?.getAttribute('data-theme') === 'dark' ? { background: '#23262a', color: '#f3f4f6', border: '1px solid #33363a' } : {}}
                />
              </div>
              <div className="price-range-slider">
                <input
                  type="range"
                  min="0"
                  max={maxPrice}
                  step="1"
                  value={router.query.priceMin || 0}
                  onChange={e => {
                    router.push({
                      pathname: router.pathname,
                      query: { ...router.query, priceMin: e.target.value },
                    }, undefined, { shallow: true });
                  }}
                  className="price-range-slider-input"
                  style={typeof window !== 'undefined' && document?.documentElement?.getAttribute('data-theme') === 'dark' ? { background: '#23262a' } : {}}
                />
                <input
                  type="range"
                  min="0"
                  max={maxPrice}
                  step="1"
                  value={router.query.priceMax || maxPrice}
                  onChange={e => {
                    router.push({
                      pathname: router.pathname,
                      query: { ...router.query, priceMax: e.target.value },
                    }, undefined, { shallow: true });
                  }}
                  className="price-range-slider-input"
                  style={typeof window !== 'undefined' && document?.documentElement?.getAttribute('data-theme') === 'dark' ? { background: '#23262a' } : {}}
                />
              </div>
            </div>
          </div>
        </div>
        <h2 className="products-content__title" style={{ textAlign: 'center' }}>
          All Products <span className="products-content__count">{products.length}</span>
        </h2>
        {paginatedProducts.length === 0 ? (
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
          <>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
              <List products={paginatedProducts} />
              <div style={{ height: '2.5rem' }} />
              <div className="pagination-buttons" style={{ marginTop: 0, display: 'flex', justifyContent: 'center', width: '100%' }}>
                <button
                  className="btn btn--rounded btn--border"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                >
                  Prev
                </button>
                <span className="pagination-info">Page {page} of {totalPages}</span>
                <button
                  className="btn btn--rounded btn--border"
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default ProductsContent;
