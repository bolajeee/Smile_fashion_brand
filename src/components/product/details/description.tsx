import type { FC } from 'react';

interface DescriptionProps {
  show: boolean;
  description?: string;
}

const Description: FC<DescriptionProps> = ({ show, description }) => {
  if (!show) return null;

  return (
    <div className="product-single__description">
      <div className="product-details__description-content">
        {description ? (
          <div className="rich-text">
            <p>{description}</p>
          </div>
        ) : (
          <p className="text-muted">No description available for this product.</p>
        )}
        
        <div className="product-details__features">
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
              <span>Easy care and maintenance</span>
            </li>
            <li>
              <i className="icon-check" />
              <span>Perfect for everyday use</span>
            </li>
          </ul>
        </div>

        <div className="product-details__care">
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
