import { some } from "lodash";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useUser } from "@/contexts/UserContext";
import type { ProductStoreType, ProductType } from "@/types";

// TODO: Fix import paths if these modules exist, or provide fallback/defaults if not.
import CheckboxColor from "../../products-filter/form-builder/checkbox-color";

// Fallbacks in case productsColors or productsSizes cannot be imported
const productsColors: string[] = [
  "red", "blue", "green", "yellow", "black", "white"
];
const productsSizes: string[] = [
  "XS", "S", "M", "L", "XL", "XXL"
];

type ProductContent = {
  product: ProductType;
};

const Content = ({ product }: ProductContent) => {
  const { addProduct } = useCart();
  const { setFavoriteProducts, toggleFavoriteProduct } = useUser();
  const [count, setCount] = useState<number>(1);
  const [color, setColor] = useState<string>("");
  const [itemSize, setItemSize] = useState<string>("");

  const onColorSet = (e: string) => setColor(e);
  const onSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setItemSize(e.target.value);

  const isFavourite = some(
    setFavoriteProducts,
    (productId) => productId === product.id,
  );

  const toggleFav = () => {
    toggleFavoriteProduct(product.id);
  };

  const addToCart = () => {
    if (!color || !itemSize) {
      alert('Please select both color and size');
      return;
    }

    const productToSave: ProductStoreType = {
      id: product.id,
      name: product.name,
      images: product.images || [],
      price: product.currentPrice,
      count: 1,
      color,
      size: itemSize,
      discount: product.discount ? Number(product.discount) : undefined,
      currentPrice: product.currentPrice,
      thumb: product.images && product.images.length > 0 ? product.images[0] : "",
    };

    addProduct(productToSave, count);
  };

  return (
    <section className="product-content">
      <div className="product-content__intro">
        <h5 className="product__id">
          Product ID:
          <br />
          {product.id}
        </h5>
        {product.discount && <span className="product-on-sale">Sale</span>}
        <h2 className="product__name">{product.name}</h2>

        <div className="product__prices">
          <h4 className="product__current-price">${product.currentPrice}</h4>
          {product.discount && <span className="product__original-price">${product.price}</span>}
        </div>
      </div>

      <div className="product-content__filters">
        <div className="product-filter-item">
          <h5>Color:</h5>
          <div className="checkbox-color-wrapper">
            {productsColors.map((colorName) => (
              <CheckboxColor
                key={colorName}
                type="radio"
                name="product-color"
                color={colorName}
                valueName={colorName}
                onChange={onColorSet}
              />
            ))}
          </div>
        </div>

        <div className="product-filter-item">
          <h5>
            Size: <strong>See size table</strong>
          </h5>
          <div className="checkbox-color-wrapper">
            <div className="select-wrapper">
              <select onChange={onSelectChange} value={itemSize}>
                <option value="">Choose size</option>
                {productsSizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="product-filter-item">
          <h5>Quantity:</h5>
          <div className="quantity-buttons">
            <div className="quantity-button">
              <button
                type="button"
                onClick={() => setCount(Math.max(1, count - 1))}
                className="quantity-button__btn quantity-button__btn--decrease"
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span className="quantity-button__count">{count}</span>
              <button
                type="button"
                onClick={() => setCount(count + 1)}
                className="quantity-button__btn quantity-button__btn--increase"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            <button
              type="button"
              onClick={addToCart}
              className="btn btn--rounded btn--yellow"
              disabled={!color || !itemSize}
            >
              Add to cart
            </button>

            <button
              type="button"
              onClick={toggleFav}
              className={`btn-heart ${isFavourite ? "btn-heart--active" : ""}`}
              aria-label={isFavourite ? "Remove from favorites" : "Add to favorites"}
            >
              <i className="icon-heart" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Content;
