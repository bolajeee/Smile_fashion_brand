import React from "react";
import ProductCardLoading from "@/components/product/card/loading";

const ProductsLoading = () => {
  return (
    <section className="products-list">
      {/* Render a few skeleton loaders */}
      {Array.from({ length: 6 }).map((_, index) => (
        <ProductItemLoading key={index} />
      ))}
    </section>
  );
};

export default ProductsLoading;
