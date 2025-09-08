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
                        className="checkout-item__select"
                        value={item.color}
                        onChange={(e) => updateVariant(item, { color: e.target.value })}
                        style={item.color ? {
                          backgroundColor: getColorHex(item.color),
                          color: ['White', 'Yellow'].includes(item.color) ? '#374151' : '#ffffff',
                          borderColor: getColorHex(item.color),
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
                  </div>
                  <div className="checkout-item__detail">
                    <span className="checkout-item__detail-label">Size:</span>
                    <div className="checkout-item__variant">
                      <select
                        className="checkout-item__select"
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
