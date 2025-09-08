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
  const { removeProduct, setCount, updateVariant } = useCart();

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
        <div className="cart-item__select-wrapper">
          <select
            className={`cart-item__select ${color ? 'has-value' : ''}`}
            value={color}
            onChange={(e) => updateVariant({
              id,
              name,
              price,
              images: [thumb],
              color,
              size,
              thumb,
              discount: 0,
              currentPrice: price,
              count: count
            }, { color: e.target.value })}
            style={color ? {
              backgroundColor: getColorHex(color),
              color: ['White', 'Yellow'].includes(color) ? '#374151' : '#ffffff',
              borderColor: getColorHex(color),
              fontWeight: '600'
            } : undefined}
          >
            <option value="">Select Color</option>
            <option value="Black" style={{ backgroundColor: '#000000', color: '#ffffff' }}>Black</option>
            <option value="White" style={{ backgroundColor: '#ffffff', color: '#374151' }}>White</option>
            <option value="Red" style={{ backgroundColor: '#DC2626', color: '#ffffff' }}>Red</option>
            <option value="Blue" style={{ backgroundColor: '#2563EB', color: '#ffffff' }}>Blue</option>
            <option value="Green" style={{ backgroundColor: '#059669', color: '#ffffff' }}>Green</option>
            <option value="Yellow" style={{ backgroundColor: '#EAB308', color: '#374151' }}>Yellow</option>
            <option value="Pink" style={{ backgroundColor: '#EC4899', color: '#ffffff' }}>Pink</option>
            <option value="Purple" style={{ backgroundColor: '#9333EA', color: '#ffffff' }}>Purple</option>
            <option value="Gray" style={{ backgroundColor: '#6B7280', color: '#ffffff' }}>Gray</option>
            <option value="Brown" style={{ backgroundColor: '#92400E', color: '#ffffff' }}>Brown</option>
            <option value="Navy" style={{ backgroundColor: '#1E3A8A', color: '#ffffff' }}>Navy</option>
          </select>
        </div>
      </td>

      <td className="cart-item__size" data-label="Size">
        <div className="cart-item__select-wrapper">
          <select
            className={`cart-item__select ${size ? 'has-value' : ''}`}
            value={size}
            onChange={(e) => updateVariant({
              id,
              name,
              price,
              images: [thumb],
              color,
              size,
              thumb,
              discount: 0,
              currentPrice: price,
              count: count
            }, { size: e.target.value })}
            style={size ? {
              backgroundColor: '#f3f4f6',
              color: '#374151',
              borderColor: '#9ca3af',
              fontWeight: '600'
            } : undefined}
          >
            <option value="">Select Size</option>
            <option value="XS">XS</option>
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
            <option value="XL">XL</option>
            <option value="XXL">XXL</option>
          </select>
        </div>
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
