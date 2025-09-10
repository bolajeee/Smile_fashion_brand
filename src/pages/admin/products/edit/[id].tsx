import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/layouts/Main';
import { withAdminProtection } from '@/components/auth/withAdminProtection';
import { useUI } from '@/contexts/UIContext';
import Image from 'next/image';


interface ProductColor {
  id?: string;
  name: string;
  hexCode: string;
  inStock: boolean;
  stock: number;
}

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  stock: string;
  images: string[];
  featured: boolean;
  colors: ProductColor[];
}

const EditProductPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { addNotification } = useUI();
  
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: '',
    stock: '',
    images: [],
    featured: false,
    colors: [],
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [initialImages, setInitialImages] = useState<string[]>([]);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      console.log('Fetching product with ID:', id);
      const response = await fetch(`/api/products/${id}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch product');
      }
      
      const product = await response.json();
      
      // Store initial images for comparison
      setInitialImages(product.images || []);
      
      setFormData({
        name: product.name,
        description: product.description,
        price: String(product.price),
        stock: String(product.stock),
        images: product.images || [],
        featured: product.featured || false,
        colors: product.colors || [],
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error fetching product';
      console.error('Error fetching product:', errorMessage);
      setError(errorMessage);
      addNotification({
        type: 'error',
        message: `Failed to fetch product details: ${errorMessage}`,
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');

    try {
      // First, upload new image if exists
      let newImageUrl = '';
      if (imageFile) {
        try {
          const formData = new FormData();
          formData.append('photos', imageFile);
          
          const uploadResponse = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });
          
          if (!uploadResponse.ok) {
            const errorData = await uploadResponse.json();
            throw new Error(errorData.message || 'Failed to upload image');
          }

          const data = await uploadResponse.json();
          newImageUrl = data.urls[0]; // Get the first uploaded image URL
        } catch (error) {
          console.error('Image upload error:', error);
          throw new Error('Failed to upload image: ' + (error instanceof Error ? error.message : 'Unknown error'));
        }
      }

      // Prepare product data - only include fields that have values
      const productData: Record<string, any> = {};
      
      if (formData.name) productData.name = formData.name;
      if (formData.description) productData.description = formData.description;
      if (formData.price) productData.price = parseFloat(formData.price);
      if (formData.stock) productData.stock = parseInt(formData.stock, 10);
      
      // Only update images if there's a new image or images were removed
      if (newImageUrl || formData.images.length !== initialImages?.length) {
        productData.images = newImageUrl 
          ? [...formData.images, newImageUrl] 
          : formData.images;
      }
      
      productData.featured = formData.featured; // Boolean can be false

      // Update product
      const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) throw new Error('Failed to update product');

      addNotification({
        type: 'success',
        message: 'Product updated successfully',
        duration: 3000,
      });

      router.push('/admin/products');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating product');
      addNotification({
        type: 'error',
        message: 'Failed to update product',
        duration: 3000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove),
    }));
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
      <div className="admin-form-page">
        <div className="container">
          <h1 className="page-title">Edit Product</h1>

          {error && (
            <div className="alert alert--error mb-4">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="admin-form">
            <div className="form-group">
              <label htmlFor="name">Product Name</label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                required
                className="form-control"
                rows={5}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="price">Price</label>
                <input
                  type="number"
                  id="price"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  required
                  min="0"
                  step="0.01"
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label htmlFor="stock">Stock</label>
                <input
                  type="number"
                  id="stock"
                  value={formData.stock}
                  onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                  required
                  min="0"
                  className="form-control"
                />
              </div>
            </div>



            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                />
                Featured Product
              </label>
            </div>

            <div className="form-group">
              <label>Product Colors</label>
              {/* ColorSwatch component removed because it is not implemented. You can add your color management UI here. */}
              {/* Example placeholder for color management: */}
              {/*
              <div>
                {formData.colors.map((color, idx) => (
                  <div key={color.id || idx}>
                    <span style={{ background: color.hexCode, display: 'inline-block', width: 20, height: 20 }} />
                    {color.name} ({color.inStock ? 'In Stock' : 'Out of Stock'})
                  </div>
                ))}
                <button type="button" onClick={() => setFormData(prev => ({ ...prev, colors: [...prev.colors, { name: '', hexCode: '', inStock: true, stock: 0 }] }))}>
                  Add Color
                </button>
              </div>
              */}
              {/* Uncomment the above block to manage colors */}
              {/* onColorsChange={(colors: ProductColor[]) => setFormData(prev => ({ ...prev, colors }))} */}
            </div>

            <div className="form-group">
              <label>Current Images</label>
              <div className="image-grid">
                {formData.images.map((url, index) => (
                  <div key={url} className="image-item">
                    <Image
                      src={url}
                      alt={`Product image ${index + 1}`}
                      width={100}
                      height={100}
                      className="product-image"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="remove-image"
                      aria-label="Remove image"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="image">Add New Image</label>
              <input
                type="file"
                id="image"
                onChange={handleImageChange}
                accept="image/*"
                className="form-control"
              />
              {previewUrl && (
                <div className="image-preview">
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    width={100}
                    height={100}
                    className="preview-image"
                  />
                </div>
              )}
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={() => router.back()}
                className="btn btn--border"
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn--primary"
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default withAdminProtection(EditProductPage);
