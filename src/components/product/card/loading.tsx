const ProductCardLoading = () => {
  return (
    <div className="product-item is-loading">
      <div className="product-item__inner">
        <div className="product-item__image">
          <div className="skeleton-box" style={{ paddingTop: '100%' }} />
        </div>
        
        <div className="product-item__content">
          <div className="product-item__name">
            <div className="skeleton-box" style={{ width: '70%', height: '24px' }} />
          </div>
          
          <div className="product-item__price">
            <div className="skeleton-box" style={{ width: '40%', height: '28px' }} />
          </div>

          <div className="product-item__buttons">
            <div className="skeleton-box" style={{ width: '100%', height: '44px' }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCardLoading;
