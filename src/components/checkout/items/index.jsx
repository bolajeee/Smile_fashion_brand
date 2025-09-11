import { useCart } from "@/contexts/CartContext";

const CheckoutItems = () => {
  const { state: { cartItems }, updateVariant } = useCart();

  // Color mapping for better display
  const getColorHex = (colorName) => {
    const colorMap = {
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
    return colorMap[colorName?.toLowerCase()] || colorName || '#6B7280';
  };

  return (
    <ul className="checkout-items">
      {cartItems.map((item) => (
        <li key={item.id} className="checkout-item">
          <div className="checkout-item__inner">
            <div className="checkout-item__content">
              <div className="checkout-item__img">
                <img src={item.images?.[0] || item.thumb} alt={item.name} />
              </div>

              <div className="checkout-item__data">
                <div className="checkout-item__header">
                  <h3 className="checkout-item__title">{item.name}</h3>
                  <h3 className="checkout-item__price">${(item.price * item.count).toFixed(2)}</h3>
                </div>
                <div className="checkout-item__details">
                  <div className="checkout-item__detail">
                    <span className="checkout-item__detail-label">Color:</span>
                    <div className="checkout-item__variant">
                      <select
                        className={`checkout-item__select ${item.colorName ? 'has-value' : ''}`}
                        value={(item.colorName || '').toLowerCase()}
                        onChange={(e) => updateVariant(item, { colorName: e.target.value, colorHexCode: getColorHex(e.target.value) })}
                        style={(() => {
                          const color = (item.colorName || '').toLowerCase();
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
                    </div>
                  </div>
                  <div className="checkout-item__detail">
                    <span className="checkout-item__detail-label">Size:</span>
                    <div className="checkout-item__variant">
                      <select
                        className={`checkout-item__select ${item.size ? 'has-value' : ''}`}
                        value={item.size}
                        onChange={(e) => updateVariant(item, { size: e.target.value })}
                        style={item.size ? {
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
                  </div>
                  <div className="checkout-item__detail">
                    <span className="checkout-item__detail-label">Quantity:</span>
                    <span className="checkout-item__quantity">{item.count}</span>
                  </div>
                </div>
                <span className="checkout-item__id">#{item.id}</span>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default CheckoutItems;
