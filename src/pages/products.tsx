import Breadcrumb from "@/components/breadcrumb";
import Footer from "@/components/footer";
import ProductsContent from "@/components/products-content";
import ProductsFilter from "@/components/products-filter";
import Layout from "@/layouts/Main";
import type {
  Product,
  ProductColor,
  ProductSize,
  ProductType,
} from "@/types/product";
import { getProducts } from "@/utils/api/products";
import type { GetStaticProps, NextPage } from "next";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

interface ProductsPageProps {
  products: Product[];
  productTypes: ProductType[];
  productSizes: ProductSize[];
  productColors: ProductColor[];
}

const ProductsPage: NextPage<ProductsPageProps> = ({
  products: initialProducts,
  productTypes,
  productSizes,
  productColors,
}) => {
  const router = useRouter();
  const [products, setProducts] = useState(initialProducts);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const filterProducts = () => {
      setLoading(true);
      let filteredProducts = [...initialProducts];

      // Filter by type
      if (router.query.type) {
        filteredProducts = filteredProducts.filter(
          (product) => product.type === router.query.type
        );
      }

      // Filter by price range
      if (router.query.price) {
        const [min, max] = (router.query.price as string)
          .split("-")
          .map(Number);
        filteredProducts = filteredProducts.filter(
          (product) => product.price >= min && product.price <= max
        );
      }

      // Filter by size
      if (router.query.size) {
        const sizes = (router.query.size as string).split(",");
        filteredProducts = filteredProducts.filter((product) =>
          product.sizes.some((size) => sizes.includes(size))
        );
      }

      // Filter by color
      if (router.query.color) {
        const colors = (router.query.color as string).split(",");
        filteredProducts = filteredProducts.filter((product) =>
          colors.includes(product.color)
        );
      }

      setProducts(filteredProducts);
      setLoading(false);
    };

    filterProducts();
  }, [router.query, initialProducts]);

  return (
    <Layout>
      <Breadcrumb />
      <section className="products-page">
        <div className="container">
          <ProductsFilter
            {...{ productTypes, productSizes, productColors }}
            selectedFilters={router.query}
          />
          {loading ? (
            <div className="products-page__loading">Loading...</div>
          ) : (
            <ProductsContent products={products} />
          )}
        </div>
      </section>
      <Footer />
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const products = await getProducts();

  // Derive filter data from all products
  const productTypes: ProductType[] = [
    ...new Map(products.map((p) => [p.type, p])).values(),
  ].map((p, index) => ({ id: String(index + 1), name: p.type }));

  const productSizes: ProductSize[] = [
    ...new Set(products.flatMap((p) => p.sizes)),
  ].map((size, index) => ({ id: String(index + 1), label: size }));

  const productColors: ProductColor[] = [
    ...new Map(products.map((p) => [p.color, p])).values(),
  ].map((p, index) => ({ id: String(index + 1), color: p.color as string }));

  return {
    props: { products, productTypes, productSizes, productColors },
    revalidate: 60, // Re-generate the page every 60 seconds
  };
};

export default ProductsPage;
