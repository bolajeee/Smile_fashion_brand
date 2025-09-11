import React from 'react';
import { useCart } from "@/contexts/CartContext";
import type { ProductStoreType } from "@/types";

// Utility to get color hex code
const getColorHex = (colorName: string) => {
  const colorMap: { [key: string]: string } = {
    white: '#ffffff',
    black: '#000000',
    blue: '#2563EB',
    teal: '#14b8a6',
    red: '#DC2626',
    green: '#059669',
  };
  return colorMap[colorName?.toLowerCase()] || '#6B7280';
};

const CartItem = ({
  thumb,
  name,
  id,
  colorId,
  colorName,
  colorHexCode,
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
      colorId,
      colorName,
      colorHexCode,
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
      colorId,
      colorName,
      colorHexCode,
      size,
      thumb,
      discount: 0,
      currentPrice: price,
      count: 1
    }, newCount);
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
        <div className="cart-item__select-wrapper" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Use local state to reflect dropdown changes instantly */}
          {(() => {
            const [selectedColor, setSelectedColor] = React.useState((colorName || '').toLowerCase());
            React.useEffect(() => { setSelectedColor((colorName || '').toLowerCase()); }, [colorName]);
            return <>
              <span
                style={{
                  display: 'inline-block',
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  backgroundColor: getColorHex(selectedColor),
                  border: '2px solid #222',
                  boxShadow: '0 0 0 1.5px #8882',
                  marginRight: 4,
                  transition: 'background 0.2s',
                }}
                title={selectedColor || 'No color selected'}
              />
              <select
                className={`cart-item__select ${selectedColor ? 'has-value' : ''}`}
                value={selectedColor}
                onChange={e => {
                  setSelectedColor(e.target.value);
                  updateVariant({
                    id,
                    name,
                    price,
                    images: [thumb],
                    colorId,
                    colorName: e.target.value,
                    colorHexCode: getColorHex(e.target.value),
                    size,
                    thumb,
                    discount: 0,
                    currentPrice: price,
                    count: count
                  }, { colorName: e.target.value, colorHexCode: getColorHex(e.target.value) });
                }}
                style={(() => {
                  const color = selectedColor;
                  const bg = color ? getColorHex(color) : '#fff';
                  let text = '#fff';
                  if (["white", "teal", "yellow"].includes(color)) text = '#222';
                  if (!color) text = '#222';
                  return {
                    minWidth: 120,
                    backgroundColor: bg,
                    color: text,
                    border: color ? `2px solid #222` : '1px solid #ccc',
                    fontWeight: '600',
                    boxShadow: color ? '0 0 0 2px #8882 inset' : undefined,
                    transition: 'background 0.2s, color 0.2s',
                  };
                })()}
              >
                <option value="">Select Color</option>
                <option value="white">White</option>
                <option value="black">Black</option>
                <option value="blue">Blue</option>
                <option value="teal">Teal</option>
                <option value="red">Red</option>
                <option value="green">Green</option>
              </select>
            </>;
          })()}
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
              colorId,
              colorName,
              colorHexCode,
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
