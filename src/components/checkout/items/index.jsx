import { useCart } from "@/contexts/CartContext";

const CheckoutItems = () => {
  const { state: { cartItems } } = useCart();

  return (
    <ul className="checkout-items">
      {cartItems.map((item) => (
        <li key={item.id} className="checkout-item">
          <div className="checkout-item__content">
            <div className="checkout-item__img">
              <img src={item.images?.[0] || item.thumb} alt={item.name} />
            </div>

            <div className="checkout-item__data">
              <h3 className="checkout-item__title">{item.name}</h3>
              <span className="checkout-item__id">#{item.id}</span>
              <span className="checkout-item__quantity">Qty: {item.count}</span>
            </div>
          </div>
          <h3 className="checkout-item__price">${item.price}</h3>
        </li>
      ))}
    </ul>
  );
};

export default CheckoutItems;
