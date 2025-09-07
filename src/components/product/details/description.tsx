interface DescriptionProps {
  show: boolean;
  description?: string;
}

const Description: React.FC<DescriptionProps> = ({ show, description }) => {
  const style = {
    display: show ? "flex" : "none",
  };

  return (
    <section style={style} className="product-details__description">
      <div className="product-description-block">
        <i className="icon-cart" />
        <h4>Details and product description</h4>
        <p>{description || "No description available."}</p>
      </div>
      <div className="product-description-block">
        <i className="icon-check" />
        <h4>Product Features</h4>
        <ul className="product-features">
          <li>High-quality materials</li>
          <li>Durable construction</li>
          <li>Modern design</li>
          <li>Comfortable fit</li>
        </ul>
      </div>
    </section>
  );
};

export default Description;
