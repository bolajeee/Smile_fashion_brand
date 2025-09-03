import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../../layouts/Main';

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    images: string[];
    stock: number;
    createdAt: string;
    updatedAt: string;
}

const AdminProductsPage = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.replace('/login');
        } else if (session?.user?.role !== 'ADMIN') {
            router.replace('/');
        }
    }, [status, session, router]);

    useEffect(() => {
        if (session?.user?.role === 'ADMIN') {
            fetchProducts();
        }
    }, [session]);

    const fetchProducts = async () => {
        try {
            const response = await fetch('/api/products');
            if (response.ok) {
                const data = await response.json();
                setProducts(data);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (productId: string) => {
        if (!confirm('Are you sure you want to delete this product?')) {
            return;
        }

        try {
            const response = await fetch(`/api/product/${productId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setProducts(products.filter(p => p.id !== productId));
                alert('Product deleted successfully');
            } else {
                alert('Error deleting product');
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('Error deleting product');
        }
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setIsEditing(true);
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingProduct) return;

        try {
            const response = await fetch(`/api/product/${editingProduct.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: editingProduct.name,
                    description: editingProduct.description,
                    price: editingProduct.price,
                    images: editingProduct.images,
                    stock: editingProduct.stock,
                }),
            });

            if (response.ok) {
                const updatedProduct = await response.json();
                setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
                setIsEditing(false);
                setEditingProduct(null);
                alert('Product updated successfully');
            } else {
                alert('Error updating product');
            }
        } catch (error) {
            console.error('Error updating product:', error);
            alert('Error updating product');
        }
    };

    const handleInputChange = (field: keyof Product, value: string | number | string[]) => {
        if (editingProduct) {
            setEditingProduct({
                ...editingProduct,
                [field]: value,
            });
        }
    };

    if (status === 'loading' || isLoading) {
        return <div>Loading...</div>;
    }

    if (session?.user?.role !== 'ADMIN') {
        return null;
    }

    return (
        <Layout>
            <section className="admin-products-page">
                <div className="container">
                    <div className="admin-header">
                        <h1>Product Management</h1>
                        <Link href="/add-product" className="btn btn--rounded btn--yellow">
                            Add New Product
                        </Link>
                    </div>

                    {isEditing && editingProduct && (
                        <div className="edit-form-overlay">
                            <div className="edit-form">
                                <h3>Edit Product</h3>
                                <form onSubmit={handleUpdate}>
                                    <div className="form-group">
                                        <label>Name</label>
                                        <input
                                            type="text"
                                            value={editingProduct.name}
                                            onChange={(e) => handleInputChange('name', e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Description</label>
                                        <textarea
                                            value={editingProduct.description}
                                            onChange={(e) => handleInputChange('description', e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Price</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={editingProduct.price}
                                            onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Images (comma-separated URLs)</label>
                                        <input
                                            type="text"
                                            value={editingProduct.images.join(', ')}
                                            onChange={(e) => handleInputChange('images', e.target.value.split(', ').filter(url => url.trim()))}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Stock</label>
                                        <input
                                            type="number"
                                            value={editingProduct.stock}
                                            onChange={(e) => handleInputChange('stock', parseInt(e.target.value))}
                                            required
                                        />
                                    </div>
                                    <div className="form-actions">
                                        <button type="submit" className="btn btn--rounded btn--yellow">
                                            Update Product
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn--rounded btn--border"
                                            onClick={() => {
                                                setIsEditing(false);
                                                setEditingProduct(null);
                                            }}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    <div className="products-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Image</th>
                                    <th>Name</th>
                                    <th>Price</th>
                                    <th>Stock</th>
                                    <th>Created</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr key={product.id}>
                                        <td>
                                            {product.images.length > 0 && (
                                                <img
                                                    src={product.images[0]}
                                                    alt={product.name}
                                                    style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                                />
                                            )}
                                        </td>
                                        <td>{product.name}</td>
                                        <td>${product.price}</td>
                                        <td>{product.stock}</td>
                                        <td>{new Date(product.createdAt).toLocaleDateString()}</td>
                                        <td>
                                            <button
                                                onClick={() => handleEdit(product)}
                                                className="btn btn--sm btn--rounded"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                className="btn btn--sm btn--rounded btn--red"
                                                style={{ marginLeft: '8px' }}
                                            >
                                                Delete
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

export default AdminProductsPage;
