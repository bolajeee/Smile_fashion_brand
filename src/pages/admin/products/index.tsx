import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '@/layouts/Main';
import { withAdminProtection } from '@/components/auth/withAdminProtection';
import Image from 'next/image';

interface Product {
  id: string;
  name: string;
  description: string;
  price: string | number;
  stock: number;
  images: string[];
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

const AdminProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionInProgress, setActionInProgress] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'stock' | 'featured'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching products');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      setActionInProgress(productId);
      setStatusMessage('');
      setError('');

      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete product');

      setProducts(products.filter(p => p.id !== productId));
      setStatusMessage('Product deleted successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error deleting product');
    } finally {
      setActionInProgress('');
    }
  };

  const handleToggleFeatured = async (product: Product) => {
    try {
      setActionInProgress(product.id);
      setStatusMessage('');
      setError('');

      const response = await fetch(`/api/products/featured/${product.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          featured: !product.featured,
          featuredOrder: !product.featured ? products.filter(p => p.featured).length : null,
        }),
      });

      if (!response.ok) throw new Error('Failed to update product');

      setProducts(products.map(p =>
        p.id === product.id ? { ...p, featured: !p.featured } : p
      ));
      setStatusMessage(`Product ${!product.featured ? 'added to' : 'removed from'} featured products`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating product');
    } finally {
      setActionInProgress('');
    }
  };

  const filteredProducts = products
    .filter(product => 
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.description.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'price') {
        return sortOrder === 'asc' 
          ? Number(a.price) - Number(b.price) 
          : Number(b.price) - Number(a.price);
      }
      if (sortBy === 'stock') {
        return sortOrder === 'asc' ? a.stock - b.stock : b.stock - a.stock;
      }
      if (sortBy === 'featured') {
        return sortOrder === 'asc' 
          ? (a.featured === b.featured ? 0 : a.featured ? -1 : 1)
          : (a.featured === b.featured ? 0 : a.featured ? 1 : -1);
      }
      // Sort by name
      return sortOrder === 'asc' 
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    });

  const toggleSort = (newSortBy: typeof sortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('asc');
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mt-8">
          <div className="loading-spinner">Loading...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="admin-products">
        <div className="container">
          <div className="admin-products__header">
            <h1>Products Management</h1>
            <Link href="/admin/products/add" className="btn btn--primary">
              Add New Product
            </Link>
          </div>

          {statusMessage && (
            <div className="alert alert--success">{statusMessage}</div>
          )}

          {error && (
            <div className="alert alert--error">{error}</div>
          )}

          <div className="admin-products__controls">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-input"
              />
            </div>
          </div>

          <div className="products-table">
            <table>
              <thead>
                <tr>
                  <th>Image</th>
                  <th onClick={() => toggleSort('name')} className="sortable">
                    Name {sortBy === 'name' && (
                      <span className="sort-indicator">
                        {sortOrder === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </th>
                  <th onClick={() => toggleSort('price')} className="sortable">
                    Price {sortBy === 'price' && (
                      <span className="sort-indicator">
                        {sortOrder === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </th>
                  <th onClick={() => toggleSort('stock')} className="sortable">
                    Stock {sortBy === 'stock' && (
                      <span className="sort-indicator">
                        {sortOrder === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </th>
                  <th onClick={() => toggleSort('featured')} className="sortable">
                    Featured {sortBy === 'featured' && (
                      <span className="sort-indicator">
                        {sortOrder === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td className="product-image">
                      {product.images[0] && (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          width={50}
                          height={50}
                          className="product-thumbnail"
                        />
                      )}
                    </td>
                    <td>{product.name}</td>
                    <td>${Number(product.price).toFixed(2)}</td>
                    <td>{product.stock}</td>
                    <td>
                      <button
                        onClick={() => handleToggleFeatured(product)}
                        className={`btn btn--sm ${product.featured ? 'btn--yellow' : 'btn--border'}`}
                        disabled={actionInProgress === product.id}
                      >
                        {actionInProgress === product.id ? 'Updating...' : 
                          product.featured ? 'Featured' : 'Not Featured'}
                      </button>
                    </td>
                    <td className="actions">
                      <Link
                        href={`/admin/products/edit/${product.id}`}
                        className="btn btn--sm btn--primary"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="btn btn--sm btn--danger"
                        disabled={actionInProgress === product.id}
                      >
                        {actionInProgress === product.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default withAdminProtection(AdminProductsPage);
