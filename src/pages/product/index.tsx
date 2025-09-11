import Breadcrumb from "@/components/breadcrumb";
import Footer from "@/components/footer";
import ProductsContent from "@/components/product/list"
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

      // Price range filter (sidebar)
      const min = router.query.priceMin ? Number(router.query.priceMin) : 0;
      const max = router.query.priceMax ? Number(router.query.priceMax) : 5000;
      filteredProducts = filteredProducts.filter(product => {
        const price = Number(product.price);
        return !isNaN(price) && price >= min && price <= max;
      });

      // Filter by size
      if (router.query.size) {
        const sizes = (router.query.size as string).split(",");
        filteredProducts = filteredProducts.filter((product) =>
          product.sizes?.some((size) => sizes.includes(size))
        );
      }

      // Filter by color
      if (router.query.color) {
        const colors = (router.query.color as string).split(",");
        filteredProducts = filteredProducts.filter((product) =>
          product.color ? colors.includes(product.color) : false
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
          {/* ProductsFilter removed as requested */}
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
  // Default categories if no products have them specified
  const defaultTypes = ['Clothing', 'Accessories', 'Shoes'].map((name, index) => ({
    id: String(index + 1),
    name
  }));

  const defaultSizes = ['XS', 'S', 'M', 'L', 'XL'].map((label, index) => ({
    id: String(index + 1),
    label
  }));

  const defaultColors = ['Black', 'White', 'Blue', 'Red'].map((color, index) => ({
    id: String(index + 1),
    color
  }));

  // Get unique values from products, fallback to defaults if empty
  const productTypes: ProductType[] = products.length 
    ? [...new Map(products.filter(p => p.type).map((p) => [p.type, p])).values()].map((p, index) => ({ 
        id: String(index + 1), 
        name: p.type || 'Unknown'
      }))
    : defaultTypes;

  const productSizes: ProductSize[] = products.length 
    ? [...new Set(products.flatMap((p) => p.sizes || []))].map((size, index) => ({ 
        id: String(index + 1), 
        label: size 
      }))
    : defaultSizes;

  const productColors: ProductColor[] = products.length 
    ? [...new Map(products.filter(p => p.color).map((p) => [p.color, p])).values()].map((p, index) => ({ 
        id: String(index + 1), 
        color: p.color || 'default'
      }))
    : defaultColors;

  return {
    props: { 
      products, 
      productTypes, 
      productSizes, 
      productColors 
    },
    revalidate: 10, // Re-generate the page every 10 seconds for faster updates
  };
};

export default ProductsPage;
