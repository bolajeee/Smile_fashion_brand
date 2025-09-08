const OrderTableSkeleton = () => {
  return (
    <div className="orders-table orders-table--loading">
      <div className="orders-table__skeleton">
        <div className="orders-table__skeleton-header">
          <div className="orders-table__skeleton-row">
            <div className="orders-table__skeleton-cell" />
            <div className="orders-table__skeleton-cell" />
            <div className="orders-table__skeleton-cell" />
            <div className="orders-table__skeleton-cell" />
            <div className="orders-table__skeleton-cell" />
          </div>
        </div>
        <div className="orders-table__skeleton-body">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="orders-table__skeleton-row">
              <div className="orders-table__skeleton-cell" />
              <div className="orders-table__skeleton-cell" />
              <div className="orders-table__skeleton-cell" />
              <div className="orders-table__skeleton-cell" />
              <div className="orders-table__skeleton-cell" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderTableSkeleton;
