import { useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import MainLayout from '@/layouts/Main';
import { withAdminProtection } from '@/components/auth/withAdminProtection';

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.coerce.number().positive('Price must be positive'),
  countInStock: z.coerce.number().int().nonnegative('Stock must be 0 or more'),
  type: z.string().min(1, 'Product type is required'),
});

type FormValues = z.infer<typeof schema>;

const AddProductPage = () => {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  });
  const [uploading, setUploading] = useState(false);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);


  const handleFileUpload = async (files: File[]) => {
    if (files.length === 0) return;
    
    setUploading(true);
    const uploadPromises = files.map(async (file) => {
      try {
        const reader = new FileReader();
        const fileDataUrl = await new Promise<string>((resolve) => {
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
        
        const res = await fetch('/api/upload/cloudinary', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ file: fileDataUrl }),
        });
        
        if (!res.ok) {
          throw new Error('Upload failed');
        }
        
        const data = await res.json();
        return data.url;
      } catch (err) {
        console.error('Upload error:', err);
        return null;
      }
    });

    try {
      const urls = (await Promise.all(uploadPromises)).filter(Boolean) as string[];
      setUploadedUrls(prev => [...prev, ...urls]);
      // Set first uploaded image as thumbnail if none exists
      if (!thumbnailUrl && urls.length > 0) {
        setThumbnailUrl(urls[0]);
      }
    } catch (err) {
      alert('Some uploads failed');
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (values: FormValues) => {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: values.name,
        description: values.description,
        price: values.price,
        images: uploadedUrls,
        thumbnail: thumbnailUrl || uploadedUrls[0] || null,
        stock: values.countInStock,
        type: values.type,
      }),
    });
    if (res.ok) {
      router.push('/admin/products');
    }
  };

  return (
    <MainLayout>
      <div className="container">
        <div className="admin-form">
          <h1 className="admin-form__title">Add New Product</h1>
          <form onSubmit={handleSubmit(onSubmit)} style={{maxWidth: 500, margin: '0 auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
            <div className="form-group">
              <label>Product Type</label>
              <select {...register('type')} defaultValue="">
                <option value="" disabled>Select type</option>
                <option value="Shirts">Shirts</option>
                <option value="Caps">Caps</option>
                <option value="Bags">Bags</option>
              </select>
              {errors.type && <small className="error-message">{errors.type.message}</small>}
            </div>
            <div className="form-group">
              <label>Name</label>
              <input type="text" {...register('name')} />
              {errors.name && <small className="error-message">{errors.name.message}</small>}
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea {...register('description')} />
              {errors.description && <small className="error-message">{errors.description.message}</small>}
            </div>
            <div className="form-group">
              <label>Price</label>
              <input type="number" step="0.01" {...register('price', { valueAsNumber: true })} />
              {errors.price && <small className="error-message">{errors.price.message}</small>}
            </div>
            <div className="form-group">
              <label>Product Images</label>
              <div className="image-upload">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleFileUpload(Array.from(e.target.files || []))}
                />
                {uploading && <div className="upload-status">Uploading images...</div>}
                
                {uploadedUrls.length > 0 && (
                  <div className="images-preview">
                    {uploadedUrls.map((url, index) => (
                      <div key={url} className="image-preview-item">
                        <img src={url} alt={`Product ${index + 1}`} />
                        <div className="image-preview-actions">
                          <button
                            type="button"
                            className={`btn btn--small ${url === thumbnailUrl ? 'btn--primary' : 'btn--outline'}`}
                            onClick={() => setThumbnailUrl(url)}
                          >
                            {url === thumbnailUrl ? 'Thumbnail' : 'Set as Thumbnail'}
                          </button>
                          <button
                            type="button"
                            className="btn btn--small btn--danger"
                            onClick={() => {
                              setUploadedUrls(prev => prev.filter(u => u !== url));
                              if (thumbnailUrl === url) {
                                setThumbnailUrl(uploadedUrls.find(u => u !== url) || null);
                              }
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {uploadedUrls.length === 0 && (
                  <div className="no-images">
                    <p>No images uploaded yet</p>
                  </div>
                )}
              </div>
            </div>


            <div className="form-group">
              <label>Count in Stock</label>
              <input type="number" {...register('countInStock', { valueAsNumber: true })} />
              {errors.countInStock && <small className="error-message">{errors.countInStock.message}</small>}
            </div>

            <div className="form-actions">
              <button type="button" className="btn btn--rounded btn--border" onClick={() => router.push('/admin/products')}>
                Cancel
              </button>
              <button type="submit" className="btn btn--rounded btn--yellow" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Add Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
};

export default withAdminProtection(AddProductPage);
