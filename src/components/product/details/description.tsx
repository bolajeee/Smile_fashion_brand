interface DescriptionProps {
  show: boolean;
  description?: string;
}

const Description: React.FC<DescriptionProps> = ({ show, description }) => {
  if (!show) return null;

  return (
    <div className="product-description">
      <div className="product-description__content">
        {description ? (
          <div className="rich-text">
            <h3>Product Description</h3>
            <p>{description}</p>
          </div>
        ) : (
          <p className="text-muted">No description available for this product.</p>
        )}
        
        <div className="product-description__features">
          <h3>Product Features</h3>
          <ul className="feature-list">
            <li>
              <i className="icon-check" />
              <span>Premium quality materials for lasting durability</span>
            </li>
            <li>
              <i className="icon-check" />
              <span>Ergonomic design for maximum comfort</span>
            </li>
            <li>
              <i className="icon-check" />
              <span>Modern aesthetic with attention to detail</span>
            </li>
            <li>
              <i className="icon-check" />
              <span>Perfect for everyday use</span>
            </li>
          </ul>
        </div>

        <div className="product-description__care">
          <h3>Care Instructions</h3>
          <div className="care-grid">
            <div className="care-item">
              <i className="icon-washing-machine" />
              <span>Machine wash cold</span>
            </div>
            <div className="care-item">
              <i className="icon-dryer" />
              <span>Tumble dry low</span>
            </div>
            <div className="care-item">
              <i className="icon-no-bleach" />
              <span>Do not bleach</span>
            </div>
            <div className="care-item">
              <i className="icon-iron-low" />
              <span>Iron on low heat</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Description;
