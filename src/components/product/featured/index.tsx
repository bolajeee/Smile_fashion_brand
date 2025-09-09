import Link from "next/link";
import useSwr from "swr";

import ProductsCarousel from "./carousel";

const ProductsFeatured = () => {
  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const { data } = useSwr("/api/products/featured", fetcher);

  return (
    <section className="section section-products-featured">
      <div className="container">
        <header className="section-products-featured__header">
          <h3>Selected just for you</h3>
          <Link href="/product" className="btn btn--primary btn--rounded btn--show-all">
            Show All Products <i className="icon-arrow-long-right" />
          </Link>
        </header>

        <ProductsCarousel products={data} />
      </div>
    </section>
  );
};

export default ProductsFeatured;
