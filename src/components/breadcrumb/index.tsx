const Breadcrumb = () => (
  <section className="breadcrumb">
    <div className="container">
      <ul className="breadcrumb-list">
        <li>
          <a href="/" className="breadcrumb-home">

            <i className="icon-chevron-left breadcrumb-arrow" />
            <i className="icon-home" />
          </a>
        </li>
        <li>
          <h1 className="breadcrumb-title">All Products</h1>
        </li>
      </ul>
    </div>
  </section>
);

export default Breadcrumb;
