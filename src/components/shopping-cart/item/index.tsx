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

  // Color mapping for better display
  const getColorHex = (colorName?: string): string => {
    const colorMap: { [key: string]: string } = {
      'black': '#000000',
      'white': '#FFFFFF',
      'red': '#DC2626',
      'blue': '#2563EB',
      'green': '#059669',
      'yellow': '#EAB308',
      'pink': '#EC4899',
      'purple': '#9333EA',
      'gray': '#6B7280',
      'grey': '#6B7280',
      'brown': '#92400E',
      'orange': '#EA580C',
      'navy': '#1E3A8A',
      'beige': '#F5F5DC',
      'cream': '#F5F5DC',
    };
    return colorMap[colorName?.toLowerCase() ?? ''] || colorName || '#6B7280';
  };

  // Format price to ensure it's a number
  const formatPrice = (priceValue: any): string => {
    const numPrice = typeof priceValue === 'string' ? parseFloat(priceValue) : priceValue;
    return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2);
  };

  const totalItemPrice = (typeof price === 'string' ? parseFloat(price) : price) * count;

  return (
    <tr className="cart-item">
      <td className="cart-item__product">
        <div className="cart-product">
          <div className="cart-product__img">
            <img src={thumb} alt={name} />
          </div>

          <div className="cart-product__content">
            <h3 className="cart-product__title">{name}</h3>
            <p className="cart-product__id">ID: #{id}</p>
          </div>
        </div>
      </td>

      <td className="cart-item__color" data-label="Color">
        <span 
          className="cart-item__color-swatch" 
          style={{ backgroundColor: getColorHex(color) }}
        ></span>
        {color}
      </td>

      <td className="cart-item__size" data-label="Size">
        {size}
      </td>

      <td className="cart-item__quantity" data-label="Quantity">
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

      <td className="cart-item__price" data-label="Price">
        ${formatPrice(totalItemPrice)}
      </td>

      <td className="cart-item__actions" data-label="Actions">
        <button
          type="button"
          onClick={removeFromCart}
          className="cart-item__remove"
          aria-label="Remove item from cart"
          title="Remove from cart"
        >
          <i className="icon-cancel" />
        </button>
      </td>
    </tr>
  );
};

export default CartItem;
