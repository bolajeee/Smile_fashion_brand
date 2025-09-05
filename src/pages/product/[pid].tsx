import type { GetStaticPaths, GetStaticProps } from "next";
import { useState } from "react";

import Breadcrumb from "@/components/breadcrumb";
import Footer from "@/components/footer";
import Content from "@/components/product-single/content";
import Description from "@/components/product-single/description";
import Gallery from "@/components/product-single/gallery";
import Reviews from "@/components/product-single/reviews";
import ProductsFeatured from "@/components/products-featured";
// types
import type { ProductType } from "@/types";

import Layout from "../../layouts/Main";
import { server } from "../../utils/server";

type ProductPageType = {
  product: ProductType;
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

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const pid = params?.pid as string;
  try {
    const res = await fetch(`${server}/api/product/${pid}`);
    if (!res.ok) return { notFound: true, revalidate: 60 };
    const product = await res.json();
    return { props: { product }, revalidate: 60 };
  } catch {
    return { notFound: true, revalidate: 60 };
  }
};

const Product = ({ product }: ProductPageType) => {
  const [showBlock, setShowBlock] = useState("description");

  return (
    <Layout>
      <Breadcrumb />

      <section className="product-single">
        <div className="container">
          <div className="product-single__content">
            <Gallery images={product.images} />
            <Content product={product} />
          </div>

          <div className="product-single__info">
            <div className="product-single__info-btns">
              <button
                type="button"
                onClick={() => setShowBlock("description")}
                className={`btn btn--rounded ${showBlock === "description" ? "btn--active" : ""}`}
              >
                Description
              </button>
              <button
                type="button"
                onClick={() => setShowBlock("reviews")}
                className={`btn btn--rounded ${showBlock === "reviews" ? "btn--active" : ""}`}
              >
                Reviews (2)
              </button>
            </div>

            <Description show={showBlock === "description"} />
            <Reviews product={product} show={showBlock === "reviews"} />
          </div>
        </div>
      </section>

      <div className="product-single-page">
        <ProductsFeatured />
      </div>
      <Footer />
    </Layout>
  );
};

export default Product;
