import { useCart } from "@/contexts/CartContext";
import type { ProductStoreType } from "@/types";

const CartItem = ({
  thumb,
  name,
  id,
  color,
  size,
  count,
  price,
}: ProductStoreType & { thumb: string }) => {
  const { removeProduct, setCount } = useCart();

  const removeFromCart = () => {
    removeProduct({
      id,
      name,
      price,
      images: [thumb],
      color,
      size,
      thumb,
      discount: 0,
      currentPrice: price,
      count: 1
    });
  };

  const setProductCount = (newCount: number) => {
    if (newCount <= 0) {
      removeFromCart();
      return;
    }

    setCount({
      id,
      name,
      price,
      images: [thumb],
      color,
      size,
      thumb,
      discount: 0,
      currentPrice: price,
      count: 1
    }, newCount);
  };

  return (
    <tr className="cart-item">
      <td className="cart-item__product">
        <div className="cart-product">
          <div className="cart-product__img">
            <img src={thumb} alt={name} />
          </div>

          <div className="cart-product__content">
            <h3 className="cart-product__title">{name}</h3>
            <p className="cart-product__id">#{id}</p>
          </div>
        </div>
      </td>

      <td className="cart-item__color" data-label="Color">
        <span className="cart-item__color-swatch" style={{ backgroundColor: color }}></span>
        {color}
      </td>

      <td className="cart-item__size" data-label="Size">
        {size}
      </td>

      <td className="cart-item__quantity">
        <div className="quantity-button">
          <button
            type="button"
            onClick={() => setProductCount(count - 1)}
            className="quantity-button__btn quantity-button__btn--decrease"
            aria-label="Decrease quantity"
          >
            -
          </button>
          <span className="quantity-button__count">{count}</span>
          <button
            type="button"
            onClick={() => setProductCount(count + 1)}
            className="quantity-button__btn quantity-button__btn--increase"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </td>

      <td className="cart-item__price">${price}</td>

      <td className="cart-item__actions">
        <button
          type="button"
          onClick={removeFromCart}
          className="cart-item__remove"
          aria-label="Remove item from cart"
        >
          <i className="icon-cancel" />
        </button>
      </td>
    </tr>
  );
};

export default CartItem;
