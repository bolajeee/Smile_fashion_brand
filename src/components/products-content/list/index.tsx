import type { Product } from "@/types/product";

import ProductItem from "../../product-item";

interface ProductListProps {
  products: Product[];
}

const List: React.FC<ProductListProps> = ({ products }) => {
  return (
    <section className="products-list">
      {products.map((item) => (
        <ProductItem
          key={item.id}
          {...item}
        />
      ))}
    </section>
  );
};

export default List;
