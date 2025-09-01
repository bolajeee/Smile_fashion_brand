import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../layouts/Main';

const AddProductPage = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [images, setImages] = useState('');
  const [countInStock, setCountInStock] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        description,
        price: parseFloat(price),
        images: [images],
        countInStock: parseInt(countInStock),
      }),
    });
    if (res.ok) {
      router.push('/products');
    }
  };

  return (
    <Layout>
      <div className="container">
        <h1>Add Product</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Price</label>
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Images</label>
            <input type="text" value={images} onChange={(e) => setImages(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Count in Stock</label>
            <input type="number" value={countInStock} onChange={(e) => setCountInStock(e.target.value)} />
          </div>
          <button type="submit" className="btn btn--rounded">Add Product</button>
        </form>
      </div>
    </Layout>
  );
};

export default AddProductPage;
